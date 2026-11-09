"use client";

import { useState } from "react";
import { History, ShieldCheck, User } from "lucide-react";
import { formatDateTimeIST } from "@/lib/utils/formatters";

export default function AdminActivityLogsPage() {
  const [logs] = useState([
    { action: "USER_LOGIN", user: "Er. Vijoy Kumar", role: "super_admin", entity: "User Session", ip: "127.0.0.1", time: new Date() },
    { action: "STAGE_CHANGE", user: "Sales Desk", role: "sales_executive", entity: "Lead VPS-LD-1001 -> Contacted", ip: "127.0.0.1", time: new Date(Date.now() - 3600000) },
    { action: "SURVEY_SCHEDULED", user: "Er. Vijoy Kumar", role: "super_admin", entity: "Survey VPS-SRV-1001", ip: "127.0.0.1", time: new Date(Date.now() - 7200000) },
    { action: "QUOTATION_DRAFTED", user: "R. P. Singh", role: "sales_manager", entity: "Quotation VPS-QT-2024-1001", ip: "127.0.0.1", time: new Date(Date.now() - 14400000) },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Audit Trail</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            System Activity & Security Logs
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Immutable log of user authentication events, lead stage transitions, and commercial quotation actions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
              <tr>
                <th className="p-4">Action</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Role</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Timestamp (IST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((l, i) => (
                <tr key={i} className="hover:bg-slate-bg/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-navy-800">{l.action}</td>
                  <td className="p-4 font-bold text-navy-800">{l.user}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 uppercase">
                      {l.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-slate-muted font-medium">{l.entity}</td>
                  <td className="p-4 font-mono text-slate-muted">{l.ip}</td>
                  <td className="p-4 text-slate-muted">{formatDateTimeIST(l.time)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
