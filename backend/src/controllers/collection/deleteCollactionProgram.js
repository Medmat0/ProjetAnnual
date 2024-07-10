import prisma from '../prisma.js';
import asyncHandler from 'express-async-handler';


/**
 * @desc    Remove collection from user's collections
 * @method  DELETE
 * @route   /collection/:collectionId
 * @access  Private
 */
const deleteCollection = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;

  if (!collectionId) {
    return res.status(400).json({ message: 'Collection ID is required.' });
  }

  // Check if the collection exists
  const collection = await prisma.programPost.findUnique({
    where: {
      id: +collectionId,
    },
  });

  if (!collection) {
    return res.status(404).json({ message: 'Collection not found.' });
  }

  // Remove collection from user's collection list
  await prisma.user.update({
    where: {
      id: +req.user.id,
    },
    data: {
      programCollections: {
        disconnect: {
          id: +collectionId,
        },
      },
    },
  });

  res.status(200).json({ status: 'Success', message: 'Collection removed from user\'s collections.' });
});

export { deleteCollection };    