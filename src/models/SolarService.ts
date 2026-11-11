import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISolarService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  suitableCustomers: string[];
  supportedSystemTypes: string[];
  processSteps: { stepNumber: number; title: string; description: string }[];
  serviceableStates: string[]; // Bihar, Jharkhand, Uttar Pradesh
  image: string;
  sortOrder: number;
  isAvailable: boolean; // only mark active if confirmed offered
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SolarServiceSchema = new Schema<ISolarService>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    benefits: [{ type: String }],
    suitableCustomers: [{ type: String }],
    supportedSystemTypes: [{ type: String }],
    processSteps: [
      {
        stepNumber: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    serviceableStates: [{ type: String }],
    image: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const SolarService: Model<ISolarService> =
  mongoose.models.SolarService ||
  mongoose.model<ISolarService>("SolarService", SolarServiceSchema);
export default SolarService;
