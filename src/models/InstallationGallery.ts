import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInstallationGallery extends Document {
  imageUrl: string;
  cloudinaryPublicId?: string;
  title: string;
  customerName?: string;
  city?: string;
  state?: string;
  category?: string;
  capacityKw?: number;
  description?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const InstallationGallerySchema = new Schema<IInstallationGallery>(
  {
    imageUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    title: { type: String, required: true, default: "Customer Solar Installation" },
    customerName: { type: String },
    city: { type: String },
    state: { type: String },
    category: {
      type: String,
      default: "Residential Rooftop",
    },
    capacityKw: { type: Number },
    description: { type: String },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

InstallationGallerySchema.index({ isPublished: 1, sortOrder: 1, createdAt: -1 });
InstallationGallerySchema.index({ isPublished: 1, category: 1, sortOrder: 1 });

const InstallationGallery: Model<IInstallationGallery> =
  mongoose.models.InstallationGallery ||
  mongoose.model<IInstallationGallery>("InstallationGallery", InstallationGallerySchema);

export default InstallationGallery;
