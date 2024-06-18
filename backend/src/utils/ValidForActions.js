import  prisma  from "../controllers/prisma.js";
import asyncHandler from "express-async-handler";


const getAllFollowed = asyncHandler(async (currentUser) => {
  const followingsList = await prisma.followRelation.findMany({
    where: {
      followerId: currentUser,
    },
    select: {
      followed: {
        select: {
          id: true,
        },
      },
    },
  });
  const followingsId = followingsList.map((el) => el.followed.id);
  return followingsId;
});

const ValidPostToMakeActions = asyncHandler(async (postId, currentUser) => {
  const followingsId = await getAllFollowed(currentUser);
  const post = await prisma.post.findFirst({
    where: {
      OR: [
        {
          id: postId,
          privacy: {
            in: ["PUBLIC", "FOLLOWERS"],
          },
          userId: {
            in: followingsId,
          },
        },
        {
          id: postId,
          privacy: "PUBLIC",
        },
      ],
    },
  });
  return post;
});

const ValidCommentToMakeActions = asyncHandler(async (commentId, currentUser) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      postId: {
        post: {
          privacy: "PUBLIC",
        },
        OR: [
          {
            post: {
              privacy: "PUBLIC",
            },
          },
          {
            post: {
              privacy: "FOLLOWERS",
              userId: currentUser,
            },
          },
        ],
      },
    },
  });
  return comment;
});
export { ValidPostToMakeActions, ValidCommentToMakeActions, getAllFollowed };
