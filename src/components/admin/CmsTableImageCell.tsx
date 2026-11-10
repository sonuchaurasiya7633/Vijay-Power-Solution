"use client";

import { useState, useRef } from "react";
import { Upload, Trash2, Eye, Loader2, Image as ImageIcon, RefreshCw, X } from "lucide-react";
import toast from "@/lib/toast";

interface CmsTableImageCellProps {
  imageUrl?: string;
  title: string;
  folder?: string;
  onUpdate: (newUrl: string) => Promise<void> | void;
  onDelete: () => Promise<void> | void;
  aspect?: "square" | "video" | "card" | "avatar";
}

export default function CmsTableImageCell({
  imageUrl,
  title,
  folder = "products",
  onUpdate,
  onDelete,
  aspect = "square",
}: CmsTableImageCellProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // Validate size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.warning("File is larger than 10MB. Please choose an optimized image.");
      return;
    }

    // Validate format
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.warning("Unsupported file type. Please upload a JPG, PNG, or WebP image.");
      return;
    }

    setUploading(true);
    try {
      // 1. Request upload signature
      const signRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", folder }),
      });

      const signData = await signRes.json();
      if (!signRes.ok) {
        throw new Error(signData.error || "Failed to get upload authorization");
      }

      // 2. Upload directly to Cloudinary
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
      if (!cloudRes.ok || !cloudData.secure_url) {
        throw new Error(cloudData.error?.message || "Cloudinary upload failed");
      }

      // 3. Persist update
      await onUpdate(cloudData.secure_url);
      toast.success("Image uploaded & replaced successfully!");
    } catch (err: any) {
      console.error("[CmsTableImageCell Upload Error]", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove the image for "${title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete();
      toast.deleted("Image removed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  const getDimensionsClass = () => {
    switch (aspect) {
      case "card":
        return "w-full h-44 rounded-t-2xl";
      case "avatar":
        return "w-10 h-10 rounded-full";
      case "video":
        return "w-20 h-12 rounded-xl";
      case "square":
      default:
        return "w-14 h-14 rounded-xl";
    }
  };

  const dimensionsClass = getDimensionsClass();

  return (
    <div className="relative group shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {imageUrl ? (
        <div
          className={`${dimensionsClass} rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs relative shrink-0`}
        >
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.currentTarget.src = "/images/hero-solar-rooftop.jpg";
            }}
            className="w-full h-full object-cover"
          />

          {/* Hover Action Overlay */}
          <div className="absolute inset-0 bg-navy-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || deleting}
              title="Replace / Upload New Image"
              className="w-6 h-6 rounded-md bg-solar-green hover:bg-solar-green-hover text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              title="View Full Image"
              className="w-6 h-6 rounded-md bg-white/90 hover:bg-white text-navy-800 flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
            >
              <Eye className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={uploading || deleting}
              title="Delete / Remove Image"
              className="w-6 h-6 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          {/* Uploading / Deleting Spinner */}
          {(uploading || deleting) && (
            <div className="absolute inset-0 bg-navy-950/85 flex items-center justify-center text-white z-20">
              <Loader2 className="w-4 h-4 animate-spin text-solar-yellow" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload Photo"
          className={`${dimensionsClass} rounded-xl border-2 border-dashed border-slate-300 hover:border-solar-green bg-slate-50 hover:bg-solar-green/5 flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-solar-green transition-all cursor-pointer`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-solar-green" />
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span className="text-[9px] font-bold">+ Upload</span>
            </>
          )}
        </button>
      )}

      {/* Lightbox Preview Modal */}
      {previewOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewOpen(false)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-border p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-800 truncate pr-4">{title}</h4>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative w-full max-h-[60vh] overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={title}
                onError={(e) => {
                  e.currentTarget.src = "/images/hero-solar-rooftop.jpg";
                }}
                className="max-h-[60vh] w-auto object-contain mx-auto"
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 font-mono text-[11px] truncate max-w-sm">{imageUrl}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-solar-green hover:bg-solar-green-hover text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewOpen(false);
                    handleDelete();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete Photo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
