"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "@/lib/toast";
import {
  Camera,
  Upload,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Loader2,
  ArrowUp,
  ArrowDown,
  Star,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Save,
  MapPin,
  Zap,
  User,
} from "lucide-react";
import { INDIAN_STATES_AND_UTS } from "@/lib/constants/states";
import CmsImageUploader from "@/components/admin/CmsImageUploader";

interface GalleryDoc {
  _id: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  title: string;
  customerName?: string;
  city?: string;
  state?: string;
  category?: string;
  capacityKw?: number;
  description?: string;
  isFeatured: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
}

export default function AdminInstallationGalleryPage() {
  const [items, setItems] = useState<GalleryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  // Edit / Details Modal State
  const [editingItem, setEditingItem] = useState<GalleryDoc | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    customerName: "",
    city: "",
    state: "Bihar",
    category: "Residential Rooftop",
    capacityKw: "",
    description: "",
    isFeatured: false,
    isPublished: true,
    sortOrder: 0,
    imageUrl: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Replacement image file ref
  const replaceFileRef = useRef<HTMLInputElement | null>(null);

  // Multi-file pre-upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch gallery items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/gallery?includeUnpublished=true");
      const data = await res.json();
      if (res.ok && data.items) {
        setItems(data.items);
      } else {
        toast.error("Failed to load gallery items");
      }
    } catch (err) {
      toast.error("Network error while loading gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle file selection with pre-upload previews
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    filePreviews.forEach((url) => URL.revokeObjectURL(url));
    setFilePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Upload multiple images to Cloudinary and save to DB
  const handleUploadSelected = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);

    try {
      // 1. Get upload signature
      const signRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", folder: "gallery" }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || "Failed to get upload signature");

      const createdItems: any[] = [];
      const currentCount = items.length;

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading ${i + 1} of ${selectedFiles.length}: ${file.name}...`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", signData.timestamp.toString());
        formData.append("signature", signData.signature);
        formData.append("folder", signData.folder);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const cloudData = await cloudRes.json();

        if (cloudData.secure_url) {
          createdItems.push({
            imageUrl: cloudData.secure_url,
            cloudinaryPublicId: cloudData.public_id,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ") || "Customer Solar Installation",
            category: "Residential Rooftop",
            isFeatured: currentCount + i < 6,
            isPublished: true,
            sortOrder: currentCount + i + 1,
          });
        }
      }

      if (createdItems.length > 0) {
        // Save to DB
        const saveRes = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "batch", items: createdItems }),
        });
        const saveData = await saveRes.json();

        if (saveRes.ok) {
          toast.success(
            `Successfully uploaded ${createdItems.length} photograph${createdItems.length > 1 ? "s" : ""}!`
          );
          clearSelectedFiles();
          await fetchItems();
        } else {
          throw new Error(saveData.error || "Failed to save records");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // Open edit modal
  const openEditModal = (item: GalleryDoc) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || "",
      customerName: item.customerName || "",
      city: item.city || "",
      state: item.state || "Bihar",
      category: item.category || "Residential Rooftop",
      capacityKw: item.capacityKw ? String(item.capacityKw) : "",
      description: item.description || "",
      isFeatured: Boolean(item.isFeatured),
      isPublished: Boolean(item.isPublished),
      sortOrder: item.sortOrder || 0,
      imageUrl: item.imageUrl || "",
    });
  };

  // Save edit form
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/gallery/${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title,
          customerName: editForm.customerName || undefined,
          city: editForm.city || undefined,
          state: editForm.state || undefined,
          category: editForm.category,
          capacityKw: editForm.capacityKw ? Number(editForm.capacityKw) : undefined,
          description: editForm.description || undefined,
          isFeatured: editForm.isFeatured,
          isPublished: editForm.isPublished,
          sortOrder: Number(editForm.sortOrder) || 0,
          imageUrl: editForm.imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Installation details updated!");
        setEditingItem(null);
        await fetchItems();
      } else {
        throw new Error(data.error || "Update failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update item");
    } finally {
      setSavingEdit(false);
    }
  };

  // Handle single image replacement in edit modal
  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !editingItem) return;
    const file = e.target.files[0];

    try {
      toast.info("Uploading replacement image to Cloudinary...");
      const signRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", folder: "gallery" }),
      });
      const signData = await signRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp.toString());
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const cloudData = await cloudRes.json();

      if (cloudData.secure_url) {
        setEditForm((prev) => ({ ...prev, imageUrl: cloudData.secure_url }));
        toast.success("Replacement image uploaded. Click Save Changes to confirm.");
      } else {
        throw new Error(cloudData.error?.message || "Cloudinary upload failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to replace image");
    }
  };

  // Toggle Featured
  const toggleFeatured = async (item: GalleryDoc) => {
    try {
      const nextVal = !item.isFeatured;
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: nextVal }),
      });
      if (res.ok) {
        toast.success(nextVal ? "Marked as featured on homepage" : "Removed from homepage featured");
        setItems((prev) =>
          prev.map((it) => (it._id === item._id ? { ...it, isFeatured: nextVal } : it))
        );
      }
    } catch (e) {
      toast.error("Failed to update featured status");
    }
  };

  // Toggle Published
  const togglePublished = async (item: GalleryDoc) => {
    try {
      const nextVal = !item.isPublished;
      const res = await fetch(`/api/gallery/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: nextVal }),
      });
      if (res.ok) {
        toast.success(nextVal ? "Photograph published" : "Photograph unpublished (hidden)");
        setItems((prev) =>
          prev.map((it) => (it._id === item._id ? { ...it, isPublished: nextVal } : it))
        );
      }
    } catch (e) {
      toast.error("Failed to update visibility");
    }
  };

  // Reorder controls: Move Up or Down
  const moveItem = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Recalculate sortOrders
    const orderPayload = newItems.map((it, idx) => ({
      id: it._id,
      sortOrder: idx + 1,
    }));

    setItems(newItems);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", items: orderPayload }),
      });
      if (res.ok) {
        toast.success("Gallery order saved");
      }
    } catch (e) {
      toast.error("Failed to persist order");
      fetchItems();
    }
  };

  // Delete Item
  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/gallery/${deleteConfirmId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Gallery item deleted successfully");
        setDeleteConfirmId(null);
        setItems((prev) => prev.filter((i) => i._id !== deleteConfirmId));
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-border shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-green-light border border-solar-green/20 text-solar-green text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Customer Photos CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-navy-800">
            Installation Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted">
            Manage authentic customer photographs, feature selections for homepage, display orders, and Cloudinary CDN sync.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-md flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Customer Photos</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Pre-Upload Batch Preview Area */}
      {selectedFiles.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-solar-green/60 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-navy-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green" />
                <span>Selected {selectedFiles.length} Photo{selectedFiles.length > 1 ? "s" : ""} for Upload</span>
              </h3>
              <p className="text-xs text-slate-muted">
                Review thumbnail previews below before uploading to Cloudinary CDN and publishing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearSelectedFiles}
                disabled={uploading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadSelected}
                disabled={uploading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-solar-green hover:bg-solar-green-hover text-white flex items-center gap-2 shadow-md disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Publish All</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {uploadProgress && (
            <div className="p-3 bg-solar-green-light/70 rounded-xl text-xs font-semibold text-solar-green flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{uploadProgress}</span>
            </div>
          )}

          {/* Previews Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
            {filePreviews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden border border-slate-border bg-navy-950 flex items-center justify-center group"
              >
                <Image
                  src={src}
                  alt={`Preview ${i + 1}`}
                  fill
                  className="object-contain"
                />
                <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded truncate max-w-[90%]">
                  {selectedFiles[i]?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-800">
            Published & Managed Photographs ({items.length})
          </h2>
          <span className="text-xs text-slate-muted">
            Starred items appear on homepage (Top 6 featured)
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-slate-border">
            <Loader2 className="w-8 h-8 text-solar-green animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-muted">Loading gallery collection...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-border space-y-3">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-800">Gallery is Empty</h3>
            <p className="text-xs text-slate-muted max-w-sm mx-auto">
              Upload genuine customer installation photographs using the upload button above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item, idx) => {
              const locationText = [item.city, item.state].filter(Boolean).join(", ");
              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm flex flex-col justify-between overflow-hidden group ${
                    !item.isPublished
                      ? "opacity-60 border-dashed border-slate-400"
                      : "border-slate-border hover:shadow-lg hover:border-solar-green/40"
                  }`}
                >
                  {/* Photo Frame (Neutral background + object-contain prevents awkward cropping of poster/portrait styles) */}
                  <div className="relative aspect-[3/4] w-full bg-navy-950 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Order Badge */}
                    <div className="absolute top-2 left-2 bg-navy-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10">
                      #{idx + 1}
                    </div>

                    {/* Featured Star Button */}
                    <button
                      onClick={() => toggleFeatured(item)}
                      title={item.isFeatured ? "Featured on homepage" : "Click to feature on homepage"}
                      className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                        item.isFeatured
                          ? "bg-solar-yellow text-navy-900 border-solar-yellow shadow-md"
                          : "bg-navy-900/70 text-slate-400 hover:text-white border-white/20"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isFeatured ? "fill-navy-900" : ""}`} />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-3.5 space-y-2">
                    <div>
                      <h4 className="font-bold text-xs text-navy-800 line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex flex-col gap-0.5 text-[11px] text-slate-muted mt-1">
                        {locationText && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-solar-green shrink-0" />
                            <span className="truncate">{locationText}</span>
                          </span>
                        )}
                        {item.customerName && (
                          <span className="flex items-center gap-1 truncate">
                            <User className="w-3 h-3 text-solar-green shrink-0" />
                            <span className="truncate">{item.customerName}</span>
                          </span>
                        )}
                        {item.capacityKw && (
                          <span className="flex items-center gap-1 font-semibold text-navy-800">
                            <Zap className="w-3 h-3 text-solar-yellow fill-solar-yellow shrink-0" />
                            <span>{item.capacityKw} kW</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Ordering and Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                      {/* Up/Down order buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItem(idx, "up")}
                          disabled={idx === 0}
                          title="Move earlier"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-800 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveItem(idx, "down")}
                          disabled={idx === items.length - 1}
                          title="Move later"
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-800 flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Publish / Edit / Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePublished(item)}
                          title={item.isPublished ? "Published (click to hide)" : "Hidden (click to publish)"}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            item.isPublished
                              ? "bg-solar-green-light text-solar-green border-solar-green/30"
                              : "bg-slate-bg text-slate-muted border-slate-border"
                          }`}
                        >
                          {item.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit details"
                          className="p-1.5 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-100 border border-slate-border transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(item._id)}
                          title="Delete photograph"
                          className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-border max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
                  Photograph Details
                </span>
                <h3 className="text-xl font-bold font-display text-navy-800">
                  Edit Installation Information
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Photo Preview & Replacement */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-border">
                <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-navy-950 shrink-0">
                  <Image
                    src={editForm.imageUrl}
                    alt={editForm.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <p className="font-bold text-navy-800">Current Image File</p>
                  <p className="text-[11px] text-slate-muted break-all line-clamp-1">{editForm.imageUrl}</p>
                  <button
                    type="button"
                    onClick={() => replaceFileRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image File</span>
                  </button>
                  <input
                    ref={replaceFileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleReplaceImage}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-navy-800 block mb-1">
                  Title / Caption <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. Residential Rooftop Installation with Customer"
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                />
              </div>

              {/* Replace / Manage Photograph */}
              <CmsImageUploader
                label="Photograph File (Replace or Upload New)"
                value={editForm.imageUrl}
                onChange={(url) => setEditForm({ ...editForm, imageUrl: url })}
                folder="gallery"
                aspectRatio="portrait"
                helpText="Upload an authentic installation photograph with customer. Replaces existing image and saves to Cloudinary."
              />

              {/* Customer Name & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Customer Name (Optional)</label>
                  <input
                    type="text"
                    value={editForm.customerName}
                    onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">System Capacity (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.capacityKw}
                    onChange={(e) => setEditForm({ ...editForm, capacityKw: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                  />
                </div>
              </div>

              {/* Location: State & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">State</label>
                  <select
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs bg-white"
                  >
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-800 block mb-1">City / District</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    placeholder="e.g. Gaya / Patna / Ranchi"
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="font-bold text-navy-800 block mb-1">Installation Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs bg-white"
                >
                  <option value="Residential Rooftop">Residential Rooftop</option>
                  <option value="Commercial Solar">Commercial Solar</option>
                  <option value="Industrial Solar">Industrial Solar</option>
                  <option value="Agricultural Solar">Agricultural Solar</option>
                  <option value="Hybrid Battery Storage">Hybrid Battery Storage</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-navy-800 block mb-1">Optional Short Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Optional technical notes about the site or installation..."
                  className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green text-xs"
                />
              </div>

              {/* Toggles: Featured & Published */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isFeatured}
                    onChange={(e) => setEditForm({ ...editForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-solar-green rounded focus:ring-solar-green"
                  />
                  <span className="font-bold text-navy-800">Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isPublished}
                    onChange={(e) => setEditForm({ ...editForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-solar-green rounded focus:ring-solar-green"
                  />
                  <span className="font-bold text-navy-800">Publicly Visible</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-border">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-6 py-2 rounded-xl font-bold bg-solar-green text-white hover:bg-solar-green-hover shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-border space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-navy-800">Delete Installation Photograph?</h3>
              <p className="text-xs text-slate-muted mt-1">
                Are you sure you want to delete this customer photo? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-md flex items-center gap-1.5"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
