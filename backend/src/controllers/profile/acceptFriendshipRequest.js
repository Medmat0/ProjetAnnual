import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

/**
 * @desc    Accept a follow request
 * @method  POST
 * @route   /follow/request/accept/:requestId
 */
const acceptFriendshipRequest = asyncHandler(async (req, res) => {
  const requestId = +req.params.requestId;
  const currentUserId = +req.user.id;

  // Trouver la demande de suivi
  const followRequest = await prisma.followRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!followRequest || followRequest.requesteeId !== currentUserId) {
    res.status(404).json({ message: "Follow request not found." });
    return;
  }

  // Mettre à jour le statut de la demande de suivi
  await prisma.followRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  // Créer une relation d'amitié
  await prisma.friendship.create({
    data: {
      userId1: followRequest.requesterId,
      userId2: followRequest.requesteeId,
    },
  });

  res.status(200).json({
    status: "Success",
    message: "Follow request accepted and friendship created.",
  });
});

export { acceptFriendshipRequest };
