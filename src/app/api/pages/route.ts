import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, sanitizeHtmlContent } from "@/lib/security/sanitize";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const requestedAdminMode = searchParams.get("adminMode") === "true";
    const session = await getSession();
    const canReadDrafts = Boolean(session && hasPermission(session.role, "read:cms"));

    if (requestedAdminMode && !canReadDrafts) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (slug) {
      const pageQuery: Record<string, unknown> = { slug: slug.toLowerCase().trim() };
      if (!canReadDrafts) pageQuery.isPublished = true;
      const page = await Page.findOne(pageQuery).lean();
      return NextResponse.json({ page });
    }

    const listQuery: Record<string, unknown> = canReadDrafts && requestedAdminMode ? {} : { isPublished: true };
    const pages = await Page.find(listQuery).sort({ updatedAt: -1, title: 1 }).lean();
    return NextResponse.json({ pages });
  } catch (error) {
    console.error("[Get Pages Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    if (typeof body.heroImage === "string" && body.heroImage.trim() !== "" && !isSafeMediaUrl(body.heroImage)) {
      return NextResponse.json({ error: "Invalid heroImage URL" }, { status: 400 });
    }

    await connectDB();
    const existing = await Page.findOne({ slug: String(body.slug).toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: "A page with this slug already exists" }, { status: 400 });
    }

    const page = await Page.create({
      title: String(body.title).trim(),
      slug: String(body.slug).toLowerCase().trim(),
      heroHeading: body.heroHeading || body.title,
      heroSubtitle: body.heroSubtitle || "",
      heroImage: body.heroImage || "",
      contentHtml: typeof body.contentHtml === "string" ? sanitizeHtmlContent(body.contentHtml) : "",
      sections: Array.isArray(body.sections) ? body.sections : [],
      metaTitle: body.metaTitle || `${body.title} | VIJOY POWER SOLUTION`,
      metaDescription: body.metaDescription || "",
      isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
      publishedAt: body.isPublished ? new Date() : undefined,
    });

    revalidatePublicSite();
    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error) {
    console.error("[Create Page Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
