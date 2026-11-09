import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Testimonial from "@/models/Testimonial";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("adminMode") === "true";

        const query: Record<string, any> = {};
    if (!adminMode) {
      query.isPublished = true;
      query.isApproved = true;
      query.hasCustomerConsent = true; // Strict consent enforcement
    }

    const testimonials = await Testimonial.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error("[Get Testimonials Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const testimonial = await Testimonial.create(body);
    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("[Create Testimonial Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
