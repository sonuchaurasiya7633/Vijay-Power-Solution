"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon, RefreshCw, Eye, CheckCircle2 } from "lucide-react";
import toast from "@/lib/toast";

interface CmsImageUploaderProps {
  label?: string;
  value: string;
  onChange: (url: string, publicId?: string) => void;
  folder?: string;
  altText?: string;
  onAltChange?: (alt: string) => void;
  aspectRatio?: "video" | "square" | "banner" | "portrait" | "auto";
  helpText?: string;
  previewHeightClass?: string;
}

export default function CmsImageUploader({
  label = "Upload or Replace Image",
  value,
  onChange,
  folder = "company",
  altText,
  onAltChange,
  aspectRatio = "auto",
  helpText = "Supports JPG, PNG, WEBP up to 10MB. Images are optimized and hosted on Cloudinary CDN.",
  previewHeightClass = "h-40",
}: CmsImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
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

      // 3. Update state & notify
      onChange(cloudData.secure_url, cloudData.public_id);
      setManualUrl(cloudData.secure_url);
      toast.success("Image uploaded & replaced successfully!");
    } catch (err: any) {
      console.error("[CmsImageUploader Error]", err);
      toast.error(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setShowUrlInput(false);
    toast.success("Image URL updated!");
  };

  const handleClearImage = () => {
    onChange("");
    setManualUrl("");
    toast.info("Image cleared. Click Save to persist changes.");
  };

  // Aspect ratio helper
  const getAspectClass = () => {
    switch (aspectRatio) {
      case "video":
        return "aspect-video";
      case "square":
        return "aspect-square";
      case "banner":
        return "aspect-[21/9]";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return previewHeightClass;
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-navy-800 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-solar-green" />
            <span>{label}</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] font-semibold text-solar-green hover:underline"
            >
              {showUrlInput ? "Hide Direct URL" : "Enter Direct URL"}
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClearImage}
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Direct URL input accordion */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-border rounded-xl animate-fadeIn">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://... or /images/..."
            className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-border bg-white outline-none focus:border-solar-green"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-navy-800 text-white hover:bg-navy-900"
          >
            Apply
          </button>
        </div>
      )}

      {/* Main Image Box & Controls */}
      <div className="relative border-2 border-dashed border-slate-border hover:border-solar-green/50 rounded-2xl p-3 bg-slate-50/70 transition-colors">
        {value ? (
          <div className="space-y-3">
            <div
              className={`relative w-full ${getAspectClass()} rounded-xl overflow-hidden bg-navy-950 flex items-center justify-center group`}
            >
              <img
                src={value}
                alt={altText || "CMS Image"}
                onError={(e) => {
                  e.currentTarget.src = "/images/hero-solar-rooftop.jpg";
                }}
                className="w-full h-full object-contain"
              />

              {/* Hover overlay with action pills */}
              <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg bg-solar-green text-white text-xs font-bold shadow-md hover:bg-solar-green-hover flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/90 text-navy-800 text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Delete Photo</span>
                </button>
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-navy-950/80 flex flex-col items-center justify-center gap-2 text-white">
                  <Loader2 className="w-6 h-6 animate-spin text-solar-yellow" />
                  <span className="text-xs font-semibold">Uploading to Cloudinary CDN...</span>
                </div>
              )}
            </div>

            {/* Quick action bar beneath preview */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-muted">
              <span className="truncate max-w-xs">{value}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="font-bold text-solar-green hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearImage}
                  disabled={uploading}
                  className="font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Delete Photo</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-8 px-4 text-center cursor-pointer hover:bg-white rounded-xl transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-solar-green" />
                <p className="text-xs font-bold text-navy-800">Uploading to Cloudinary CDN...</p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-solar-green-light flex items-center justify-center text-solar-green mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-navy-800">
                  Click to choose a file or drag & drop
                </p>
                <p className="text-[11px] text-slate-muted mt-0.5">{helpText}</p>
              </>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Optional Alt Text Input */}
      {onAltChange && (
        <div className="pt-1">
          <label className="text-[11px] font-semibold text-slate-muted block mb-0.5">
            Accessibility / SEO Alt Text
          </label>
          <input
            type="text"
            value={altText || ""}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Describe the image content for SEO and screen readers..."
            className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-border bg-white outline-none focus:border-solar-green"
          />
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewModalOpen && value && (
        <div
          onClick={() => setPreviewModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[85vh] bg-navy-900 rounded-3xl p-4 border border-navy-700 shadow-2xl flex flex-col items-center"
          >
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-[70vh] flex items-center justify-center">
              <Image
                src={value}
                alt="Full View Preview"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-full text-center text-xs text-slate-300 pt-3 border-t border-navy-700 truncate">
              {value}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
