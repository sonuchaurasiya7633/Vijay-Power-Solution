import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { getSession } from "@/lib/auth/session";
import { comparePassword, hashPassword } from "@/lib/auth/passwords";
import { checkRateLimit, getClientIp, rateLimitResponse } from "@/lib/security/rate-limit";
import { isValidObjectId } from "@/lib/security/sanitize";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isValidObjectId(session.userId)) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const ip = getClientIp(req);
    const rlIp = checkRateLimit(`pwd-change-ip:${ip}`, 10, 15 * 60 * 1000);
    if (!rlIp.allowed) {
      return rateLimitResponse("Too many password update attempts. Please wait a few minutes.", rlIp.retryAfterSec);
    }

    const rlUser = checkRateLimit(`pwd-change-user:${session.userId}`, 5, 15 * 60 * 1000);
    if (!rlUser.allowed) {
      return rateLimitResponse("Too many attempts on this account. Please wait before retrying.", rlUser.retryAfterSec);
    }

    const body = await req.json();
    const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";
    const confirmPassword = typeof body?.confirmPassword === "string" ? body.confirmPassword : "";

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Please provide current password, new password, and confirmation password." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation password do not match." },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(session.userId);
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "User account not found or deactivated." }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: "PASSWORD_CHANGED",
      entityType: "user",
      entityId: user._id.toString(),
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || undefined,
      details: { timestamp: new Date().toISOString() },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. Please use your new password next time you sign in.",
    });
  } catch (error) {
    console.error("[Change Password Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
