import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Skill from '../models/skillModel';
import { MulterRequest } from '../types';

export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, level } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newSkill = new Skill({
      name,
      level,
      image,
    });

    const skill = await newSkill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSkillById = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSkill = async (req: MulterRequest, res: Response) => {
  const { name, level } = req.body;
  let image = '';
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.name = name || skill.name;
    skill.level = level || skill.level;
    skill.image = image || skill.image;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await Skill.deleteOne({ _id: req.params.id });
    res.json({ message: 'Skill removed' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
