import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/models/User";
import AuditLog from "@/models/AuditLog";
import { comparePassword } from "@/lib/auth/passwords";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const ipLimit = checkRateLimit(`login-ip:${ip}`, 25, 15 * 60 * 1000);
    if (!ipLimit.allowed) {
      return rateLimitResponse(
        "Too many login attempts. Please wait a few minutes before retrying.",
        ipLimit.retryAfterSec
      );
    }

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const accountLimit = checkRateLimit(
      `login-acct:${ip}:${email}`,
      10,
      15 * 60 * 1000
    );
    if (!accountLimit.allowed) {
      return rateLimitResponse(
        "Too many failed attempts for this account. Please try again later.",
        accountLimit.retryAfterSec
      );
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials or account is inactive" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = await createSessionToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user._id.toString(),
      ipAddress: ip,
      userAgent: (req.headers.get("user-agent") || "").slice(0, 300),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[Login Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
