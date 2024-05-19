import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    Join a public group
 * @method  POST
 * @route   /group/join
 * @access  Private
 */
const joinGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.body;
  const userId = req.user.id;

  // Vérifier si le groupe est public
  const group = await prisma.group.findUnique({
    where: { id: groupId }
  });

  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  if (group.privacy !== 'PUBLIC') {
    return res.status(403).json({ message: "Not PUBLIC groupe" });
  }

  const existingMember = await prisma.groupMember.findUnique({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId
      }
    }
  });

  if (existingMember) {
    return res.status(400).json({ message: "You are already a member of this group" });
  }

  const newMember = await prisma.groupMember.create({
    data: {
      userId: userId,
      groupId: groupId,
      role: "MEMBER",
      joinedAt: new Date()
    }
  });

  res.status(201).json({ status: "Success", data: newMember });
});

export { joinGroup };
