import { Router } from 'express';
import { check } from 'express-validator';
import { loginUser, registerUser, getUserProfile } from '../controllers/authController';
import { updateUserProfile, getAllUsers, getUserById, deleteUser } from '../controllers/userController';
import authMiddleware from '../middleware/auth';
import upload from '../middleware/upload';

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

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), updateUserProfile);

// Opcional: Rutas adicionales para manejar usuarios
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/users/:id', authMiddleware, upload.single('avatar'), updateUserProfile);  // Ruta para actualizar usuario
router.delete('/users/:id', authMiddleware, deleteUser);

export default router;
