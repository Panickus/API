import { Request, Response } from 'express';
import Blog from '../models/blogModel';

export const createBlog = async (req: Request, res: Response) => {
  const { title, content, author, tags } = req.body;
  let image = '';
  let authorAvatar = '';

  if (req.files && 'image' in req.files) {
    image = `/uploads/${(req.files.image as Express.Multer.File[])[0].filename}`;
  }

  if (req.files && 'authorAvatar' in req.files) {
    authorAvatar = `/uploads/${(req.files.authorAvatar as Express.Multer.File[])[0].filename}`;
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      author,
      tags,
      image,
      authorAvatar
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Error creating blog' });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).send(`Blog with ID ${id} not found`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tags, title, content, author, date } = req.body;
  let image = '';
  let authorAvatar = '';

  if (req.files && 'image' in req.files) {
    image = `/uploads/${(req.files.image as Express.Multer.File[])[0].filename}`;
  }

  if (req.files && 'authorAvatar' in req.files) {
    authorAvatar = `/uploads/${(req.files.authorAvatar as Express.Multer.File[])[0].filename}`;
  }

  const updateData: any = { tags, title, content, author, date };
  if (image) updateData.image = image;
  if (authorAvatar) updateData.authorAvatar = authorAvatar;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).send(`Blog with ID ${id} not found`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (blog) {
      res.status(204).send();
    } else {
      res.status(404).send(`Blog with ID ${id} not found`);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog' });
  }
};
