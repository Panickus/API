import mongoose, { Document, Schema } from 'mongoose';

export interface Testimonial extends Document {
  name: string;
  position: string;
  company: string;
  testimonial: string;
  companyLogo: string;
  image: string;
}

const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  company: { type: String, required: true },
  testimonial: { type: String, required: true },
  companyLogo: { type: String, required: true },
  image: { type: String, required: true }
});

export default mongoose.model<Testimonial>('Testimonial', TestimonialSchema);
