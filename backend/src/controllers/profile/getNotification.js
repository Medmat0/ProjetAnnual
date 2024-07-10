import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";


/**
 * @desc    Get user notifications
 * @method  GET
 * @route   /notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
  const currentUserId = +req.user.id;

  const notifications = await prisma.notification.findMany({
    where: {
      userId: currentUserId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    status: "Success",
    notifications,
  });
});

export { getNotifications };
