import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Blog from "@/models/Blog";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields, sanitizeHtmlContent } from "@/lib/security/sanitize";

const ALLOWED_BLOG_FIELDS = [
  "title",
  "slug",
  "excerpt",
  "content",
  "coverImage",
  "category",
  "tags",
  "authorName",
  "authorRole",
  "estimatedReadTimeMin",
  "isPublished",
  "publishedAt",
  "seoTitle",
  "seoDescription",
  "ogImage",
] as const;

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "blog id");
    if (idErr) return idErr;

    await connectDB();
    const blog = await Blog.findById(params.id).lean();
    if (!blog) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    if (!blog.isPublished) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }
    }
    return NextResponse.json({ blog });
  } catch (error) {
    console.error("[Get Blog Error]", error);
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

    const idErr = validateIdParam(params.id, "blog id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_BLOG_FIELDS) as Record<string, unknown>;
    if (typeof updates.slug === "string") {
      updates.slug = updates.slug.toLowerCase().trim();
    }
    if (typeof updates.coverImage === "string" && updates.coverImage.trim() !== "" && !isSafeMediaUrl(updates.coverImage)) {
      return NextResponse.json({ error: "Invalid coverImage URL" }, { status: 400 });
    }
    if (typeof updates.ogImage === "string" && updates.ogImage.trim() !== "" && !isSafeMediaUrl(updates.ogImage)) {
      return NextResponse.json({ error: "Invalid ogImage URL" }, { status: 400 });
    }
    if (typeof updates.content === "string") {
      updates.content = sanitizeHtmlContent(updates.content);
    }

    await connectDB();

    const blog = await Blog.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!blog) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    revalidatePublicSite(["/blog"]);
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("[Update Blog Error]", error);
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

    const idErr = validateIdParam(params.id, "blog id");
    if (idErr) return idErr;

    await connectDB();
    const blog = await Blog.findByIdAndDelete(params.id);
    if (!blog) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    revalidatePublicSite(["/blog"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete Blog Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
