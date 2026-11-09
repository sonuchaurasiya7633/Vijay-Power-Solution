import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/models/User";
import { getSession } from "@/lib/auth/session";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "super_admin" && session.role !== "admin")) {
      return NextResponse.json({ error: "Forbidden: Super Admin or Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    // Prevent removing super_admin status from the main admin
    const target = await User.findById(params.id);
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (target.email === "admin@vijoypowersolution.com" && body.isActive === false) {
      return NextResponse.json({ error: "Cannot deactivate primary root super administrator" }, { status: 400 });
    }

    const updates: any = {};
    if (typeof body.name === "string") updates.name = body.name.trim();
    if (typeof body.phone === "string") updates.phone = body.phone.trim();
    if (typeof body.role === "string") updates.role = body.role;
    if (typeof body.isActive === "boolean") updates.isActive = body.isActive;
    if (body.password && body.password.length >= 6) {
      const { hashPassword } = await import("@/lib/auth/passwords");
      updates.passwordHash = await hashPassword(body.password);
    }

    const updated = await User.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, select: "-passwordHash" }
    );

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    console.error("[Update User Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden: Only Super Admin can remove team accounts" }, { status: 403 });
    }

    await connectDB();
    const target = await User.findById(params.id);
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (target.email === "admin@vijoypowersolution.com") {
      return NextResponse.json({ error: "Cannot delete primary root super administrator" }, { status: 400 });
    }

    await User.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Delete User Error]", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
