"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, AlertCircle, Phone, MessageCircle, Calendar, Loader2 } from "lucide-react";
import { formatDateIST, formatDateTimeIST } from "@/lib/utils/formatters";

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // today, upcoming, overdue, all

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/follow-ups?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setFollowUps(data.followUps || []);
      }
    } catch (err) {
      console.error("Fetch follow-ups error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [filter]);

  const markComplete = async (id: string) => {
    const outcome = prompt("Enter follow-up outcome notes:");
    if (!outcome) return;

    await fetch(`/api/follow-ups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed", outcome }),
    });
    fetchFollowUps();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Lead Cadence</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Task & Follow-Up Management
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Never lose momentum with prospective clients across Bihar, JH, and UP.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-bg p-1 rounded-xl border border-slate-border text-xs font-bold">
          {["all", "today", "upcoming", "overdue"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filter === f
                  ? "bg-navy-800 text-white shadow-sm"
                  : "text-navy-800 hover:bg-slate-200/60"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading follow-up tasks...</span>
          </div>
        ) : followUps.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Clock className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No follow-ups for this filter</h3>
            <p className="text-xs text-slate-muted">You are all caught up on scheduled calls and surveys.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Scheduled For</th>
                  <th className="p-4">Task Type</th>
                  <th className="p-4">Customer Lead</th>
                  <th className="p-4">Contact Phone</th>
                  <th className="p-4">Assigned To</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {followUps.map((fu) => (
                  <tr key={fu._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-bold text-navy-800">
                      {formatDateTimeIST(fu.scheduledAt)}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-navy-800 capitalize">
                        {fu.followUpType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      {fu.leadId ? (
                        <Link href={`/admin/leads/${fu.leadId._id}`} className="font-bold text-navy-800 hover:text-solar-green">
                          {fu.leadId.fullName} ({fu.leadId.city})
                        </Link>
                      ) : (
                        <span className="text-slate-muted">Unlinked</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-muted">{fu.leadId?.phone || "-"}</td>
                    <td className="p-4 text-slate-muted">{fu.assignedTo?.name || "Unassigned"}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          fu.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : fu.status === "overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {fu.status}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      {fu.status !== "completed" && (
                        <button
                          onClick={() => markComplete(fu._id)}
                          className="px-2.5 py-1 rounded-lg bg-solar-green text-white hover:bg-solar-green-hover font-bold transition-colors"
                        >
                          Complete
                        </button>
                      )}
                      {fu.leadId && (
                        <Link
                          href={`/admin/leads/${fu.leadId._id}`}
                          className="px-2.5 py-1 rounded-lg border border-slate-border text-navy-800 hover:bg-slate-50 font-semibold transition-colors"
                        >
                          View Lead
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
