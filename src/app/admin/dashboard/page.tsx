import type { Metadata } from "next";
import connectDB from "@/lib/db/connection";
import "@/models/User";
import Lead from "@/models/Lead";
import FollowUp from "@/models/FollowUp";
import SiteSurvey from "@/models/SiteSurvey";
import InstallationJob from "@/models/InstallationJob";
import PortfolioProject from "@/models/PortfolioProject";
import SolarProduct from "@/models/SolarProduct";
import Page from "@/models/Page";
import InstallationGallery from "@/models/InstallationGallery";
import DashboardLiveView, {
  DashboardMetrics,
  RecentLeadItem,
  StateBreakdownItem,
} from "@/components/admin/DashboardLiveView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Overview Dashboard | VIJOY POWER SOLUTION",
};

export default async function AdminDashboardPage() {
  const initialMetrics: DashboardMetrics = {
    totalLeads: 0,
    todayLeads: 0,
    weekLeads: 0,
    monthLeads: 0,
    newLeads: 0,
    wonLeads: 0,
    lostLeads: 0,
    pendingFollowUps: 0,
    scheduledSurveys: 0,
    activeInstallations: 0,
    completedProjects: 0,
    publishedProducts: 0,
    galleryCount: 10,
    pagesCount: 7,
  };
  let initialRecentLeads: RecentLeadItem[] = [];
  let initialStateBreakdown: StateBreakdownItem[] = [];

  try {
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

    initialMetrics.totalLeads = tLeads;
    initialMetrics.todayLeads = tdLeads;
    initialMetrics.weekLeads = wLeads;
    initialMetrics.monthLeads = mLeads;
    initialMetrics.newLeads = nLeads;
    initialMetrics.wonLeads = wnLeads;
    initialMetrics.lostLeads = lLeads;
    initialMetrics.pendingFollowUps = pFollowUps;
    initialMetrics.scheduledSurveys = sSurveys;
    initialMetrics.activeInstallations = aInstallations;
    initialMetrics.completedProjects = cProjects;
    initialMetrics.publishedProducts = pProducts;
    initialMetrics.galleryCount = gCount;
    initialMetrics.pagesCount = pgCount || 7;

    initialRecentLeads = (rLeads || []).map((l: any) => ({
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

    initialStateBreakdown = (sBreakdown || []).map((item: any) => ({
      _id: item._id || "Unspecified",
      count: Number(item.count || 0),
    }));
  } catch (err) {
    console.error("[Dashboard Load Error]", err);
  }

  return (
    <DashboardLiveView
      initialMetrics={initialMetrics}
      initialRecentLeads={initialRecentLeads}
      initialStateBreakdown={initialStateBreakdown}
    />
  );
}
