import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const page = await Page.findOne({ slug: slug.toLowerCase() }).lean();
      return NextResponse.json({ page });
    }

    const pages = await Page.find({}).sort({ updatedAt: -1, title: 1 }).lean();
    return NextResponse.json({ pages });
  } catch (error) {
    console.error("[Get Pages Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    await connectDB();
    const existing = await Page.findOne({ slug: body.slug.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 400 });
    }

    const page = await Page.create({
      title: body.title,
      slug: body.slug.toLowerCase().trim(),
      heroHeading: body.heroHeading || body.title,
      heroSubtitle: body.heroSubtitle || "",
      heroImage: body.heroImage || "",
      contentHtml: body.contentHtml || "",
      sections: body.sections || [],
      metaTitle: body.metaTitle || `${body.title} | VIJOY POWER SOLUTION`,
      metaDescription: body.metaDescription || "",
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      publishedAt: body.isPublished ? new Date() : undefined,
    });

    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error: any) {
    console.error("[Create Page Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
