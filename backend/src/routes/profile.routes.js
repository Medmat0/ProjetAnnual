import express from 'express';
const router = express.Router();

import { authMiddleware } from '../middleware/auth.middleware.js';
import { getCurrentProfile , 
  getAllFriends , 
          searchForUsers ,
          unfollowUser,
         updateCurrentUser ,
          listFriendshipRequest ,
          acceptFriendshipRequest, 
           rejectFriendshipRequest, sendFriendshipRequest } from '../controllers/profile/profile.index.js';

router.get('/details/:userId', authMiddleware, getCurrentProfile);
router.get('/followers/', authMiddleware, getAllFriends);
router.get('/search?', authMiddleware, searchForUsers);
router.patch('/edit', authMiddleware, updateCurrentUser);
router.get('/requests', authMiddleware, listFriendshipRequest);
router.post('/request/accept/:requestId', authMiddleware, acceptFriendshipRequest);
router.post('/request/reject/:requestId', authMiddleware, rejectFriendshipRequest);
router.post('/request/send/:userId', authMiddleware, sendFriendshipRequest);
router.post('/unfollow/:userId', authMiddleware , unfollowUser)



export default router;
