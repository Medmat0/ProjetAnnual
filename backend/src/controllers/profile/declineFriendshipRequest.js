import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

const prisma = new PrismaClient();

/**
 * @desc    Reject a follow request
 * @method  POST
 * @route   /follow/request/reject/:requestId
 */
const rejectFriendshipRequest = asyncHandler(async (req, res) => {
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
      status: "REJECTED",
    },
  });

  res.status(200).json({
    status: "Success",
    message: "Follow request rejected.",
  });
});

export { rejectFriendshipRequest };
