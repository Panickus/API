import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log('Fetching all users');
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const createUser = async (req: Request, res: Response) => {
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
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send(`User with ID ${id} not found`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  user?: any;
}

export const updateUserProfile = async (req: MulterRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const updates: any = {};

    if (email) updates.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    return res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Error updating profile', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.status(204).send();
    } else {
      res.status(404).send(`User with ID ${id} not found`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
