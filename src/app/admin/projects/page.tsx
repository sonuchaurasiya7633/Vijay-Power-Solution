"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, CheckCircle2, Eye, EyeOff, Loader2, Trash2 } from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects?adminMode=true");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !currentStatus }),
    });
    fetchProjects();
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Portfolio CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Public Installation Case Studies
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage customer-confirmed installation projects visible on the public website.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading case studies...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No portfolio projects</h3>
            <p className="text-xs text-slate-muted">Convert completed installation jobs or add verified case studies.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Project ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Customer Consent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{p.projectId}</td>
                    <td className="p-4 font-bold text-navy-800 max-w-sm truncate">{p.title}</td>
                    <td className="p-4 text-slate-muted">{p.generalLocation}</td>
                    <td className="p-4 font-extrabold text-navy-800">{p.systemCapacityKw} kW</td>
                    <td className="p-4">
                      <span className="text-green-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Consent Documented</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          p.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(p._id, p.isPublished)}
                        className="px-2.5 py-1 rounded-lg border border-slate-border text-navy-800 hover:bg-slate-50 font-bold text-[11px]"
                      >
                        {p.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/projects/${p.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px]"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => deleteProject(p._id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
