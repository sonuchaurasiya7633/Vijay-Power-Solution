import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SiteSurvey from "@/models/SiteSurvey";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import {
  requirePermission,
  validateIdParam,
} from "@/lib/security/api-helpers";
import { isValidObjectId } from "@/lib/security/sanitize";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "survey ID");
    if (idErr) return idErr;

    const auth = await requirePermission("write:surveys");
    if (!auth.ok) return auth.response;

    const body = await req.json();
    await connectDB();

    const survey = await SiteSurvey.findById(params.id);
    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    if (body.status) survey.status = body.status;
    if (body.assignedTechnician) {
      if (!isValidObjectId(body.assignedTechnician)) {
        return NextResponse.json(
          { error: "Invalid technician ID" },
          { status: 400 }
        );
      }
      survey.assignedTechnician = body.assignedTechnician;
    }
    if (body.shadingObservations !== undefined)
      survey.shadingObservations = body.shadingObservations;
    if (body.existingSanctionedLoadKw !== undefined)
      survey.existingSanctionedLoadKw = body.existingSanctionedLoadKw;
    if (body.currentMonthlyUnits !== undefined)
      survey.currentMonthlyUnits = body.currentMonthlyUnits;
    if (body.feasibilityStatus)
      survey.feasibilityStatus = body.feasibilityStatus;
    if (body.suggestedSystemCapacityKw !== undefined)
      survey.suggestedSystemCapacityKw = body.suggestedSystemCapacityKw;
    if (body.mountingStructureType)
      survey.mountingStructureType = body.mountingStructureType;
    if (body.safetyObservations !== undefined)
      survey.safetyObservations = body.safetyObservations;
    if (body.surveyNotes !== undefined) survey.surveyNotes = body.surveyNotes;
    if (Array.isArray(body.sitePhotographs))
      survey.sitePhotographs = body.sitePhotographs;

    if (body.status === "completed") {
      survey.completedAt = new Date();
      await Lead.findByIdAndUpdate(survey.leadId, {
        stage: "site_survey_completed",
        requiredSystemSizeKw: survey.suggestedSystemCapacityKw,
      });

      await LeadActivity.create({
        leadId: survey.leadId,
        performedBy: auth.session.userId,
        activityType: "survey_scheduled",
        title: `Site Survey Completed: ${survey.surveyId}`,
        description: `Feasibility: ${survey.feasibilityStatus}. Recommended solar capacity: ${survey.suggestedSystemCapacityKw || "N/A"} kW.`,
      });
    }

    await survey.save();
    return NextResponse.json({ success: true, survey });
  } catch (error) {
    console.error("[Update Survey Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
