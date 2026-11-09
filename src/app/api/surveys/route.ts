import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SiteSurvey from "@/models/SiteSurvey";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const surveys = await SiteSurvey.find()
      .sort({ surveyDate: -1 })
      .populate("leadId", "leadId fullName phone city state")
      .populate("assignedTechnician", "name email phone")
      .lean();

    return NextResponse.json({ surveys });
  } catch (error) {
    console.error("[Get Surveys Error]", error);
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
    const {
      leadId,
      customerName,
      customerPhone,
      siteAddress,
      state,
      city,
      surveyDate,
      assignedTechnician,
      roofType,
      roofAreaSqFt,
      surveyNotes,
    } = body;

    if (!leadId || !customerName || !customerPhone || !siteAddress || !surveyDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const count = await SiteSurvey.countDocuments();
    const surveyId = `VPS-SRV-${String(1001 + count).padStart(4, "0")}`;

    const survey = await SiteSurvey.create({
      surveyId,
      leadId,
      customerName,
      customerPhone,
      siteAddress,
      state,
      city,
      surveyDate: new Date(surveyDate),
      assignedTechnician: assignedTechnician || undefined,
      roofType,
      roofAreaSqFt,
      surveyNotes,
      status: "scheduled",
    });

    // Update lead stage
    await Lead.findByIdAndUpdate(leadId, { stage: "site_survey_scheduled" });

    await LeadActivity.create({
      leadId,
      performedBy: session.userId,
      activityType: "survey_scheduled",
      title: `Site Survey Scheduled: ${surveyId}`,
      description: `Technician survey scheduled for ${new Date(surveyDate).toLocaleDateString("en-IN")} at ${siteAddress}.`,
    });

    return NextResponse.json({ success: true, survey });
  } catch (error) {
    console.error("[Create Survey Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
