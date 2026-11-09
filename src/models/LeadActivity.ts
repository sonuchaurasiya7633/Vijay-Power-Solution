import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILeadActivity extends Document {
  leadId: mongoose.Types.ObjectId;
  performedBy?: mongoose.Types.ObjectId; // User
  activityType:
    | "created"
    | "stage_changed"
    | "assigned"
    | "note_added"
    | "call_logged"
    | "whatsapp_sent"
    | "email_sent"
    | "survey_scheduled"
    | "quotation_created"
    | "installation_converted"
    | "won"
    | "lost";
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const LeadActivitySchema = new Schema<ILeadActivity>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    performedBy: { type: Schema.Types.ObjectId, ref: "User" },
    activityType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

LeadActivitySchema.index({ leadId: 1, createdAt: -1 });

export const LeadActivity: Model<ILeadActivity> =
  mongoose.models.LeadActivity ||
  mongoose.model<ILeadActivity>("LeadActivity", LeadActivitySchema);
export default LeadActivity;
