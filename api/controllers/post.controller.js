import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import {
  incrementTotalCount,
  decrementTotalCount,
} from '../controllers/category.controller.js'

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    // Increment totalCount in the category
    await incrementTotalCount(req.body.category);

    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {

    // Find the post by ID
    const post = await Post.findByIdAndDelete(req.params.postId);

    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }
    // Decrement totalCount in the category
    await decrementTotalCount(post.category);

    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const getallposts = async (req, res, next) => {

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;

    // Fetch posts from the database with sorting and pagination
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('userId');

    // Send response with the fetched posts
    res.status(200).json({
      success: true,
      message: "A list of all posts",
      posts: posts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: err.message
    });
  }
};

export async function getallpostsbyuserid(req, res, next) {
  const userId = req.params.userId;

  try {
    const posts = await Post.find({ userId: userId }).sort({ createdAt: -1 }).exec();
    res.status(200).json({
      success: true,
      message: `Posts by user ${userId}`,
      posts: posts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: err.message
    });
  }
}


export const searchPosts = async (req, res, next) => {
  try {
    const searchtext = req.query.searchtext;
    const query = {};

    if (searchtext) {
      query.$or = [
        { title: { $regex: searchtext, $options: 'i' } },
        { category: { $regex: searchtext, $options: 'i' } },
      ];
    }

    const posts = await Post.find(query);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

export const getpostsbystatus = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const status = req.query.status;

    const posts = await Post.find({ status: status })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('userId');

    // Send response with the fetched posts
    res.status(200).json({
      success: true,
      message: "A list of all published posts",
      posts: posts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: err.message
    });
  }
};

export const searchPostsByStatus = async (req, res, next) => {
  try {
    const searchtext = req.query.searchtext;
    const status = req.query.status;
    const query = { status };

    if (searchtext) {
      query.$or = [
        { title: { $regex: searchtext, $options: 'i' } },
        { category: { $regex: searchtext, $options: 'i' } },
      ];
    }
    const posts = await Post.find(query);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};