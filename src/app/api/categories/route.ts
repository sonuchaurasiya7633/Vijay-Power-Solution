import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import ProductCategory from "@/models/ProductCategory";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  try {
    await connectDB();
    const categories = await ProductCategory.find({}).sort({ displayOrder: 1, name: 1 }).lean();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("[Get Categories Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    await connectDB();
    const existing = await ProductCategory.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 });
    }

    const category = await ProductCategory.create({
      name: body.name,
      slug: body.slug.toLowerCase().trim(),
      description: body.description || "",
      technologyType: body.technologyType || "Monocrystalline",
      displayOrder: body.displayOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error("[Create Category Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
