import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageSection {
  sectionId: string;
  sectionType: string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  isVisible: boolean;
  sortOrder: number;
  items?: Array<{
    title?: string;
    description?: string;
    statValue?: string;
    suffix?: string;
    icon?: string;
    imageUrl?: string;
    linkUrl?: string;
  }>;
}

export interface IPage extends Document {
  title: string;
  slug: string;
  heroHeading?: string;
  heroSubtitle?: string;
  heroImage?: string;
  contentHtml?: string;
  sections: IPageSection[];
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PageSectionSchema = new Schema<IPageSection>(
  {
    sectionId: { type: String, required: true },
    sectionType: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    badgeText: { type: String },
    content: { type: String },
    imageUrl: { type: String },
    videoUrl: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
    ctaSecondaryText: { type: String },
    ctaSecondaryLink: { type: String },
    isVisible: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    items: [
      {
        title: { type: String },
        description: { type: String },
        statValue: { type: String },
        suffix: { type: String },
        icon: { type: String },
        imageUrl: { type: String },
        linkUrl: { type: String },
      },
    ],
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    heroHeading: { type: String },
    heroSubtitle: { type: String },
    heroImage: { type: String },
    contentHtml: { type: String },
    sections: [PageSectionSchema],
    metaTitle: { type: String },
    metaDescription: { type: String },
    isPublished: { type: Boolean, default: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
export default Page;
