import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Testimonial from "@/models/Testimonial";
import { getSession } from "@/lib/auth/session";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!testimonial) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

    revalidatePublicSite(["/testimonials"]);
    return NextResponse.json({ success: true, testimonial });
  } catch (error: any) {
    console.error("[Update Testimonial Error]", error);
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
    const testimonial = await Testimonial.findByIdAndDelete(params.id);
    if (!testimonial) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

    revalidatePublicSite(["/testimonials"]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete Testimonial Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
