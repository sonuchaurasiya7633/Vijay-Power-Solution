"use client";

import { useState } from "react";
import { ShieldCheck, User, Plus, CheckCircle2 } from "lucide-react";

export default function AdminTeamPage() {
  const [team] = useState([
    { name: "Er. Vijoy Kumar", email: "admin@vijoypowersolution.com", role: "super_admin", phone: "+91 94310 00000", status: "Active" },
    { name: "R. P. Singh", email: "sales.mgr@vijoypowersolution.com", role: "sales_manager", phone: "+91 94310 00001", status: "Active" },
    { name: "Amit Srivastava", email: "installation@vijoypowersolution.com", role: "installation_manager", phone: "+91 94310 00002", status: "Active" },
    { name: "Sunil Verma", email: "tech.patna@vijoypowersolution.com", role: "technician", phone: "+91 94310 00003", status: "Active" },
    { name: "Priya Sharma", email: "editor@vijoypowersolution.com", role: "content_editor", phone: "+91 94310 00004", status: "Active" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Role-Based Access Control</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Team Members & Security Roles
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Granular server-side enforced permissions: Super Admin, Sales Manager, Technician, Content Editor, Viewer.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
              <tr>
                <th className="p-4">Staff Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Security Role</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {team.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-bg/50 transition-colors">
                  <td className="p-4 font-bold text-navy-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-solar-green-light text-solar-green flex items-center justify-center font-bold text-xs">
                      {m.name.slice(0, 1)}
                    </div>
                    <span>{m.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-muted">{m.email}</td>
                  <td className="p-4 font-mono text-slate-muted">{m.phone}</td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 uppercase">
                      {m.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
