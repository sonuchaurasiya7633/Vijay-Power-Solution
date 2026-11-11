import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarService from "@/models/SolarService";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("adminMode") === "true";
    const query = adminMode ? {} : { isAvailable: true };
    const services = await SolarService.find(query).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ services });
  } catch (error) {
    console.error("[Get Services Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    body.image = body.image || "";
    body.fullDescription = body.fullDescription || body.shortDescription;
    await connectDB();
    const service = await SolarService.create(body);
    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("[Create Service Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
