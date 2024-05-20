import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    Create a new groupe
 * @method  POST
 * @route   /group/create
 * @access  Public
 */
const createGroup = asyncHandler(async (req, res) => {
  const { userId, name, description, privacy } = req.body;
  let avatar = null;
  if (req.file) {
    avatar = req.file.path;
  }
  const group = await prisma.group.create({
    data: {
      name,
      description,
      privacy: privacy === 'PRIVATE' ? 'PRIVATE' : 'PUBLIC', 
      avatar,
      members: {
        create: {
          userId,
          role: "ADMIN"
        }
      }
    },
  });
  res.status(201).json({ status: "Success", data: group });
});

export { createGroup };
