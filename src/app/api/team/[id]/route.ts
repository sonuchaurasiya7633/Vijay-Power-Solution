import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User, { type UserRole } from "@/models/User";
import { getSession } from "@/lib/auth/session";
import { validateIdParam } from "@/lib/security/api-helpers";

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "user ID");
    if (idErr) return idErr;

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
    await connectDB();

    const target = await User.findById(params.id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Non-super_admin cannot modify an existing super_admin account
    if (target.role === "super_admin" && session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only Super Admin can modify a Super Admin account" },
        { status: 403 }
      );
    }

    if (
      target.email === "admin@vijoypowersolution.com" &&
      body.isActive === false
    ) {
      return NextResponse.json(
        { error: "Cannot deactivate primary root super administrator" },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (typeof body.name === "string" && body.name.trim()) {
      updates.name = body.name.trim();
    }
    if (typeof body.phone === "string") {
      updates.phone = body.phone.trim();
    }
    if (typeof body.role === "string") {
      const nextRole = body.role as UserRole;
      if (!VALID_ROLES.has(nextRole)) {
        return NextResponse.json(
          { error: "Invalid user role" },
          { status: 400 }
        );
      }
      if (nextRole === "super_admin" && session.role !== "super_admin") {
        return NextResponse.json(
          { error: "Only Super Admin can promote users to super_admin" },
          { status: 403 }
        );
      }
      if (
        target.email === "admin@vijoypowersolution.com" &&
        nextRole !== "super_admin"
      ) {
        return NextResponse.json(
          { error: "Cannot downgrade primary root super administrator" },
          { status: 400 }
        );
      }
      updates.role = nextRole;
    }
    if (typeof body.isActive === "boolean") {
      updates.isActive = body.isActive;
    }
    if (typeof body.password === "string" && body.password.length > 0) {
      if (body.password.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters" },
          { status: 400 }
        );
      }
      const { hashPassword } = await import("@/lib/auth/passwords");
      updates.passwordHash = await hashPassword(body.password);
    }

    const updated = await User.findByIdAndUpdate(
      params.id,
      { $set: updates },
      {
        new: true,
        select: "-passwordHash -passwordResetToken -passwordResetExpires",
      }
    );

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("[Update User Error]", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const idErr = validateIdParam(params.id, "user ID");
    if (idErr) return idErr;

    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Forbidden: Only Super Admin can remove team accounts" },
        { status: 403 }
      );
    }

    await connectDB();
    const target = await User.findById(params.id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (
      target.email === "admin@vijoypowersolution.com" ||
      target._id.toString() === session.userId
    ) {
      return NextResponse.json(
        { error: "Cannot delete primary administrator or own active account" },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Delete User Error]", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
