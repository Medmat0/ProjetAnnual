import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import asyncHandler from "express-async-handler";
import { comparePassword } from "../../utils/hashingPassword.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../../utils/createToken.js";
import { sendEmailToUser } from '../../functions/functions.js';
const prisma = new PrismaClient();

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    return res.status(400).json({ message: "Wrong email or password." });
  }
  
  const matchedPasswords = await comparePassword(password, user.password);
  if (!matchedPasswords) {
    return res.status(400).json({ message: "Wrong email or password." });
  }
  
  if (!user.emailVerified) {
    const plainVerifyToken = crypto.randomBytes(64).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainVerifyToken)
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
      subject: "Email verification",
      text: "Verify your email",
      html: `<h1>Email verification</h1>
             <p>Hello ${user.name}, Please follow this link to verify your account.</p>
             <a href='http://localhost:3000/api/v1/auth/verify/${plainVerifyToken}'> Click here to verify</a>
             <p>If you did not verify your account, you won't be able to use many website features.</p>`,
    };
    
    await sendEmailToUser(info);
    
    return res.status(400).json({
      message: "You didn't verify your account yet. Please check your email to verify.",
    });
  }
  
  const accessToken = await createAccessToken(user.id);
  const refreshToken = await createRefreshToken(user.id);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 90 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.status(200).json({ user, token: accessToken });
});

export { login };
