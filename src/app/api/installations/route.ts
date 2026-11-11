import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import InstallationJob from "@/models/InstallationJob";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import PortfolioProject from "@/models/PortfolioProject";
import "@/models/User";
import { getSession } from "@/lib/auth/session";
import { hasPermission } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "read:installations")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const jobs = await InstallationJob.find()
      .sort({ createdAt: -1 })
      .populate("assignedManager", "name email")
      .populate("leadTechnician", "name email phone")
      .populate("leadId", "leadId fullName phone city state")
      .lean();

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[Get Installations Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.role, "write:installations")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      leadId,
      customerName,
      customerPhone,
      installationAddress,
      state,
      city,
      systemCapacityKw,
      solarPanelBrandModel,
      solarPanelQuantity,
      inverterBrandModel,
      assignedManager,
      leadTechnician,
      startDate,
      scheduledCompletionDate,
      installationNotes,
    } = body;

    if (!leadId || !customerName || !systemCapacityKw || !installationAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    const count = await InstallationJob.countDocuments();
    const jobId = `VPS-JOB-${String(1001 + count).padStart(4, "0")}`;

    const job = await InstallationJob.create({
      jobId,
      leadId,
      customerName,
      customerPhone,
      installationAddress,
      state,
      city,
      systemCapacityKw,
      solarPanelBrandModel,
      solarPanelQuantity,
      inverterBrandModel,
      assignedManager: assignedManager || session.userId,
      leadTechnician: leadTechnician || undefined,
      stage: "customer_confirmed",
      startDate: startDate ? new Date(startDate) : undefined,
      scheduledCompletionDate: scheduledCompletionDate ? new Date(scheduledCompletionDate) : undefined,
      installationNotes,
    });

    await Lead.findByIdAndUpdate(leadId, { stage: "installation_scheduled" });

    await LeadActivity.create({
      leadId,
      performedBy: session.userId,
      activityType: "installation_converted",
      title: `Converted to Installation Project: ${jobId}`,
      description: `Project setup for ${systemCapacityKw} kW rooftop installation at ${city}, ${state}.`,
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("[Create Installation Job Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
