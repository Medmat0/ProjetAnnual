import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";


/**
 * @desc    Get a single pipeline by ID
 * @method  GET
 * @route   /pipeline/:id
 */
const getPipelineById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const pipeline = await prisma.pipeline.findUnique({
        where: { id: Number(id) },
    });

    if (!pipeline) {
        return res.status(404).json({ message: "Pipeline not found." });
    }

    res.status(200).json({ status: "Success", data: pipeline });
});

export { getPipelineById };