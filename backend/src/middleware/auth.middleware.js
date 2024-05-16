import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { verifyAccessToken } from "../utils/token.js";
const prisma = new PrismaClient();

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Header not found" });
  const encodedToken = token.split(" ")[1];
  if (!encodedToken) return res.status(403).json({ message: "Token not found" });
  const decodedToken = await verifyAccessToken(encodedToken);
  const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
  if (!user) return res.status(403).json({ message: "User not allowed" });
  req.user = user;
  next();
});

const isAdminOfGroup = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const groupId = req.body.groupId;

  const groupMember = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId
      }
    }
  });

  if (!groupMember || groupMember.role !== "ADMIN") {
    return res.status(403).json({ message: "You are not admin of this group" });
  }
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) return next();
  const role = user.role;
  if (role !== "ADMIN") return res.status(403).json({ message: "You are not admin" });
  next();
});

export { authMiddleware, isAdminOfGroup, isAdmin };
