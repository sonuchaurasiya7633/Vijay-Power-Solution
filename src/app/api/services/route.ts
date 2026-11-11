import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarService from "@/models/SolarService";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { isSafeMediaUrl, pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_SERVICE_FIELDS = [
  "title",
  "slug",
  "shortDescription",
  "fullDescription",
  "icon",
  "image",
  "deliverables",
  "sortOrder",
  "isAvailable",
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

    const query = allowAdminMode ? {} : { isAvailable: true };
    const services = await SolarService.find(query).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("[Get Services Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const rawBody = await req.json();
    const data = pickAllowedFields(rawBody, ALLOWED_SERVICE_FIELDS) as Record<string, unknown>;
    if (!data.title || !data.slug || !data.shortDescription) {
      return NextResponse.json({ error: "Missing required service fields" }, { status: 400 });
    }
    if (typeof data.image === "string" && data.image.trim() !== "" && !isSafeMediaUrl(data.image)) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }
    data.image = data.image || "";
    data.fullDescription = data.fullDescription || data.shortDescription;

    await connectDB();
    const service = await SolarService.create(data);
    revalidatePublicSite(["/services"]);
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("[Create Service Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
