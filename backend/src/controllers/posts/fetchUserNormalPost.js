import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";

/**
 * @desc    User list his specific outher user posts (normal posts )
 * @method  GET
 * @route   /post/posts:userId
 */
const getUniqueUserPosts = asyncHandler(async (req, res, next) => {
const userId = parseInt(req.params.userId);  
  const limit = +req?.query?.limit || 10;
  const page = +req?.query?.page || 1;
  const skip = (page - 1) * limit;
  const privacy = req.query?.privacy;
  const posts = await prisma.post.findMany({
    where: {
      userId: userId,
      privacy: privacy,
    },   
    skip: skip,
    take: limit,
    orderBy: {
      postedAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          id: true,
        },
      },
      comments: { // Include comments for each post
        select: {
          id: true,
          content: true,
          User: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  res.status(200).json({ status: "Success", data: posts });
});

export { getUniqueUserPosts };
