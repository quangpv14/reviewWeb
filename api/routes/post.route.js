import express from "express";
import {
	verifyToken,
	verifyIsAdminOrNonBlockedUser,
} from "../utils/verifyUser.js";
import {
	create,
	deletepost,
	getposts,
	updatepost,
	getallposts,
	getallpostsbyuserid,
	searchPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", verifyToken, verifyIsAdminOrNonBlockedUser, create);
router.get("/getposts", getposts);
router.get("/getallposts", getallposts);
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
router.get("/user/:userId", getallpostsbyuserid);
router.get("/filterposts/search", searchPosts);

export default router;
