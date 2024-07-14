
import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";



/**
 * @desc    Get program posts from user and friends
 * @method  GET  
 * @route   /post/programPosts
 */
const getProgramPosts = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
  
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId1: userId },
          { userId2: userId }
        ]
      },
      select: {
        userId1: true,
        userId2: true,
      }
    });
  
    const friendIds = friends.map(friend => 
      friend.userId1 === userId ? friend.userId2 : friend.userId1
    );
  
    const userIds = [...friendIds, userId];
  
    const programPosts = await prisma.programPost.findMany({
      where: {
        userId: {
          in: userIds
        },
        privacy: "PUBLIC" 
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                image: true 
              }
            }
          }
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
            id :true,
            userId :true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  
    res.status(200).json({ data: programPosts });
  });
  
  export { getProgramPosts };