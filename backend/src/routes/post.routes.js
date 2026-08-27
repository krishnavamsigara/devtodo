import { Router } from 'express';
import {
  getPosts,
  getPost,
  create,
  update,
  remove
} from '../controllers/post.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { createPostSchema, updatePostSchema } from '../validators/post.validator.js';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authenticate, validate(createPostSchema), create);
router.put('/:id', authenticate, validate(updatePostSchema), update);
router.delete('/:id', authenticate, remove);

export default router;
