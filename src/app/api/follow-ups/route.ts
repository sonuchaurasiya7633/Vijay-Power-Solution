import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FollowUp from "@/models/FollowUp";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import "@/models/User";
import { requirePermission } from "@/lib/security/api-helpers";
import { isValidObjectId } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await requirePermission("read:leads");
    if (!auth.ok) return auth.response;

    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    const query: Record<string, any> = {};

    if (auth.session.role === "sales_executive") {
      query.assignedTo = auth.session.userId;
    }

    if (filter === "today") {
      query.scheduledAt = { $gte: startOfToday, $lte: endOfToday };
      query.status = { $in: ["pending", "due_today"] };
    } else if (filter === "overdue") {
      query.scheduledAt = { $lt: startOfToday };
      query.status = { $in: ["pending", "overdue"] };
    } else if (filter === "upcoming") {
      query.scheduledAt = { $gt: endOfToday };
      query.status = "pending";
    }

    const followUps = await FollowUp.find(query)
      .sort({ scheduledAt: 1 })
      .populate("leadId", "leadId fullName phone city state stage")
      .populate("assignedTo", "name email")
      .lean();

    return NextResponse.json({ followUps });
  } catch (error) {
    console.error("[Get Follow-ups Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:leads");
    if (!auth.ok) return auth.response;

    const body = await req.json();
    const { leadId, followUpType, scheduledAt, notes, assignedTo } = body;

    if (!leadId || !scheduledAt || !isValidObjectId(leadId)) {
      return NextResponse.json(
        { error: "Valid leadId and scheduledAt are required" },
        { status: 400 }
      );
    }

    if (assignedTo && !isValidObjectId(assignedTo)) {
      return NextResponse.json(
        { error: "Invalid assignee ID" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid scheduledAt timestamp" },
        { status: 400 }
      );
    }

    await connectDB();
    const safeType =
      typeof followUpType === "string" && followUpType.trim()
        ? followUpType.trim()
        : "phone_call";
    const assignee = assignedTo || auth.session.userId;

    const followUp = await FollowUp.create({
      leadId,
      assignedTo: assignee,
      followUpType: safeType,
      scheduledAt: scheduledDate,
      notes: typeof notes === "string" ? notes.trim().slice(0, 1000) : undefined,
      status: "pending",
    });

    await Lead.findByIdAndUpdate(leadId, { nextFollowUpDate: scheduledDate });

    await LeadActivity.create({
      leadId,
      performedBy: auth.session.userId,
      activityType: "note_added",
      title: `Scheduled Follow-up: ${safeType.replace(/_/g, " ").toUpperCase()}`,
      description: `Follow-up planned for ${scheduledDate.toLocaleString("en-IN")}. Notes: ${notes || "None"}`,
    });

    return NextResponse.json({ success: true, followUp });
  } catch (error) {
    console.error("[Create Follow-up Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
