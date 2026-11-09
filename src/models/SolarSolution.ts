import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISolarSolution extends Document {
  title: string;
  slug: string;
  category: string; // e.g. "Residential", "Commercial", "Industrial", "Agricultural", "Off-Grid", "Hybrid"
  tagline: string;
  description: string;
  keyBenefits: string[];
  suitableFor: string[];
  typicalCapacityRange: string; // e.g. "1 kW – 10 kW"
  image: string;
  sortOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SolarSolutionSchema = new Schema<ISolarSolution>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    keyBenefits: [{ type: String }],
    suitableFor: [{ type: String }],
    typicalCapacityRange: { type: String, required: true },
    image: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

export const SolarSolution: Model<ISolarSolution> =
  mongoose.models.SolarSolution ||
  mongoose.model<ISolarSolution>("SolarSolution", SolarSolutionSchema);
export default SolarSolution;
