import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Blog from "@/models/Blog";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const adminMode = searchParams.get("adminMode") === "true";

        const query: Record<string, any> = {};
    if (!adminMode) query.isPublished = true;
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
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const blog = await Blog.create({
      ...body,
      publishedAt: body.isPublished ? new Date() : undefined,
    });
    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error("[Create Blog Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
