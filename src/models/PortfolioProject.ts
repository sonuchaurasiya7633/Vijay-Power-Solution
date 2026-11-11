import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioProject extends Document {
  projectId: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullCaseStudy?: string;
  customerName?: string;
  customerBusinessName?: string;
  hasCustomerPhotoConsent: boolean;
  hasCustomerVideoConsent: boolean;
  hasCustomerTestimonialConsent: boolean;
  state: string; // Bihar, Jharkhand, Uttar Pradesh
  district?: string;
  city: string;
  generalLocation: string; // Public safe location (e.g. "Gaya, Bihar")
  completionDate: Date;
  systemCapacityKw: number;
  panelWattageWp: number; // e.g. 540Wp
  panelQuantity?: number;
  panelBrandModel?: string;
  inverterModel?: string;
  systemCategory: string; // Residential Rooftop, Commercial, On-Grid, Off-Grid, Hybrid
  installationType: string;
  customerRequirement?: string;
  problemStatement?: string;
  recommendedSolution?: string;
  installationChallenges?: string;
  projectOutcome?: string;
  coverImage: string;
  beforePhotos: string[];
  duringPhotos: string[];
  afterPhotos: string[];
  videoUrl?: string; // Cloudinary secure video
  videoThumbnail?: string;
  videoDurationSec?: number;
  testimonialQuote?: string;
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    projectId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    shortDescription: { type: String, required: true },
    fullCaseStudy: { type: String },
    customerName: { type: String },
    customerBusinessName: { type: String },
    hasCustomerPhotoConsent: { type: Boolean, default: false },
    hasCustomerVideoConsent: { type: Boolean, default: false },
    hasCustomerTestimonialConsent: { type: Boolean, default: false },
    state: { type: String, required: true, index: true },
    district: { type: String },
    city: { type: String, required: true, index: true },
    generalLocation: { type: String, required: true },
    completionDate: { type: Date, required: true, index: true },
    systemCapacityKw: { type: Number, required: true, index: true },
    panelWattageWp: { type: Number, required: true },
    panelQuantity: { type: Number },
    panelBrandModel: { type: String },
    inverterModel: { type: String },
    systemCategory: { type: String, required: true, index: true },
    installationType: { type: String, default: "Rooftop Solar" },
    customerRequirement: { type: String },
    problemStatement: { type: String },
    recommendedSolution: { type: String },
    installationChallenges: { type: String },
    projectOutcome: { type: String },
    coverImage: { type: String, default: "" },
    beforePhotos: [{ type: String }],
    duringPhotos: [{ type: String }],
    afterPhotos: [{ type: String }],
    videoUrl: { type: String },
    videoThumbnail: { type: String },
    videoDurationSec: { type: Number },
    testimonialQuote: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true }
);

PortfolioProjectSchema.index({ isPublished: 1, completionDate: -1 });
PortfolioProjectSchema.index({ isPublished: 1, state: 1, city: 1 });

export const PortfolioProject: Model<IPortfolioProject> =
  mongoose.models.PortfolioProject ||
  mongoose.model<IPortfolioProject>("PortfolioProject", PortfolioProjectSchema);
export default PortfolioProject;
