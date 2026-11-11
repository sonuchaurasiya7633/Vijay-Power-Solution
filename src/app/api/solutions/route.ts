import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarSolution from "@/models/SolarSolution";
import { getSession } from "@/lib/auth/session";
import { revalidatePublicSite } from "@/lib/revalidate-public";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("adminMode") === "true";
    const query = adminMode ? {} : { isPublished: true };
    const solutions = await SolarSolution.find(query).sort({ sortOrder: 1 }).lean();
    return NextResponse.json({ solutions });
  } catch (error) {
    console.error("[Get Solutions Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    body.image = body.image || "";
    await connectDB();
    const solution = await SolarSolution.create(body);
    revalidatePublicSite(["/solar-solutions"]);
    return NextResponse.json({ success: true, solution });
  } catch (error) {
    console.error("[Create Solution Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
