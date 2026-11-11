import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarSolution from "@/models/SolarSolution";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_SOLUTION_FIELDS = [
  "title",
  "slug",
  "tagline",
  "shortDescription",
  "fullDescription",
  "targetAudience",
  "benefits",
  "recommendedCapacityRange",
  "subsidyInfo",
  "icon",
  "image",
  "isPublished",
  "sortOrder",
] as const;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const requestedAdminMode = searchParams.get("adminMode") === "true";

    let allowAdminMode = false;
    if (requestedAdminMode) {
      const session = await getSession();
      if (!session || !hasPermission(session.role, "read:cms")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      allowAdminMode = true;
    }

    const query = allowAdminMode ? {} : { isPublished: true };
    const solutions = await SolarSolution.find(query).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ solutions });
  } catch (error) {
    console.error("[Get Solutions Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const rawBody = await req.json();
    const data = pickAllowedFields(rawBody, ALLOWED_SOLUTION_FIELDS) as Record<string, unknown>;
    if (!data.title || !data.slug || !data.shortDescription) {
      return NextResponse.json({ error: "Missing required solution fields" }, { status: 400 });
    }
    if (typeof data.image === "string" && data.image.trim() !== "" && !isSafeMediaUrl(data.image)) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }
    data.image = data.image || "";

    await connectDB();
    const solution = await SolarSolution.create(data);
    revalidatePublicSite(["/solar-solutions"]);
    return NextResponse.json({ success: true, solution });
  } catch (error) {
    console.error("[Create Solution Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
