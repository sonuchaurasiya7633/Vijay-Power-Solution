"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Trash2, Folder, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminMediaPage() {
  const [folder, setFolder] = useState("all");
  const [assets, setAssets] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  const loadAssets = () => {
    fetch(`/api/media?folder=${folder}`)
      .then((r) => r.json())
      .then((d) => setAssets(d.assets || []));
  };

  useEffect(() => {
    loadAssets();
  }, [folder]);

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
      loadAssets();
      setTimeout(() => setUploadMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setUploadMsg(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = "";
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
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
            <span className="text-[10px] text-slate-muted uppercase block">
              {a.folder} • {a.bytes ? `${Math.round(a.bytes / 1024)} KB` : "Asset"}
            </span>
          </div>
        ))}

        {/* Fallback Sample Assets */}
        {assets.length === 0 &&
          [
            { name: "rooftop-patna-10kw.jpg", folder: "projects", size: "340 KB", url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&q=80" },
            { name: "commercial-gaya-25kw.jpg", folder: "projects", size: "420 KB", url: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=400&q=80" },
            { name: "hybrid-ranchi-5kw.jpg", folder: "projects", size: "290 KB", url: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=400&q=80" },
            { name: "550w-waaree-bifacial.jpg", folder: "products", size: "180 KB", url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=400&q=80" },
          ].map((a, i) => (
            <div key={i} className="p-3 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2 group">
              <div className="relative h-28 w-full bg-slate-100 rounded-xl overflow-hidden">
                <Image src={a.url} alt={a.name} fill className="object-cover group-hover:scale-105 transition-transform" />
              </div>
              <p className="text-[11px] font-bold text-navy-800 truncate">{a.name}</p>
              <span className="text-[10px] text-slate-muted uppercase block">{a.folder} • {a.size}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
