import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

/**
 * @desc    Unfollow a user
 * @method  POST
 * @route   /unfollow/:userId
 */
const unfollowUser = asyncHandler(async (req, res) => {
  const currentUserId = +req.user.id;
  const unfollowUserId = +req.params.userId;

  // Check if the friendship relation exists
  const friendship = await prisma.friendship.findFirst({
    where: {
      OR: [
        {
          userId1: currentUserId,
          userId2: unfollowUserId,
        },
        {
          userId1: unfollowUserId,
          userId2: currentUserId,
        },
      ],
    },
  });

  if (!friendship) {
    res.status(404).json({ message: "Friendship not found." });
    return;
  }

  // Delete the friendship relation
  await prisma.friendship.delete({
    where: {
      id: friendship.id,
    },
  });

  res.status(200).json({
    status: "Success",
    message: "You have unfollowed the user.",
  });
});

export { unfollowUser };
