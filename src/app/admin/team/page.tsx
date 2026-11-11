"use client";

import { useState, useEffect } from "react";
import toast from "@/lib/toast";
import { ShieldCheck, User, Plus, CheckCircle2, Loader2, Trash2, X, AlertCircle, Edit2 } from "lucide-react";
import { AdminTableSkeleton } from "@/components/ui/SkeletonLoaders";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "sales_executive",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "sales_executive",
    password: "",
    isActive: true,
  });

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const data = await res.json();
        setTeam(data.users || []);
      }
    } catch (err) {
      console.error("Fetch team error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      role: user.role || "sales_executive",
      password: "",
      isActive: user.isActive !== false,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      const payload: any = {
        name: editForm.name,
        phone: editForm.phone,
        role: editForm.role,
        isActive: editForm.isActive,
      };
      if (editForm.password) {
        payload.password = editForm.password;
      }
      const res = await fetch(`/api/team/${editingUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.updated("Updated successfully!", `Staff member "${editForm.name}" updated.`);
        setEditingUser(null);
        fetchTeam();
      } else {
        toast.error(data.error || "Failed to update staff member");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update staff member");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.created("Created successfully!", `Staff account for "${form.name}" created.`);
        setShowAddModal(false);
        setForm({ name: "", email: "", password: "", phone: "", role: "sales_executive" });
        fetchTeam();
      } else {
        toast.error(data.error || "Failed to create staff account");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to create staff account");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `User status changed to ${!current ? "Active" : "Inactive"}.`);
        fetchTeam();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update user status");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove user "${email}"?`)) return;
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", `User "${email}" deleted.`);
        fetchTeam();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Role-Based Access Control</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Team Members & Security Roles
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Server-side enforced permissions: Super Admin, Sales Manager, Technician, Content Editor, Viewer.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <AdminTableSkeleton rows={4} />
        ) : team.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <User className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No team members</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Security Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {team.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-bold text-navy-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-solar-green-light text-solar-green flex items-center justify-center font-bold text-xs uppercase">
                        {m.name.slice(0, 1)}
                      </div>
                      <span>{m.name}</span>
                    </td>
                    <td className="p-4 font-mono text-slate-muted">{m.email}</td>
                    <td className="p-4 font-mono text-slate-muted">{m.phone || "-"}</td>
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-navy-50 text-navy-800 uppercase">
                        {m.role ? m.role.replace(/_/g, " ") : "viewer"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          m.isActive ? "text-solar-green bg-solar-green-light" : "text-slate-muted bg-slate-bg"
                        }`}
                      >
                        {m.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1 text-slate-400 hover:text-solar-green rounded"
                        title="Edit Staff Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {m.email !== "admin@vijoypowersolution.com" && (
                        <>
                          <button
                            onClick={() => toggleStatus(m._id, m.isActive)}
                            className="px-2 py-1 rounded border border-slate-border text-navy-800 hover:bg-slate-50 font-bold text-[10px]"
                          >
                            {m.isActive ? "Disable" : "Enable"}
                          </button>
                          <button
                            onClick={() => handleDelete(m._id, m.email)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-800">Add Staff Account</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@vijoypowersolution.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Secure password (min 8 chars)"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 94310 12345"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Security Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                >
                  <option value="sales_executive">Sales Executive</option>
                  <option value="sales_manager">Sales Manager</option>
                  <option value="technician">Technician (Surveys & Visits)</option>
                  <option value="installation_manager">Installation Manager (EPC)</option>
                  <option value="content_editor">Content Editor (CMS)</option>
                  <option value="admin">Administrator</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-800">Edit Staff Account</h3>
                <p className="text-[11px] text-slate-muted">{editingUser.email}</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 94310 12345"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Security Role *</label>
                <select
                  disabled={editingUser.email === "admin@vijoypowersolution.com"}
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green disabled:bg-slate-100"
                >
                  <option value="super_admin">Super Administrator</option>
                  <option value="sales_executive">Sales Executive</option>
                  <option value="sales_manager">Sales Manager</option>
                  <option value="technician">Technician (Surveys & Visits)</option>
                  <option value="installation_manager">Installation Manager (EPC)</option>
                  <option value="content_editor">Content Editor (CMS)</option>
                  <option value="admin">Administrator</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Reset Password (leave blank to keep current)</label>
                <input
                  type="password"
                  placeholder="Enter new password (optional)"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              {editingUser.email !== "admin@vijoypowersolution.com" && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-solar-green focus:ring-solar-green"
                  />
                  <label htmlFor="isActive" className="text-navy-800 font-bold">
                    Active Account Status
                  </label>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
