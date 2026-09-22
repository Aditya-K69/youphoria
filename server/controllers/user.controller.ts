/* 
TODOs : 
1) Add Pagination to data fetching, currently no pagination
*/

/* 
NOTEs : 
1) No application level handling of same username. If username exists and create user request is sent, error is thrown instead of a response being sent
*/

import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import { z } from "zod";

import { db } from "../db/index";
import { users } from "../db/schemas/user.schema";
import type { AuthenticatedRequest } from "../middleware/auth";

// -------------------------
// Validation schemas
// -------------------------

const createUserSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(255, "Username cannot exceed 255 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

  isActive: z.boolean().optional(),
});

const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username cannot be empty")
      .max(255, "Username cannot exceed 255 characters")
      .optional(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      )
      .optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

const userIdSchema = z.object({
  id: z.uuid("Invalid user ID"),
});

// -------------------------
// CREATE - single user
// POST /users
// -------------------------

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createUserSchema.parse(req.body);

    const passwordHash = await argon2.hash(data.password);

    const [user] = await db
      .insert(users)
      .values({
        username: data.username,
        password: passwordHash,
        isActive: data.isActive ?? true,
      })
      .returning({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// CREATE - multiple users
// POST /users/bulk
// -------------------------

export const createUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = z.array(createUserSchema).parse(req.body);

    const values = await Promise.all(
      data.map(async (user) => ({
        username: user.username,
        password: await argon2.hash(user.password),
        isActive: user.isActive ?? true,
      })),
    );

    const createdUsers = await db.insert(users).values(values).returning({
      id: users.id,
      username: users.username,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });

    return res.status(201).json({
      success: true,
      data: createdUsers,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// FETCH - all users
// GET /users
// -------------------------

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await db
      .select({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// FETCH - single user
// GET /users/:id
// -------------------------

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// UPDATE - single user
// PATCH /users/:id
// -------------------------

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = userIdSchema.parse(req.params);
    const data = updateUserSchema.parse(req.body);

    const updateData: Partial<typeof users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.username !== undefined) {
      updateData.username = data.username;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (data.password !== undefined) {
      updateData.password = await argon2.hash(data.password);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------
// DELETE - single user
// DELETE /users/:id
// -------------------------

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
      });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: deletedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getSelf = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as AuthenticatedRequest).user.id;

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
