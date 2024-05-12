import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { hashPassword } from "../../utils/hashPassword.js";
import crypto from "crypto";

const prisma = new PrismaClient();

/**
 * @desc    Users can change password
 * @method  patch
 * @route   /api/v1/user/change-password
 * @access  public
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const { password, acessCode } = req.body;
  console.log("password",password);
  console.log("acessCode",acessCode);   
  const hashedAccessCode = crypto.createHash("sha256").update(acessCode).digest("hex");
  const verifyTokenfromUser = await prisma.user.findFirst({where: {passwordResetToken: hashedAccessCode}});
  if(!verifyTokenfromUser) return res.status(400).json({ message: "Invalid acess code" });
  const hashedPassword = await hashPassword(password);
  await prisma.user.update({
    where: {
      id: verifyTokenfromUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  res.status(201).json({ status: "Success" });
});
