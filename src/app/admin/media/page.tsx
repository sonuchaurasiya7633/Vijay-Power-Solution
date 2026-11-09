"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Upload, Trash2, Folder, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function AdminMediaPage() {
  const [folder, setFolder] = useState("all");
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/media?folder=${folder}`)
      .then((r) => r.json())
      .then((d) => setAssets(d.assets || []));
  }, [folder]);

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
            Centralized media assets, video walkthroughs, and optimized responsive images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2 rounded-xl text-xs font-bold bg-solar-green text-white hover:bg-solar-green-hover cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New Asset</span>
            <input type="file" className="hidden" />
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

        {/* Demo assets */}
        {[
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
