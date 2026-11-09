import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FAQ from "@/models/FAQ";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

        const query: Record<string, any> = { isPublished: true };
    if (category && category !== "all") query.category = category;

    const faqs = await FAQ.find(query).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error("[Get FAQs Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const faq = await FAQ.create(body);
    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("[Create FAQ Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
