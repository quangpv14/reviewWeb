import Rating from '../models/ratingpost.model.js';
import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const createRating = async (req, res, next) => {
    try {
        const { userId, postId, rating } = req.body;

        // Check if the user has already rated this post
        const existingRating = await Rating.findOne({ userId, postId });
        if (existingRating) {
            return next(errorHandler(400, 'User has already rated this post'));
        }

        // Create new rating
        const newRating = new Rating({ userId, postId, rating });
        await newRating.save();

        // Update post's average rating
        const postRatings = await Rating.find({ postId });
        const totalRatings = postRatings.length;
        const totalRatingSum = postRatings.reduce((acc, curr) => acc + curr.rating, 0); //acc=0 curr: element current
        const averageRating = totalRatings > 0 ? totalRatingSum / totalRatings : 0;

        await Post.findByIdAndUpdate(postId, { rating: averageRating });

        // res.status(201).json({ message: "Rating created successfully" });
        res.json({ newRating: averageRating });
    } catch (error) {
        next(error);
    }
};
