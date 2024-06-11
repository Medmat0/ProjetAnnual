import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";


/**
 * @desc    Get versions of a program post
 * @method  GET
 * @route   /post/program-versions/:postId
 */
const getProgramVersions = asyncHandler(async (req, res, next) => {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }
    
    const versions = await prisma.programPostVersion.findMany({
      where: { programPostId: +postId },
      orderBy: { versionNumber: 'asc' }
    });
    if (!versions) {
      return res.status(404).json({ message: "No versions found." });
    }
  
    res.status(200).json({ status: "Success", data: versions });
  });

export { getProgramVersions };