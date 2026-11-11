import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import PortfolioProject from "@/models/PortfolioProject";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_PROJECT_FIELDS = [
  "title",
  "slug",
  "shortDescription",
  "fullCaseStudy",
  "customerName",
  "customerBusinessName",
  "hasCustomerPhotoConsent",
  "hasCustomerVideoConsent",
  "hasCustomerTestimonialConsent",
  "state",
  "district",
  "city",
  "generalLocation",
  "completionDate",
  "systemCapacityKw",
  "panelWattageWp",
  "panelQuantity",
  "panelBrandModel",
  "inverterModel",
  "systemCategory",
  "coverImage",
  "beforePhotos",
  "duringPhotos",
  "afterPhotos",
  "videoUrl",
  "videoThumbnail",
  "testimonialQuote",
  "isFeatured",
  "isPublished",
  "seoTitle",
  "seoDescription",
] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "project id");
    if (idErr) return idErr;

    await connectDB();
    const project = await PortfolioProject.findById(params.id).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (!project.isPublished) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ project });
  } catch (error) {
    console.error("[Get Project Detail Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "project id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_PROJECT_FIELDS) as Record<string, unknown>;
    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.toLowerCase().trim();
    }
    if (typeof updates.coverImage === "string" && updates.coverImage.trim() !== "" && !isSafeMediaUrl(updates.coverImage)) {
      return NextResponse.json({ error: "Invalid coverImage URL" }, { status: 400 });
    }
    if (typeof updates.videoUrl === "string" && updates.videoUrl.trim() !== "" && !isSafeMediaUrl(updates.videoUrl)) {
      return NextResponse.json({ error: "Invalid videoUrl URL" }, { status: 400 });
    }

    await connectDB();

    const project = await PortfolioProject.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    revalidatePublicSite(["/projects"]);
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("[Update Project Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "project id");
    if (idErr) return idErr;

    await connectDB();
    await PortfolioProject.findByIdAndDelete(params.id);
    revalidatePublicSite(["/projects"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Project Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
