import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorName: string;
  authorRole?: string;
  estimatedReadTimeMin: number;
  isPublished: boolean;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, required: true, index: true },
    tags: [{ type: String }],
    authorName: { type: String, default: "Solar Engineering Team" },
    authorRole: { type: String, default: "Technical Advisory" },
    estimatedReadTimeMin: { type: Number, default: 4 },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true }
);

BlogSchema.index({ isPublished: 1, publishedAt: -1 });

export const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
export default Blog;
