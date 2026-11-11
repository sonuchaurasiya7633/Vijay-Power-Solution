import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SiteSurvey from "@/models/SiteSurvey";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import "@/models/User";
import { requirePermission } from "@/lib/security/api-helpers";
import { isValidObjectId } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await requirePermission("read:surveys");
    if (!auth.ok) return auth.response;

    await connectDB();
    const surveys = await SiteSurvey.find()
      .sort({ surveyDate: -1 })
      .populate("leadId", "leadId fullName phone city state")
      .populate("assignedTechnician", "name email phone")
      .lean();

    return NextResponse.json({ surveys });
  } catch (error) {
    console.error("[Get Surveys Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:surveys");
    if (!auth.ok) return auth.response;

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

    if (
      !leadId ||
      !isValidObjectId(leadId) ||
      !customerName ||
      !customerPhone ||
      !siteAddress ||
      !surveyDate
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      );
    }

    if (assignedTechnician && !isValidObjectId(assignedTechnician)) {
      return NextResponse.json(
        { error: "Invalid technician ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const lastSurvey = (await SiteSurvey.findOne({}, "surveyId")
      .sort({ createdAt: -1 })
      .lean()) as { surveyId?: string } | null;
    const lastSeq = lastSurvey?.surveyId?.match(/(\d+)$/)?.[1];
    const nextNum = lastSeq ? Math.max(1001, Number(lastSeq) + 1) : 1001;
    const surveyId = `VPS-SRV-${String(nextNum).padStart(4, "0")}`;

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

    await Lead.findByIdAndUpdate(leadId, { stage: "site_survey_scheduled" });

    await LeadActivity.create({
      leadId,
      performedBy: auth.session.userId,
      activityType: "survey_scheduled",
      title: `Site Survey Scheduled: ${surveyId}`,
      description: `Technician survey scheduled for ${new Date(surveyDate).toLocaleDateString("en-IN")} at ${siteAddress}.`,
    });

    return NextResponse.json({ success: true, survey });
  } catch (error) {
    console.error("[Create Survey Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
