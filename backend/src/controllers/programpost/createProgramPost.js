
import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";


/**
 * @desc    Create program post
 * @method  POST  
 * @route   /post/create-program-post
 */
const createProgramPost = asyncHandler(async (req, res, next) => {
  const { title, content, code, inputType, privacy, language,tags } = req.body;
 
  if (!title || !content || !code) {
    return res.status(400).json({ message: "Title, Description, and Code are required." });
  }

  const newProgramPost = await prisma.programPost.create({
    data: {
      userId: +req.user.id,
      title: title,
      description: content,
      code: code,
      inputType: inputType,
      privacy: privacy,
      language: language,
      tags: tags,
    },
  });

  res.status(201).json({ status: "Success", data: newProgramPost });
});

export { createProgramPost };
