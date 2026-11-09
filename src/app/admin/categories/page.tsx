"use client";

import { useState, useEffect } from "react";
import { Layers, Plus, CheckCircle2, Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");

  const fetchCats = async () => {
    try {
      const res = await fetch("/api/products?adminMode=true");
      // Load distinct categories or categories from DB
      setCategories([
        { name: "Monocrystalline Solar Panels", slug: "monocrystalline-solar-panels", count: 2 },
        { name: "Mono PERC Solar Panels", slug: "mono-perc-solar-panels", count: 4 },
        { name: "Bifacial Solar Panels", slug: "bifacial-solar-panels", count: 3 },
        { name: "N-Type TOPCon Solar Panels", slug: "n-type-topcon-solar-panels", count: 1 },
        { name: "Heterojunction (HJT) Panels", slug: "hjt-solar-panels", count: 1 },
        { name: "Polycrystalline Solar Panels", slug: "polycrystalline-solar-panels", count: 2 },
        { name: "Half-Cut Cell Modules", slug: "half-cut-cell-solar-modules", count: 4 },
        { name: "Small-Wattage Modules", slug: "small-wattage-solar-modules", count: 2 },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Catalogue Taxonomy</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Solar Panel Technology Categories
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Non-mutually exclusive engineering categories (e.g. Mono PERC + Bifacial + Half-Cut).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div
            key={c.slug}
            className="p-5 rounded-2xl bg-white border border-slate-border shadow-sm space-y-2 hover:border-solar-green/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-solar-green-light text-solar-green flex items-center justify-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-navy-800">{c.name}</h3>
            <p className="text-xs text-slate-muted font-mono">{c.slug}</p>
            <span className="inline-block text-[11px] font-bold text-solar-green bg-slate-bg px-2 py-0.5 rounded">
              {c.count} Linked Products
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
