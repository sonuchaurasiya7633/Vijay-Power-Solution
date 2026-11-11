"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRight,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";
import { AdminTableSkeleton } from "@/components/ui/SkeletonLoaders";

export default function LeadsCRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (stageFilter !== "all") params.set("stage", stageFilter);
      if (priorityFilter !== "all") params.set("priority", priorityFilter);
      if (stateFilter !== "all") params.set("state", stateFilter);
      params.set("page", String(pagination.page));

      const res = await fetch(`/api/leads?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads || []);
        setPagination(data.pagination || { page: 1, limit: 25, total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Fetch leads error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [stageFilter, priorityFilter, stateFilter, pagination.page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Lead ID", "Name", "Phone", "City", "State", "Customer Type", "Solution", "Stage", "Priority", "Created At"];
    const rows = leads.map((l) => [
      l.leadId,
      `"${l.fullName}"`,
      l.phone,
      `"${l.city}"`,
      `"${l.state}"`,
      l.customerType,
      `"${l.solarSolutionType || l.productName || 'General'}"`,
      l.stage,
      l.priority,
      formatDateIST(l.createdAt),
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
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
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Lead Pipeline CRM</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Inbound Solar Enquiries & Lead Tracking
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Total active leads: <strong>{pagination.total}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-border text-navy-800 hover:bg-slate-bg flex items-center gap-1.5 transition-colors"
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
          <Search className="w-4 h-4 text-slate-muted absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Lead ID, Customer Name, Phone, or City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-border focus:border-solar-green outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Stage filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-border bg-white text-navy-800 font-semibold outline-none"
          >
            <option value="all">All Stages</option>
            <option value="new_lead">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="site_survey_scheduled">Survey Scheduled</option>
            <option value="quotation_sent">Quotation Sent</option>
            <option value="won">Won Customer</option>
            <option value="lost">Lost / Inactive</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
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
            onChange={(e) => setStateFilter(e.target.value)}
            className="py-2 px-3 rounded-xl border border-slate-border bg-white text-navy-800 font-semibold outline-none"
          >
            <option value="all">All States & UTs</option>
            {INDIAN_STATES_AND_UTS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <AdminTableSkeleton rows={6} />
        ) : leads.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No leads found</h3>
            <p className="text-xs text-slate-muted">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
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
                      <span className="text-[10px] text-slate-muted capitalize">{l.customerType}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-muted">{l.phone}</td>
                    <td className="p-4 text-slate-muted">{l.city}, {l.state}</td>
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
                        {l.stage.replace(/_/g, " ")}
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
        )}
      </div>
    </div>
  );
}
