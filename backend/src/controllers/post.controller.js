import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} from '../services/post.service.js';
import { sendSuccess } from '../utils/response.js';

export const getPosts = async (req, res, next) => {
  try {
    const { page, limit, search, category, authorId } = req.query;
    const result = await getAllPosts({ page, limit, search, category, authorId });
    return sendSuccess(res, result, 'Posts retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await getPostById(id);
    return sendSuccess(res, post, 'Post retrieved successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    const post = await createPost({
      title,
      description,
      category,
      authorId: req.user.id
    });
    return sendSuccess(res, post, 'Post created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;
    const post = await updatePost(id, req.user.id, { title, description, category });
    return sendSuccess(res, post, 'Post updated successfully', 200);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await deletePost(id, req.user.id);
    return sendSuccess(res, result, 'Post deleted successfully', 200);
  } catch (error) {
    next(error);
  }
};
