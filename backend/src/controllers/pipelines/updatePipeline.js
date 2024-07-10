
import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Update a pipeline
 * @method  PUT
 * @route   /pipeline/:id
 */
const updatePipeline = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, nodes, edges } = req.body;

    const updatedPipeline = await prisma.pipeline.update({
        where: { id: Number(id) },
        data: {
            name,
            description,
            nodes,
            edges,
        },
    });

    if (!updatedPipeline) {
        return res.status(404).json({ message: "Pipeline not found." });
    }

    res.status(200).json({ status: "Success", data: updatedPipeline });
});

export { updatePipeline };