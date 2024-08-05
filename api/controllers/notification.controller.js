import { errorHandler } from '../utils/error.js';
import Notification from '../models/notification.model.js';

export const createNotification = async (req, res, next) => {
    try {
        const { content, userId, postId } = req.body;

        // Create new rating
        const newNotify = new Notification({ content, userId, postId });
        await newNotify.save();

        res.status(201).json(newNotify);
    } catch (error) {
        next(error);
    }
}
