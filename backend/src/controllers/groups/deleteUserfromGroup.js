import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

/**
 * @desc    Remove a user from a group
 * @method  POST
 * @route   /group/removeuser
 */
const removeUserFromGroup = asyncHandler(async (req, res) => {
  const { groupId, userIdToRemove } = req.body;

  try {
    await prisma.groupMember.deleteMany({
      where: {
        groupId: groupId,
        userId: userIdToRemove
      }
    });

    res.status(200).json({ message: "User removed from group successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while removing user from group" });
  }
});

export { removeUserFromGroup };
