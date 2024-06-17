import { Router } from 'express';
import { check } from 'express-validator';
import { loginUser, registerUser, getUserProfile } from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router = Router();

router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

router.get('/user', authMiddleware, getUserProfile);

export default router;
