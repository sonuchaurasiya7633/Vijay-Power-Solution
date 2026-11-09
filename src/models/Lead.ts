import mongoose, { Schema, Document, Model } from "mongoose";

export type LeadStage =
  | "new_lead"
  | "contact_attempted"
  | "contacted"
  | "qualified"
  | "site_survey_requested"
  | "site_survey_scheduled"
  | "site_survey_completed"
  | "quotation_preparation"
  | "quotation_sent"
  | "negotiation"
  | "won"
  | "installation_scheduled"
  | "installation_in_progress"
  | "installation_completed"
  | "handover_completed"
  | "lost"
  | "not_interested"
  | "invalid_duplicate";

export type CustomerType =
  | "residential"
  | "commercial"
  | "industrial"
  | "agricultural"
  | "institutional"
  | "other";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export interface ILead extends Document {
  leadId: string; // VPS-LD-XXXX
  fullName: string;
  phone: string;
  whatsappPhone?: string;
  email?: string;
  state: string; // Bihar, Jharkhand, Uttar Pradesh, etc.
  district?: string;
  city: string;
  postalCode?: string;
  installationAddress?: string;
  customerType: CustomerType;
  enquiryType: string; // general, quote, site_survey, product, service, calculator
  solarSolutionType?: string; // Residential Rooftop, On-Grid, etc.
  productId?: mongoose.Types.ObjectId;
  productName?: string;
  wattagePreference?: number; // 10W - 730W
  requiredSystemSizeKw?: number;
  monthlyBillAmount?: number;
  monthlyUnitsConsumed?: number;
  roofType?: string; // Flat concrete, Tin/Metal, Sloped tile, Ground mount
  roofAreaSqFt?: number;
  preferredConsultationDate?: Date;
  message?: string;
  leadSource: string; // website_form, hero_cta, product_enquiry, calculator, whatsapp_click, direct_call, manual_admin
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  consentGiven: boolean;
  priority: LeadPriority;
  stage: LeadStage;
  assignedTo?: mongoose.Types.ObjectId; // Ref User
  lostReason?: string;
  tags: string[];
  lastContactedAt?: Date;
  nextFollowUpDate?: Date;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    leadId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    whatsappPhone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    district: { type: String, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    postalCode: { type: String, trim: true },
    installationAddress: { type: String, trim: true },
    customerType: {
      type: String,
      enum: ["residential", "commercial", "industrial", "agricultural", "institutional", "other"],
      default: "residential",
    },
    enquiryType: { type: String, default: "general" },
    solarSolutionType: { type: String },
    productId: { type: Schema.Types.ObjectId, ref: "SolarProduct" },
    productName: { type: String },
    wattagePreference: { type: Number },
    requiredSystemSizeKw: { type: Number },
    monthlyBillAmount: { type: Number },
    monthlyUnitsConsumed: { type: Number },
    roofType: { type: String },
    roofAreaSqFt: { type: Number },
    preferredConsultationDate: { type: Date },
    message: { type: String },
    leadSource: { type: String, default: "website_form" },
    landingPage: { type: String },
    utmSource: { type: String },
    utmMedium: { type: String },
    utmCampaign: { type: String },
    utmContent: { type: String },
    utmTerm: { type: String },
    referrer: { type: String },
    consentGiven: { type: Boolean, default: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    stage: {
      type: String,
      enum: [
        "new_lead",
        "contact_attempted",
        "contacted",
        "qualified",
        "site_survey_requested",
        "site_survey_scheduled",
        "site_survey_completed",
        "quotation_preparation",
        "quotation_sent",
        "negotiation",
        "won",
        "installation_scheduled",
        "installation_in_progress",
        "installation_completed",
        "handover_completed",
        "lost",
        "not_interested",
        "invalid_duplicate",
      ],
      default: "new_lead",
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    lostReason: { type: String },
    tags: [{ type: String }],
    lastContactedAt: { type: Date },
    nextFollowUpDate: { type: Date, index: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ state: 1, city: 1 });
LeadSchema.index({ stage: 1, priority: 1 });

export const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
export default Lead;
