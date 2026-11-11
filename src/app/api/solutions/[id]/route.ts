import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarSolution from "@/models/SolarSolution";
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
    const solution = await SolarSolution.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!solution) return NextResponse.json({ error: "Solution not found" }, { status: 404 });

    revalidatePublicSite(["/solar-solutions"]);
    return NextResponse.json({ success: true, solution });
  } catch (error: any) {
    console.error("[Update Solution Error]", error);
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
    const solution = await SolarSolution.findByIdAndDelete(params.id);
    if (!solution) return NextResponse.json({ error: "Solution not found" }, { status: 404 });

    revalidatePublicSite(["/solar-solutions"]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete Solution Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
