import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FollowUp from "@/models/FollowUp";
import LeadActivity from "@/models/LeadActivity";
import { getSession } from "@/lib/auth/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, outcome, nextAction } = await req.json();
    await connectDB();

    const followUp = await FollowUp.findById(params.id);
    if (!followUp) {
      return NextResponse.json({ error: "Follow-up not found" }, { status: 404 });
    }

    if (status) followUp.status = status;
    if (outcome) followUp.outcome = outcome;
    if (nextAction) followUp.nextAction = nextAction;
    if (status === "completed") followUp.completedAt = new Date();

    await followUp.save();

    await LeadActivity.create({
      leadId: followUp.leadId,
      performedBy: session.userId,
      activityType: "call_logged",
      title: `Follow-up ${status.toUpperCase()}`,
      description: `Outcome: ${outcome || 'No outcome noted'}. Next action: ${nextAction || 'None'}`,
    });

    return NextResponse.json({ success: true, followUp });
  } catch (error) {
    console.error("[Update Follow-up Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
