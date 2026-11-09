import mongoose, { Schema, Document, Model } from "mongoose";

export type SurveyStatus =
  | "requested"
  | "scheduled"
  | "assigned"
  | "in_progress"
  | "completed"
  | "rescheduled"
  | "cancelled";

export interface ISiteSurvey extends Document {
  surveyId: string; // VPS-SRV-XXXX
  leadId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  siteAddress: string;
  state: string;
  city: string;
  surveyDate: Date;
  assignedTechnician?: mongoose.Types.ObjectId;
  roofType?: string;
  roofAreaSqFt?: number;
  shadingObservations?: string;
  existingSanctionedLoadKw?: number;
  currentMonthlyUnits?: number;
  sitePhotographs: string[]; // Cloudinary secure URLs
  surveyNotes?: string;
  feasibilityStatus: "feasible" | "feasible_with_modifications" | "not_feasible" | "pending_review";
  suggestedSystemCapacityKw?: number;
  mountingStructureType?: string;
  safetyObservations?: string;
  status: SurveyStatus;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSurveySchema = new Schema<ISiteSurvey>(
  {
    surveyId: { type: String, required: true, unique: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    siteAddress: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    surveyDate: { type: Date, required: true, index: true },
    assignedTechnician: { type: Schema.Types.ObjectId, ref: "User", index: true },
    roofType: { type: String },
    roofAreaSqFt: { type: Number },
    shadingObservations: { type: String },
    existingSanctionedLoadKw: { type: Number },
    currentMonthlyUnits: { type: Number },
    sitePhotographs: [{ type: String }],
    surveyNotes: { type: String },
    feasibilityStatus: {
      type: String,
      enum: ["feasible", "feasible_with_modifications", "not_feasible", "pending_review"],
      default: "pending_review",
    },
    suggestedSystemCapacityKw: { type: Number },
    mountingStructureType: { type: String },
    safetyObservations: { type: String },
    status: {
      type: String,
      enum: [
        "requested",
        "scheduled",
        "assigned",
        "in_progress",
        "completed",
        "rescheduled",
        "cancelled",
      ],
      default: "requested",
      index: true,
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const SiteSurvey: Model<ISiteSurvey> =
  mongoose.models.SiteSurvey || mongoose.model<ISiteSurvey>("SiteSurvey", SiteSurveySchema);
export default SiteSurvey;
