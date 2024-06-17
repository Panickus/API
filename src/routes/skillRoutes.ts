import { Router, Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { createSkill, getAllSkills, getSkillById, updateSkill, deleteSkill } from '../controllers/skillController';
import auth from '../middleware/auth';
import roleAuth from '../middleware/roleAuth';
import upload from '../middleware/upload'; // Asegúrate de que el middleware de multer esté configurado correctamente
import { MulterRequest } from '../types';

const router = Router();

router.post(
  '/',
  auth,
  roleAuth(['admin']),
  upload.single('image'),  // Manejador de archivo
  [
    check('name', 'Name is required').not().isEmpty(),
    check('level', 'Level is required').not().isEmpty()
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createSkill(req as MulterRequest, res, next );  
  }
);

router.get('/', auth, roleAuth(['admin', 'user']), (req: Request, res: Response) => {
  getAllSkills(req, res);  // Llamar con 2 argumentos
});

router.get('/:id', auth, roleAuth(['admin', 'user']), (req: Request, res: Response) => {
  getSkillById(req, res);  // Llamar con 2 argumentos
});

router.put(
  '/:id',
  auth,
  roleAuth(['admin']),
  upload.single('image'),  // Manejador de archivo
  [
    check('name', 'Name is required').not().isEmpty(),
    check('level', 'Level is required').not().isEmpty()
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    updateSkill(req as MulterRequest, res);  // Llamar con 2 argumentos
  }
);

router.delete('/:id', auth, roleAuth(['admin']), (req: Request, res: Response) => {
  deleteSkill(req, res);  // Llamar con 2 argumentos
});

export default router;
