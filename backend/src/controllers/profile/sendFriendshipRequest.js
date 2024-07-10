import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";


/**
 * @desc    Send a follow request
 * @method  POST
 * @route   /follow/request/:userId
 */
const sendFriendshipRequest = asyncHandler(async (req, res) => {
  const requesterId = +req.user.id;
  const requesteeId = +req.params.userId;

  // Vérifiez si une demande de suivi existe déjà
  const existingRequest = await prisma.followRequest.findFirst({
    where: {
      requesterId: requesterId,
      requesteeId: requesteeId,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    res.status(400).json({ message: "Follow request already sent." });
  } else {
    const followRequest = await prisma.followRequest.create({
      data: {
        requesterId: requesterId,
        requesteeId: requesteeId,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Follow request sent to user ID: ${requesteeId}`,
      followRequest,
    });
  }
});

export { sendFriendshipRequest };
