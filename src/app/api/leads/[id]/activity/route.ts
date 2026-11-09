import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import { getSession } from "@/lib/auth/session";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { activityType, title, description, metadata } = await req.json();
    if (!title || !activityType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const activity = await LeadActivity.create({
      leadId: lead._id,
      performedBy: session.userId,
      activityType,
      title,
      description,
      metadata,
    });

    // Update last contacted timestamp if call or message was recorded
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
