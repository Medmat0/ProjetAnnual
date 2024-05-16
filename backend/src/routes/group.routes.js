import express from "express";
const router = express.Router();


import {createGroup, addUserToGroup , removeUserFromGroup, changeUserRole  } from "../controllers/groups/groups.index.js";
import { authMiddleware, isAdminOfGroup } from "../middleware/auth.middleware.js";

  
  
router.post("/create", authMiddleware, createGroup);
router.post("/adduser", authMiddleware, isAdminOfGroup, addUserToGroup);
router.delete("/removeuser", authMiddleware, isAdminOfGroup, removeUserFromGroup);
router.put("/changerole", authMiddleware, isAdminOfGroup, changeUserRole);


export default router;