import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Project from '../models/projectModel';
import { MulterRequest } from '../types';

export const createProject = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, githubLink } = req.body;
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
    } else if (req.files && !Array.isArray(req.files)) {
      images = Object.values(req.files).flat().map(file => `/uploads/${file.filename}`);
    }

    const newProject = new Project({
      name,
      description,
      githubLink,
      images,
      captureImage: images[0]
    });

    const project = await newProject.save();
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req: MulterRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description, githubLink } = req.body;
    let images: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      images = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
    } else if (req.files && !Array.isArray(req.files)) {
      images = Object.values(req.files).flat().map(file => `/uploads/${file.filename}`);
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.githubLink = githubLink || project.githubLink;
    project.images = images.length > 0 ? images : project.images;
    project.captureImage = images.length > 0 ? images[0] : project.captureImage;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
