import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { hashPassword } from "../../utils/hashPassword.js";

import crypto from "crypto";
import { sendEmailToUser } from "../../utils/email.config.js";
const prisma = new PrismaClient();

/**
 * @desc    user cab  create new acount
 * @method  post
 * @route   /auth/register
 * @access  public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, bio, city } = req.body;
  const role = req.body.role || "USER";
  

  console.log("name", name)
  console.log("email", email)
  console.log("password", password)
  console.log("bio", bio)
  console.log("city", city)

  console.log("role", role)
  
  const emailexist = await prisma.user.findFirst({where: {email: email}});
  if (emailexist) return res.status(400).json({ message: "Email already exist" });
 
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
          image:  null,
          city: city
         
        },
      },
    },
  });
  if (!user)
    return  res.status(400).json({ message : "Something wrong happened while sign-up, please try again later"});
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
          <p>Hello ${name}, Please follow this link to verfiy your account. </p><a href= 'https://socialcode-backend.scm.azurewebsites.net/verfiy/${plainVerfiyToken}'> Click link </a>
          <p>If you did not verfiy your account you won't be able to use a lot of website features</p>`,
  };
  await sendEmailToUser(info);
  res.status(200).json({ status: "Success", data: user });
});

export { register };
