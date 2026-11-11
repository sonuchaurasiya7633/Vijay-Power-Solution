import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarService from "@/models/SolarService";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_SERVICE_FIELDS = [
  "title",
  "slug",
  "shortDescription",
  "fullDescription",
  "icon",
  "image",
  "deliverables",
  "sortOrder",
  "isAvailable",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "service id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_SERVICE_FIELDS) as Record<string, unknown>;
    if (typeof updates.image === "string" && updates.image.trim() !== "" && !isSafeMediaUrl(updates.image)) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    await connectDB();
    const service = await SolarService.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    revalidatePublicSite(["/services"]);
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("[Update Service Error]", error);
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

    const idErr = validateIdParam(params.id, "service id");
    if (idErr) return idErr;

    await connectDB();
    const service = await SolarService.findByIdAndDelete(params.id);
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    revalidatePublicSite(["/services"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Service Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
