"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Plus, Zap, CheckCircle2, Loader2, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products?adminMode=true");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !currentStatus }),
    });
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product from the catalogue?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Catalogue CMS</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Solar Panels (10W to 730W)
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Verified engineering module catalogue. Strictly non-ecommerce (no public pricing).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-muted flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
            <span>Loading product catalogue...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No products found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
                <tr>
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Rated Power</th>
                  <th className="p-4">Group</th>
                  <th className="p-4">Efficiency</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-bg/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-navy-800">{p.productId}</td>
                    <td className="p-4 font-bold text-navy-800 max-w-xs truncate">{p.name}</td>
                    <td className="p-4 text-slate-muted">{p.brand}</td>
                    <td className="p-4 font-extrabold text-navy-800">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-solar-green fill-current" />
                        <span>{p.ratedPowerWp} Wp</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-muted">{p.wattageGroup}</td>
                    <td className="p-4 font-semibold text-navy-800">{p.moduleEfficiencyPercent ? `${p.moduleEfficiencyPercent}%` : "-"}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          p.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(p._id, p.isPublished)}
                        className="px-2.5 py-1 rounded-lg border border-slate-border text-navy-800 hover:bg-slate-50 font-bold text-[11px]"
                      >
                        {p.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <Link
                        href={`/solar-panels/${p.slug}`}
                        target="_blank"
                        className="px-2 py-1 rounded-lg bg-navy-50 text-navy-800 hover:bg-navy-800 hover:text-white font-bold text-[11px]"
                      >
                        Preview
                      </Link>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        className="p-1 rounded text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
