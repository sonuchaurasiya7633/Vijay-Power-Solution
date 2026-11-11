import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import ProductCategory from "@/models/ProductCategory";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const requestedAdminMode = searchParams.get("adminMode") === "true";

    let allowInactive = false;
    if (requestedAdminMode) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:products")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      allowInactive = true;
    }

    const query = allowInactive ? {} : { isActive: true };
    const categories = await ProductCategory.find(query).sort({ displayOrder: 1, name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[Get Categories Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:products");
    if (!auth.ok) return auth.response;

    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const cleanSlug = String(body.slug).toLowerCase().trim();
    await connectDB();
    const existing = await ProductCategory.findOne({ slug: cleanSlug });
    if (existing) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
    }

    const category = await ProductCategory.create({
      name: String(body.name).trim(),
      slug: cleanSlug,
      description: body.description || "",
      technologyType: body.technologyType || "Monocrystalline",
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    revalidatePublicSite(["/solar-panels"]);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error("[Create Category Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
