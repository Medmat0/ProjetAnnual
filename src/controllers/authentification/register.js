import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { hashPassword } from "../../utils/hashingPassword.js";
import crypto from "crypto";
import APIError from "../../utils/APIError.js";
import { sendEmailToUser } from '../../functions/functions.js';
const prisma = new PrismaClient();

/**
 * @desc    users create new account
 * @method  post
 * @route   /api/v1/auth/register
 * @access  public
 */
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
  if (!user)
    return next(
      new APIError(
        "Something wrong happened while sign-up, please try again later"
      ),
      400
    );
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
          <p>Hello ${name}, Please follow this link to verify your account.</p><a href='http://localhost:3000/api/v1/auth/verify/${plainVerifyToken}'> Click here to verify</a>
          <p>If you did not verify your account, you won't be able to use many website features.</p>`,
  };
  await sendEmailToUser(info);
  res.status(200).json({ status: "Success", data: user });
});

export { register };