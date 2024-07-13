import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { sendEmailToUser } from "../../utils/email.config.js";
const prisma = new PrismaClient();

/**
 * @DESC    user can change his password
 * @METHOD  GET
 * @ROUTE   /auth/changepassword
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const email = req.body?.email;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user)
    return res.status(404).json({"this email is not available ": email});
  const plainResetToken = crypto.randomBytes(4).toString("hex");
  const hashedResetToken = await crypto
    .createHash("sha256")
    .update(plainResetToken)
    .digest("hex");
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      passwordResetToken: hashedResetToken,
      passwordResetTokenExpire: String(Date.now() + 15 * 60 * 1000),
    },
  });
  const info = {
    from: `Mailer Company`,
    to: email,
    subject: "PasswordResetToken",
    text: "Now you can change you password.",
    htm: `<h1>Password reset </h1>
          <p>Here is your acess code to change your password:  ${plainResetToken}</p>
          <p>If you did not request a password reset, please ignore this email.</p>`,
  };
  await sendEmailToUser(info);
  res
    .status(200)
    .json({ status: "Success", message: "password reset code has been sent." });
});

export { forgotPassword };
