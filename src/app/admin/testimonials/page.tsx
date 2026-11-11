"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Edit3,
  X,
  Loader2,
  Save,
  Eye,
  ExternalLink,
  User,
} from "lucide-react";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import CmsLivePreviewModal from "@/components/admin/CmsLivePreviewModal";
import CmsTableImageCell from "@/components/admin/CmsTableImageCell";

export default function AdminTestimonialsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerCity: "",
    customerState: "Bihar",
    systemCapacityKw: 5,
    rating: 5,
    reviewText: "",
    photoUrl: "",
    hasConsentToPublish: true,
    isApproved: true,
  });

  const fetchReviews = () => {
    fetch("/api/testimonials?adminMode=true")
      .then((r) => r.json())
      .then((d) => setReviews(d.testimonials || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      customerName: "",
      customerCity: "",
      customerState: "Bihar",
      systemCapacityKw: 5,
      rating: 5,
      reviewText: "",
      photoUrl: "",
      hasConsentToPublish: true,
      isApproved: true,
    });
    setShowModal(true);
  };

  const openEditModal = (t: any) => {
    setEditingId(t._id);
    setForm({
      customerName: t.customerName || "",
      customerCity: t.customerCity || "",
      customerState: t.customerState || "Bihar",
      systemCapacityKw: t.systemCapacityKw || 5,
      rating: t.rating || 5,
      reviewText: t.reviewText || "",
      photoUrl: t.photoUrl || "",
      hasConsentToPublish: t.hasConsentToPublish !== undefined ? t.hasConsentToPublish : true,
      isApproved: t.isApproved !== undefined ? t.isApproved : true,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/testimonials/${editingId}` : "/api/testimonials";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        if (editingId) {
          toast.updated("Updated successfully!", `Review by ${form.customerName} updated.`);
        } else {
          toast.created("Created successfully!", `Review by ${form.customerName} added.`);
        }
        setShowModal(false);
        fetchReviews();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to save testimonial");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Review approval status changed.`);
        fetchReviews();
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to update review status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this customer testimonial?")) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", "Customer review deleted.");
        fetchReviews();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to delete review");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Review Moderation</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Customer Testimonials & Consent
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Strict consent enforcement: only reviews with verified client approval are displayed publicly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-navy-800 flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Reviews Preview</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
          <span>Loading customer reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-border text-center space-y-2">
          <Star className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-navy-800">No testimonials found</h3>
          <p className="text-xs text-slate-muted">Add customer reviews with explicit consent.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((t) => (
            <div key={t._id} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-solar-yellow text-solar-yellow" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(t)}
                      className="p-1 text-slate-400 hover:text-navy-800 rounded"
                      title="Edit Review"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-navy-800 italic leading-relaxed">
                  &ldquo;{t.reviewText}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CmsTableImageCell
                    imageUrl={t.photoUrl}
                    title={t.customerName}
                    folder="testimonials"
                    aspect="avatar"
                    onUpdate={async (newUrl) => {
                      const res = await fetch(`/api/testimonials/${t._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ photoUrl: newUrl }),
                      });
                      if (!res.ok) throw new Error("Failed to update reviewer photo");
                      setReviews((prev) =>
                        prev.map((item) => (item._id === t._id ? { ...item, photoUrl: newUrl } : item))
                      );
                    }}
                    onDelete={async () => {
                      const res = await fetch(`/api/testimonials/${t._id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ photoUrl: "" }),
                      });
                      if (!res.ok) throw new Error("Failed to remove reviewer photo");
                      setReviews((prev) =>
                        prev.map((item) => (item._id === t._id ? { ...item, photoUrl: "" } : item))
                      );
                    }}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-navy-800">{t.customerName}</h4>
                    <p className="text-[10px] text-slate-muted">{t.customerCity}, {t.customerState} ({t.systemCapacityKw}kW)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleApproval(t._id, t.isApproved)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                      t.isApproved ? "text-solar-green bg-solar-green-light" : "text-solar-yellow-hover bg-solar-yellow-light"
                    }`}
                  >
                    {t.isApproved ? "Approved" : "Pending"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Testimonial Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 my-8">
            <div className="p-5 border-b border-slate-border flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Customer Review" : "Add Customer Review"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Prakash"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Rating (1-5)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                  </select>
                </div>
              </div>

              {/* Customer Photo Upload */}
              <CmsImageUploader
                label="Customer Photo (Optional)"
                value={form.photoUrl}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
                folder="testimonials"
                aspectRatio="square"
                helpText="Upload a customer portrait photo or leave blank for a default avatar icon."
              />

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patna"
                    value={form.customerCity}
                    onChange={(e) => setForm({ ...form, customerCity: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">State *</label>
                  <select
                    value={form.customerState}
                    onChange={(e) => setForm({ ...form, customerState: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Capacity (kW)</label>
                  <input
                    type="number"
                    value={form.systemCapacityKw}
                    onChange={(e) => setForm({ ...form, systemCapacityKw: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Review Statement *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Customer feedback regarding electricity bill savings and installation..."
                  value={form.reviewText}
                  onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={form.hasConsentToPublish}
                  onChange={(e) => setForm({ ...form, hasConsentToPublish: e.target.checked })}
                  className="rounded text-solar-green focus:ring-0"
                />
                <label htmlFor="consent" className="text-slate-muted cursor-pointer">
                  Client has given documented consent for this review to be displayed publicly.
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
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
                  <span>{editingId ? "Update Review" : "Save Review"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Live Preview Modal */}
      <CmsLivePreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        url="/"
        pageTitle="Customer Reviews Live Preview"
      />
    </div>
  );
}
