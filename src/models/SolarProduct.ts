import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISolarProduct extends Document {
  productId: string; // VPS-PRD-XXXX
  name: string;
  slug: string;
  brand: string; // e.g. Loom, Tata Power Solar, Vikram, Waaree, Adani, Goldi, etc.
  modelNumber?: string;
  ratedPowerWp: number; // 10 to 730
  technologyCategories: string[]; // e.g. ["Mono PERC", "Bifacial", "N-Type TOPCon"]
  wattageGroup: string; // "10W-50W", "51W-100W", "101W-200W", "201W-300W", "301W-400W", "401W-500W", "501W-600W", "601W-700W", "701W-730W"
  moduleEfficiencyPercent?: number; // e.g. 21.5%
  cellCount?: number; // 72, 144, 120, 36, etc.
  dimensionsMm?: string; // e.g. "2278 x 1134 x 35 mm"
  weightKg?: number; // e.g. 27.5
  maxSystemVoltageV?: number; // e.g. 1500
  openCircuitVoltageVoc?: number;
  optOperatingVoltageVmp?: number;
  shortCircuitCurrentIsc?: number;
  optOperatingCurrentImp?: number;
  temperatureCoefficientPmax?: string; // e.g. "-0.34% / °C"
  certifications?: string[]; // IEC 61215, IEC 61730, BIS, ALMM
  productWarrantyYears?: number; // e.g. 10 or 12
  performanceWarrantyYears?: number; // e.g. 25 or 30
  datasheetUrl?: string; // Cloudinary / PDF
  coverImage: string;
  galleryImages: string[];
  keyFeatures: string[];
  typicalApplications: string[];
  description: string;
  availabilityStatus: "in_stock" | "available_on_order" | "quote_on_request";
  isFeatured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SolarProductSchema = new Schema<ISolarProduct>(
  {
    productId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    brand: { type: String, required: true, trim: true, index: true },
    modelNumber: { type: String, trim: true },
    ratedPowerWp: {
      type: Number,
      required: true,
      min: 10,
      max: 730,
      index: true,
    },
    technologyCategories: [{ type: String, index: true }],
    wattageGroup: { type: String, required: true, index: true },
    moduleEfficiencyPercent: { type: Number },
    cellCount: { type: Number },
    dimensionsMm: { type: String },
    weightKg: { type: Number },
    maxSystemVoltageV: { type: Number },
    openCircuitVoltageVoc: { type: Number },
    optOperatingVoltageVmp: { type: Number },
    shortCircuitCurrentIsc: { type: Number },
    optOperatingCurrentImp: { type: Number },
    temperatureCoefficientPmax: { type: String },
    certifications: [{ type: String }],
    productWarrantyYears: { type: Number },
    performanceWarrantyYears: { type: Number },
    datasheetUrl: { type: String },
    coverImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    keyFeatures: [{ type: String }],
    typicalApplications: [{ type: String }],
    description: { type: String, required: true },
    availabilityStatus: {
      type: String,
      enum: ["in_stock", "available_on_order", "quote_on_request"],
      default: "available_on_order",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
  },
  { timestamps: true }
);

SolarProductSchema.index({ isPublished: 1, ratedPowerWp: 1 });
SolarProductSchema.index({ isPublished: 1, brand: 1 });
SolarProductSchema.index({ isPublished: 1, technologyCategories: 1 });

export const SolarProduct: Model<ISolarProduct> =
  mongoose.models.SolarProduct ||
  mongoose.model<ISolarProduct>("SolarProduct", SolarProductSchema);
export default SolarProduct;
