"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FolderGit2, Plus, CheckCircle2, Eye, EyeOff, Loader2, Trash2, Edit3, X, Save } from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    customerName: "",
    city: "Patna",
    state: "Bihar",
    systemCapacityKw: 10,
    systemType: "on-grid",
    projectCategory: "residential",
    coverImageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    hasCustomerConsent: true,
    isPublished: true,
    scopeOfWork: "Turnkey EPC: structure erection, solar panel mounting, bi-directional net-metering synchronization.",
  });

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

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      customerName: "",
      city: "Patna",
      state: "Bihar",
      systemCapacityKw: 10,
      systemType: "on-grid",
      projectCategory: "residential",
      coverImageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
      hasCustomerConsent: true,
      isPublished: true,
      scopeOfWork: "Turnkey EPC: structure erection, solar panel mounting, bi-directional net-metering synchronization.",
    });
    setShowModal(true);
  };

  const openEditModal = (p: any) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      slug: p.slug || "",
      customerName: p.customerName || "",
      city: p.city || "Patna",
      state: p.state || "Bihar",
      systemCapacityKw: p.systemCapacityKw || 10,
      systemType: p.systemType || "on-grid",
      projectCategory: p.projectCategory || "residential",
      coverImageUrl: p.coverImageUrl || "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
      hasCustomerConsent: p.hasCustomerConsent !== undefined ? p.hasCustomerConsent : true,
      isPublished: p.isPublished !== undefined ? p.isPublished : true,
      scopeOfWork: p.scopeOfWork || "Turnkey EPC: structure erection, solar panel mounting, bi-directional net-metering synchronization.",
    });
    setShowModal(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingId) {
      const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setForm({ ...form, title: val, slug });
    } else {
      setForm({ ...form, title: val });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.hasCustomerConsent) {
      return alert("Customer consent is strictly required before publishing any project publicly.");
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          completionDate: new Date(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(false);
        fetchProjects();
      } else {
        alert(data.error || "Failed to save project");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

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

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Case Study</span>
        </button>
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
                  <th className="p-4">Project</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">System Type</th>
                  <th className="p-4">Consent</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Completed</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-bold text-navy-800 max-w-xs truncate">{p.title}</td>
                    <td className="p-4 font-extrabold text-navy-800">{p.systemCapacityKw} kW</td>
                    <td className="p-4 text-slate-muted">{p.city}, {p.state}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {p.systemType}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          p.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-muted">{p.completionDate ? formatDateIST(p.completionDate) : "-"}</td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                        title="Edit Case Study"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
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

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Installation Case Study" : "Add Installation Case Study"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10kW On-Grid Rooftop Solar Installation in Kankarbagh, Patna"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Customer / Entity Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Residential Villa / School"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">State *</label>
                  <select
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="Bihar">Bihar</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Capacity (kW) *</label>
                  <input
                    type="number"
                    required
                    value={form.systemCapacityKw}
                    onChange={(e) => setForm({ ...form, systemCapacityKw: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">System Type</label>
                  <select
                    value={form.systemType}
                    onChange={(e) => setForm({ ...form, systemType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="on-grid">On-Grid (Net Metered)</option>
                    <option value="off-grid">Off-Grid (Battery Storage)</option>
                    <option value="hybrid">Hybrid (Grid + Battery)</option>
                    <option value="solar-pump">Solar Water Pump</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Category</label>
                  <select
                    value={form.projectCategory}
                    onChange={(e) => setForm({ ...form, projectCategory: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="residential">Residential Rooftop</option>
                    <option value="commercial">Commercial / Institutional</option>
                    <option value="industrial">Industrial</option>
                    <option value="agricultural">Agricultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Cover Image URL (Cloudinary or Web)</label>
                <input
                  type="url"
                  required
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent_proj"
                  checked={form.hasCustomerConsent}
                  onChange={(e) => setForm({ ...form, hasCustomerConsent: e.target.checked })}
                  className="rounded text-solar-green focus:ring-0"
                />
                <label htmlFor="consent_proj" className="text-slate-muted">
                  Client has granted explicit documented consent for this installation to be showcased publicly.
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-muted hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-solar-green text-white font-bold hover:bg-solar-green-hover flex items-center gap-1.5 shadow-sm"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingId ? "Update Case Study" : "Save Case Study"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
