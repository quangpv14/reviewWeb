import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
    create, deletepost, getposts, getpostsbystatus,
    updatepost, getallposts, getallpostsbyuserid, searchPosts, searchPostsByStatus,
} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getposts', getposts)
router.get('/getallposts', verifyToken, getallposts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost)
router.put('/updatepost/:postId/:userId', verifyToken, updatepost)
router.get('/user/:userId', getallpostsbyuserid)
router.get('/filterposts/search', searchPosts)
router.get('/getpostsbystatus', verifyToken, getpostsbystatus)
router.get('/filterpostsbystatus/search', searchPostsByStatus)

export default router;