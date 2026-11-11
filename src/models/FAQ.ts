import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: "general" | "residential" | "commercial" | "subsidy" | "installation" | "maintenance";
  sortOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "residential", "commercial", "subsidy", "installation", "maintenance"],
      default: "general",
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

FAQSchema.index({ isPublished: 1, category: 1, sortOrder: 1 });

export const FAQ: Model<IFAQ> =
  mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);
export default FAQ;
