import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/auth/session";
import { isValidObjectId } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({})
        .sort({ createdAt: -1 })
        .limit(30)
        .populate("leadId", "leadId fullName phone city state")
        .lean(),
      Notification.countDocuments({ isRead: false }),
    ]);

    return NextResponse.json(
      {
        notifications,
        unreadCount,
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (error) {
    console.error("[Get Notifications Error]", error);
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    if (body.all) {
      // Mark all notifications as read
      await Notification.updateMany({ isRead: false }, { $set: { isRead: true, readAt: new Date() } });
      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (body.id) {
      if (!isValidObjectId(body.id)) {
        return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
      }
      await Notification.findByIdAndUpdate(body.id, { $set: { isRead: true, readAt: new Date() } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  } catch (error) {
    console.error("[Update Notification Error]", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const clearRead = searchParams.get("clearRead") === "true";

    await connectDB();

    if (clearRead) {
      await Notification.deleteMany({ isRead: true });
      return NextResponse.json({ success: true, message: "Cleared read notifications" });
    }

    if (id) {
      if (!isValidObjectId(id)) {
        return NextResponse.json({ error: "Invalid notification ID" }, { status: 400 });
      }
      await Notification.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: "Notification deleted" });
    }

    return NextResponse.json({ error: "Missing ID or clearRead param" }, { status: 400 });
  } catch (error) {
    console.error("[Delete Notification Error]", error);
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });
  }
}
