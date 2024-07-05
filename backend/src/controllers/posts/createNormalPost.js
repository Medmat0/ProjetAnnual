import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";
import uploader from "../../utils/cloudinary.js";
import fs from "fs";


/**
 * @desc    Create normal post
 * @method  POST  
 * @route   /post/create-post
 */
const createPost = asyncHandler(async (req, res, next) => {
  const { title, content, privacy } = req.body;
  console.log("privacy in backend", privacy);
 
  const img = req.files;
  if (!img || img.length === 0) {
    return res.status(400).json({ message: "Please select at least one image." });
  }
  if (img) {
    const urls = [];
    for (let file of img) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.url);
      fs.unlinkSync(path);
      console.log("newPath", newPath);
    }
    req.urls = urls;
  }
  const { urls } = req;
  
  const newPost = await prisma.post.create({
    data: {
      userId: +req.user.id,
      title: title,
      content: content,
      privacy: privacy,
      image: urls,
    },
  });
  res.status(201).json({ status: "Success", data: newPost });
});


export { createPost };