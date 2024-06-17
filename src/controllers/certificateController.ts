import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Certificate from '../models/certificateModel';
import { MulterRequest } from '../types';

export const getAllCertificates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const certificates = await Certificate.find();
        res.json(certificates);
    } catch (error) {
        next(error);  // Pasa el error al siguiente middleware
    }
};

export const createCertificate = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array()); // Registro para ver errores de validación
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, organization, date, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const newCertificate = new Certificate({ title, organization, date, description, image });
        await newCertificate.save();
        res.status(201).json(newCertificate);
    } catch (error) {
        console.error('Error creating certificate:', error);
        res.status(500).json({ message: 'Error creating certificate' });
    }
};

export const getCertificateById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const certificate = await Certificate.findById(id);
        if (certificate) {
            res.json(certificate);
        } else {
            res.status(404).send(`Certificate with ID ${id} not found`);
        }
    } catch (error) {
        next(error);  // Pasa el error al siguiente middleware
    }
};

export const updateCertificate = async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, organization, date, description } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const updatedCertificate = await Certificate.findByIdAndUpdate(
            id, 
            { title, organization, date, description, image }, 
            { new: true }
        );
        if (updatedCertificate) {
            res.json(updatedCertificate);
        } else {
            res.status(404).send(`Certificate with ID ${id} not found`);
        }
    } catch (error) {
        next(error);  // Pasa el error al siguiente middleware
    }
};

export const deleteCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const certificate = await Certificate.findByIdAndDelete(id);
        if (certificate) {
            res.status(204).send();
        } else {
            res.status(404).send(`Certificate with ID ${id} not found`);
        }
    } catch (error) {
        next(error);  // Pasa el error al siguiente middleware
    }
};
