import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    User can create comment on a program post
 * @method  POST
 * @route   /programpost/comment/:pId
 */
const createProgramPostComment = asyncHandler(async (req, res, next) => {
  const programPostId = +req.params.pId;
  const currentUser = +req.user.id;
  const { content } = req.body;

  const programPost = await prisma.programPost.findUnique({
    where: { id: programPostId },
  });
  if (!programPost) return res.status(404).json({ message: "Program Post not found" });

  // Create comment
  const comment = await prisma.programPostComment.create({
    data: {
      programPostId: programPostId,
      userId: currentUser,
      content: content,
    },
    select: {
      id: true,
      content: true,
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      programPost: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!comment) return res.status(400).json({ message: "Error while posting the comment" });

  await prisma.programPost.update({
    where: { id: programPostId },
    data: { commentsCount: { increment: 1 } },
  });

  res.status(201).json({ status: "Success", data: comment });
});

export { createProgramPostComment };
