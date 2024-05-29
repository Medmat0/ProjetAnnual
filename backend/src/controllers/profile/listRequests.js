import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const listFriendshipRequest = async (req, res) => {
  const userId = req.user.id; // Supposons que l'ID de l'utilisateur soit stocké dans req.user.id après l'authentification

  try {
    const userFollowRequests = await prisma.followRequest.findMany({
      where: {
        requesteeId: userId,
        status: "PENDING", // Filtrer les demandes où l'utilisateur est le demandé
      },
      include: {
        requester: {
          select: {
            name: true,
            profile: {
              select: {
                image: true,
              },
            },
          },
        },
      },
    });

    res.json(userFollowRequests);
  } catch (error) {
    console.error('Error fetching user follow requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { listFriendshipRequest };
