import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Quotation from "@/models/Quotation";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import "@/models/User";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "read:quotations")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const leadId = searchParams.get("leadId");

        const query: Record<string, any> = {};
    if (leadId) query.leadId = leadId;

    const quotations = await Quotation.find(query)
      .sort({ createdAt: -1 })
      .populate("leadId", "leadId fullName phone city state")
      .populate("preparedBy", "name email")
      .populate("approvedBy", "name email")
      .lean();

    return NextResponse.json({ quotations });
  } catch (error) {
    console.error("[Get Quotations Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:quotations")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      leadId,
      customerName,
      customerPhone,
      customerEmail,
      installationAddress,
      proposedSystemCapacityKw,
      solarPanelBrandModel,
      solarPanelQuantity,
      inverterBrandModel,
      batteryBackupDetails,
      lineItems = [],
      subtotal,
      taxGstPercent = 13.8,
      taxAmount,
      estimatedSubsidyAmount = 0,
      netPayableEstimate,
      termsAndConditions,
      validDays = 15,
      internalNotes,
    } = body;

    if (!leadId || !customerName || !customerPhone || !proposedSystemCapacityKw || !subtotal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const year = new Date().getFullYear();
    const count = await Quotation.countDocuments();
    const quotationNumber = `VPS-QT-${year}-${String(1001 + count).padStart(4, "0")}`;

    const validUntil = new Date(Date.now() + validDays * 24 * 60 * 60 * 1000);

    const quotation = await Quotation.create({
      quotationNumber,
      leadId,
      customerName,
      customerPhone,
      customerEmail,
      installationAddress,
      proposedSystemCapacityKw,
      solarPanelBrandModel,
      solarPanelQuantity,
      inverterBrandModel,
      batteryBackupDetails,
      lineItems,
      subtotal,
      taxGstPercent,
      taxAmount: taxAmount || (subtotal * taxGstPercent) / 100,
      estimatedSubsidyAmount,
      netPayableEstimate: netPayableEstimate || subtotal + ((subtotal * taxGstPercent) / 100) - estimatedSubsidyAmount,
      termsAndConditions,
      validUntil,
      status: "draft",
      preparedBy: session.userId,
      internalNotes,
    });

    await Lead.findByIdAndUpdate(leadId, { stage: "quotation_preparation" });

    await LeadActivity.create({
      leadId,
      performedBy: session.userId,
      activityType: "quotation_created",
      title: `Internal Quotation Drafted: ${quotationNumber}`,
      description: `Drafted proposal for ${proposedSystemCapacityKw} kW. Net estimate: ₹${quotation.netPayableEstimate.toLocaleString("en-IN")}`,
    });

    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    console.error("[Create Quotation Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
