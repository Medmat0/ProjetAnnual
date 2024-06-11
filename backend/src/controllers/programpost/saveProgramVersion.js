import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Save a version of a program post
 * @method  POST
 * @route   /post/save-program-version
 */
const saveProgramVersion = asyncHandler(async (req, res, next) => {
  const { postId, content } = req.body;

  // Fetch the program post
  const programPost = await prisma.programPost.findUnique({
    where: { id: postId },
    include: { versions: true }
  });

  if (!programPost) {
    return res.status(404).json({ message: "Program post not found." });
  }

  // Create a new version
  const newVersion = await prisma.programPostVersion.create({
    data: {
      programPostId: postId,
      content: content,
      versionNumber: programPost.versions.length + 1
    }
  });

  // Update the main program post content
  await prisma.programPost.update({
    where: { id: postId },
    data: { description: content, code: content }
  });

  res.status(201).json({ status: "Success", data: newVersion });
});



export { saveProgramVersion };
