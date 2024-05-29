import asyncHandler from "express-async-handler";
import prisma from '../prisma.js';


/**
 * @desc       Utilisateur peut modifier un commentaire
 * @method     PUT 
 * @route      /comment/:commentId
 */
const updateComment = asyncHandler(async (req, res, next) => {
    const commentId = +req.params.commentId;
    const currentUser = +req.user.id;
    const { content } = req.body;
  
    // Vérifier si le commentaire appartient à l'utilisateur actuel
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        userId: true,
      },
    });
  
    if (!comment || comment.userId !== currentUser) {
      return res.status(403).json({ message: "You can't update this comment" });
    }
  
    // Mettre à jour le commentaire
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: content,
      },
      select: {
        id: true,
        content: true,
        User: {
          select: {
            name: true,
            id: true,
          },
        },
        Post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  
    if (!updatedComment) {
      return res.status(400).json({ message: "Error while typing this comment" });
    }
  
    res.status(200).json({ status: "Succes", data: updatedComment });
  });
  
  export { updateComment };
  