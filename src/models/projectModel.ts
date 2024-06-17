import mongoose, { Document, Schema } from 'mongoose';

export interface Project extends Document {
  name: string;
  description: string;
  githubLink: string;
  images: string[];
  captureImage: string;
}

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  githubLink: { type: String, required: true },
  images: { type: [String], required: true },
  captureImage: { type: String, required: true }
});

export default mongoose.model<Project>('Project', ProjectSchema);
