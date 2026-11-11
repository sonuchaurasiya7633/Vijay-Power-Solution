import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Testimonial from "@/models/Testimonial";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_TESTIMONIAL_FIELDS = [
  "customerName",
  "designationOrType",
  "locationCity",
  "locationState",
  "systemCapacityKw",
  "quote",
  "rating",
  "customerPhoto",
  "videoUrl",
  "hasCustomerConsent",
  "isApproved",
  "isPublished",
  "sortOrder",
] as const;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
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
      query.isApproved = true;
      query.hasCustomerConsent = true; // Strict consent enforcement
    }

    const testimonials = await Testimonial.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("[Get Testimonials Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const rawBody = await req.json();
    const data = pickAllowedFields(rawBody, ALLOWED_TESTIMONIAL_FIELDS) as Record<string, unknown>;
    if (!data.customerName || !data.quote) {
      return NextResponse.json({ error: "Customer name and quote are required" }, { status: 400 });
    }
    if (typeof data.customerPhoto === "string" && data.customerPhoto.trim() !== "" && !isSafeMediaUrl(data.customerPhoto)) {
      return NextResponse.json({ error: "Invalid customerPhoto URL" }, { status: 400 });
    }
    if (typeof data.videoUrl === "string" && data.videoUrl.trim() !== "" && !isSafeMediaUrl(data.videoUrl)) {
      return NextResponse.json({ error: "Invalid videoUrl" }, { status: 400 });
    }

    await connectDB();
    const testimonial = await Testimonial.create(data);
    revalidatePublicSite(["/testimonials"]);
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("[Create Testimonial Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
