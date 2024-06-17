import { Router, Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { getAllCertificates, createCertificate, getCertificateById, updateCertificate, deleteCertificate } from '../controllers/certificateController';
import auth from '../middleware/auth';
import roleAuth from '../middleware/roleAuth';
import upload from '../middleware/upload';
import { MulterRequest } from '../types';

const router = Router();

router.get('/', auth, roleAuth(['admin', 'user']), (req: Request, res: Response, next: NextFunction) => {
  getAllCertificates(req, res, next);
});

router.post(
  '/',
  auth,
  roleAuth(['admin']),
  upload.single('image'),  // Manejador de archivo
  [
    check('title', 'Title is required').not().isEmpty(),
    check('organization', 'Organization is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  (req: MulterRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createCertificate(req, res, next);
  }
);

router.get('/:id', auth, roleAuth(['admin', 'user']), (req: Request, res: Response, next: NextFunction) => {
  getCertificateById(req, res, next);
});

router.put(
  '/:id',
  auth,
  roleAuth(['admin']),
  upload.single('image'),  // Manejador de archivo
  [
    check('title', 'Title is required').not().isEmpty(),
    check('organization', 'Organization is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  (req: MulterRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateCertificate(req, res, next);
  }
);

router.delete('/:id', auth, roleAuth(['admin']), (req: Request, res: Response, next: NextFunction) => {
  deleteCertificate(req, res, next);
});

export default router;
