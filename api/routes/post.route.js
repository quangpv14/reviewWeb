import express from "express";
import {
	verifyToken,
	verifyIsAdminOrNonBlockedUser,
} from "../utils/verifyUser.js";
import {
	create,
	deletepost,
	getposts,
	getpostsbystatus,
	updatepost,
	getallposts,
	getallpostsbyuserid,
	searchPosts,
	searchPostsByStatus,
	viewPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, verifyIsAdminOrNonBlockedUser, create);
router.get("/getposts", getposts);
router.get("/getallposts", verifyToken, getallposts);
router.delete(
	"/deletepost/:postId/:userId",
	verifyToken,
	verifyIsAdminOrNonBlockedUser,
	deletepost
);
router.put(
	"/updatepost/:postId/:userId",
	verifyToken,
	verifyIsAdminOrNonBlockedUser,
	updatepost
);
router.put("/viewpost/:postId/:userId", verifyToken, viewPost);
router.get("/user/:userId", getallpostsbyuserid);
router.get("/filterposts/search", searchPosts);
router.get("/getpostsbystatus", verifyToken, getpostsbystatus);
router.get("/filterpostsbystatus/search", searchPostsByStatus);

export default router;
