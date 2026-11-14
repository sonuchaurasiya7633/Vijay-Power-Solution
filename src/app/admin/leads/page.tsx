"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";
import { AdminTableSkeleton } from "@/components/ui/SkeletonLoaders";

function LeadsCRMContent() {
  const searchParams = useSearchParams();
  const initialStage = searchParams.get("stage") || "all";
  const initialState = searchParams.get("state") || "all";
  const initialPriority = searchParams.get("priority") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [stageFilter, setStageFilter] = useState(initialStage);
  const [priorityFilter, setPriorityFilter] = useState(initialPriority);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });

  const isFetchingRef = useRef(false);

  // Sync state if URL query params change externally
  useEffect(() => {
    const stageParam = searchParams.get("stage");
    if (stageParam) {
      setStageFilter((prev) => (stageParam !== prev ? stageParam : prev));
    }
  }, [searchParams]);

  // Live debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchLeads = useCallback(
    async (silent = false, signal?: AbortSignal) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (!silent) {
        setLoading(true);
      } else {
        setIsSyncing(true);
      }
      setErrorMsg(null);

      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (stageFilter !== "all") params.set("stage", stageFilter);
        if (priorityFilter !== "all") params.set("priority", priorityFilter);
        if (stateFilter !== "all") params.set("state", stateFilter);
        params.set("page", String(page));

        const res = await fetch(`/api/leads?${params.toString()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
          signal,
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load leads");
        }
        setLeads(data.leads || []);
        setPagination(data.pagination || { page, limit: 25, total: 0, totalPages: 1 });
        const now = new Date();
        setLastSyncTime(
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Fetch leads error:", err);
        if (!silent) {
          setErrorMsg(err?.message || "Unable to fetch leads right now.");
        }
      } finally {
        isFetchingRef.current = false;
        if (!signal?.aborted) {
          setLoading(false);
          setIsSyncing(false);
        }
      }
    },
    [debouncedSearch, stageFilter, priorityFilter, stateFilter, page]
  );

  // Initial and filter-change fetch
  useEffect(() => {
    const controller = new AbortController();
    fetchLeads(false, controller.signal);
    return () => controller.abort();
  }, [fetchLeads]);

  // Real-time background polling & auto-sync on tab switch/focus
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLeads(true);
      }
    }, 12000);

    const handleFocus = () => fetchLeads(true);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchLeads(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchLeads]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(searchInput.trim());
    setPage(1);
  };

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStageFilter("all");
    setPriorityFilter("all");
    setStateFilter("all");
    setPage(1);
  };

  const hasActiveFilters =
    Boolean(debouncedSearch) ||
    stageFilter !== "all" ||
    priorityFilter !== "all" ||
    stateFilter !== "all";

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      "Lead ID",
      "Name",
      "Phone",
      "City",
      "State",
      "Customer Type",
      "Solution",
      "Stage",
      "Priority",
      "Created At",
    ];
    const rows = leads.map((l) => [
      l.leadId,
      `"${l.fullName}"`,
      l.phone,
      `"${l.city}"`,
      `"${l.state}"`,
      l.customerType,
      `"${l.solarSolutionType || l.productName || "General"}"`,
      l.stage,
      l.priority,
      formatDateIST(l.createdAt),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `VPS_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-solar-green-light text-solar-green border border-solar-green/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solar-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-solar-green"></span>
              </span>
              Live Sync Active
            </span>
            <span className="text-[11px] text-slate-muted">
              Auto-syncs live &bull; Last updated: {lastSyncTime}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Inbound Solar Enquiries & Lead Tracking
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Total active leads: <strong>{pagination.total}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchLeads(false)}
            disabled={isSyncing || loading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-border text-navy-800 hover:bg-slate-bg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh leads live without reloading the page"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-solar-green ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Live"}</span>
          </button>
          <button
            type="button"
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-border text-navy-800 hover:bg-slate-bg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/admin/pipeline"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors"
          >
            Kanban View
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-muted absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by Lead ID, Customer Name, Phone, City, or State..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-border focus:border-solar-green outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => {
              setStageFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-border bg-white text-navy-800 font-semibold outline-none"
          >
            <option value="all">All Stages</option>
            <option value="new_lead">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="site_survey_scheduled">Survey Scheduled</option>
            <option value="site_survey_completed">Survey Completed</option>
            <option value="quotation_sent">Quotation Sent</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Won Customer</option>
            <option value="installation_in_progress">Installation In Progress</option>
            <option value="installation_completed">Completed</option>
            <option value="lost">Lost / Inactive</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-border bg-white text-navy-800 font-semibold outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* State filter */}
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-border bg-white text-navy-800 font-semibold outline-none"
          >
            <option value="all">All States & UTs</option>
            {INDIAN_STATES_AND_UTS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="py-2 px-3 rounded-xl border border-slate-border bg-slate-bg hover:bg-slate-border/60 text-navy-800 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <AdminTableSkeleton rows={6} />
        ) : errorMsg ? (
          <div className="p-14 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">Failed to load leads</h3>
            <p className="text-xs text-slate-muted">{errorMsg}</p>
            <button
              type="button"
              onClick={() => fetchLeads(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover transition-colors cursor-pointer"
            >
              Retry Loading Leads
            </button>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No leads found</h3>
            <p className="text-xs text-slate-muted">
              {hasActiveFilters
                ? "Try adjusting or resetting your stage, priority, or state filters."
                : "No inbound leads have been recorded yet."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors cursor-pointer"
              >
                Show All Leads
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                  <tr>
                    <th className="p-4">Lead ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Requirement</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Stage</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((l) => (
                    <tr key={l._id} className="hover:bg-slate-bg/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-navy-800">{l.leadId}</td>
                      <td className="p-4">
                        <span className="font-bold text-navy-800 block">{l.fullName}</span>
                        <span className="text-[10px] text-slate-muted capitalize">
                          {l.customerType}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-muted">{l.phone}</td>
                      <td className="p-4 text-slate-muted">
                        {l.city ? `${l.city}, ` : ""}{l.state}
                      </td>
                      <td className="p-4 text-navy-800 font-medium truncate max-w-xs">
                        {l.solarSolutionType || l.productName || "General Solar"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            l.priority === "urgent"
                              ? "bg-red-100 text-red-700"
                              : l.priority === "high"
                              ? "bg-solar-yellow-light text-solar-yellow-hover"
                              : "bg-slate-bg text-slate-main"
                          }`}
                        >
                          {l.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-solar-green-light text-solar-green uppercase">
                          {(l.stage || "new_lead").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4 text-slate-muted">{formatDateIST(l.createdAt)}</td>
                      <td className="p-4">
                        <Link
                          href={`/admin/leads/${l._id}`}
                          className="px-2.5 py-1 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold transition-colors inline-block"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-border bg-slate-bg/60 flex items-center justify-between text-xs">
                <span className="text-slate-muted font-medium">
                  Page <strong className="text-navy-800">{pagination.page}</strong> of{" "}
                  <strong className="text-navy-800">{pagination.totalPages}</strong> (
                  {pagination.total} total leads)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-border bg-white text-navy-800 font-bold disabled:opacity-40 hover:bg-slate-bg inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-border bg-white text-navy-800 font-bold disabled:opacity-40 hover:bg-slate-bg inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function LeadsCRMPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton rows={8} />}>
      <LeadsCRMContent />
    </Suspense>
  );
}
