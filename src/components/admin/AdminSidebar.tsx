"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  Clock,
  ClipboardCheck,
  FileSpreadsheet,
  HardHat,
  FolderGit2,
  Package,
  Layers,
  Sparkles,
  Wrench,
  MapPin,
  FileText,
  HelpCircle,
  MessageSquareQuote,
  Image as ImageIcon,
  Sliders,
  Globe,
  BarChart3,
  ShieldCheck,
  History,
  Settings,
  ChevronRight,
  LogOut,
  FileCode2,
} from "lucide-react";

interface AdminSidebarProps {
  userRole?: string;
  userName?: string;
}

export default function AdminSidebar({ userRole = "admin", userName = "Staff" }: AdminSidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      group: "CRM & Sales",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "All Leads", href: "/admin/leads", icon: Users },
        { label: "Pipeline Funnel", href: "/admin/pipeline", icon: Kanban },
        { label: "Follow-ups", href: "/admin/follow-ups", icon: Clock },
        { label: "Site Surveys", href: "/admin/surveys", icon: ClipboardCheck },
        { label: "Quotations (Private)", href: "/admin/quotations", icon: FileSpreadsheet },
      ],
    },
    {
      group: "Operations & Projects",
      items: [
        { label: "Installation Jobs", href: "/admin/installations", icon: HardHat },
        { label: "Portfolio Projects", href: "/admin/projects", icon: FolderGit2 },
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      ],
    },
    {
      group: "Catalogue & Content",
      items: [
        { label: "Solar Products", href: "/admin/products", icon: Package },
        { label: "Product Categories", href: "/admin/categories", icon: Layers },
        { label: "Solar Solutions", href: "/admin/solutions", icon: Sparkles },
        { label: "Services", href: "/admin/services", icon: Wrench },
        { label: "Service Areas", href: "/admin/service-areas", icon: MapPin },
        { label: "Blogs & Articles", href: "/admin/blogs", icon: FileText },
        { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
        { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      ],
    },
    {
      group: "CMS & Platform",
      items: [
        { label: "Homepage CMS", href: "/admin/cms/home", icon: Sliders },
        { label: "Pages CMS", href: "/admin/pages", icon: FileCode2 },
        { label: "SEO Manager", href: "/admin/seo", icon: Globe },
        { label: "Analytics & Reports", href: "/admin/analytics", icon: BarChart3 },
        { label: "Team & Roles", href: "/admin/team", icon: ShieldCheck },
        { label: "Activity Logs", href: "/admin/activity-logs", icon: History },
        { label: "Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-navy-900 text-slate-300 flex flex-col shrink-0 border-r border-navy-700 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-800 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20">
          <Image src="/images/logo.png" alt="VPS Logo" fill className="object-contain" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-white font-display leading-tight">
            VIJOY POWER
          </h2>
          <span className="text-[10px] font-bold text-solar-green uppercase tracking-wider block">
            Admin Suite • CRM
          </span>
        </div>
      </div>

      {/* Nav list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
        {navGroups.map((g, idx) => (
          <div key={idx} className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              {g.group}
            </span>
            <div className="space-y-0.5 mt-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-solar-green text-white shadow-sm"
                        : "text-slate-300 hover:bg-navy-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User info & Logout */}
      <div className="p-4 border-t border-navy-800 bg-navy-900/90 flex items-center justify-between">
        <div className="overflow-hidden pr-2">
          <p className="text-xs font-bold text-white truncate">{userName}</p>
          <span className="text-[10px] text-solar-yellow uppercase font-semibold">
            {userRole.replace(/_/g, " ")}
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-lg bg-navy-800 text-slate-400 hover:text-red-400 hover:bg-navy-700 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
