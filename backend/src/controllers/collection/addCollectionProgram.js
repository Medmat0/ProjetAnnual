import prisma from '../prisma.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Add program post to collection
 * @method  POST
 * @route   /collection/add
 * @access  Private
 */
const addToCollection = asyncHandler(async (req, res) => {
  const { postId } = req.body;

  if (!postId) {
    return res.status(400).json({ message: 'Post ID is required.' });
  }

  // Check if the post exists
  const post = await prisma.programPost.findUnique({
    where: {
      id: +postId,
    },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  // Add post to user's collection
  await prisma.user.update({
    where: {
      id: +req.user.id,
    },
    data: {
      programCollections: {
        connect: {
          id: +postId,
        },
      },
    },
  });

  res.status(200).json({ status: 'Success', message: 'Post added to collection.' });
});

export { addToCollection };
