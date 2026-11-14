import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createAndBroadcastNotification } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notification = await createAndBroadcastNotification({
      title: "VPS Solar - Test Notification",
      body: `Live notification test for ${session.name || "Admin"} at ${new Date().toLocaleTimeString("en-IN")}. Firebase FCM & In-App system is active!`,
      type: "system",
      link: "/admin/leads",
      metadata: { initiatedBy: session.email, test: true },
    });

    return NextResponse.json({
      success: true,
      message: "Test notification created and broadcasted.",
      notification,
    });
  } catch (error) {
    console.error("[Test Notification Error]", error);
    return NextResponse.json({ error: "Failed to dispatch test notification" }, { status: 500 });
  }
}
