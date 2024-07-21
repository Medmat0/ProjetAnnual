import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";

/**
 * @desc    Create normal post
 * @method  POST  
 * @route   /post/create-post
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, privacy, image } = req.body;
  const urls =  [];

  if (!image || image.length === 0) {
    return res.status(400).json({ message: "Please provide at least one image URL." });
  }
  urls.push(image); 
  const newPost = await prisma.post.create({
    data: {
      userId: +req.user.id,
      title,
      content,
      privacy,
      image: urls,
    },
  });

  res.status(201).json({ status: "Success", data: newPost });
});

export { createPost };
