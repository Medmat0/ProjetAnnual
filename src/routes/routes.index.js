import express from "express";
const router = express.Router();
import {
  login,
  register,
  verifyEmail,
  logout,
} from "../controllers/authentification/authenfication.index.js";

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/verify/:token", verifyEmail);
export default router;