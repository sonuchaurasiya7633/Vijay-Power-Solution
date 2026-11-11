import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  customerName: string;
  customerCity: string;
  customerState: string;
  systemCapacityKw?: number;
  projectType?: string; // Residential Rooftop, Commercial, etc.
  rating: number; // 1 to 5
  reviewText: string;
  photoUrl?: string;
  videoUrl?: string;
  relatedProjectId?: mongoose.Types.ObjectId;
  hasCustomerConsent: boolean;
  isApproved: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    customerName: { type: String, required: true, trim: true },
    customerCity: { type: String, required: true, trim: true },
    customerState: { type: String, required: true, trim: true },
    systemCapacityKw: { type: Number },
    projectType: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    reviewText: { type: String, required: true },
    photoUrl: { type: String },
    videoUrl: { type: String },
    relatedProjectId: { type: Schema.Types.ObjectId, ref: "PortfolioProject" },
    hasCustomerConsent: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TestimonialSchema.index({ isPublished: 1, isApproved: 1, sortOrder: 1, createdAt: -1 });

export const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
export default Testimonial;
