import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

/**
 * @desc    Get all friends of the current user
 * @method  GET
 * @route   /friends
 */
const getAllFriends = asyncHandler(async (req, res) => {
  const currentUser = +req.user.id;

  // Récupérer les amis de l'utilisateur actuel
  const friends = await prisma.friendship.findMany({
    where: {
      OR: [
        { userId1: currentUser },
        { userId2: currentUser },
      ],
    },
    include: {
      user1: {
        include: {
          profile: true,
        },
      },
      user2: {
        include: {
          profile: true,
        },
      },
    },
  });

  const friendsList = friends.map(friend => {
    if (friend.userId1 === currentUser) {
      return {
        id: friend.user2.id,
        name: friend.user2.name,
        profile: {
          image: friend.user2.profile ? friend.user2.profile.image : null,
        },
      };
    } else {
      return {
        id: friend.user1.id,
        name: friend.user1.name,
        profile: {
          image: friend.user1.profile ? friend.user1.profile.image : null,
        },
      };
    }
  });

  res.status(200).json({
    status: "Success",
    data: friendsList,
  });
});

export { getAllFriends };
