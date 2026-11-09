import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHomeSection extends Document {
  sectionKey: string; // hero, trust_stats, solutions, product_range, why_us, process, recent_projects, videos, coverage, reviews, calculator, faqs, cta_lead
  title: string;
  subtitle?: string;
  content?: Record<string, unknown>;
  isEnabled: boolean;
  sortOrder: number;
  updatedAt: Date;
}

const HomeSectionSchema = new Schema<IHomeSection>(
  {
    sectionKey: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: Schema.Types.Mixed, default: {} },
    isEnabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HomeSection: Model<IHomeSection> =
  mongoose.models.HomeSection ||
  mongoose.model<IHomeSection>("HomeSection", HomeSectionSchema);
export default HomeSection;
