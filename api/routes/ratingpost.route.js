import express from 'express';
import {
    createRating,
} from '../controllers/ratingpost.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post("/create", verifyToken, createRating);

export default router;

