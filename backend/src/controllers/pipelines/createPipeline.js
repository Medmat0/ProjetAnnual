import prisma from "../prisma.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Create a new pipeline
 * @method  POST
 * @route   /pipeline
 */
const createPipeline = asyncHandler(async (req, res) => {
    const { name, description, nodes, edges } = req.body;
    const userId = req.user.id; 

    if (!name || !nodes || !edges) {
        return res.status(400).json({ message: "Name, nodes, and edges are required." });
    }

    const nodesWithVersions = nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
            ...node.data,
            version: node.data.version  
        },
        width: node.width,
        height: node.height
    }));

    const newPipeline = await prisma.pipeline.create({
        data: {
            name,
            description,
            nodes: nodesWithVersions,
            edges,
            userId,
        },
    });

    res.status(201).json({ status: "Success", data: newPipeline });
});
export { createPipeline };