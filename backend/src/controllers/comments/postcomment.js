import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";
import { ValidPostToMakeActions } from "../../utils/ValidForActions.js";

/**
 * @desc       User can create comment
 * @method     POST 
 * @route      /comment/:pId
 */
const createComment = asyncHandler(async (req, res, next) => {
  const postId = +req.params.pId;
  const currentUser = +req.user.id;
  const { content } = req.body;

  const post = await ValidPostToMakeActions(postId, currentUser);
  if (!post)
    return res.status(404).json({ message: "We can't reach to this post" });

  const comment = await prisma.postComment.create({
    data: {
      postId: postId,
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
          profile: {
            select: {
              image: true,
            },
          },
        },
      },
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!comment)
    return res.status(400).json({ message: "Error while posting the comment" });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      commentsCount: {
        increment: 1,
      },
    },
  });

  res.status(201).json({ status: "Success", data: comment });
});

export { createComment };
