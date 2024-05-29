import prisma from '../prisma.js';
import asyncHandler from 'express-async-handler';


/**
 * @desc       Utilisateur peut ajouter une réponse à un commentaire
 * @method     POST 
 * @route      /comment/:commentId/reply
 */
const addReplyToComment = asyncHandler(async (req, res, next) => {
    const commentId = +req.params.commentId;
    const currentUser = +req.user.id;
    const { content } = req.body;
  
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
      },
    });
  
    if (!comment) {
      return res.status(404).json({ message: "This comment is not found" });
    }
  
    const reply = await prisma.reply.create({
      data: {
        commentId: commentId,
        userId: currentUser,
        content: content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  
    if (!reply) {
      return res.status(400).json({ message: "Error with the reply comment" });
    }
  
    res.status(201).json({ status: "Succes", data: reply });
  });
  
  export { addReplyToComment };
  