import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAdminPushSubscription extends Document {
  token: string;
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminPushSubscriptionSchema = new Schema<IAdminPushSubscription>(
  {
    token: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    userEmail: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const AdminPushSubscription: Model<IAdminPushSubscription> =
  mongoose.models.AdminPushSubscription ||
  mongoose.model<IAdminPushSubscription>("AdminPushSubscription", AdminPushSubscriptionSchema);

export default AdminPushSubscription;
