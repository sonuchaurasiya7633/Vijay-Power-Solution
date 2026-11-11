"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import { FileSpreadsheet, Plus, CheckCircle2, Send, Download, Loader2 } from "lucide-react";
import { formatCurrencyINR, formatDateIST } from "@/lib/utils/formatters";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotations = async () => {
    try {
      const res = await fetch("/api/quotations");
      if (res.ok) {
        const data = await res.json();
        setQuotations(data.quotations || []);
      }
    } catch (err) {
      console.error("Fetch quotations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Quotation marked as "${newStatus.replace(/_/g, " ")}".`);
        fetchQuotations();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to update quotation");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update quotation");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Commercial Proposals</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Internal Quotation Management
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Strictly private commercial proposals with line items, GST, and estimated PM Surya Ghar subsidies.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading quotations...</span>
          </div>
        ) : quotations.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No quotations generated</h3>
            <p className="text-xs text-slate-muted">Generate private quotations from individual lead profiles.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Quote Number</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Proposed System</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">Subsidy Est.</th>
                  <th className="p-4">Net Payable</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Prepared By</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{q.quotationNumber}</td>
                    <td className="p-4 font-bold text-navy-800">{q.customerName}</td>
                    <td className="p-4">
                      <span className="font-bold text-navy-800">{q.proposedSystemCapacityKw} kW</span>
                      <span className="block text-[10px] text-slate-muted truncate max-w-xs">{q.solarPanelBrandModel || "Standard Tier-1"}</span>
                    </td>
                    <td className="p-4 font-semibold text-slate-muted">{formatCurrencyINR(q.subtotal)}</td>
                    <td className="p-4 font-semibold text-solar-green">
                      {q.estimatedSubsidyAmount ? `-${formatCurrencyINR(q.estimatedSubsidyAmount)}` : "₹0"}
                    </td>
                    <td className="p-4 font-extrabold text-navy-800">{formatCurrencyINR(q.netPayableEstimate)}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          q.status === "approved" || q.status === "accepted"
                            ? "bg-solar-green-light text-solar-green"
                            : q.status === "sent"
                            ? "bg-navy-50 text-navy-800"
                            : "bg-slate-bg text-slate-main"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-muted">{q.preparedBy?.name || "Staff"}</td>
                    <td className="p-4 flex items-center gap-1.5">
                      {q.status === "draft" && (
                        <button
                          onClick={() => updateStatus(q._id, "approved")}
                          className="px-2 py-1 rounded bg-navy-800 text-white font-bold text-[10px] hover:bg-navy-900"
                        >
                          Approve
                        </button>
                      )}
                      {q.status === "approved" && (
                        <button
                          onClick={() => updateStatus(q._id, "sent")}
                          className="px-2 py-1 rounded bg-navy-800 text-white font-bold text-[10px] hover:bg-navy-900"
                        >
                          Mark Sent
                        </button>
                      )}
                      {q.status === "sent" && (
                        <button
                          onClick={() => updateStatus(q._id, "accepted")}
                          className="px-2 py-1 rounded bg-solar-green text-white font-bold text-[10px] hover:bg-solar-green-hover"
                        >
                          Customer Won
                        </button>
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
