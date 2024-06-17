import mongoose, { Document, Schema } from 'mongoose';

export interface Certificate extends Document {
    title: string;
    organization: string;
    date: string;
    description: string;
    image: string;
}

const CertificateSchema: Schema = new Schema({
    title: { type: String, required: true },
    organization: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },  // Ruta de la imagen
});

export default mongoose.model<Certificate>('Certificate', CertificateSchema);
