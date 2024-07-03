import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";


/**
 * @desc    User can like or unlike any available program post
 * @method  POST
 * @route   /programpost/like/:pId
 */
const likeOrUnLikeProgramPost = asyncHandler(async (req, res, next) => {
  const programPostId = +req.params.pId;
  const currentUser = +req.user.id;

  const programPost = await prisma.programPost.findUnique({
    where: { id: programPostId },
  });
  if (!programPost) return res.status(404).json({ message: "Program Post not found" });

  const alreadyLiked = await prisma.programPostLike.findFirst({
    where: {
      programPostId: programPostId,
      userId: currentUser,
    },
  });

  if (!alreadyLiked) {
    const addLike = await prisma.programPostLike.create({
      data: {
        programPostId: programPostId,
        userId: currentUser,
      },
      select: {
        programPostId: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!addLike) return res.status(400).json({ message: "Error while liking the program post" });

    await prisma.programPost.update({
      where: { id: programPostId },
      data: { likesCount: { increment: 1 } },
    });

    res.status(201).json({ message: `You liked this program post ${programPostId}`, data: addLike });
  } else {
    const unLike = await prisma.programPostLike.delete({
      where: {
        programPostId_userId: {
          programPostId: programPostId,
          userId: currentUser,
        },
      },
    });

    if (!unLike) return res.status(400).json({ message: "Error while unliking the program post" });

    await prisma.programPost.update({
      where: { id: programPostId },
      data: { likesCount: { decrement: 1 } },
    });

    res.status(200).json({ message: `You unliked this program post ${programPostId}` });
  }
});

export { likeOrUnLikeProgramPost };
