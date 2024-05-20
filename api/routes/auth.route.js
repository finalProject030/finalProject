import express from "express";
import {
  facebook,
  google,
  requestPasswordReset,
  resetPassword,
  signOut,
  signin,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.post("/facebook", facebook);
router.post("/requestPasswordReset", requestPasswordReset);
router.post("/resetPassword", resetPassword);
router.get("/signout", signOut);

export default router;
