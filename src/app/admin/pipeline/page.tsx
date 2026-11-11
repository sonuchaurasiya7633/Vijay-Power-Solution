"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Kanban, ArrowRight, Phone, MapPin } from "lucide-react";
import { AdminTableSkeleton } from "@/components/ui/SkeletonLoaders";

export default function PipelinePage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads?limit=100");
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      }
    } catch (err) {
      console.error("Fetch pipeline error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Visual CRM Funnel</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Lead Pipeline Stages
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Monitor enquiry progression from inbound discovery to physical commissioning.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors"
        >
          Table Grid View
        </Link>
      </div>

      {loading ? (
        <AdminTableSkeleton rows={5} />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-thin">
          {stages.map((st) => {
            const stageLeads = leads.filter((l) => l.stage === st.key);
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
                          <span className="truncate">{lead.city}, {lead.state}</span>
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
