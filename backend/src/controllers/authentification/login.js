import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { comparePassword } from "../../utils/hashPassword.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/token.js";
import { sendEmailToUser } from "../../utils/email.config.js";
const prisma = new PrismaClient();

/**
 * @desc    User type email and password to login
 * @method  post
 * @route   /login
 * @access  public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) return res.status(400).json({ message: "Wrong email or password." });
  const matchedPasswords = await comparePassword(password, user.password);
  if (!matchedPasswords)
    return res.status(400).json({ message: "Wrong email or password" });
  if (!user.emailVerified) {
    const plainVerfiyToken = crypto.randomBytes(64).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainVerfiyToken)
      .digest("hex");
    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        emailVerificationToken: hashedToken,
      },
    });
    const info = {
      from: `Mailer Company`,
      to: email,
      subject: "Email verfication",
      text: "Verfiy you email",
      htm: `<h1>Email verfication </h1>
          <p>Hello ${user.name}, Please follow this link to verfiy your account. </p><a href= 'http://localhost:3000/auth/verfiy/${plainVerfiyToken}'> Click link </a>
          <p>If you did not verfiy your account you won't be able to use a lot of website features</p>`,
    };
    await sendEmailToUser(info);
    return res.status(400).json({ message: "Verify your account please ! " });
  }
  const accessToken = await createAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
  res.status(200).json({ user, tokn: accessToken });
});

export { login };
