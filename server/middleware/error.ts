import type { ErrorRequestHandler, Request } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    options?: {
      code?: string;
      details?: unknown;
      isOperational?: boolean;
    },
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = options?.code ?? "APP_ERROR";
    this.details = options?.details;
    this.isOperational = options?.isOperational ?? true;

    Error.captureStackTrace?.(this, AppError);
  }
}

type RequestWithId = Request & {
  id?: string;
};

function getRequestId(req: Request): string | undefined {
  const request = req as RequestWithId;

  if (request.id) {
    return request.id;
  }

  const requestId = req.headers["x-request-id"];

  if (typeof requestId === "string") {
    return requestId;
  }

  return undefined;
}

function isPostgresError(error: unknown): error is {
  code: string;
  detail?: string;
  constraint?: string;
  table?: string;
  column?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  );
}

function getPostgresError(error: unknown): {
  statusCode: number;
  code: string;
  message: string;
} | null {
  if (!isPostgresError(error)) {
    return null;
  }

  switch (error.code) {
    case "23505":
      return {
        statusCode: 409,
        code: "DUPLICATE_RESOURCE",
        message: "A resource with the provided value already exists.",
      };

    case "23503":
      return {
        statusCode: 409,
        code: "FOREIGN_KEY_VIOLATION",
        message: "The requested operation violates a resource relationship.",
      };

    case "23502":
      return {
        statusCode: 400,
        code: "INVALID_DATA",
        message: "A required value is missing.",
      };

    case "23514":
      return {
        statusCode: 400,
        code: "CONSTRAINT_VIOLATION",
        message: "The provided data violates a database constraint.",
      };

    default:
      return null;
  }
}

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}

function isDevelopment(): boolean {
  return process.env.NODE_ENV !== "production";
}

function logError(error: unknown, req: Request, requestId?: string): void {
  logger.error(
    {
      err: error,
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    },
    "Request error",
  );
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  const requestId = getRequestId(req);

  /*
   * If headers have already been sent, Express cannot safely
   * replace the response. Let Express handle the situation.
   */
  if (res.headersSent) {
    return;
  }

  logError(error, req, requestId);

  /*
   * Zod validation errors
   */
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed.",
        details: formatZodError(error),
      },
      ...(requestId && { requestId }),
    });

    return;
  }

  /*
   * Application errors
   */
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details !== undefined && {
          details: error.details,
        }),
      },
      ...(requestId && { requestId }),
      ...(isDevelopment() && {
        stack: error.stack,
      }),
    });

    return;
  }

  /*
   * PostgreSQL errors
   */
  const postgresError = getPostgresError(error);

  if (postgresError) {
    res.status(postgresError.statusCode).json({
      success: false,
      error: {
        code: postgresError.code,
        message: postgresError.message,
      },
      ...(requestId && { requestId }),
    });

    return;
  }

  /*
   * Unknown/unexpected errors
   *
   * Log the complete error server-side, but never expose
   * internal implementation details in production.
   */
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
    ...(requestId && { requestId }),
    ...(isDevelopment() &&
      error instanceof Error && {
        stack: error.stack,
        debug: {
          name: error.name,
          message: error.message,
        },
      }),
  });
};
