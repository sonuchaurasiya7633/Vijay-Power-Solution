import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FAQ from "@/models/FAQ";
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

    const faq = await FAQ.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

    revalidatePublicSite(["/faqs"]);
    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    console.error("[Update FAQ Error]", error);
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
    const faq = await FAQ.findByIdAndDelete(params.id);
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

    revalidatePublicSite(["/faqs"]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete FAQ Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
