import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  title: string;
  body: string;
  type: "lead" | "survey" | "quotation" | "installation" | "system";
  link: string;
  leadId?: mongoose.Types.ObjectId;
  isRead: boolean;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["lead", "survey", "quotation", "installation", "system"],
      default: "lead",
      index: true,
    },
    link: { type: String, default: "/admin/leads", trim: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", index: true },
    isRead: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed },
    readAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isRead: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
