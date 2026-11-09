import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarProduct from "@/models/SolarProduct";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const technology = searchParams.get("technology");
    const wattageGroup = searchParams.get("wattageGroup");
    const brand = searchParams.get("brand");
    const minWattage = searchParams.get("minWattage");
    const maxWattage = searchParams.get("maxWattage");
    const search = searchParams.get("search");
    const adminMode = searchParams.get("adminMode") === "true";

        const query: Record<string, any> = {};

    if (!adminMode) {
      query.isPublished = true;
    }

    if (technology && technology !== "all") {
      query.technologyCategories = technology;
    }

    if (wattageGroup && wattageGroup !== "all") {
      query.wattageGroup = wattageGroup;
    }

    if (brand && brand !== "all") {
      query.brand = brand;
    }

    if (minWattage || maxWattage) {
      query.ratedPowerWp = {};
      if (minWattage) query.ratedPowerWp.$gte = Number(minWattage);
      if (maxWattage) query.ratedPowerWp.$lte = Number(maxWattage);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { modelNumber: { $regex: search, $options: "i" } },
      ];
    }

    const products = await SolarProduct.find(query)
      .sort({ ratedPowerWp: 1 })
      .lean();

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[Get Products Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:products")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      brand,
      modelNumber,
      ratedPowerWp,
      technologyCategories = [],
      wattageGroup,
      moduleEfficiencyPercent,
      cellCount,
      dimensionsMm,
      weightKg,
      maxSystemVoltageV,
      openCircuitVoltageVoc,
      optOperatingVoltageVmp,
      shortCircuitCurrentIsc,
      optOperatingCurrentImp,
      temperatureCoefficientPmax,
      certifications = [],
      productWarrantyYears,
      performanceWarrantyYears,
      datasheetUrl,
      coverImage,
      galleryImages = [],
      keyFeatures = [],
      typicalApplications = [],
      description,
      availabilityStatus = "available_on_order",
      isFeatured = false,
      isPublished = true,
      seoTitle,
      seoDescription,
    } = body;

    if (!name || !slug || !brand || !ratedPowerWp || !coverImage || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const count = await SolarProduct.countDocuments();
    const productId = `VPS-PRD-${String(1001 + count).padStart(4, "0")}`;

    // Determine wattageGroup if not provided
    let group = wattageGroup;
    if (!group) {
      const w = Number(ratedPowerWp);
      if (w <= 50) group = "10W-50W";
      else if (w <= 100) group = "51W-100W";
      else if (w <= 200) group = "101W-200W";
      else if (w <= 300) group = "201W-300W";
      else if (w <= 400) group = "301W-400W";
      else if (w <= 500) group = "401W-500W";
      else if (w <= 600) group = "501W-600W";
      else if (w <= 700) group = "601W-700W";
      else group = "701W-730W";
    }

    const product = await SolarProduct.create({
      productId,
      name,
      slug: slug.toLowerCase().trim(),
      brand,
      modelNumber,
      ratedPowerWp: Number(ratedPowerWp),
      technologyCategories,
      wattageGroup: group,
      moduleEfficiencyPercent: moduleEfficiencyPercent ? Number(moduleEfficiencyPercent) : undefined,
      cellCount: cellCount ? Number(cellCount) : undefined,
      dimensionsMm,
      weightKg: weightKg ? Number(weightKg) : undefined,
      maxSystemVoltageV: maxSystemVoltageV ? Number(maxSystemVoltageV) : undefined,
      openCircuitVoltageVoc: openCircuitVoltageVoc ? Number(openCircuitVoltageVoc) : undefined,
      optOperatingVoltageVmp: optOperatingVoltageVmp ? Number(optOperatingVoltageVmp) : undefined,
      shortCircuitCurrentIsc: shortCircuitCurrentIsc ? Number(shortCircuitCurrentIsc) : undefined,
      optOperatingCurrentImp: optOperatingCurrentImp ? Number(optOperatingCurrentImp) : undefined,
      temperatureCoefficientPmax,
      certifications,
      productWarrantyYears: productWarrantyYears ? Number(productWarrantyYears) : undefined,
      performanceWarrantyYears: performanceWarrantyYears ? Number(performanceWarrantyYears) : undefined,
      datasheetUrl,
      coverImage,
      galleryImages,
      keyFeatures,
      typicalApplications,
      description,
      availabilityStatus,
      isFeatured,
      isPublished,
      seoTitle,
      seoDescription,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[Create Product Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
