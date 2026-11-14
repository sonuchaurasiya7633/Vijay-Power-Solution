import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AdminPushSubscription from "@/models/AdminPushSubscription";
import { getSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();
    if (!token || typeof token !== "string" || token.length < 10) {
      return NextResponse.json({ error: "Valid FCM token is required" }, { status: 400 });
    }

    await connectDB();

    const userAgent = req.headers.get("user-agent") || "unknown";

    await AdminPushSubscription.findOneAndUpdate(
      { token },
      {
        token,
        userId: session.userId,
        userEmail: session.email,
        userAgent,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: "Push subscription active." });
  } catch (error) {
    console.error("[Subscribe Push Token Error]", error);
    return NextResponse.json({ error: "Failed to save push subscription" }, { status: 500 });
  }
}
