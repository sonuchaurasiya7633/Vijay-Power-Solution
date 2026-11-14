"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Kanban, ArrowRight, Phone, MapPin, RefreshCw } from "lucide-react";
import { AdminTableSkeleton } from "@/components/ui/SkeletonLoaders";

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("Just now");
  const isFetchingRef = useRef(false);

  const fetchLeads = useCallback(async (silent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (!silent) setLoading(true);
    else setIsSyncing(true);

    try {
      const res = await fetch("/api/leads?limit=100", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        const now = new Date();
        setLastSyncTime(
          now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })
        );
      }
    } catch (err) {
      console.error("Fetch pipeline error:", err);
    } finally {
      isFetchingRef.current = false;
      if (!silent) setLoading(false);
      else setIsSyncing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchLeads(false);
  }, [fetchLeads]);

  // Real-time background auto-polling & focus sync
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

  const stages = [
    { key: "new_lead", label: "New Lead", color: "border-navy-600" },
    { key: "contacted", label: "Contacted", color: "border-solar-yellow" },
    { key: "qualified", label: "Qualified", color: "border-navy-700" },
    { key: "site_survey_scheduled", label: "Survey Scheduled", color: "border-navy-800" },
    { key: "quotation_sent", label: "Quotation Sent", color: "border-solar-yellow-hover" },
    { key: "won", label: "Won Customer", color: "border-solar-green" },
  ];

  return (
    <div className="space-y-6">
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
              Auto-syncs live &bull; Updated: {lastSyncTime}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Lead Pipeline Stages
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Monitor enquiry progression from inbound discovery to physical commissioning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchLeads(false)}
            disabled={isSyncing || loading}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-border text-navy-800 hover:bg-slate-bg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            title="Refresh pipeline live without reloading the page"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-solar-green ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing..." : "Sync Live"}</span>
          </button>
          <Link
            href="/admin/leads"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors"
          >
            Table Grid View
          </Link>
        </div>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={5} />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {stages.map((st) => {
            const aliases: Record<string, string[]> = {
              new_lead: ["new_lead", "new"],
              site_survey_scheduled: ["site_survey_scheduled", "survey_scheduled"],
              site_survey_completed: ["site_survey_completed", "survey_completed"],
              installation_completed: ["installation_completed", "completed"],
            };
            const accepted = aliases[st.key] || [st.key];
            const stageLeads = leads.filter((l) => accepted.includes(l.stage));
            return (
              <div
                key={st.key}
                className="w-72 shrink-0 bg-slate-bg/70 rounded-2xl p-4 border border-slate-border flex flex-col max-h-[75vh]"
              >
                <div className={`flex items-center justify-between pb-3 mb-3 border-b-2 ${st.color}`}>
                  <h3 className="text-xs font-bold text-navy-800 uppercase tracking-wide">
                    {st.label}
                  </h3>
                  <span className="text-xs font-extrabold text-navy-800 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin pr-1">
                  {stageLeads.length === 0 ? (
                    <p className="text-[11px] text-slate-400 text-center py-8">
                      No leads in this stage
                    </p>
                  ) : (
                    stageLeads.map((lead) => (
                      <Link
                        key={lead._id}
                        href={`/admin/leads/${lead._id}`}
                        className="block bg-white p-4 rounded-xl border border-slate-border hover:border-solar-green hover:shadow-md transition-all space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-muted">
                            {lead.leadId}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              lead.priority === "urgent"
                                ? "bg-red-100 text-red-700"
                                : lead.priority === "high"
                                ? "bg-solar-yellow-light text-solar-yellow-hover"
                                : "bg-slate-bg text-slate-main"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-navy-800 group-hover:text-solar-green transition-colors">
                          {lead.fullName}
                        </h4>

                        <div className="flex items-center gap-1 text-[11px] text-slate-muted">
                          <MapPin className="w-3 h-3 text-solar-green shrink-0" />
                          <span className="truncate">
                            {lead.city ? `${lead.city}, ` : ""}{lead.state}
                          </span>
                        </div>

                        <div className="text-[11px] font-medium text-navy-800 bg-slate-bg p-2 rounded-lg truncate">
                          {lead.solarSolutionType || lead.productName || "General Solar"}
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
