import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Location from "@/models/Location";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { revalidatePublicSite } from "@/lib/revalidate-public";
import { requirePermission } from "@/lib/security/api-helpers";
import { pickAllowedFields } from "@/lib/security/sanitize";

const ALLOWED_LOCATION_FIELDS = [
  "state",
  "stateSlug",
  "city",
  "citySlug",
  "district",
  "region",
  "serviceDescription",
  "localSolarPotentialKwhPerKw",
  "averageSunHoursPerDay",
  "popularCapacities",
  "discomUtilityNames",
  "completedProjectsCount",
  "isPublished",
  "seoTitle",
  "seoDescription",
] as const;

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const stateSlug = searchParams.get("stateSlug");
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
    if (stateSlug) query.stateSlug = stateSlug;

    const locations = await Location.find(query).sort({ state: 1, city: 1 }).lean();
    return NextResponse.json({ locations });
  } catch (error) {
    console.error("[Get Locations Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requirePermission("write:cms");
    if (!auth.ok) return auth.response;

    const rawBody = await req.json();
    const data = pickAllowedFields(rawBody, ALLOWED_LOCATION_FIELDS) as Record<string, unknown>;
    if (!data.state || !data.stateSlug || !data.city || !data.citySlug) {
      return NextResponse.json({ error: "State, stateSlug, city, and citySlug are required" }, { status: 400 });
    }

    await connectDB();
    const location = await Location.create(data);
    revalidatePublicSite(["/service-areas"]);
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("[Create Location Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
