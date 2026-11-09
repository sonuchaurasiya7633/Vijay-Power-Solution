"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Bell, User } from "lucide-react";

export default function AdminHeader({ userName = "Administrator", userRole = "super_admin" }: { userName?: string; userRole?: string }) {
  const pathname = usePathname();
  const pageTitle = pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard";

  return (
    <header className="h-16 bg-white border-b border-slate-border px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-navy-800 capitalize font-display">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold text-slate-muted hover:text-navy-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-border hover:bg-slate-50 transition-colors"
        >
          <span>View Live Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-solar-green-light text-solar-green flex items-center justify-center font-bold text-xs">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left text-xs">
            <span className="font-bold text-navy-800 block leading-tight">{userName}</span>
            <span className="text-[10px] text-slate-muted capitalize font-medium">{userRole.replace(/_/g, " ")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
