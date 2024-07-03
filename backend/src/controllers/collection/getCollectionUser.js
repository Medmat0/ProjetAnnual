import prisma from './prisma.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Get all collections for a user
 * @method  GET
 * @route   /collections
 * @access  Private
 */
const getCollections = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch the user's collections with program versions
  const userCollections = await prisma.user.findUnique({
    where: {
      id: +userId,
    },
    select: {
      programCollections: {
        include: {
          versions: true,
        },
      },
    },
  });

  if (!userCollections) {
    return res.status(404).json({ message: 'Collections not found.' });
  }

  res.status(200).json(userCollections.programCollections);
});

export { getCollections };
