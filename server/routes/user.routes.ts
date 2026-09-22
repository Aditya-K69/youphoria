/*
TODOs
1) Add route protection later
*/

import { Router } from "express";

import {
  createUser,
  createUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getSelf,
} from "../controllers/user.controller";

import { auth } from "../middleware/auth";

const router = Router();

// Create
router.post("/", createUser);
router.post("/bulk", createUsers);

// Fetch
router.get("/", getUsers);
router.get("/self", auth, getSelf);
router.get("/:id", getUser);

// Update
router.patch("/:id", updateUser);

// Delete
router.delete("/:id", deleteUser);

export default router;
