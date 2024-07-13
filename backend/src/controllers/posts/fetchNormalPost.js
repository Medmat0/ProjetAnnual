import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    User list his posts
 * @method  GET
 * @route   /post/myposts
 */
const getUserPosts = asyncHandler(async (req, res, next) => {
  const userId =+req.user.id;  
  const limit = +req?.query?.limit || 10;
  const page = +req?.query?.page || 1;
  const skip = (page - 1) * limit;
  const privacy = req.query?.privacy;
  const publicPosts = await prisma.post.findMany({
    where: {
      privacy: 'PUBLIC', // Récupérer les posts avec privacy 'PUBLIC'
    },
    skip: skip,
    take: limit,
    orderBy: {
      postedAt: 'desc',
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
      likes: { // Include likes for each post
        select: { 
          postId :true,
          userId :true,
          User: {
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
      likes: { // Include likes for each post
        select: { 
          postId :true,
          userId :true,
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
  res.status(200).json({
    count: publicPosts.length,
    data: publicPosts
});
});

export { getUserPosts };
