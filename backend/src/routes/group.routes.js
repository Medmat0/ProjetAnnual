import express from "express";
const router = express.Router();


import {createGroup, addUserToGroup , removeUserFromGroup, changeUserRole,joinGroup  } from "../controllers/groups/groups.index.js";
import { authMiddleware, isAdminOfGroup } from "../middleware/auth.middleware.js";

  
  
router.post("/create", authMiddleware, createGroup);
router.post("/adduser", authMiddleware, isAdminOfGroup, addUserToGroup);
router.delete("/removeuser", authMiddleware, isAdminOfGroup, removeUserFromGroup);
router.post("/changerole", authMiddleware, isAdminOfGroup, changeUserRole);
router.post("/join", authMiddleware, joinGroup);


export default router;