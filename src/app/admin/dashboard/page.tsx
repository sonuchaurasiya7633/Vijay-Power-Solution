import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Zap,
  Clock,
  ClipboardCheck,
  CheckCircle2,
  HardHat,
  Package,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";
import connectDB from "@/lib/db/connection";
import Lead from "@/models/Lead";
import FollowUp from "@/models/FollowUp";
import SiteSurvey from "@/models/SiteSurvey";
import InstallationJob from "@/models/InstallationJob";
import PortfolioProject from "@/models/PortfolioProject";
import SolarProduct from "@/models/SolarProduct";
import Blog from "@/models/Blog";
import Page from "@/models/Page";
import InstallationGallery from "@/models/InstallationGallery";
import { formatDateIST } from "@/lib/utils/formatters";
import {
  Sliders,
  LayoutGrid,
  Camera,
  UploadCloud,
  FileCode2,
} from "lucide-react";
import {
  StaggerGrid,
  StaggerItem,
  AnimatedCounter,
  AnimatedProgressBar,
} from "@/components/ui/MotionPrimitives";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Overview Dashboard | VIJOY POWER SOLUTION",
};

export default async function AdminDashboardPage() {
  let totalLeads = 0;
  let todayLeads = 0;
  let weekLeads = 0;
  let monthLeads = 0;
  let newLeads = 0;
  let wonLeads = 0;
  let lostLeads = 0;
  let pendingFollowUps = 0;
  let scheduledSurveys = 0;
  let activeInstallations = 0;
  let completedProjects = 0;
  let publishedProducts = 0;
  let galleryCount = 10;
  let pagesCount = 7;
  let recentLeads: any[] = [];
  let stateBreakdown: any[] = [];

  try {
    await connectDB();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
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
      InstallationGallery.countDocuments({ isPublished: true }),
      Page.countDocuments(),
      Lead.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .limit(6)
        .populate("assignedTo", "name email")
        .lean(),
      Lead.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: "$state", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    totalLeads = tLeads;
    todayLeads = tdLeads;
    weekLeads = wLeads;
    monthLeads = mLeads;
    newLeads = nLeads;
    wonLeads = wnLeads;
    lostLeads = lLeads;
    pendingFollowUps = pFollowUps;
    scheduledSurveys = sSurveys;
    activeInstallations = aInstallations;
    completedProjects = cProjects;
    publishedProducts = pProducts;
    galleryCount = gCount;
    pagesCount = pgCount || 7;
    recentLeads = rLeads;
    stateBreakdown = sBreakdown;
  } catch (err) {
    console.warn("DB offline during build, using defaults");
  }

  const cards = [
    { label: "Total Public Pages", value: pagesCount, icon: FileCode2, color: "text-navy-800", bg: "bg-navy-50", link: "/admin/cms" },
    { label: "Total Leads", value: totalLeads, icon: Users, color: "text-navy-700", bg: "bg-navy-50", link: "/admin/leads" },
    { label: "New Leads (Uncontacted)", value: newLeads, icon: Zap, color: "text-solar-green", bg: "bg-solar-green-light", link: "/admin/leads?stage=new_lead" },
    { label: "Today's Enquiries", value: todayLeads, icon: Calendar, color: "text-solar-yellow-hover", bg: "bg-solar-yellow-light", link: "/admin/leads" },
    { label: "Gallery Installations", value: galleryCount, icon: Camera, color: "text-navy-800", bg: "bg-navy-50", link: "/admin/gallery" },
    { label: "Active Installations", value: activeInstallations, icon: HardHat, color: "text-solar-green", bg: "bg-solar-green-light", link: "/admin/installations" },
    { label: "Won Customers", value: wonLeads, icon: CheckCircle2, color: "text-solar-green", bg: "bg-solar-green-light", link: "/admin/leads?stage=won" },
    { label: "Catalogue Products", value: publishedProducts, icon: Package, color: "text-navy-700", bg: "bg-navy-50", link: "/admin/products" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Live Executive Overview</span>
          <h2 className="text-2xl font-bold font-display text-navy-800">
            Solar Operations & CRM Dashboard
          </h2>
          <p className="text-xs text-slate-muted mt-0.5">
            Real-time pipeline metrics, pending surveys, and active installations across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pipeline"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors"
          >
            Open Visual Pipeline
          </Link>
          <Link
            href="/admin/leads"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover transition-colors shadow-sm"
          >
            Manage All Leads
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-muted block mb-2 px-1">
          Quick Management Actions
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <Link
            href="/admin/cms/home"
            className="p-3 rounded-xl bg-slate-50 hover:bg-solar-green-light hover:text-solar-green border border-slate-border/80 flex items-center gap-2.5 text-xs font-bold text-navy-800 transition-all group"
          >
            <Sliders className="w-4 h-4 text-solar-green group-hover:scale-110 transition-transform" />
            <span className="truncate">Manage Homepage</span>
          </Link>

          <Link
            href="/admin/cms"
            className="p-3 rounded-xl bg-slate-bg hover:bg-solar-green-light hover:text-solar-green border border-slate-border flex items-center gap-2.5 text-xs font-bold text-navy-800 transition-all group"
          >
            <LayoutGrid className="w-4 h-4 text-navy-800 group-hover:text-solar-green group-hover:scale-110 transition-transform" />
            <span className="truncate">Website All Pages</span>
          </Link>

          <Link
            href="/admin/media"
            className="p-3 rounded-xl bg-slate-bg hover:bg-solar-green-light hover:text-solar-green border border-slate-border flex items-center gap-2.5 text-xs font-bold text-navy-800 transition-all group"
          >
            <UploadCloud className="w-4 h-4 text-navy-700 group-hover:scale-110 transition-transform" />
            <span className="truncate">Upload Images</span>
          </Link>

          <Link
            href="/admin/gallery"
            className="p-3 rounded-xl bg-slate-bg hover:bg-solar-green-light hover:text-solar-green border border-slate-border flex items-center gap-2.5 text-xs font-bold text-navy-800 transition-all group"
          >
            <Camera className="w-4 h-4 text-solar-yellow-hover group-hover:scale-110 transition-transform" />
            <span className="truncate">Customer Gallery</span>
          </Link>

          <Link
            href="/admin/leads"
            className="p-3 rounded-xl bg-slate-bg hover:bg-solar-green-light hover:text-solar-green border border-slate-border flex items-center gap-2.5 text-xs font-bold text-navy-800 transition-all group"
          >
            <Users className="w-4 h-4 text-solar-green group-hover:scale-110 transition-transform" />
            <span className="truncate">View Leads ({totalLeads})</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <StaggerItem key={idx} hoverLift>
              <Link
                href={c.link}
                className="h-full bg-white p-5 rounded-2xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-muted">{c.label}</span>
                  <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold font-display text-navy-800">
                    <AnimatedCounter value={c.value} />
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-solar-green transition-colors flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          );
        })}
      </StaggerGrid>

      {/* State breakdown & Pipeline overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* State distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-border shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-800">Geographic Lead Distribution</h3>
            <span className="text-xs text-slate-muted">By Target State</span>
          </div>
          <div className="space-y-3">
            {stateBreakdown.map((item) => {
              const pct = totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0;
              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-navy-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-solar-green" />
                      <span>{item._id || "Unspecified"}</span>
                    </span>
                    <span className="text-slate-muted font-mono">{item.count} leads ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <AnimatedProgressBar
                      percent={pct}
                      className="h-full bg-solar-green rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations Guide */}
        <div className="lg:col-span-7 bg-navy-800 text-white p-6 rounded-2xl border border-navy-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-2.5 py-0.5 rounded-full">
              Standard Operating Sequence
            </span>
            <h3 className="text-lg font-bold font-display">
              Visitor to Completed Installation Journey
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a visitor submits an enquiry, qualify them promptly. Conduct an on-site survey to inspect roof load and azimuth, draft a private quotation with equipment line items, and convert won jobs to physical installations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-navy-800">
            <div className="p-2.5 rounded-xl bg-navy-800/80">
              <span className="text-[10px] text-slate-400 block">Step 1</span>
              <strong className="text-white">Qualify Lead</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-800/80">
              <span className="text-[10px] text-slate-400 block">Step 2</span>
              <strong className="text-solar-yellow">Survey & Quote</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-navy-800/80">
              <span className="text-[10px] text-slate-400 block">Step 3</span>
              <strong className="text-solar-green">Install & Publish</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy-800">Recent Inbound Solar Enquiries</h3>
            <p className="text-xs text-slate-muted">Showing latest 6 submissions</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-solar-green hover:underline flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
              <tr>
                <th className="p-4">Lead ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Location</th>
                <th className="p-4">Requirement</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentLeads.map((l: any) => (
                <tr key={l._id.toString()} className="hover:bg-slate-bg/60 transition-colors">
                  <td className="p-4 font-mono font-bold text-navy-800">{l.leadId}</td>
                  <td className="p-4 font-bold text-navy-800">{l.fullName}</td>
                  <td className="p-4 text-slate-muted font-mono">{l.phone}</td>
                  <td className="p-4 text-slate-muted">{l.city}, {l.state}</td>
                  <td className="p-4 text-navy-800 font-medium truncate max-w-xs">
                    {l.solarSolutionType || l.productName || "General Solar"}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-solar-green-light text-solar-green uppercase">
                      {l.stage.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/leads/${l._id.toString()}`}
                      className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold transition-colors"
                    >
                      Open Lead
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
