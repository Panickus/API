import { Router } from 'express';
import { check } from 'express-validator';
import multer from 'multer';
import { createProject, getAllProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController';
import auth from '../middleware/auth';
import roleAuth from '../middleware/roleAuth';

const router = Router();
const upload = multer({ dest: 'uploads/' });  // Configura multer según tus necesidades

router.get('/', auth, roleAuth(['admin', 'user']), getAllProjects);

router.post(
  '/',
  auth,
  roleAuth(['admin']),
  upload.array('images', 10), // Asegúrate de que esto coincida con el nombre del campo en el frontend
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('githubLink', 'Github link is required').isURL(),
  ],
  createProject
);

router.get('/:id', auth, roleAuth(['admin', 'user']), getProjectById);

router.put(
  '/:id',
  auth,
  roleAuth(['admin']),
  upload.array('images', 10), // Asegúrate de que esto coincida con el nombre del campo en el frontend
  updateProject
);

router.delete('/:id', auth, roleAuth(['admin']), deleteProject);

export default router;
