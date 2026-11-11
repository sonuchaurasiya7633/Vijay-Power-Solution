import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import InstallationJob, { type InstallationStage } from "@/models/InstallationJob";
import PortfolioProject from "@/models/PortfolioProject";
import LeadActivity from "@/models/LeadActivity";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, isValidObjectId } from "@/lib/security/sanitize";
import { revalidatePublicSite } from "@/lib/revalidate-public";

const ALLOWED_INSTALLATION_STAGES = new Set<InstallationStage>([
  "customer_confirmed",
  "survey_approved",
  "specs_finalized",
  "docs_collected",
  "materials_procured",
  "installation_scheduled",
  "installation_underway",
  "electrical_inspection",
  "commissioning",
  "handover_completed",
  "follow_up_maintenance",
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:installations")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const idErr = validateIdParam(params.id, "installation job id");
    if (idErr) return idErr;

    const body = await req.json();
    await connectDB();

    const job = await InstallationJob.findById(params.id);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (body.stage !== undefined) {
      if (typeof body.stage !== "string" || !ALLOWED_INSTALLATION_STAGES.has(body.stage as InstallationStage)) {
        return NextResponse.json({ error: "Invalid installation stage" }, { status: 400 });
      }
      job.stage = body.stage as InstallationStage;
    }
    if (body.assignedManager) {
      if (!isValidObjectId(String(body.assignedManager))) {
        return NextResponse.json({ error: "Invalid assignedManager id" }, { status: 400 });
      }
      job.assignedManager = body.assignedManager;
    }
    if (body.leadTechnician) {
      if (!isValidObjectId(String(body.leadTechnician))) {
        return NextResponse.json({ error: "Invalid leadTechnician id" }, { status: 400 });
      }
      job.leadTechnician = body.leadTechnician;
    }
    if (body.startDate) job.startDate = new Date(body.startDate);
    if (body.actualCompletionDate) job.actualCompletionDate = new Date(body.actualCompletionDate);
    if (typeof body.commissioningChecklistDone === "boolean") job.commissioningChecklistDone = body.commissioningChecklistDone;
    if (typeof body.handoverDocSigned === "boolean") job.handoverDocSigned = body.handoverDocSigned;
    if (typeof body.customerApprovalReceived === "boolean") job.customerApprovalReceived = body.customerApprovalReceived;
    if (typeof body.hasCustomerConsentForPortfolio === "boolean") job.hasCustomerConsentForPortfolio = body.hasCustomerConsentForPortfolio;
    if (typeof body.installationNotes === "string") job.installationNotes = body.installationNotes.slice(0, 4000);
    if (Array.isArray(body.privateSitePhotos)) {
      job.privateSitePhotos = body.privateSitePhotos.filter((u: unknown): u is string => typeof u === "string" && isSafeMediaUrl(u));
    }

    // Convert to public portfolio project if requested and has consent
    if (body.convertToPortfolio && !job.convertedToPublicProject) {
      if (!job.hasCustomerConsentForPortfolio) {
        return NextResponse.json(
          { error: "Explicit customer consent is required before publishing project to portfolio" },
          { status: 400 }
        );
      }

      const slugBase = `${job.systemCapacityKw}kw-solar-rooftop-${job.city.toLowerCase()}-${Date.now().toString().slice(-4)}`;
      const publicProject = await PortfolioProject.create({
        projectId: `VPS-PRJ-${Date.now().toString().slice(-4)}`,
        title: `${job.systemCapacityKw} kW Rooftop Solar Installation in ${job.city}`,
        slug: slugBase,
        shortDescription: `Successful ${job.systemCapacityKw} kW rooftop solar commissioning in ${job.city}, ${job.state}.`,
        customerName: job.customerName,
        hasCustomerPhotoConsent: true,
        hasCustomerVideoConsent: false,
        hasCustomerTestimonialConsent: true,
        state: job.state,
        city: job.city,
        generalLocation: `${job.city}, ${job.state}`,
        completionDate: job.actualCompletionDate || new Date(),
        systemCapacityKw: job.systemCapacityKw,
        panelWattageWp: 540,
        panelQuantity: job.solarPanelQuantity || Math.round((job.systemCapacityKw * 1000) / 540),
        panelBrandModel: job.solarPanelBrandModel,
        inverterModel: job.inverterBrandModel,
        systemCategory: "Residential Rooftop",
        coverImage: job.privateSitePhotos[0] || "/images/logo.png",
        afterPhotos: job.privateSitePhotos,
        isFeatured: false,
        isPublished: false, // Default to unpublished draft for content review
      });

      job.convertedToPublicProject = true;
      job.publicProjectId = publicProject._id as unknown as typeof job.publicProjectId;
      revalidatePublicSite(["/projects"]);
    }

    await job.save();

    await LeadActivity.create({
      leadId: job.leadId,
      performedBy: session.userId,
      activityType: "installation_converted",
      title: `Installation Progress: ${job.stage.replace(/_/g, " ").toUpperCase()}`,
      description: `Job ${job.jobId} updated by ${session.name}.`,
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("[Update Installation Job Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
