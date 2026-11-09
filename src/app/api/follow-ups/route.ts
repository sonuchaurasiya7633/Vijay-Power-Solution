import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FollowUp from "@/models/FollowUp";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // today, upcoming, overdue, all
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const query: Record<string, any> = {};

    if (session.role === "sales_executive") {
      query.assignedTo = session.userId;
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { leadId, followUpType, scheduledAt, notes, assignedTo } = body;

    if (!leadId || !scheduledAt) {
      return NextResponse.json({ error: "leadId and scheduledAt are required" }, { status: 400 });
    }

    await connectDB();

    const assignee = assignedTo || session.userId;
    const followUp = await FollowUp.create({
      leadId,
      assignedTo: assignee,
      followUpType: followUpType || "phone_call",
      scheduledAt: new Date(scheduledAt),
      notes,
      status: "pending",
    });

    // Update lead's nextFollowUpDate
    await Lead.findByIdAndUpdate(leadId, { nextFollowUpDate: new Date(scheduledAt) });

    await LeadActivity.create({
      leadId,
      performedBy: session.userId,
      activityType: "note_added",
      title: `Scheduled Follow-up: ${followUpType.replace(/_/g, " ").toUpperCase()}`,
      description: `Follow-up planned for ${new Date(scheduledAt).toLocaleString("en-IN")}. Notes: ${notes || "None"}`,
    });

    return NextResponse.json({ success: true, followUp });
  } catch (error) {
    console.error("[Create Follow-up Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
