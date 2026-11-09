import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Location from "@/models/Location";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const stateSlug = searchParams.get("stateSlug");

        const query: Record<string, any> = { isPublished: true };
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
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const location = await Location.create(body);
    return NextResponse.json({ success: true, location });
  } catch (error) {
    console.error("[Create Location Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
