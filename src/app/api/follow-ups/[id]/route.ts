import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FollowUp from "@/models/FollowUp";
import LeadActivity from "@/models/LeadActivity";
import {
  requirePermission,
  validateIdParam,
} from "@/lib/security/api-helpers";

const VALID_STATUSES = new Set([
  "pending",
  "due_today",
  "overdue",
  "completed",
  "rescheduled",
  "cancelled",
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "follow-up ID");
    if (idErr) return idErr;

    const auth = await requirePermission("write:leads");
    if (!auth.ok) return auth.response;

    const { status, outcome, nextAction } = await req.json();
    await connectDB();

    const followUp = await FollowUp.findById(params.id);
    if (!followUp) {
      return NextResponse.json(
        { error: "Follow-up not found" },
        { status: 404 }
      );
    }

    if (
      auth.session.role === "sales_executive" &&
      followUp.assignedTo?.toString() !== auth.session.userId
    ) {
      return NextResponse.json(
        { error: "Access denied to unassigned follow-up" },
        { status: 403 }
      );
    }

    if (status) {
      if (!VALID_STATUSES.has(status)) {
        return NextResponse.json(
          { error: "Invalid follow-up status" },
          { status: 400 }
        );
      }
      followUp.status = status;
    }
    if (typeof outcome === "string") followUp.outcome = outcome.trim().slice(0, 1000);
    if (typeof nextAction === "string") followUp.nextAction = nextAction.trim().slice(0, 500);
    if (status === "completed") followUp.completedAt = new Date();

    await followUp.save();

    const displayStatus = (followUp.status || "updated").toUpperCase();
    await LeadActivity.create({
      leadId: followUp.leadId,
      performedBy: auth.session.userId,
      activityType: "call_logged",
      title: `Follow-up ${displayStatus}`,
      description: `Outcome: ${outcome || "No outcome noted"}. Next action: ${nextAction || "None"}`,
    });

    return NextResponse.json({ success: true, followUp });
  } catch (error) {
    console.error("[Update Follow-up Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
