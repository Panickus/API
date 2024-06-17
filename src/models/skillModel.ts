import mongoose, { Document, Schema } from 'mongoose';

export interface Skill extends Document {
  name: string;
  level: string;
  image: string;
}

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  image: { type: String, required: true }
});

export default mongoose.model<Skill>('Skill', SkillSchema);
