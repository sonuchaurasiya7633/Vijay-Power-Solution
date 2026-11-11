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
import { requirePermission } from "@/lib/security/api-helpers";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = checkRateLimit(`analytics:${ip}`, 90, 60 * 1000);
    if (!rl.allowed) {
      return rateLimitResponse("Rate limit exceeded", rl.retryAfterSec);
    }

    const body = await req.json();
    const eventName =
      typeof body?.eventName === "string" ? body.eventName.trim().slice(0, 64) : "";
    const pagePath =
      typeof body?.pagePath === "string" ? body.pagePath.trim().slice(0, 256) : "";

    if (!eventName || !pagePath || !pagePath.startsWith("/")) {
      return NextResponse.json(
        { error: "Missing or invalid event fields" },
        { status: 400 }
      );
    }

    const cleanString = (v: unknown, max = 128) =>
      typeof v === "string" ? v.trim().slice(0, max) : undefined;

    let safeMetadata: Record<string, string | number | boolean> | undefined;
    if (body?.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)) {
      safeMetadata = {};
      for (const [k, v] of Object.entries(body.metadata).slice(0, 10)) {
        if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
          safeMetadata[String(k).slice(0, 40)] =
            typeof v === "string" ? v.slice(0, 120) : v;
        }
      }
    }

    await connectDB();
    await AnalyticsEvent.create({
      eventName,
      pagePath,
      source: cleanString(body?.source, 80),
      medium: cleanString(body?.medium, 80),
      campaign: cleanString(body?.campaign, 120),
      referrer: cleanString(body?.referrer, 256),
      deviceType: cleanString(body?.deviceType, 24),
      metadata: safeMetadata,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Track Event Error]", error);
    return NextResponse.json(
      { error: "Failed to record event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const auth = await requirePermission("read:analytics");
    if (!auth.ok) return auth.response;

    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeLeadFilter = { isArchived: { $ne: true } };

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
      Lead.countDocuments(activeLeadFilter),
      Lead.countDocuments({ ...activeLeadFilter, createdAt: { $gte: startOfToday } }),
      Lead.countDocuments({ ...activeLeadFilter, createdAt: { $gte: startOfWeek } }),
      Lead.countDocuments({ ...activeLeadFilter, createdAt: { $gte: startOfMonth } }),
      Lead.countDocuments({
        ...activeLeadFilter,
        stage: { $in: ["new_lead", "new"] },
      }),
      Lead.countDocuments({ ...activeLeadFilter, stage: "won" }),
      Lead.countDocuments({
        ...activeLeadFilter,
        stage: { $in: ["lost", "not_interested"] },
      }),
      FollowUp.countDocuments({
        status: { $in: ["pending", "due_today", "overdue"] },
      }),
      SiteSurvey.countDocuments({
        status: { $in: ["requested", "scheduled", "assigned"] },
      }),
      InstallationJob.countDocuments({
        stage: {
          $in: [
            "installation_scheduled",
            "installation_underway",
            "electrical_inspection",
            "commissioning",
          ],
        },
      }),
      PortfolioProject.countDocuments({ isPublished: true }),
      SolarProduct.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: true }),
      Lead.aggregate([
        { $match: activeLeadFilter },
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Lead.aggregate([
        { $match: activeLeadFilter },
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
