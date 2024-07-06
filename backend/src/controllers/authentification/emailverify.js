import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * @desc    Verfiy user's email
 * @method  PATCH
 * @route   /auth/verfiy/:token
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
  const token = req.params?.token;
  const hashToken = await crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashToken,
    },
  });
  if (!user) return res.status(400)
  await prisma.user.update({
    where: {
      emailVerificationToken: hashToken,
    },
    data: {
      emailVerificationToken: null,
      emailVerified: true,
      isActive: true,
    },
  });
  res.status(200).json({ status: "Success", message: "Email verfied." });
});

export { verifyEmail };
