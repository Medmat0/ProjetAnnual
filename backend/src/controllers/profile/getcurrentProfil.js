import prisma from '../prisma.js';
import asyncHandler from "express-async-handler";


/**
 * @desc    Get current user profile
 * @method  GET
 * @route   /profile:userId
 */

const getCurrentProfile = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    
    const user = await prisma.user.findUnique({
        where: {
            id: +userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
            profile: {
                select: {
                    id: true,
                    bio: true,
                    image: true,
                    city: true,
                    website: true,
                   
                },
            },
            followers: true,
            following: true,
        },
      
    });


    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
    });

export { getCurrentProfile };