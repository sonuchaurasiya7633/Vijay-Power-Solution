import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (key) {
      const setting = await Setting.findOne({ key }).lean();
      return NextResponse.json({ setting: setting?.value || {} });
    }

    const settings = await Setting.find().lean();
        const map: Record<string, any> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    return NextResponse.json({ settings: map });
  } catch (error) {
    console.error("[Get Settings Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (!hasPermission(session.role, "manage:settings") && !hasPermission(session.role, "write:cms"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

    await connectDB();
    const updated = await Setting.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, setting: updated });
  } catch (error) {
    console.error("[Save Setting Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
