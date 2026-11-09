import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole =
  | "super_admin"
  | "admin"
  | "sales_manager"
  | "sales_executive"
  | "installation_manager"
  | "technician"
  | "content_editor"
  | "viewer";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  avatarUrl?: string;
  lastLoginAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "super_admin",
        "admin",
        "sales_manager",
        "sales_executive",
        "installation_manager",
        "technician",
        "content_editor",
        "viewer",
      ],
      default: "sales_executive",
      required: true,
    },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String },
    lastLoginAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
