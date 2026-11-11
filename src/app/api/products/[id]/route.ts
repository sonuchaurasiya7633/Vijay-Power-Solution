import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarProduct from "@/models/SolarProduct";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { normalizeOfficialPanelBrand } from "@/lib/constants/brands";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_PRODUCT_FIELDS = [
  "name",
  "slug",
  "brand",
  "modelNumber",
  "ratedPowerWp",
  "technologyCategories",
  "wattageGroup",
  "moduleEfficiencyPercent",
  "cellCount",
  "dimensionsMm",
  "weightKg",
  "maxSystemVoltageV",
  "openCircuitVoltageVoc",
  "optOperatingVoltageVmp",
  "shortCircuitCurrentIsc",
  "optOperatingCurrentImp",
  "temperatureCoefficientPmax",
  "certifications",
  "productWarrantyYears",
  "performanceWarrantyYears",
  "datasheetUrl",
  "coverImage",
  "galleryImages",
  "keyFeatures",
  "typicalApplications",
  "description",
  "availabilityStatus",
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
    const idErr = validateIdParam(params.id, "product id");
    if (idErr) return idErr;

    await connectDB();
    const product = await SolarProduct.findById(params.id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!product.isPublished) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:products")) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error("[Get Product Detail Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:products");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "product id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_PRODUCT_FIELDS) as Record<string, unknown>;
    if (typeof updates.brand === "string") {
      updates.brand = normalizeOfficialPanelBrand(updates.brand);
    }
    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.toLowerCase().trim();
    }
    if (typeof updates.coverImage === "string" && updates.coverImage.trim() !== "" && !isSafeMediaUrl(updates.coverImage)) {
      return NextResponse.json({ error: "Invalid coverImage URL" }, { status: 400 });
    }
    if (typeof updates.datasheetUrl === "string" && updates.datasheetUrl.trim() !== "" && !isSafeMediaUrl(updates.datasheetUrl)) {
      return NextResponse.json({ error: "Invalid datasheetUrl URL" }, { status: 400 });
    }

    await connectDB();

    const product = await SolarProduct.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    revalidatePublicSite(["/solar-panels"]);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[Update Product Error]", error);
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

    const idErr = validateIdParam(params.id, "product id");
    if (idErr) return idErr;

    await connectDB();
    await SolarProduct.findByIdAndDelete(params.id);
    revalidatePublicSite(["/solar-panels"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Product Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
