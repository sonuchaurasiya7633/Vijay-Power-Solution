import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import FAQ from "@/models/FAQ";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_FAQ_FIELDS = [
  "question",
  "answer",
  "category",
  "sortOrder",
  "isPublished",
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

    const query: Record<string, unknown> = allowAdminMode ? {} : { isPublished: true };
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
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const rawBody = await req.json();
    const data = pickAllowedFields(rawBody, ALLOWED_FAQ_FIELDS) as Record<string, unknown>;
    if (!data.question || !data.answer) {
      return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
    }

    await connectDB();
    const faq = await FAQ.create(data);
    revalidatePublicSite(["/faqs"]);
    return NextResponse.json({ success: true, faq });
  } catch (error) {
    console.error("[Create FAQ Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
