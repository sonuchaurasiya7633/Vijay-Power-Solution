import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILocation extends Document {
  state: string; // Bihar, Jharkhand, Uttar Pradesh
  stateSlug: string;
  district: string;
  city: string;
  citySlug: string;
  postalCodes: string[];
  serviceAvailability: "available" | "enquiry_only" | "coming_soon";
  priorityArea: boolean;
  contactPhone?: string;
  assignedStaffId?: mongoose.Types.ObjectId; // User
  overviewText?: string;
  localSolarFaqs: { question: string; answer: string }[];
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    state: { type: String, required: true, trim: true, index: true },
    stateSlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    district: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    citySlug: { type: String, required: true, lowercase: true, trim: true, index: true },
    postalCodes: [{ type: String }],
    serviceAvailability: {
      type: String,
      enum: ["available", "enquiry_only", "coming_soon"],
      default: "available",
      index: true,
    },
    priorityArea: { type: Boolean, default: false },
    contactPhone: { type: String },
    assignedStaffId: { type: Schema.Types.ObjectId, ref: "User" },
    overviewText: { type: String },
    localSolarFaqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    isPublished: { type: Boolean, default: true, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

LocationSchema.index({ stateSlug: 1, citySlug: 1 }, { unique: true });

export const Location: Model<ILocation> =
  mongoose.models.Location || mongoose.model<ILocation>("Location", LocationSchema);
export default Location;
