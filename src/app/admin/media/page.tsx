"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "@/lib/toast";
import { Image as ImageIcon, Upload, Trash2, Folder, ShieldAlert, CheckCircle2 } from "lucide-react";
import { SolarEmblemSpinner } from "@/components/ui/SolarLoader";

export default function AdminMediaPage() {
  const [folder, setFolder] = useState("all");
  const [assets, setAssets] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const loadAssets = useCallback(() => {
    fetch(`/api/media?folder=${folder}`)
      .then((r) => r.json())
      .then((d) => setAssets(d.assets || []));
  }, [folder]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMsg("Requesting Cloudinary signature...");

    try {
      const targetFolder = folder === "all" ? "company" : folder;
      // 1. Get signed params
      const signRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sign", folder: `vps_solar/${targetFolder}` }),
      });
      const signData = await signRes.json();

      if (!signRes.ok) {
        throw new Error(signData.error || "Failed to generate signature");
      }

      setUploadMsg("Uploading directly to Cloudinary...");
      // 2. Direct upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", String(signData.timestamp));
      formData.append("signature", signData.signature);
      formData.append("folder", signData.folder);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${signData.cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const cldData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(cldData.error?.message || "Cloudinary upload failed");
      }

      setUploadMsg("Saving asset record...");
      // 3. Save asset record to DB
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cldData.secure_url,
          publicId: cldData.public_id,
          name: file.name,
          folder: targetFolder,
          format: cldData.format || "img",
          bytes: cldData.bytes,
          resourceType: cldData.resource_type || "image",
          altText: file.name.replace(/\.[^/.]+$/, ""),
        }),
      });

      setUploadMsg("Upload successful!");
      toast.uploaded("Uploaded successfully!", `${file.name} uploaded to ${targetFolder}.`);
      loadAssets();
      setTimeout(() => setUploadMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Failed to upload asset";
      setUploadMsg(`Error: ${msg}`);
      toast.error(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete asset "${name}"?`)) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.deleted("Deleted successfully!", `Asset "${name}" removed.`);
        loadAssets();
      } else {
        toast.error(data.error || "Failed to delete asset");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete asset");
    }
  };

  const folders = ["all", "company", "products", "services", "projects", "testimonials", "videos"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Asset Pipeline</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Cloudinary Media Library
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Cloudinary Cloud: <code className="text-solar-green font-mono">dqpbo1uho</code> • Optimized responsive images & video walkthroughs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {uploadMsg && (
            <span className="text-xs font-medium text-navy-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-border">
              {uploadMsg}
            </span>
          )}
          <label className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm">
            {uploading ? (
              <SolarEmblemSpinner size="xs" variant="white" label="Uploading asset" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploading ? "Uploading..." : "Upload New Asset"}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept="image/*,video/*"
            />
          </label>
        </div>
      </div>

      {/* Folder Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {folders.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              folder === f
                ? "bg-navy-800 text-white shadow-sm"
                : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Company Logo Asset */}
        <div className="p-3 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2 group">
          <div className="relative h-28 w-full bg-navy-800 rounded-xl overflow-hidden p-2">
            <Image src="/images/logo.png" alt="Company Logo" fill className="object-contain p-2" />
          </div>
          <p className="text-[11px] font-bold text-navy-800 truncate">logo.png</p>
          <span className="text-[10px] text-slate-muted uppercase block">company • 45 KB</span>
        </div>

        {/* Database Assets */}
        {assets.map((a) => (
          <div key={a._id} className="p-3 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2 group">
            <div className="relative h-28 w-full bg-slate-100 rounded-xl overflow-hidden">
              <Image
                src={a.url || a.secureUrl}
                alt={a.altText || a.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <p className="text-[11px] font-bold text-navy-800 truncate">{a.name}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-muted uppercase block">
                {a.folder} • {a.bytes ? `${Math.round(a.bytes / 1024)} KB` : "Asset"}
              </span>
              <button
                onClick={() => handleDelete(a._id, a.name)}
                title="Delete asset"
                className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {assets.length === 0 && (
          <div className="col-span-full p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
            <p className="text-sm font-bold text-navy-800">No Media Assets Uploaded Yet</p>
            <p className="text-xs text-slate-muted">
              Upload new product, solution, service, or blog photos using the upload button above or directly inside each Admin CMS module.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
