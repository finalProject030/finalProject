import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUserById,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUserById); // Define the route to fetch user data by ID

export default router;
