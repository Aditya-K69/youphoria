import express, { type Express, type Request, type Response } from "express";
import pinoHttp from "pino-http";

import { sql } from "drizzle-orm";
import { db } from "./db/index";
import { logger } from "./lib/logger";
import { errorHandler } from "./middleware/error";

const app: Express = express();

app.use(express.json());

/*
 * HTTP request logging.
 *
 * Every request gets:
 * - request ID
 * - method
 * - URL
 * - status code
 * - response time
 */
app.use(
  pinoHttp({
    logger,
  }),
);

/*
 * Health check
 */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
  });
});

/*
 * Database health check
 */
app.get("/dbhealth", async (_req: Request, res: Response) => {
  try {
    await db.execute(sql`SELECT 1`);

    res.status(200).json({
      status: "ok",
      database: "up",
    });
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Database health check failed",
    );

    res.status(503).json({
      status: "error",
      database: "down",
    });
  }
});

/*
 * Global error handler.
 *
 * This MUST be registered after all routes and middleware.
 */
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      environment: process.env.NODE_ENV ?? "development",
    },
    "Server started",
  );
});
