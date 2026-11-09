import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AuditLog from "@/models/AuditLog";
import { getSession } from "@/lib/auth/session";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("[Get Activity Logs Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
