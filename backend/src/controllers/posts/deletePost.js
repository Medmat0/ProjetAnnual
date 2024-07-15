import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
const prisma = new PrismaClient();

/**
 * @desc    Current user can delete his post
 * @method  DELETE   
 * @route   /post/delete/:postId
 */
const currentUserDeletePost = asyncHandler(async (req, res, next) => {
  const currentUser = +req.user.id;
  const postId = +req.params.postId;
  console.log("postId", postId);

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post || post.userId !== currentUser) {
    return res.status(400).json({ message: "You can't delete this post or it does not exist" });
  }

  await prisma.$transaction([
    prisma.postComment.deleteMany({
      where: {
        postId: postId,
      },
    }),
    prisma.postLike.deleteMany({
      where: {
        postId: postId,
      },
    }),
  ]);

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });


  res.status(200).json({
    status: "Success",
    message: "Post has been deleted",
  });
});

export { currentUserDeletePost };
