import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AuditLog from "@/models/AuditLog";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (
      !hasPermission(session.role, "manage:team") &&
      !hasPermission(session.role, "manage:settings")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const parsedLimit = Number.parseInt(searchParams.get("limit") || "50", 10);
    const limit = Number.isFinite(parsedLimit)
      ? Math.min(200, Math.max(1, parsedLimit))
      : 50;

    const logs = await AuditLog.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("[Get Activity Logs Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
