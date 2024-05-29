import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";

import {
  ValidPostToMakeActions,
} from "../../utils/ValidForActions.js";
const prisma = new PrismaClient();

/**
 * @desc       User can get ALl comments on any post 
 * @method     GET 
 * @route      /comments/:pId
 */
const getAllCommentsOnAPost = asyncHandler(async (req, res, next) => {
  const postId = +req.params.pId;
  const currentUser = +req.user.id;
  const post = await ValidPostToMakeActions(postId, currentUser);
  if (!post)
    return res.status(404).json({ message: "We can't reach to this post" });
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    select: {
      postId: true,
      User: {
        select: {
          id: true,
          name: true,
        },
      },
      content: true,
    },
  });
  if (!comments)
    return res.status(404).json({ message: "No comments found" });
  res.status(200).json({ status: "Success", data: comments });
});

export { getAllCommentsOnAPost };