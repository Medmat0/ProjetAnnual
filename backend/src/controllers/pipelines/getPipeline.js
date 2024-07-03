    import prisma from "../prisma.js";
    import asyncHandler from "express-async-handler";


    /**
     * @desc    Get all pipelines for the authenticated user
     * @method  GET
     * @route   /pipeline
     */
    const getPipelines = asyncHandler(async (req, res) => {
        const userId = req.user.id; 
        

        const pipelines = await prisma.pipeline.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        

        res.status(200).json({ status: "Success", data: pipelines });
    });
    export { getPipelines };