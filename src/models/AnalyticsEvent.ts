import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  eventName:
    | "page_view"
    | "cta_click"
    | "form_submit"
    | "calculator_complete"
    | "whatsapp_click"
    | "call_click"
    | "product_view"
    | "service_view"
    | "project_view";
  pagePath: string;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  deviceType?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    eventName: { type: String, required: true, index: true },
    pagePath: { type: String, required: true, index: true },
    source: { type: String },
    medium: { type: String },
    campaign: { type: String },
    referrer: { type: String },
    deviceType: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ eventName: 1, createdAt: -1 });

export const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
export default AnalyticsEvent;
