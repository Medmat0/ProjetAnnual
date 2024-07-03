import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Delete a pipeline
 * @method  DELETE
 * @route   /pipeline/:id
 */
const deletePipeline = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingPipeline = await prisma.pipeline.findUnique({
        where: { id: Number(id) },
    });

    if (!existingPipeline) {
        return res.status(404).json({ message: "Pipeline not found." });
    }

    await prisma.pipeline.delete({
        where: { id: Number(id) },
    });

    res.status(204).json({ status: "Success", data: null });
});

export { deletePipeline };