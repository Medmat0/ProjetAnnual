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

  const group = await prisma.group.create({
    data: {
      name,
      description,
      privacy,
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
