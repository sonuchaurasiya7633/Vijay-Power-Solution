import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import PortfolioProject from "@/models/PortfolioProject";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { isSafeMediaUrl } from "@/lib/security/sanitize";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const requestedAdminMode = searchParams.get("adminMode") === "true";

    let allowAdminMode = false;
    if (requestedAdminMode) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      allowAdminMode = true;
    }

    const query: Record<string, unknown> = {};

    if (!allowAdminMode) {
      query.isPublished = true;
    }

    if (state && state !== "all") query.state = state;
    if (city && city !== "all") query.city = city;
    if (category && category !== "all") query.systemCategory = category;
    if (featured === "true") query.isFeatured = true;

    const projects = await PortfolioProject.find(query)
      .sort({ completionDate: -1 })
      .lean();

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("[Get Projects Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:cms")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      shortDescription,
      fullCaseStudy,
      customerName,
      customerBusinessName,
      hasCustomerPhotoConsent = false,
      hasCustomerVideoConsent = false,
      hasCustomerTestimonialConsent = false,
      state,
      district,
      city,
      generalLocation,
      completionDate,
      systemCapacityKw,
      panelWattageWp,
      panelQuantity,
      panelBrandModel,
      inverterModel,
      systemCategory,
      coverImage,
      beforePhotos = [],
      duringPhotos = [],
      afterPhotos = [],
      videoUrl,
      videoThumbnail,
      testimonialQuote,
      isFeatured = false,
      isPublished = false,
      seoTitle,
      seoDescription,
    } = body;

    if (!title || !slug || !state || !city || !systemCapacityKw || !coverImage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const count = await PortfolioProject.countDocuments();
    const projectId = `VPS-PRJ-${String(1001 + count).padStart(4, "0")}`;

    const project = await PortfolioProject.create({
      projectId,
      title,
      slug: slug.toLowerCase().trim(),
      shortDescription,
      fullCaseStudy,
      customerName,
      customerBusinessName,
      hasCustomerPhotoConsent,
      hasCustomerVideoConsent,
      hasCustomerTestimonialConsent,
      state,
      district,
      city,
      generalLocation: generalLocation || `${city}, ${state}`,
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      systemCapacityKw: Number(systemCapacityKw),
      panelWattageWp: Number(panelWattageWp || 540),
      panelQuantity: panelQuantity ? Number(panelQuantity) : undefined,
      panelBrandModel,
      inverterModel,
      systemCategory: systemCategory || "Residential Rooftop",
      coverImage,
      beforePhotos,
      duringPhotos,
      afterPhotos,
      videoUrl,
      videoThumbnail,
      testimonialQuote,
      isFeatured,
      isPublished,
      seoTitle,
      seoDescription,
    });

    revalidatePublicSite(["/projects"]);
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("[Create Project Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
