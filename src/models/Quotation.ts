import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuotationLineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export type QuotationStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export interface IQuotation extends Document {
  quotationNumber: string; // VPS-QT-YYYY-XXXX
  leadId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  installationAddress: string;
  proposedSystemCapacityKw: number;
  solarPanelBrandModel?: string;
  solarPanelQuantity?: number;
  inverterBrandModel?: string;
  batteryBackupDetails?: string;
  lineItems: IQuotationLineItem[];
  subtotal: number;
  taxGstPercent: number;
  taxAmount: number;
  estimatedSubsidyAmount?: number;
  netPayableEstimate: number;
  termsAndConditions?: string;
  validUntil: Date;
  status: QuotationStatus;
  preparedBy: mongoose.Types.ObjectId; // User
  approvedBy?: mongoose.Types.ObjectId; // User
  sentAt?: Date;
  pdfUrl?: string;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationSchema = new Schema<IQuotation>(
  {
    quotationNumber: { type: String, required: true, unique: true, index: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    installationAddress: { type: String, required: true },
    proposedSystemCapacityKw: { type: Number, required: true },
    solarPanelBrandModel: { type: String },
    solarPanelQuantity: { type: Number },
    inverterBrandModel: { type: String },
    batteryBackupDetails: { type: String },
    lineItems: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: "nos" },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    taxGstPercent: { type: Number, default: 13.8 }, // Standard mixed solar GST
    taxAmount: { type: Number, required: true },
    estimatedSubsidyAmount: { type: Number, default: 0 },
    netPayableEstimate: { type: Number, required: true },
    termsAndConditions: { type: String },
    validUntil: { type: Date, required: true },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_approval",
        "approved",
        "sent",
        "accepted",
        "rejected",
        "expired",
      ],
      default: "draft",
      index: true,
    },
    preparedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    sentAt: { type: Date },
    pdfUrl: { type: String },
    internalNotes: { type: String },
  },
  { timestamps: true }
);

export const Quotation: Model<IQuotation> =
  mongoose.models.Quotation || mongoose.model<IQuotation>("Quotation", QuotationSchema);
export default Quotation;
