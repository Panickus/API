import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import { CustomRequest } from '../types/custom';

export const registerUser = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, email, password, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: { id: user.id, role: user.role }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || '',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            email: user.email, 
            username: user.username, 
            role: user.role, 
            avatar: `http://localhost:3000${user.avatar}` // Ajusta la ruta del avatar
          } 
        });
      }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: CustomRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: { id: user.id, role: user.role }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || '',
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            email: user.email, 
            username: user.username, 
            role: user.role, 
            avatar: `http://localhost:3000${user.avatar}` // Ajusta la ruta del avatar
          } 
        });
      }
    );
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (user) {
      res.json({
        ...user.toObject(),
        avatar: `http://localhost:3000${user.avatar}` // Ajusta la ruta del avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
