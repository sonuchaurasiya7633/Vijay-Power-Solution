"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  Menu,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface AdminHeaderProps {
  userName?: string;
  userRole?: string;
  collapsed?: boolean;
  setCollapsed?: (val: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
}

export default function AdminHeader({
  userName = "Administrator",
  userRole = "super_admin",
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: AdminHeaderProps) {
  const pathname = usePathname();

  // Create clean breadcrumbs from pathname
  const segments = pathname
    .replace(/^\/admin/, "")
    .split("/")
    .filter(Boolean);

  const getBreadcrumbLabel = (seg: string) => {
    switch (seg) {
      case "cms":
        return "Website CMS";
      case "products":
        return "Solar Panels (10W-730W)";
      case "services":
        return "EPC Services";
      case "solutions":
        return "Solar Solutions";
      case "gallery":
        return "Installation Gallery";
      case "projects":
        return "Projects Portfolio";
      case "leads":
        return "Lead CRM";
      case "pipeline":
        return "Pipeline Funnel";
      case "media":
        return "Media Library";
      case "seo":
        return "SEO Manager";
      case "header-footer":
        return "Header & Footer Shell";
      case "subsidy":
        return "PM Surya Ghar Subsidy";
      case "service-areas":
        return "Pan India Service Areas";
      default:
        return seg.replace(/-/g, " ");
    }
  };

  const pageTitle =
    segments.length > 0
      ? getBreadcrumbLabel(segments[segments.length - 1])
      : "Executive Dashboard";

  return (
    <header className="h-16 bg-white border-b border-slate-border px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
      {/* Left: Mobile Hamburger + Desktop Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        {setMobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-border text-navy-800 flex items-center justify-center hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Collapse Toggle */}
        {setCollapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-9 h-9 rounded-xl text-slate-400 hover:text-navy-800 hover:bg-slate-100 items-center justify-center transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-solar-green" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Breadcrumb Hierarchy */}
        <div className="flex items-center gap-1.5 text-xs text-slate-muted truncate">
          <Link
            href="/admin/dashboard"
            className="font-bold hover:text-navy-800 transition-colors hidden sm:inline"
          >
            Admin
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline shrink-0" />
          <h1 className="text-sm font-bold text-navy-800 capitalize font-display truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right: View Live Website + User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-bold text-navy-800 hover:text-solar-green flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-border hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <span className="hidden sm:inline">View Public Website</span>
          <span className="sm:hidden">Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="hidden md:block text-left text-xs">
            <span className="font-bold text-navy-800 block leading-tight">{userName}</span>
            <span className="text-[10px] text-slate-muted capitalize font-medium">
              {userRole.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
