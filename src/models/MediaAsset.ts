import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMediaAsset extends Document {
  publicId: string;
  secureUrl: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  folder:
    | "company"
    | "products"
    | "services"
    | "projects"
    | "testimonials"
    | "blogs"
    | "videos"
    | "temporary"
    | "private";
  altText?: string;
  caption?: string;
  tags: string[];
  durationSec?: number;
  uploadedBy?: mongoose.Types.ObjectId;
  usageCount: number;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    publicId: { type: String, required: true, unique: true, index: true },
    secureUrl: { type: String, required: true },
    resourceType: { type: String, enum: ["image", "video", "raw"], required: true },
    format: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    bytes: { type: Number, required: true },
    folder: {
      type: String,
      enum: [
        "company",
        "products",
        "services",
        "projects",
        "testimonials",
        "blogs",
        "videos",
        "temporary",
        "private",
      ],
      default: "company",
      index: true,
    },
    altText: { type: String },
    caption: { type: String },
    tags: [{ type: String }],
    durationSec: { type: Number },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    usageCount: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ||
  mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
export default MediaAsset;
