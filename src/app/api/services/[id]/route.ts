import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import SolarService from "@/models/SolarService";
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
    const service = await SolarService.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    revalidatePublicSite(["/services"]);
    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    console.error("[Update Service Error]", error);
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
    const service = await SolarService.findByIdAndDelete(params.id);
    if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

    revalidatePublicSite(["/services"]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete Service Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
