import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Blog from "@/models/Blog";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
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

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const requestedAdminMode = searchParams.get("adminMode") === "true";

    let allowAdminMode = false;
    if (requestedAdminMode) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      allowAdminMode = true;
    }

    const query: Record<string, unknown> = {};
    if (!allowAdminMode) query.isPublished = true;
    if (category && category !== "all") query.category = category;

    const blogs = await Blog.find(query).sort({ publishedAt: -1, createdAt: -1 }).lean();
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("[Get Blogs Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const rawBody = await req.json();
    const data = pickAllowedFields(rawBody, ALLOWED_BLOG_FIELDS) as Record<string, unknown>;
    if (!data.title || !data.slug || !data.excerpt || !data.content || !data.category) {
      return NextResponse.json({ error: "Missing required blog fields" }, { status: 400 });
    }
    if (typeof data.coverImage === "string" && data.coverImage.trim() !== "" && !isSafeMediaUrl(data.coverImage)) {
      return NextResponse.json({ error: "Invalid coverImage URL" }, { status: 400 });
    }
    if (typeof data.ogImage === "string" && data.ogImage.trim() !== "" && !isSafeMediaUrl(data.ogImage)) {
      return NextResponse.json({ error: "Invalid ogImage URL" }, { status: 400 });
    }
    if (typeof data.content === "string") {
      data.content = sanitizeHtmlContent(data.content);
    }
    data.slug = String(data.slug).toLowerCase().trim();

    await connectDB();
    const blog = await Blog.create({
      ...data,
      publishedAt: data.isPublished ? new Date() : undefined,
    });
    revalidatePublicSite(["/blog"]);
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("[Create Blog Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
