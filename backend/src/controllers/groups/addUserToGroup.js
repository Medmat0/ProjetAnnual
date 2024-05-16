import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    Add a user to a group
 * @method  POST
 * @route   /group/adduser
 */
const addUserToGroup = asyncHandler(async (req, res) => {
  const { groupId, userIdToAdd } = req.body;

  const userToAdd = await prisma.user.findUnique({ where: { id: userIdToAdd } });
  if (!userToAdd) return res.status(404).json({ message: "User not found" });

  const existingMember = await prisma.groupMember.findFirst({
    where: {
      groupId: groupId,
      userId: userIdToAdd
    }
  });

  if (existingMember) {
    return res.status(400).json({ message: "User already in this group" });
  }

  const groupMember = await prisma.groupMember.create({
    data: {
      userId: userIdToAdd,
      groupId: groupId,
      role: "MEMBER",
      joinedAt: new Date(),
    },
  });

  res.status(201).json({ status: "Success", data: groupMember });
});

export { addUserToGroup };



/**{
  "userIdToAdd": 2,
  "groupId": 1
} */