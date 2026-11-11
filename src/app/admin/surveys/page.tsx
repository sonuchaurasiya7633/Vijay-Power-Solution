"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import { ClipboardCheck, MapPin, Calendar, CheckCircle2, Plus, Loader2 } from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSurveys = async () => {
    try {
      const res = await fetch("/api/surveys");
      if (res.ok) {
        const data = await res.json();
        setSurveys(data.surveys || []);
      }
    } catch (err) {
      console.error("Fetch surveys error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const completeSurvey = async (id: string) => {
    const kwStr = prompt("Enter suggested solar capacity in kW (e.g. 5, 10, 25):");
    if (!kwStr) return;
    const kw = Number(kwStr);

    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          feasibilityStatus: "feasible",
          suggestedSystemCapacityKw: kw,
        }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Survey marked completed with suggested capacity: ${kw} kW.`);
        fetchSurveys();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to update survey");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update survey");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Engineering Feasibility</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Rooftop Site Surveys
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Physical site inspections, shadow analysis, and load verification across India.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading site surveys...</span>
          </div>
        ) : surveys.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <ClipboardCheck className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No surveys scheduled</h3>
            <p className="text-xs text-slate-muted">Surveys requested from leads will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Survey ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Site Location</th>
                  <th className="p-4">Survey Date</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Feasibility</th>
                  <th className="p-4">Suggested kW</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {surveys.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{s.surveyId}</td>
                    <td className="p-4">
                      <span className="font-bold text-navy-800 block">{s.customerName}</span>
                      <span className="text-[10px] font-mono text-slate-muted">{s.customerPhone}</span>
                    </td>
                    <td className="p-4 text-slate-muted max-w-xs truncate">{s.siteAddress}, {s.city}</td>
                    <td className="p-4 font-bold text-navy-800">{formatDateIST(s.surveyDate)}</td>
                    <td className="p-4 text-slate-muted">{s.assignedTechnician?.name || "Assigned Team"}</td>
                    <td className="p-4 capitalize font-semibold">{s.feasibilityStatus.replace(/_/g, " ")}</td>
                    <td className="p-4 font-extrabold text-navy-800">
                      {s.suggestedSystemCapacityKw ? `${s.suggestedSystemCapacityKw} kW` : "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          s.status === "completed"
                            ? "bg-solar-green-light text-solar-green"
                            : "bg-solar-yellow-light text-solar-yellow-hover"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {s.status !== "completed" ? (
                        <button
                          onClick={() => completeSurvey(s._id)}
                          className="px-2.5 py-1 rounded-lg bg-solar-green text-white hover:bg-solar-green-hover font-bold transition-colors"
                        >
                          Record Outcome
                        </button>
                      ) : (
                        <span className="text-solar-green font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
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
