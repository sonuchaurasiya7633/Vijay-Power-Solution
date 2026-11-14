import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Lead, { type LeadPriority, type LeadStage } from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import FollowUp from "@/models/FollowUp";
import SiteSurvey from "@/models/SiteSurvey";
import Quotation from "@/models/Quotation";
import Notification from "@/models/Notification";
import "@/models/User";
import "@/models/SolarProduct";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { validateIdParam } from "@/lib/security/api-helpers";
import { isValidObjectId } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

const VALID_STAGES = new Set<LeadStage>([
  "new_lead",
  "contact_attempted",
  "contacted",
  "qualified",
  "site_survey_requested",
  "site_survey_scheduled",
  "site_survey_completed",
  "quotation_preparation",
  "quotation_sent",
  "negotiation",
  "won",
  "installation_scheduled",
  "installation_in_progress",
  "installation_completed",
  "handover_completed",
  "lost",
  "not_interested",
  "invalid_duplicate",
]);

const VALID_PRIORITIES = new Set<LeadPriority>([
  "low",
  "medium",
  "high",
  "urgent",
]);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "lead ID");
    if (idErr) return idErr;

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

    // Automatically mark all related unread notifications as read when the lead is viewed
    Notification.updateMany(
      { leadId: lead._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    ).catch((err) => console.warn("Auto-read notification error on view:", err));

    if (
      session.role === "sales_executive" &&
      lead.assignedTo?._id?.toString() !== session.userId
    ) {
      return NextResponse.json(
        { error: "Access denied to unassigned lead" },
        { status: 403 }
      );
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "lead ID");
    if (idErr) return idErr;

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

    // Automatically mark all related unread notifications as read when the lead is viewed
    Notification.updateMany(
      { leadId: lead._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    ).catch((err) => console.warn("Auto-read notification error on view:", err));

    if (
      session.role === "sales_executive" &&
      lead.assignedTo?.toString() !== session.userId
    ) {
      return NextResponse.json(
        { error: "Access denied to modify unassigned lead" },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (body.stage && body.stage !== lead.stage) {
      if (!VALID_STAGES.has(body.stage)) {
        return NextResponse.json(
          { error: "Invalid lead pipeline stage" },
          { status: 400 }
        );
      }
      const oldStage = lead.stage;
      lead.stage = body.stage;
      if (body.stage === "lost" && typeof body.lostReason === "string") {
        lead.lostReason = body.lostReason.trim().slice(0, 500);
      }
      await LeadActivity.create({
        leadId: lead._id,
        performedBy: session.userId,
        activityType: "stage_changed",
        title: `Pipeline Stage Updated to "${String(body.stage).replace(/_/g, " ").toUpperCase()}"`,
        description: `Stage moved from ${oldStage} to ${body.stage}. ${body.lostReason ? `Reason: ${String(body.lostReason).slice(0, 300)}` : ""}`,
        metadata: { oldStage, newStage: body.stage },
      });
    }

    if (body.assignedTo && body.assignedTo !== lead.assignedTo?.toString()) {
      if (!hasPermission(session.role, "assign:leads")) {
        return NextResponse.json(
          { error: "Only Managers and Admins can assign leads" },
          { status: 403 }
        );
      }
      if (!isValidObjectId(body.assignedTo)) {
        return NextResponse.json(
          { error: "Invalid assignee user ID" },
          { status: 400 }
        );
      }
      lead.assignedTo = body.assignedTo;
      await LeadActivity.create({
        leadId: lead._id,
        performedBy: session.userId,
        activityType: "assigned",
        title: "Lead Reassigned",
        description: "Lead assigned to staff member",
        metadata: { assignedTo: body.assignedTo },
      });
    }

    if (body.priority) {
      if (!VALID_PRIORITIES.has(body.priority)) {
        return NextResponse.json(
          { error: "Invalid lead priority" },
          { status: 400 }
        );
      }
      lead.priority = body.priority;
    }

    if (typeof body.notes === "string" && body.notes.trim()) {
      await LeadActivity.create({
        leadId: lead._id,
        performedBy: session.userId,
        activityType: "note_added",
        title: "Staff Internal Note Added",
        description: body.notes.trim().slice(0, 2000),
      });
    }

    if (body.nextFollowUpDate) {
      const parsedDate = new Date(body.nextFollowUpDate);
      if (!Number.isNaN(parsedDate.getTime())) {
        lead.nextFollowUpDate = parsedDate;
      }
    }

    if (typeof body.isArchived === "boolean") {
      if (body.isArchived && !hasPermission(session.role, "delete:leads")) {
        return NextResponse.json(
          { error: "Archiving leads requires Admin or Super Admin permission" },
          { status: 403 }
        );
      }
      lead.isArchived = body.isArchived;
    }

    await lead.save();

    // Automatically mark all related unread notifications as read when stage or status is updated
    Notification.updateMany(
      { leadId: lead._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    ).catch((err) => console.warn("Auto-read notification error on status change:", err));

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[Update Lead Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
