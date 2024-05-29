import prisma from '../prisma.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc       Utilisateur peut supprimer un commentaire
 * @method     DELETE 
 * @route      /comment/:commentId
 */
const deleteComment = asyncHandler(async (req, res, next) => {
    const commentId = +req.params.commentId;
    const currentUser = +req.user.id;
  
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userId: true,
      },
    });
  
    if (!comment) {
      return res.status(404).json({ message: "this comment does not exist " });
    }
  
    if (comment.userId !== currentUser) {
      return res.status(403).json({ message: "You can't delete this comment" });
    }
  
    // Supprimer le commentaire
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  await prisma.reply.deleteMany({
    where: {
      commentId: commentId,
    },
  });
  
    await prisma.post.update({
      where: {
        id: comment.postId,
      },
      data: {
        commentsCount: {
          decrement: 1,
        },
      },
    });
  
    res.status(200).json({ status: "Succes", message: "Comment deleted" });
  });
  
  export { deleteComment };
  