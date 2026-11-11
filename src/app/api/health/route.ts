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
    console.error("[Health Check Error]", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "unreachable",
      },
      { status: 503 }
    );
  }
}
