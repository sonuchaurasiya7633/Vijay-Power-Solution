"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "@/lib/toast";
import { FileText, Plus, CheckCircle2, Eye, Trash2, Edit3, X, Loader2, Save } from "lucide-react";
import { formatDateIST } from "@/lib/utils/formatters";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import CmsTableImageCell from "@/components/admin/CmsTableImageCell";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "Subsidy Guides",
    authorName: "Er. Vijoy Kumar",
    isPublished: true,
  });

  const fetchBlogs = () => {
    fetch("/api/blogs?adminMode=true")
      .then((r) => r.json())
      .then((d) => setBlogs(d.blogs || []))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      category: "Subsidy Guides",
      authorName: "Er. Vijoy Kumar",
      isPublished: true,
    });
    setShowModal(true);
  };

  const openEditModal = (b: any) => {
    setEditingId(b._id);
    setForm({
      title: b.title || "",
      slug: b.slug || "",
      excerpt: b.excerpt || "",
      content: b.content || "",
      coverImage: b.coverImage || "",
      category: b.category || "Subsidy Guides",
      authorName: b.authorName || "Er. Vijoy Kumar",
      isPublished: b.isPublished !== undefined ? b.isPublished : true,
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
    setSaving(true);
    try {
      const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishedAt: form.isPublished ? new Date() : null,
        }),
      });
      if (res.ok) {
        if (editingId) {
          toast.updated("Updated successfully!", `Article "${form.title}" updated.`);
        } else {
          toast.created("Created successfully!", `Article "${form.title}" created.`);
        }
        setShowModal(false);
        fetchBlogs();
      } else {
        const d = await res.json();
        toast.error(d.error || "Failed to save article");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: !currentStatus,
          publishedAt: !currentStatus ? new Date() : null,
        }),
      });
      if (res.ok) {
        toast.updated("Updated successfully!", `Article status changed to ${!currentStatus ? "Published" : "Draft"}.`);
        fetchBlogs();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to update article status");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update article status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this educational article?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.deleted("Deleted successfully!", "Educational article deleted.");
        fetchBlogs();
      } else {
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Failed to delete article");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete article");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Knowledge Hub CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Educational Solar Articles
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage educational articles, SEO metadata, and published guides.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Article</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading articles...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No articles found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4 w-20">Cover</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Published</th>
                  <th className="p-4 text-right sticky right-0 bg-slate-bg shadow-[-6px_0_10px_rgba(0,0,0,0.04)] z-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blogs.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-bg/50 transition-colors group/row">
                    <td className="p-4">
                      <CmsTableImageCell
                        imageUrl={b.coverImage}
                        title={b.title}
                        folder="blogs"
                        aspect="square"
                        onUpdate={async (newUrl) => {
                          const res = await fetch(`/api/blogs/${b._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ coverImage: newUrl }),
                          });
                          if (!res.ok) throw new Error("Failed to update blog cover");
                          setBlogs((prev) =>
                            prev.map((item) => (item._id === b._id ? { ...item, coverImage: newUrl } : item))
                          );
                        }}
                        onDelete={async () => {
                          const res = await fetch(`/api/blogs/${b._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ coverImage: "" }),
                          });
                          if (!res.ok) throw new Error("Failed to remove blog cover");
                          setBlogs((prev) =>
                            prev.map((item) => (item._id === b._id ? { ...item, coverImage: "" } : item))
                          );
                        }}
                      />
                    </td>
                    <td className="p-4 font-bold text-navy-800 max-w-sm truncate">{b.title}</td>
                    <td className="p-4 text-slate-muted">{b.category}</td>
                    <td className="p-4 text-slate-muted">{b.authorName}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          b.isPublished ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {b.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-muted">{b.publishedAt ? formatDateIST(b.publishedAt) : "-"}</td>
                    <td className="p-4 sticky right-0 bg-white group-hover/row:bg-slate-50 shadow-[-6px_0_10px_rgba(0,0,0,0.04)] z-10">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 rounded bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => togglePublish(b._id, b.isPublished)}
                          className="px-2 py-1 rounded border border-slate-border text-navy-800 hover:bg-slate-50 font-bold text-[10px]"
                        >
                          {b.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="px-2 py-1 rounded bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[10px] inline-block"
                        >
                          Preview
                        </Link>
                        <button
                          onClick={() => handleDelete(b._id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-border shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="sticky top-0 bg-white p-5 border-b border-slate-border flex items-center justify-between z-10">
              <h3 className="text-base font-bold text-navy-800">
                {editingId ? "Edit Educational Article" : "Add Educational Article"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 text-slate-400 hover:text-navy-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-800 block mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Guide to PM Surya Ghar Scheme in Bihar"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
                />
              </div>

              {/* Cover Photo */}
              <CmsImageUploader
                label="Article Cover Photo"
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                folder="blogs"
                aspectRatio="banner"
                helpText="Upload a banner photo for this educational guide. Replaces existing image and saves to Cloudinary."
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  >
                    <option value="Subsidy Guides">Subsidy Guides</option>
                    <option value="Solar Technology">Solar Technology</option>
                    <option value="Installation Stories">Installation Stories</option>
                    <option value="Maintenance & O&M">Maintenance & O&M</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Author Name</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Brief summary shown on article cards and search results..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <label className="font-bold text-navy-800 block mb-1">Full Article Body *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Detailed educational guide content (supports markdown)..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green leading-relaxed font-sans"
                />
              </div>

              <div className="sticky bottom-0 bg-white pt-3 border-t border-slate-border flex justify-end gap-2">
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
                  <span>{editingId ? "Update Article" : "Save Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
