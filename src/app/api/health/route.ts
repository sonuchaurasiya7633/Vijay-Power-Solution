import { NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      service: "VIJOY POWER SOLUTION API",
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 503 }
    );
  }
}
