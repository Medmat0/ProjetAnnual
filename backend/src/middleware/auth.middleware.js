
import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { verifyAccessToken } from "../utils/token.js";
const prisma = new PrismaClient();

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Header not found" });
  const encodedToken = token.split(" ")[1];
  if (!encodedToken) res.status(403).json({ message: "Token not found" });
  const decodedToken = await verifyAccessToken(encodedToken);
  const user = await prisma.user.findUnique({ where: { id: decodedToken.id } });
  req.user = user;
  if (!user) return res.status(403).json({ message: "User not allowed" });
  next();
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) return next();
  const role = user.role;
  if (role !== "ADMIN") return res.status(403).json({ message: "You are not admin" });
  next();
});

export { authMiddleware, isAdmin };
