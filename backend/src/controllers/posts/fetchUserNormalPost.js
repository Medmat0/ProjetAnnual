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
          id: true,
          name: true,
          profile: {
            select: {
              image: true,
            },
          },
        },
      },

      comments: {
        select: {
          id: true,
          content: true,
          user: {
            select: {
              id: true,
              name: true,
              profile: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      },
      likes: { 
        select: { 
          postId :true,
          userId :true,
          user: {
            select: {
              id: true,
              name: true,
              profile: {
                select: {
                  image: true,
                },
              },
            },
          },
        },
      },
    },
  });

  res.status(200).json({ status: "Success", data: posts });
});

export { getUniqueUserPosts };
