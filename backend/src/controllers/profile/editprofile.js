import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { sendEmailToUser } from "../../utils/email.config.js";


/**
 * @desc    user updates his info
 * @method  patch
 * @route   /api/v1/user/
 * @access  public
 */
export const updateCurrentUser = asyncHandler(async (req, res, next) => {
  const { name, email, desc, city, profilePicture, coverPicture } = req.body;
  console.log(req.body);

  // Fetch the current user data
  const currentUser = await prisma.user.findUnique({
    where: { id: +req.user.id },
    include: { profile: true },
  });

  if (!currentUser) {
    return res.status(400).json({ message: "User not found" });
  }

  // Prepare the update data, ensuring not to overwrite with empty strings
  const updateData = {
    name: name || currentUser.name,
    email: email || currentUser.email,
    profile: {
      update: {
        bio: desc || currentUser.profile.bio,
        city: city || currentUser.profile.city,
        image: profilePicture || currentUser.profile.image,
        website: coverPicture || currentUser.profile.website,
      },
    },
  };

  // Check if email needs to be updated and verified
  if (email && email !== currentUser.email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    updateData.email = email;
    updateData.emailVerified = false;
    updateData.emailVerificationToken = null;

    // Generate a verification token
    const plainVerifyToken = crypto.randomBytes(64).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(plainVerifyToken).digest("hex");

    // Update the user's email verification token
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { emailVerificationToken: hashedToken },
    });

    // Send verification email
    const info = {
      from: `Mailer Company`,
      to: email,
      subject: "Email verification",
      text: "Verify your email",
      html: `<h1>Email verification</h1>
             <p>Hello ${name || currentUser.name}, Please follow this link to verify your account.</p>
             <a href='http://localhost:3000/auth/verfiy/${plainVerifyToken}'>Click here</a>
             <p>If you do not verify your account, you won't be able to use many website features</p>`,
    };

    await sendEmailToUser(info);
    res.json({
      status: "Success",
      message: "Please check your email for verification",
    });
  } else {
    // Update the user without changing the email
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });

    res.json({ status: "Success", updatedUser });
  }
});
