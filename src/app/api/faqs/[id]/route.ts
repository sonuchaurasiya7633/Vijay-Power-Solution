import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FAQ from "@/models/FAQ";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission, validateIdParam } from "@/lib/security/api-helpers";
import { pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_FAQ_FIELDS = [
  "question",
  "answer",
  "category",
  "sortOrder",
  "isPublished",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const idErr = validateIdParam(params.id, "FAQ id");
    if (idErr) return idErr;

    const rawBody = await req.json();
    const updates = pickAllowedFields(rawBody, ALLOWED_FAQ_FIELDS) as Record<string, unknown>;

    await connectDB();

    const faq = await FAQ.findByIdAndUpdate(params.id, { $set: updates }, { new: true });
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

    revalidatePublicSite(["/faqs"]);
    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("[Update FAQ Error]", error);
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

    const idErr = validateIdParam(params.id, "FAQ id");
    if (idErr) return idErr;

    await connectDB();
    const faq = await FAQ.findByIdAndDelete(params.id);
    if (!faq) return NextResponse.json({ error: "FAQ not found" }, { status: 404 });

    revalidatePublicSite(["/faqs"]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete FAQ Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
