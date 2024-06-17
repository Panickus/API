import { Request, Response } from 'express';
import Testimonial from '../models/testimonialModel';

interface MulterRequest extends Request {
  files: {
    companyLogo?: Express.Multer.File[];
    image?: Express.Multer.File[];
  };
}

export const getAllTestimonials = async (req: Request, res: Response): Promise<void> => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials' });
  }
};

export const createTestimonial = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { name, position, company, testimonial } = req.body;
    const companyLogo = req.files && req.files.companyLogo ? `/uploads/${req.files.companyLogo[0].filename}` : '';
    const image = req.files && req.files.image ? `/uploads/${req.files.image[0].filename}` : '';

    const newTestimonial = new Testimonial({ name, position, company, testimonial, companyLogo, image });
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    res.status(500).json({ message: 'Error creating testimonial', error });
  }
};

export const getTestimonialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (testimonial) {
      res.json(testimonial);
    } else {
      res.status(404).json({ message: `Testimonial with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonial', error });
  }
};

export const updateTestimonial = async (req: MulterRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, position, company, testimonial } = req.body;

    const companyLogo = req.files && req.files.companyLogo ? `/uploads/${req.files.companyLogo[0].filename}` : '';
    const image = req.files && req.files.image ? `/uploads/${req.files.image[0].filename}` : '';

    const updatedFields: Partial<typeof req.body> & { companyLogo?: string; image?: string } = { name, position, company, testimonial };
    if (companyLogo) updatedFields.companyLogo = companyLogo;
    if (image) updatedFields.image = image;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(id, updatedFields, { new: true });
    if (updatedTestimonial) {
      res.json(updatedTestimonial);
    } else {
      res.status(404).json({ message: `Testimonial with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating testimonial', error });
  }
};

export const deleteTestimonial = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (testimonial) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: `Testimonial with ID ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting testimonial', error });
  }
};
