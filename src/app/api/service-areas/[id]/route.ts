import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Location from "@/models/Location";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_LOCATION_FIELDS = [
  "state",
  "stateSlug",
  "city",
  "citySlug",
  "district",
  "region",
  "serviceDescription",
  "localSolarPotentialKwhPerKw",
  "averageSunHoursPerDay",
  "popularCapacities",
  "discomUtilityNames",
  "completedProjectsCount",
  "isPublished",
  "seoTitle",
  "seoDescription",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "location id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_LOCATION_FIELDS) as Record<string, unknown>;

    await connectDB();
    const location = await Location.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    revalidatePublicSite(["/service-areas"]);
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("[Update Location Error]", error);
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

    const idErr = validateIdParam(params.id, "location id");
    if (idErr) return idErr;

    await connectDB();
    const location = await Location.findByIdAndDelete(params.id);
    if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    revalidatePublicSite(["/service-areas"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Location Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
