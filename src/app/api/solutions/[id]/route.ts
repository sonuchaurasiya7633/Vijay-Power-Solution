import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarSolution from "@/models/SolarSolution";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_SOLUTION_FIELDS = [
  "title",
  "slug",
  "tagline",
  "shortDescription",
  "fullDescription",
  "targetAudience",
  "benefits",
  "recommendedCapacityRange",
  "subsidyInfo",
  "icon",
  "image",
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

    const idErr = validateIdParam(params.id, "solution id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_SOLUTION_FIELDS) as Record<string, unknown>;
    if (typeof updates.image === "string" && updates.image.trim() !== "" && !isSafeMediaUrl(updates.image)) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    await connectDB();
    const solution = await SolarSolution.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!solution) return NextResponse.json({ error: "Solution not found" }, { status: 404 });

    revalidatePublicSite(["/solar-solutions"]);
    return NextResponse.json({ success: true, solution });
  } catch (error) {
    console.error("[Update Solution Error]", error);
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

    const idErr = validateIdParam(params.id, "solution id");
    if (idErr) return idErr;

    await connectDB();
    const solution = await SolarSolution.findByIdAndDelete(params.id);
    if (!solution) return NextResponse.json({ error: "Solution not found" }, { status: 404 });

    revalidatePublicSite(["/solar-solutions"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Solution Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
