import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import User from "@/models/User";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { isValidObjectId } from "@/lib/security/sanitize";

export async function GET() {
  const session = await getSession();
  if (!session || !isValidObjectId(session.userId)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(
      session.userId,
      "name email role isActive"
    ).lean();

    if (!user || !user.isActive) {
      await clearSessionCookie();
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
