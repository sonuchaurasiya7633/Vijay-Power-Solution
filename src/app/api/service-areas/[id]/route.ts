import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Location from "@/models/Location";
import { getSession } from "@/lib/auth/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();
    const location = await Location.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    return NextResponse.json({ success: true, location });
  } catch (error: any) {
    console.error("[Update Location Error]", error);
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
    const location = await Location.findByIdAndDelete(params.id);
    if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete Location Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
