import express from "express";
const router = express.Router();


import {login, register , verifyEmail , forgotPassword , changePassword} from "../controllers/authentification/Auth.index.js";

  
  
router.post("/register", register);
router.post("/login",  login);
router.get("/verfiy/:token", verifyEmail)
router.post("/forgotpassword", forgotPassword);
router.patch("/changepassword", changePassword);



export default router;