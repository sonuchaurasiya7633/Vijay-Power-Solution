import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getSession } from "@/lib/auth/session";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const page = await Page.findById(params.id);
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    return NextResponse.json({ page });
  } catch (error: any) {
    console.error("[Get Page Error]", error);
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

    const page = await Page.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error("[Update Page Error]", error);
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
    const page = await Page.findByIdAndDelete(params.id);
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete Page Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
