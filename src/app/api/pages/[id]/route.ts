import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields, sanitizeHtmlContent } from "@/lib/security/sanitize";

const ALLOWED_PAGE_FIELDS = [
  "title",
  "slug",
  "heroHeading",
  "heroSubtitle",
  "heroImage",
  "contentHtml",
  "sections",
  "metaTitle",
  "metaDescription",
  "isPublished",
  "publishedAt",
] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "page id");
    if (idErr) return idErr;

    await connectDB();
    const page = await Page.findById(params.id).lean();
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    if (!page.isPublished) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ page });
  } catch (error) {
    console.error("[Get Page Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "page id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_PAGE_FIELDS) as Record<string, unknown>;
    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.toLowerCase().trim();
    }
    if (typeof updates.heroImage === "string" && updates.heroImage.trim() !== "" && !isSafeMediaUrl(updates.heroImage)) {
      return NextResponse.json({ error: "Invalid heroImage URL" }, { status: 400 });
    }
    if (typeof updates.contentHtml === "string") {
      updates.contentHtml = sanitizeHtmlContent(updates.contentHtml);
    }

    await connectDB();

    const page = await Page.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

    revalidatePublicSite();
    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("[Update Page Error]", error);
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

    const idErr = validateIdParam(params.id, "page id");
    if (idErr) return idErr;

    await connectDB();
    const page = await Page.findByIdAndDelete(params.id);
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

    revalidatePublicSite();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Page Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
