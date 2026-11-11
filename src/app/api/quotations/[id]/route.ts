import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Quotation, { type QuotationStatus } from "@/models/Quotation";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { validateIdParam } from "@/lib/security/api-helpers";

const ALLOWED_QUOTATION_STATUSES = new Set<QuotationStatus>([
  "draft",
  "pending_approval",
  "approved",
  "sent",
  "accepted",
  "rejected",
  "expired",
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:quotations")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const idErr = validateIdParam(params.id, "quotation id");
    if (idErr) return idErr;

    const body = await req.json();
    await connectDB();

    const quotation = await Quotation.findById(params.id);
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !ALLOWED_QUOTATION_STATUSES.has(body.status as QuotationStatus)) {
        return NextResponse.json({ error: "Invalid quotation status" }, { status: 400 });
      }
      if (body.status === "approved") {
        if (!hasPermission(session.role, "approve:quotations")) {
          return NextResponse.json({ error: "Approval requires Sales Manager or Admin permissions" }, { status: 403 });
        }
        quotation.status = "approved";
        quotation.approvedBy = session.userId as unknown as typeof quotation.approvedBy;
      } else if (body.status === "sent") {
        quotation.status = "sent";
        quotation.sentAt = new Date();
        await Lead.findByIdAndUpdate(quotation.leadId, { stage: "quotation_sent" });
      } else {
        quotation.status = body.status as QuotationStatus;
      }
    }

    if (body.status === "accepted") {
      await Lead.findByIdAndUpdate(quotation.leadId, { stage: "won" });
    }

    if (typeof body.internalNotes === "string") {
      quotation.internalNotes = body.internalNotes.slice(0, 4000);
    }

    await quotation.save();

    await LeadActivity.create({
      leadId: quotation.leadId,
      performedBy: session.userId,
      activityType: "quotation_created",
      title: `Quotation Status Updated: ${quotation.quotationNumber} -> ${quotation.status.toUpperCase()}`,
      description: `Commercial quotation updated by ${session.name}.`,
    });

    return NextResponse.json({ success: true, quotation });
  } catch (error) {
    console.error("[Update Quotation Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
