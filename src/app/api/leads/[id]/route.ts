import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import FollowUp from "@/models/FollowUp";
import SiteSurvey from "@/models/SiteSurvey";
import Quotation from "@/models/Quotation";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "read:leads")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const lead = await Lead.findById(params.id)
      .populate("assignedTo", "name email phone role")
      .populate("productId", "name ratedPowerWp coverImage slug")
      .lean();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Role boundary check for sales executives
    if (
      session.role === "sales_executive" &&
      lead.assignedTo?._id?.toString() !== session.userId
    ) {
      return NextResponse.json({ error: "Access denied to unassigned lead" }, { status: 403 });
    }

    const [activities, followUps, surveys, quotations] = await Promise.all([
      LeadActivity.find({ leadId: lead._id })
        .sort({ createdAt: -1 })
        .populate("performedBy", "name email role")
        .lean(),
      FollowUp.find({ leadId: lead._id })
        .sort({ scheduledAt: -1 })
        .populate("assignedTo", "name email")
        .lean(),
      SiteSurvey.find({ leadId: lead._id })
        .sort({ surveyDate: -1 })
        .populate("assignedTechnician", "name email phone")
        .lean(),
      Quotation.find({ leadId: lead._id })
        .sort({ createdAt: -1 })
        .populate("preparedBy", "name email")
        .lean(),
    ]);

    return NextResponse.json({
      lead,
      activities,
      followUps,
      surveys,
      quotations,
    });
  } catch (error) {
    console.error("[Get Lead Detail Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:leads")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const body = await req.json();

    // Stage change tracking
    if (body.stage && body.stage !== lead.stage) {
      const oldStage = lead.stage;
      lead.stage = body.stage;
      if (body.stage === "lost" && body.lostReason) {
        lead.lostReason = body.lostReason;
      }
      await LeadActivity.create({
        leadId: lead._id,
        performedBy: session.userId,
        activityType: "stage_changed",
        title: `Pipeline Stage Updated to "${body.stage.replace(/_/g, " ").toUpperCase()}"`,
        description: `Stage moved from ${oldStage} to ${body.stage}. ${body.lostReason ? `Reason: ${body.lostReason}` : ""}`,
        metadata: { oldStage, newStage: body.stage },
      });
    }

    // Assignment change
    if (body.assignedTo && body.assignedTo !== lead.assignedTo?.toString()) {
      if (!hasPermission(session.role, "assign:leads")) {
        return NextResponse.json({ error: "Only Managers and Admins can assign leads" }, { status: 403 });
      }
      lead.assignedTo = body.assignedTo;
      await LeadActivity.create({
        leadId: lead._id,
        performedBy: session.userId,
        activityType: "assigned",
        title: "Lead Reassigned",
        description: `Lead assigned to staff member`,
        metadata: { assignedTo: body.assignedTo },
      });
    }

    if (body.priority) lead.priority = body.priority;
    if (body.notes) {
      await LeadActivity.create({
        leadId: lead._id,
        performedBy: session.userId,
        activityType: "note_added",
        title: "Staff Internal Note Added",
        description: body.notes,
      });
    }

    if (body.nextFollowUpDate) {
      lead.nextFollowUpDate = new Date(body.nextFollowUpDate);
    }

    if (typeof body.isArchived === "boolean") {
      lead.isArchived = body.isArchived;
    }

    await lead.save();

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[Update Lead Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
