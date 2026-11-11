import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User, { type UserRole } from "@/models/User";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";
import { hashPassword } from "@/lib/auth/passwords";

const VALID_ROLES = new Set<UserRole>([
  "super_admin",
  "admin",
  "sales_manager",
  "sales_executive",
  "installation_manager",
  "technician",
  "content_editor",
  "viewer",
]);

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only staff managing teams, leads, surveys, or installations may query staff lists
    const canListTeam =
      hasPermission(session.role, "manage:team") ||
      hasPermission(session.role, "assign:leads") ||
      hasPermission(session.role, "write:surveys") ||
      hasPermission(session.role, "write:installations");

    if (!canListTeam) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const users = await User.find(
      {},
      { passwordHash: 0, passwordResetToken: 0, passwordResetExpires: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[Get Team Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      (session.role !== "super_admin" && session.role !== "admin")
    ) {
      return NextResponse.json(
        { error: "Forbidden: Super Admin or Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email =
      typeof body?.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const role = body?.role as UserRole;
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.has(role)) {
      return NextResponse.json(
        { error: "Invalid user role specified" },
        { status: 400 }
      );
    }

    // Prevent privilege escalation: only super_admin can create another super_admin
    if (role === "super_admin" && session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only Super Admin can assign the super_admin role" },
        { status: 403 }
      );
    }

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      phone,
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isActive: user.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Create Team Member Error]", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
