import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SiteSurvey from "@/models/SiteSurvey";
import Lead from "@/models/Lead";
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

    const body = await req.json();
    await connectDB();

    const survey = await SiteSurvey.findById(params.id);
    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    if (body.status) survey.status = body.status;
    if (body.assignedTechnician) survey.assignedTechnician = body.assignedTechnician;
    if (body.shadingObservations) survey.shadingObservations = body.shadingObservations;
    if (body.existingSanctionedLoadKw) survey.existingSanctionedLoadKw = body.existingSanctionedLoadKw;
    if (body.currentMonthlyUnits) survey.currentMonthlyUnits = body.currentMonthlyUnits;
    if (body.feasibilityStatus) survey.feasibilityStatus = body.feasibilityStatus;
    if (body.suggestedSystemCapacityKw) survey.suggestedSystemCapacityKw = body.suggestedSystemCapacityKw;
    if (body.mountingStructureType) survey.mountingStructureType = body.mountingStructureType;
    if (body.safetyObservations) survey.safetyObservations = body.safetyObservations;
    if (body.surveyNotes) survey.surveyNotes = body.surveyNotes;
    if (Array.isArray(body.sitePhotographs)) survey.sitePhotographs = body.sitePhotographs;

    if (body.status === "completed") {
      survey.completedAt = new Date();
      await Lead.findByIdAndUpdate(survey.leadId, {
        stage: "site_survey_completed",
        requiredSystemSizeKw: survey.suggestedSystemCapacityKw,
      });

      await LeadActivity.create({
        leadId: survey.leadId,
        performedBy: session.userId,
        activityType: "survey_scheduled",
        title: `Site Survey Completed: ${survey.surveyId}`,
        description: `Feasibility: ${survey.feasibilityStatus}. Recommended solar capacity: ${survey.suggestedSystemCapacityKw || 'N/A'} kW.`,
      });
    }

    await survey.save();
    return NextResponse.json({ success: true, survey });
  } catch (error) {
    console.error("[Update Survey Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
