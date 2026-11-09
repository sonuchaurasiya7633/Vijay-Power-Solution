import mongoose, { Schema, Document, Model } from "mongoose";

export type FollowUpType =
  | "phone_call"
  | "whatsapp"
  | "email"
  | "meeting"
  | "site_survey"
  | "quotation_follow_up";

export type FollowUpStatus =
  | "pending"
  | "due_today"
  | "overdue"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface IFollowUp extends Document {
  leadId: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId; // User
  followUpType: FollowUpType;
  scheduledAt: Date;
  status: FollowUpStatus;
  notes?: string;
  outcome?: string;
  completedAt?: Date;
  nextAction?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FollowUpSchema = new Schema<IFollowUp>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    followUpType: {
      type: String,
      enum: [
        "phone_call",
        "whatsapp",
        "email",
        "meeting",
        "site_survey",
        "quotation_follow_up",
      ],
      default: "phone_call",
    },
    scheduledAt: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: [
        "pending",
        "due_today",
        "overdue",
        "completed",
        "cancelled",
        "rescheduled",
      ],
      default: "pending",
      index: true,
    },
    notes: { type: String },
    outcome: { type: String },
    completedAt: { type: Date },
    nextAction: { type: String },
  },
  { timestamps: true }
);

FollowUpSchema.index({ assignedTo: 1, scheduledAt: 1, status: 1 });

export const FollowUp: Model<IFollowUp> =
  mongoose.models.FollowUp || mongoose.model<IFollowUp>("FollowUp", FollowUpSchema);
export default FollowUp;
