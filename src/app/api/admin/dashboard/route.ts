import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import { getSession } from "@/lib/auth/session";
import "@/models/User";
import Lead from "@/models/Lead";
import FollowUp from "@/models/FollowUp";
import SiteSurvey from "@/models/SiteSurvey";
import InstallationJob from "@/models/InstallationJob";
import PortfolioProject from "@/models/PortfolioProject";
import SolarProduct from "@/models/SolarProduct";
import Page from "@/models/Page";
import InstallationGallery from "@/models/InstallationGallery";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      tLeads,
      tdLeads,
      wLeads,
      mLeads,
      nLeads,
      wnLeads,
      lLeads,
      pFollowUps,
      sSurveys,
      aInstallations,
      cProjects,
      pProducts,
      gCount,
      pgCount,
      rLeads,
      sBreakdown,
    ] = await Promise.all([
      Lead.countDocuments({ isArchived: { $ne: true } }),
      Lead.countDocuments({ createdAt: { $gte: startOfToday }, isArchived: { $ne: true } }),
      Lead.countDocuments({ createdAt: { $gte: startOfWeek }, isArchived: { $ne: true } }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth }, isArchived: { $ne: true } }),
      Lead.countDocuments({ stage: { $in: ["new_lead", "new"] }, isArchived: { $ne: true } }),
      Lead.countDocuments({ stage: "won", isArchived: { $ne: true } }),
      Lead.countDocuments({ stage: { $in: ["lost", "not_interested"] }, isArchived: { $ne: true } }),
      FollowUp.countDocuments({ status: { $in: ["pending", "due_today", "overdue"] } }),
      SiteSurvey.countDocuments({ status: { $in: ["requested", "scheduled", "assigned"] } }),
      InstallationJob.countDocuments({
        stage: { $in: ["installation_scheduled", "installation_underway", "electrical_inspection", "commissioning"] },
      }),
      PortfolioProject.countDocuments({ isPublished: true }),
      SolarProduct.countDocuments({ isPublished: true }),
      InstallationGallery.countDocuments({ isPublished: true }),
      Page.countDocuments(),
      Lead.find({ isArchived: { $ne: true } })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("assignedTo", "name email")
        .lean(),
      Lead.aggregate([
        { $match: { isArchived: { $ne: true } } },
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const sanitizedRecentLeads = (rLeads || []).map((l: any) => ({
      _id: l._id?.toString(),
      leadId: l.leadId || "",
      fullName: l.fullName || "",
      phone: l.phone || "",
      city: l.city || "",
      state: l.state || "",
      solarSolutionType: l.solarSolutionType || l.productName || "General Solar",
      stage: l.stage || "new_lead",
      priority: l.priority || "medium",
      createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(
      {
        metrics: {
          totalLeads: tLeads,
          todayLeads: tdLeads,
          weekLeads: wLeads,
          monthLeads: mLeads,
          newLeads: nLeads,
          wonLeads: wnLeads,
          lostLeads: lLeads,
          pendingFollowUps: pFollowUps,
          scheduledSurveys: sSurveys,
          activeInstallations: aInstallations,
          completedProjects: cProjects,
          publishedProducts: pProducts,
          galleryCount: gCount,
          pagesCount: pgCount || 7,
        },
        recentLeads: sanitizedRecentLeads,
        stateBreakdown: sBreakdown || [],
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[Dashboard API Error]", error);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}
