import { Router } from 'express';
import { check } from 'express-validator';
import { createBlog, getBlogById, updateBlog, deleteBlog, getAllBlogs } from '../controllers/blogController';
import auth from '../middleware/auth';
import roleAuth from '../middleware/roleAuth';
import upload from '../middleware/upload';

const router = Router();

router.post(
  '/',
  auth,
  roleAuth(['admin']),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'authorAvatar', maxCount: 1 }]),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
    check('tags', 'Tags are required').not().isEmpty(),
  ],
  createBlog
);

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.put('/:id', auth, roleAuth(['admin']), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'authorAvatar', maxCount: 1 }]), updateBlog);
router.delete('/:id', auth, roleAuth(['admin']), deleteBlog);

export default router;
