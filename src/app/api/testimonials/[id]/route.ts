import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Testimonial from "@/models/Testimonial";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "testimonial id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_TESTIMONIAL_FIELDS) as Record<string, unknown>;
    if (typeof updates.customerPhoto === "string" && updates.customerPhoto.trim() !== "" && !isSafeMediaUrl(updates.customerPhoto)) {
      return NextResponse.json({ error: "Invalid customerPhoto URL" }, { status: 400 });
    }
    if (typeof updates.videoUrl === "string" && updates.videoUrl.trim() !== "" && !isSafeMediaUrl(updates.videoUrl)) {
      return NextResponse.json({ error: "Invalid videoUrl" }, { status: 400 });
    }

    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!testimonial) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

    revalidatePublicSite(["/testimonials"]);
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("[Update Testimonial Error]", error);
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

    const idErr = validateIdParam(params.id, "testimonial id");
    if (idErr) return idErr;

    await connectDB();
    const testimonial = await Testimonial.findByIdAndDelete(params.id);
    if (!testimonial) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

    revalidatePublicSite(["/testimonials"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Testimonial Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
