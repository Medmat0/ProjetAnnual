import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    Change user role in a group
 * @method  PUT
 * @route   /group/changerole
 */
const changeUserRole = asyncHandler(async (req, res) => {
  const { groupId, userId, newRole } = req.body;

  const requestingUser = req.user;
  const isAdmin = await prisma.groupMember.findFirst({
    where: {
      userId: requestingUser.id,
      groupId: groupId,
      role: "ADMIN"
    }
  });
  if (!isAdmin) {
    return res.status(403).json({ message: "You are not allowed to change user role in this group" });
  }

  const updatedMember = await prisma.groupMember.update({
    where: {
      userId_groupId: {
        userId: userId,
        groupId: groupId
      }
    },
    data: {
      role: newRole
    }
  });

  res.status(200).json({ status: "Success", data: updatedMember });
});

export { changeUserRole };
