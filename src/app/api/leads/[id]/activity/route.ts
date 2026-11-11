import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import {
  requirePermission,
  validateIdParam,
} from "@/lib/security/api-helpers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "lead ID");
    if (idErr) return idErr;

    const auth = await requirePermission("write:leads");
    if (!auth.ok) return auth.response;

    const { activityType, title, description, metadata } = await req.json();
    if (!title || !activityType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (
      auth.session.role === "sales_executive" &&
      lead.assignedTo?.toString() !== auth.session.userId
    ) {
      return NextResponse.json(
        { error: "Access denied to unassigned lead" },
        { status: 403 }
      );
    }

    const activity = await LeadActivity.create({
      leadId: lead._id,
      performedBy: auth.session.userId,
      activityType: String(activityType).trim(),
      title: String(title).trim().slice(0, 200),
      description:
        typeof description === "string" ? description.trim().slice(0, 2000) : undefined,
      metadata,
    });

    if (["call_logged", "whatsapp_sent", "email_sent"].includes(activityType)) {
      lead.lastContactedAt = new Date();
      if (lead.stage === "new_lead") {
        lead.stage = "contacted";
      }
      await lead.save();
    }

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error("[Create Activity Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
