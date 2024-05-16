import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { hashPassword } from "../../utils/hashingPassword.js";
import crypto from "crypto";
import { sendEmailToUser } from '../../functions/functions.js';
const prisma = new PrismaClient();


const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, bio, city } = req.body;
  const role = req.body.role || "USER";
  
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      profile: {
        create: {
          bio: bio,
          city: city,
        },
      },
    },
  });
  
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Something wrong happened while sign-up, please try again later"
    });
  }
  
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
          <p>Hello ${name}, Please follow this link to verify your account.</p><a href='http://localhost:3000/api/auth/verify/${plainVerifyToken}'> Click here to verify</a>
          <p>If you did not verify your account, you won't be able to use many website features.</p>`,
  };
  
  await sendEmailToUser(info);
  
  res.status(200).json({ status: "Success", data: user });
});

export { register };
