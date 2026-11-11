import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import ProductCategory from "@/models/ProductCategory";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_CATEGORY_FIELDS = [
  "name",
  "slug",
  "description",
  "technologyType",
  "displayOrder",
  "isActive",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:products");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "category id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_CATEGORY_FIELDS) as Record<string, unknown>;
    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.toLowerCase().trim();
    }

    await connectDB();

    const category = await ProductCategory.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true }
    );

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    revalidatePublicSite(["/solar-panels"]);
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("[Update Category Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:products");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "category id");
    if (idErr) return idErr;

    await connectDB();
    const category = await ProductCategory.findByIdAndDelete(params.id);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    revalidatePublicSite(["/solar-panels"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Category Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
