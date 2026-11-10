"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, RefreshCw, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import toast from "@/lib/toast";

export interface CmsImageUploaderProps {
  label?: string;
  value?: string;
  initialImageUrl?: string;
  initialAltText?: string;
  initialTitle?: string;
  folder?: string;
  defaultFallback?: string;
  aspectRatio?: "square" | "video" | "banner" | "portrait" | "auto";
  aspectRatioLabel?: string;
  hint?: string;
  onChange: (data: any) => void;
  onRemove?: () => void;
}

export default function CmsImageUploader({
  label = "Upload or Replace Image",
  value,
  initialImageUrl = "",
  initialAltText = "",
  initialTitle = "",
  folder = "company",
  defaultFallback,
  aspectRatio = "auto",
  aspectRatioLabel,
  hint,
  onChange,
  onRemove,
}: CmsImageUploaderProps) {
  const effectiveInitial = value || initialImageUrl || defaultFallback || "";
  const [currentUrl, setCurrentUrl] = useState<string>(effectiveInitial);
  const [originalUrl] = useState<string>(effectiveInitial);
  const [altText, setAltText] = useState<string>(initialAltText);
  const [title, setTitle] = useState<string>(initialTitle);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Aspect ratio classes
  const aspectClass =
    aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "banner"
      ? "aspect-[21/9]"
      : aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : "aspect-video sm:aspect-[16/9]";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    // File validation: JPG, JPEG, PNG, WebP up to 10MB
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload JPG, PNG, or WebP.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      // 1. Request signature from API
      const signRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", folder }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || "Failed to get upload credentials");

      // 2. Direct upload to Cloudinary
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
        setCurrentUrl(cloudData.secure_url);
        const derivedTitle = title || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ");
        setTitle(derivedTitle);
        onChange({
          imageUrl: cloudData.secure_url,
          publicId: cloudData.public_id,
          altText: altText || derivedTitle,
          title: derivedTitle,
        });
        toast.success("Image uploaded successfully! Remember to save your page changes.");
      } else {
        throw new Error(cloudData.error?.message || "Upload to CDN failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRevert = () => {
    setCurrentUrl(originalUrl);
    onChange({
      imageUrl: originalUrl,
      altText,
      title,
    });
    toast.info("Image reverted to previous saved state.");
  };

  const handleRemove = () => {
    setCurrentUrl("");
    if (onRemove) onRemove();
    onChange({
      imageUrl: "",
      altText: "",
      title: "",
    });
    toast.warning("Image cleared. Click save to confirm removal.");
  };

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-border text-xs">
      <div className="flex items-center justify-between">
        <label className="font-bold text-navy-800">{label}</label>
        {currentUrl !== originalUrl && (
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Unsaved Changes
          </span>
        )}
      </div>

      {/* Image Preview & Replacement Box */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {currentUrl ? (
          <div
            className={`relative ${aspectClass} w-full sm:w-48 rounded-xl overflow-hidden bg-navy-950 border border-slate-border shrink-0 group`}
          >
            <Image
              src={currentUrl}
              alt={altText || "Image Preview"}
              fill
              className="object-contain"
            />
            <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm"
                title="Full Preview"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`w-full sm:w-48 ${aspectClass} rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 p-4 text-center shrink-0`}
          >
            <Upload className="w-6 h-6 mb-1 text-slate-300" />
            <span className="text-[11px] font-medium">No Image Uploaded</span>
          </div>
        )}

        <div className="space-y-2 w-full">
          <p className="text-[11px] text-slate-muted break-all font-mono line-clamp-1">
            {currentUrl || "No asset configured"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl font-bold bg-navy-800 text-white hover:bg-navy-900 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to CDN...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{currentUrl ? "Replace Image" : "Upload Image"}</span>
                </>
              )}
            </button>

            {currentUrl !== originalUrl && (
              <button
                type="button"
                onClick={handleRevert}
                className="px-3 py-1.5 rounded-xl font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              >
                Revert to Original
              </button>
            )}

            {currentUrl && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1.5 rounded-xl font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />

          <p className="text-[10px] text-slate-400">
            Supports JPG, PNG, WebP (max 10MB). Automatically optimized via Cloudinary CDN.
          </p>
        </div>
      </div>

      {/* Alt Text & Caption */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div>
          <label className="text-[11px] font-bold text-slate-muted block mb-0.5">Image Alt Text (SEO)</label>
          <input
            type="text"
            value={altText}
            onChange={(e) => {
              setAltText(e.target.value);
              onChange({ imageUrl: currentUrl, altText: e.target.value, title });
            }}
            placeholder="e.g. Solar rooftop panels installed on commercial building"
            className="w-full p-2 rounded-lg border border-slate-border outline-none focus:border-solar-green text-xs bg-white"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold text-slate-muted block mb-0.5">Image Title / Caption</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onChange({ imageUrl: currentUrl, altText, title: e.target.value });
            }}
            placeholder="e.g. Turnkey 10kW Solar Array"
            className="w-full p-2 rounded-lg border border-slate-border outline-none focus:border-solar-green text-xs bg-white"
          />
        </div>
      </div>

      {/* Full Preview Modal */}
      {previewModalOpen && currentUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div
            className="bg-navy-950 rounded-2xl max-w-4xl w-full p-4 border border-white/20 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="relative aspect-video w-full max-h-[75vh]">
              <Image src={currentUrl} alt={altText || "Preview"} fill className="object-contain" />
            </div>
            <div className="pt-3 text-center text-slate-300 text-xs">
              <p className="font-bold text-white">{title || "Image Preview"}</p>
              <p className="text-[11px] text-slate-400 break-all">{currentUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
