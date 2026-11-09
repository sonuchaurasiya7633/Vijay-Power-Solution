import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Blog from "@/models/Blog";
import { getSession } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const blog = await Blog.findById(params.id);
    if (!blog) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    return NextResponse.json({ blog });
  } catch (error: any) {
    console.error("[Get Blog Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    const blog = await Blog.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!blog) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error("[Update Blog Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const blog = await Blog.findByIdAndDelete(params.id);
    if (!blog) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete Blog Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
