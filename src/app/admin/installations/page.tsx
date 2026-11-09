"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { HardHat, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Plus } from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";

export default function InstallationsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/installations");
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Fetch installations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStage = async (id: string, newStage: string) => {
    await fetch(`/api/installations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });
    fetchJobs();
  };

  const convertToPortfolio = async (id: string) => {
    const consent = confirm("Confirm: Has the customer provided explicit written/digital consent to publish this installation project to the public portfolio?");
    if (!consent) return;

    const res = await fetch(`/api/installations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hasCustomerConsentForPortfolio: true,
        convertToPortfolio: true,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Successfully created an unpublished draft project in Portfolio Projects. Review and publish when ready.");
      fetchJobs();
    } else {
      alert(data.error || "Failed to convert project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Execution & EPC Workflow</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Installation Jobs & Commissioning
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Internal installation tracking from material procurement to DISCOM net meter commissioning.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading active jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <HardHat className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No active installation jobs</h3>
            <p className="text-xs text-slate-muted">When a lead is won, authorized staff can convert it into an installation job.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Job ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Assigned Team</th>
                  <th className="p-4">Job Stage</th>
                  <th className="p-4">Portfolio Link</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{j.jobId}</td>
                    <td className="p-4 font-bold text-navy-800">{j.customerName}</td>
                    <td className="p-4 text-slate-muted">{j.city}, {j.state}</td>
                    <td className="p-4 font-extrabold text-navy-800">{j.systemCapacityKw} kW</td>
                    <td className="p-4 text-slate-muted">{j.assignedManager?.name || "Installation Dept"}</td>
                    <td className="p-4">
                      <select
                        value={j.stage}
                        onChange={(e) => updateStage(j._id, e.target.value)}
                        className="py-1 px-2 rounded-lg border border-slate-border text-xs font-semibold bg-white outline-none"
                      >
                        <option value="customer_confirmed">Confirmed</option>
                        <option value="materials_procured">Materials Procured</option>
                        <option value="installation_scheduled">Scheduled</option>
                        <option value="installation_underway">Underway</option>
                        <option value="electrical_inspection">Inspection</option>
                        <option value="commissioning">Commissioning</option>
                        <option value="handover_completed">Handover Completed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      {j.convertedToPublicProject ? (
                        <span className="text-green-700 font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Linked to Portfolio</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => convertToPortfolio(j._id)}
                          className="px-2.5 py-1 rounded bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[10px] transition-colors"
                        >
                          Convert with Consent
                        </button>
                      )}
                    </td>
                    <td className="p-4">
                      {j.leadId && (
                        <Link
                          href={`/admin/leads/${j.leadId._id}`}
                          className="font-bold text-solar-green hover:underline"
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
