import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";


/**
 * @desc    Current user can delete his program post along with related likes, comments, collections, and versions
 * @method  DELETE
 * @route   /programPost/:id
 */
const deleteProgramPost = asyncHandler(async (req, res, next) => {
  const currentUser = +req.user.id;
  const postId = +req.params.postId;

  const programPost = await prisma.programPost.findUnique({
    where: { id: postId },
    include: {
      author: true, 
      versions: true, 
    },
  });

  if (!programPost || programPost.userId !== currentUser) {
    return res.status(400).json({ message: "You can't delete this post or it does not exist" });
  }

  await prisma.$transaction([
    prisma.ProgramPostComment.deleteMany({
      where: { programPostId: postId },
    }),

    prisma.ProgramPostLike.deleteMany({
      where: { programPostId: postId },
    }),

    prisma.user.update({
      where: { id: currentUser },
      data: {
        programCollections: {
          disconnect: { id: postId },
        },
      },
    }),

    prisma.programPostVersion.deleteMany({
      where: { programPostId: postId },
    }),

    prisma.programPost.delete({
      where: { id: postId },
    }),
  ]);

  res.status(200).json({
    status: "Success",
    message: "Program post and related data have been deleted",
  });
});

export { deleteProgramPost };
