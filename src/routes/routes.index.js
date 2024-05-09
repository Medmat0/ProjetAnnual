import express from "express";
const router = express.Router();
import {
  login,
  register,
  verifyEmail,
} from "../controllers/authentification/authenfication.index.js";
import {
  loginValidator,
  registerValidator,
  verifyEmailValidator,
} from "../utils/auth.validator.js";
router.post("/login", loginValidator, login);
router.post("/register", registerValidator, register);
router.get("/verfiy/:token", verifyEmailValidator, verifyEmail);
export default router;