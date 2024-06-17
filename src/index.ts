import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import skillRoutes from './routes/skillRoutes';
import testimonialRoutes from './routes/testimonialRoutes';
import projectRoutes from './routes/projectRoutes';
import certificateRoutes from './routes/certificateRoutes';
import blogRoutes from './routes/blogRoutes';
import authRoutes from './routes/authRoutes';
import setupSwagger from './config/swagger';
import path from 'path';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Permitir el origen del frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permitir credenciales
}));
app.use(morgan('dev'));
app.use(express.json());

// Servir archivos estáticos desde el directorio uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

setupSwagger(app);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

