import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISetting extends Document {
  key: string; // "general", "website", "crm", "calculator", "seo"
  value: Record<string, unknown>;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Setting: Model<ISetting> =
  mongoose.models.Setting || mongoose.model<ISetting>("Setting", SettingSchema);
export default Setting;
