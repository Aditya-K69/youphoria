import type { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { z } from "zod";

import { db } from "../db/index";
import { users } from "../db/schemas/user.schema";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

// -------------------------
// Validation schema
// -------------------------

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(255, "Username cannot exceed 255 characters"),

  password: z.string().min(1, "Password is required"),
});

// -------------------------
// LOGIN
// POST /auth/login
// -------------------------

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = loginSchema.parse(req.body);

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.username, data.username))
      .limit(1);

    // Don't reveal whether the username exists.
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const passwordValid = await argon2.verify(user.password, data.password);

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        username: user.username,
      },
      JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "24h",
      },
    );

    return res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: "24h",
      },
    });
  } catch (error) {
    next(error);
  }
};
