import { Router, Request, Response } from 'express';
import { getAllTestimonials, createTestimonial, getTestimonialById, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import upload from '../middleware/upload';

const router = Router();

router.get('/', getAllTestimonials);
router.post('/', upload.fields([{ name: 'companyLogo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req: Request, res: Response) => {
  createTestimonial(req as any, res);
});
router.get('/:id', getTestimonialById);
router.put('/:id', upload.fields([{ name: 'companyLogo', maxCount: 1 }, { name: 'image', maxCount: 1 }]), (req: Request, res: Response) => {
  updateTestimonial(req as any, res);
});
router.delete('/:id', deleteTestimonial);

export default router;
