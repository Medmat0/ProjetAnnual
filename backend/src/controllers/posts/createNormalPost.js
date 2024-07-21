import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";

/**
 * @desc    Create normal post
 * @method  POST  
 * @route   /post/create-post
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, privacy, imageUrl } = req.body;
  console.log("privacy in backend", privacy);

  if (!imageUrl || imageUrl.length === 0) {
    return res.status(400).json({ message: "Please provide at least one image URL." });
  }

  const newPost = await prisma.post.create({
    data: {
      userId: +req.user.id,
      title,
      content,
      privacy,
      image: imageUrl,
    },
  });

  res.status(201).json({ status: "Success", data: newPost });
});

export { createPost };
