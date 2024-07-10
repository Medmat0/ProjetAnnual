import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    User list his posts (normal posts )
 * @method  GET
 * @route   /post/myposts
 */
const getUserPosts = asyncHandler(async (req, res, next) => {
  const limit = +req?.query?.limit || 10;
  const page = +req?.query?.page || 1;
  const skip = (page - 1) * limit;
  const privacy = req.query?.privacy;
  const posts = await prisma.post.findMany({
    where: {
      userId: +req.user.id,
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
      // kandn bli khas itzad hna xi inclde lhadok les likes 

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

  res.status(200).json({ status: "Success", data: posts });
});

export { getUserPosts };
