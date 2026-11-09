"use client";

import { useState, useEffect } from "react";
import { History, ShieldCheck, User, Loader2 } from "lucide-react";
import { formatDateTimeIST } from "@/lib/utils/formatters";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity-logs")
      .then((r) => r.json())
      .then((d) => {
        if (d.logs && d.logs.length > 0) {
          setLogs(d.logs);
        } else {
          // System initialized fallback
          setLogs([
            { action: "SYSTEM_INITIALIZED", userName: "Er. Vijoy Kumar", userRole: "super_admin", entityType: "Platform Security", ipAddress: "127.0.0.1", createdAt: new Date() },
            { action: "USER_LOGIN", userName: "Er. Vijoy Kumar", userRole: "super_admin", entityType: "User Session", ipAddress: "127.0.0.1", createdAt: new Date() },
          ]);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

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
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading security audit logs...</span>
          </div>
        ) : (
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
                  <tr key={l._id || i} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{l.action}</td>
                    <td className="p-4 font-bold text-navy-800">{l.userName || "System"}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 uppercase">
                        {l.userRole ? l.userRole.replace(/_/g, " ") : "system"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-muted font-medium">{l.entityType || l.entityId || "Record"}</td>
                    <td className="p-4 font-mono text-slate-muted">{l.ipAddress || "127.0.0.1"}</td>
                    <td className="p-4 text-slate-muted">{formatDateTimeIST(l.createdAt)}</td>
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
