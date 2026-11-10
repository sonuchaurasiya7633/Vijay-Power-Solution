"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import toast from "@/lib/toast";
import {
  LayoutDashboard,
  LayoutGrid,
  Sliders,
  Building2,
  Wrench,
  Package,
  Camera,
  FolderGit2,
  Phone,
  Landmark,
  FileCode2,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Megaphone,
  FileText,
  Sparkles,
  MapPin,
  Users,
  Kanban,
  ClipboardCheck,
  FileSpreadsheet,
  HardHat,
  Globe,
  Settings,
  ShieldCheck,
  History,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface AdminSidebarProps {
  userRole?: string;
  userName?: string;
  collapsed?: boolean;
  setCollapsed?: (val: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
}

export default function AdminSidebar({
  userRole = "admin",
  userName = "Staff",
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Strict SaaS Sidebar Hierarchy per master instructions
  const navGroups = [
    {
      group: "MAIN",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      group: "WEBSITE MANAGEMENT",
      items: [
        { label: "All Pages", href: "/admin/cms", icon: LayoutGrid, badge: "Hub" },
        { label: "Homepage", href: "/admin/cms/home", icon: Sliders },
        { label: "About Us", href: "/admin/cms/about", icon: Building2 },
        { label: "Services", href: "/admin/services", icon: Wrench },
        { label: "Solar Products", href: "/admin/products", icon: Package },
        { label: "Projects & Gallery", href: "/admin/gallery", icon: Camera },
        { label: "Contact Page", href: "/admin/cms/contact", icon: Phone },
        { label: "Subsidy Guide", href: "/admin/cms/subsidy", icon: Landmark },
        { label: "Custom Pages", href: "/admin/pages", icon: FileCode2 },
      ],
    },
    {
      group: "CONTENT & MEDIA",
      items: [
        { label: "Media Library", href: "/admin/media", icon: ImageIcon },
        { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
        { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
        { label: "Header & Footer", href: "/admin/cms/header-footer", icon: Megaphone },
        { label: "Educational Blogs", href: "/admin/blogs", icon: FileText },
        { label: "Solar Solutions", href: "/admin/solutions", icon: Sparkles },
        { label: "Service Areas", href: "/admin/service-areas", icon: MapPin },
      ],
    },
    {
      group: "BUSINESS MANAGEMENT",
      items: [
        { label: "Customer Leads", href: "/admin/leads", icon: Users },
        { label: "Pipeline Funnel", href: "/admin/pipeline", icon: Kanban },
        { label: "Site Surveys", href: "/admin/surveys", icon: ClipboardCheck },
        { label: "Quotations", href: "/admin/quotations", icon: FileSpreadsheet },
        { label: "Installation Jobs", href: "/admin/installations", icon: HardHat },
      ],
    },
    {
      group: "SEO & SETTINGS",
      items: [
        { label: "SEO Management", href: "/admin/seo", icon: Globe },
        { label: "Website Settings", href: "/admin/settings", icon: Settings },
        { label: "Team & Roles", href: "/admin/team", icon: ShieldCheck },
        { label: "Activity Logs", href: "/admin/activity-logs", icon: History },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.info("Logged out successfully");
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    }
  };

  const isLinkActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin/dashboard";
    if (href === "/admin/cms") return pathname === "/admin/cms";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-50 bg-navy-900 text-slate-300 flex flex-col shrink-0 border-r border-navy-800 transition-all duration-300 ease-in-out select-none shadow-xl lg:shadow-none ${
        /* Mobile drawer classes */
        mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
      } ${
        /* Desktop collapse classes */
        collapsed ? "lg:w-[76px]" : "lg:w-[260px]"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-navy-800 flex items-center justify-between shrink-0">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 overflow-hidden group"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20 shrink-0 shadow-sm">
            <Image src="/images/logo.png" alt="VPS Logo" fill className="object-contain" priority />
          </div>
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2 className="text-sm font-extrabold text-white font-display leading-tight truncate">
                VIJOY POWER
              </h2>
              <span className="text-[10px] font-bold text-solar-green uppercase tracking-wider block">
                Solar Suite • CMS
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Button */}
        {setCollapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 items-center justify-center transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-solar-yellow" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Mobile Close Button */}
        {setMobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 flex items-center justify-center"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {navGroups.map((g, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed ? (
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block">
                {g.group}
              </span>
            ) : (
              <div className="h-px bg-navy-800 mx-2 my-2" />
            )}

            <div className="space-y-0.5 mt-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const active = isLinkActive(item.href);

                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      className={`flex items-center ${
                        collapsed ? "justify-center px-2" : "justify-between px-3"
                      } py-2 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? "bg-solar-green text-white shadow-sm font-bold"
                          : "text-slate-300 hover:bg-navy-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {!collapsed && item.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-solar-yellow/20 text-solar-yellow border border-solar-yellow/30 shrink-0">
                          {item.badge}
                        </span>
                      )}

                      {!collapsed && active && !item.badge && (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                      )}
                    </Link>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {collapsed && (
                      <div className="hidden lg:group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-navy-950 text-white text-xs font-semibold rounded-lg shadow-xl border border-navy-700 whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                        {item.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-navy-800 bg-navy-900/90 shrink-0">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div className="overflow-hidden pr-2">
              <p className="text-xs font-bold text-white truncate">{userName}</p>
              <span className="text-[10px] text-solar-yellow uppercase font-semibold">
                {userRole.replace(/_/g, " ")}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-xl bg-navy-800 text-slate-400 hover:text-red-400 hover:bg-navy-700 transition-colors shrink-0"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
