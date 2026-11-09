import mongoose, { Schema, Document, Model } from "mongoose";

export type InstallationStage =
  | "customer_confirmed"
  | "survey_approved"
  | "specs_finalized"
  | "docs_collected"
  | "materials_procured"
  | "installation_scheduled"
  | "installation_underway"
  | "electrical_inspection"
  | "commissioning"
  | "handover_completed"
  | "follow_up_maintenance";

export interface IInstallationJob extends Document {
  jobId: string; // VPS-JOB-XXXX
  leadId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  installationAddress: string;
  state: string;
  city: string;
  systemCapacityKw: number;
  solarPanelBrandModel?: string;
  solarPanelQuantity?: number;
  inverterBrandModel?: string;
  assignedManager?: mongoose.Types.ObjectId; // User
  leadTechnician?: mongoose.Types.ObjectId; // User
  stage: InstallationStage;
  startDate?: Date;
  scheduledCompletionDate?: Date;
  actualCompletionDate?: Date;
  privateSitePhotos: string[];
  installationNotes?: string;
  commissioningChecklistDone: boolean;
  handoverDocSigned: boolean;
  customerApprovalReceived: boolean;
  hasCustomerConsentForPortfolio: boolean;
  convertedToPublicProject: boolean;
  publicProjectId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InstallationJobSchema = new Schema<IInstallationJob>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    installationAddress: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    systemCapacityKw: { type: Number, required: true },
    solarPanelBrandModel: { type: String },
    solarPanelQuantity: { type: Number },
    inverterBrandModel: { type: String },
    assignedManager: { type: Schema.Types.ObjectId, ref: "User", index: true },
    leadTechnician: { type: Schema.Types.ObjectId, ref: "User" },
    stage: {
      type: String,
      enum: [
        "customer_confirmed",
        "survey_approved",
        "specs_finalized",
        "docs_collected",
        "materials_procured",
        "installation_scheduled",
        "installation_underway",
        "electrical_inspection",
        "commissioning",
        "handover_completed",
        "follow_up_maintenance",
      ],
      default: "customer_confirmed",
      index: true,
    },
    startDate: { type: Date },
    scheduledCompletionDate: { type: Date },
    actualCompletionDate: { type: Date },
    privateSitePhotos: [{ type: String }],
    installationNotes: { type: String },
    commissioningChecklistDone: { type: Boolean, default: false },
    handoverDocSigned: { type: Boolean, default: false },
    customerApprovalReceived: { type: Boolean, default: false },
    hasCustomerConsentForPortfolio: { type: Boolean, default: false },
    convertedToPublicProject: { type: Boolean, default: false },
    publicProjectId: { type: Schema.Types.ObjectId, ref: "PortfolioProject" },
  },
  { timestamps: true }
);

export const InstallationJob: Model<IInstallationJob> =
  mongoose.models.InstallationJob ||
  mongoose.model<IInstallationJob>("InstallationJob", InstallationJobSchema);
export default InstallationJob;
