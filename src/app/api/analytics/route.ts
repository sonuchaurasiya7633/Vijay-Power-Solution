import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/connection";
import AnalyticsEvent from "@/models/AnalyticsEvent";
import Lead from "@/models/Lead";
import FollowUp from "@/models/FollowUp";
import SiteSurvey from "@/models/SiteSurvey";
import InstallationJob from "@/models/InstallationJob";
import PortfolioProject from "@/models/PortfolioProject";
import SolarProduct from "@/models/SolarProduct";
import Blog from "@/models/Blog";
import { getSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventName, pagePath, source, medium, campaign, referrer, deviceType, metadata } = body;

    if (!eventName || !pagePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();
    // Save privacy-safe event
    await AnalyticsEvent.create({
      eventName,
      pagePath,
      source,
      medium,
      campaign,
      referrer,
      deviceType,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Track Event Error]", error);
    return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      todayLeads,
      weekLeads,
      monthLeads,
      newLeads,
      wonLeads,
      lostLeads,
      pendingFollowUps,
      scheduledSurveys,
      activeInstallations,
      completedProjects,
      publishedProducts,
      publishedBlogs,
      stateBreakdown,
      stageFunnel,
    ] = await Promise.all([
      Lead.countDocuments({ isArchived: false }),
      Lead.countDocuments({ createdAt: { $gte: startOfToday }, isArchived: false }),
      Lead.countDocuments({ createdAt: { $gte: startOfWeek }, isArchived: false }),
      Lead.countDocuments({ createdAt: { $gte: startOfMonth }, isArchived: false }),
      Lead.countDocuments({ stage: "new_lead", isArchived: false }),
      Lead.countDocuments({ stage: "won", isArchived: false }),
      Lead.countDocuments({ stage: { $in: ["lost", "not_interested"] }, isArchived: false }),
      FollowUp.countDocuments({ status: { $in: ["pending", "due_today", "overdue"] } }),
      SiteSurvey.countDocuments({ status: { $in: ["requested", "scheduled", "assigned"] } }),
      InstallationJob.countDocuments({
        stage: { $in: ["installation_scheduled", "installation_underway", "electrical_inspection", "commissioning"] },
      }),
      PortfolioProject.countDocuments({ isPublished: true }),
      SolarProduct.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: true }),
      Lead.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: "$stage", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return NextResponse.json({
      metrics: {
        totalLeads,
        todayLeads,
        weekLeads,
        monthLeads,
        newLeads,
        wonLeads,
        lostLeads,
        pendingFollowUps,
        scheduledSurveys,
        activeInstallations,
        completedProjects,
        publishedProducts,
        publishedBlogs,
      },
      stateBreakdown,
      stageFunnel,
    });
  } catch (error) {
    console.error("[Get Analytics Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
