import React from "react";

/**
 * Hero + Card Grid skeleton tailored to VPS Solar public pages.
 */
export function PublicPageSkeleton() {
  return (
    <div className="bg-slate-bg min-h-[70vh]" role="status" aria-busy="true" aria-label="Loading page content">
      {/* Navy Header Band */}
      <div className="bg-navy-800 py-14 sm:py-16 border-b border-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="h-6 w-44 rounded-full vps-skeleton-dark" />
          <div className="h-9 sm:h-11 w-3/4 max-w-xl rounded-xl vps-skeleton-dark" />
          <div className="h-4 w-2/3 max-w-2xl rounded-lg vps-skeleton-dark" />
        </div>
      </div>

      {/* Main Section Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full vps-skeleton" />
            <div className="h-7 w-64 rounded-lg vps-skeleton" />
          </div>
          <div className="h-9 w-40 rounded-xl vps-skeleton" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-border bg-white overflow-hidden shadow-sm"
            >
              <div className="h-48 w-full vps-skeleton" />
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded-full vps-skeleton" />
                  <div className="h-4 w-14 rounded-full vps-skeleton" />
                </div>
                <div className="h-5 w-4/5 rounded-lg vps-skeleton" />
                <div className="h-3.5 w-full rounded vps-skeleton" />
                <div className="h-3.5 w-2/3 rounded vps-skeleton" />
                <div className="h-10 w-full rounded-xl vps-skeleton mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Detail page skeleton for slug routes (product / project / blog / service).
 */
export function PublicDetailSkeleton() {
  return (
    <div className="bg-slate-bg min-h-[70vh]" role="status" aria-busy="true" aria-label="Loading page details">
      <div className="bg-navy-800 py-12 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="h-4 w-36 rounded-full vps-skeleton-dark" />
          <div className="h-10 w-3/4 max-w-2xl rounded-xl vps-skeleton-dark" />
          <div className="h-4 w-1/2 max-w-lg rounded vps-skeleton-dark" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-border p-6 sm:p-8 space-y-6">
          <div className="h-72 sm:h-96 w-full rounded-2xl vps-skeleton" />
          <div className="space-y-3">
            <div className="h-5 w-1/2 rounded-lg vps-skeleton" />
            <div className="h-4 w-full rounded vps-skeleton" />
            <div className="h-4 w-full rounded vps-skeleton" />
            <div className="h-4 w-4/5 rounded vps-skeleton" />
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-border p-6 space-y-4 h-fit">
          <div className="h-6 w-40 rounded-lg vps-skeleton" />
          <div className="h-24 w-full rounded-xl vps-skeleton" />
          <div className="h-11 w-full rounded-xl vps-skeleton" />
          <div className="h-11 w-full rounded-xl vps-skeleton" />
        </div>
      </div>
    </div>
  );
}

/**
 * 4-column Solar Panel Product card skeleton matching ProductWattageShowcase dimensions.
 */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading solar panels"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white border border-slate-border overflow-hidden flex flex-col"
        >
          <div className="h-48 w-full vps-skeleton" />
          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-20 rounded-full vps-skeleton" />
                <div className="h-4 w-16 rounded-full vps-skeleton" />
              </div>
              <div className="h-5 w-4/5 rounded-lg vps-skeleton" />
              <div className="h-3.5 w-full rounded vps-skeleton" />
              <div className="h-3.5 w-3/4 rounded vps-skeleton" />
            </div>
            <div className="pt-3 border-t border-slate-border flex items-center justify-between gap-2">
              <div className="h-9 flex-1 rounded-xl vps-skeleton" />
              <div className="h-9 w-9 rounded-xl vps-skeleton" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Admin CMS & Dashboard skeleton mirroring header + KPI grid + data list rows.
 */
export function AdminWorkspaceSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading admin workspace">
      <div className="bg-white p-6 rounded-2xl border border-slate-border flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-36 rounded-full vps-skeleton" />
          <div className="h-7 w-60 rounded-lg vps-skeleton" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 rounded-xl vps-skeleton" />
          <div className="h-9 w-36 rounded-xl vps-skeleton" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl vps-skeleton" />
              <div className="h-4 w-14 rounded-full vps-skeleton" />
            </div>
            <div className="h-7 w-20 rounded-lg vps-skeleton" />
            <div className="h-3 w-28 rounded vps-skeleton" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-border p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-border">
          <div className="h-5 w-44 rounded-lg vps-skeleton" />
          <div className="h-8 w-48 rounded-xl vps-skeleton" />
        </div>
        {[1, 2, 3, 4, 5].map((r) => (
          <div key={r} className="h-14 w-full rounded-xl vps-skeleton" />
        ))}
      </div>
    </div>
  );
}

/**
 * Lightweight Admin Table / List skeleton for client-fetched management tabs.
 */
export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-border p-5 space-y-3"
      role="status"
      aria-busy="true"
      aria-label="Loading records"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-border">
        <div className="h-4 w-36 rounded vps-skeleton" />
        <div className="h-4 w-20 rounded vps-skeleton" />
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="h-14 w-full rounded-xl vps-skeleton" />
      ))}
    </div>
  );
}
