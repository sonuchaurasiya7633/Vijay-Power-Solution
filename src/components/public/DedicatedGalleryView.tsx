"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Maximize2, MapPin, Zap, User, Sparkles } from "lucide-react";
import type { GalleryItem } from "@/components/public/GalleryLightbox";
import { optimizeCloudinaryUrl } from "@/lib/image-optimize";
import { motion } from "framer-motion";
import { VPS_EASE } from "@/components/ui/MotionPrimitives";

const GalleryLightbox = dynamic(() => import("@/components/public/GalleryLightbox"), {
  ssr: false,
});

interface DedicatedGalleryViewProps {
  items: GalleryItem[];
}

export default function DedicatedGalleryView({ items = [] }: DedicatedGalleryViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-border">
        <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-base font-bold text-navy-800">No Installation Photos Yet</h3>
        <p className="text-xs text-slate-muted mt-1">
          Photos of completed customer installations will appear here.
        </p>
      </div>
    );
  }

  // Categories list
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((i) => i.category === selectedCategory);

  const openLightbox = (idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Category filter tabs if there are distinct categories */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat as string}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-navy-800 text-white shadow-md"
                  : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid: Desktop 4 cols, Tablet 3 cols, Mobile 2 cols */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: VPS_EASE }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
      >
        {filteredItems.map((item, idx) => {
          const locationText = [item.city, item.state].filter(Boolean).join(", ");
          return (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.24), ease: VPS_EASE }}
              whileHover={{ y: -4 }}
              onClick={() => openLightbox(idx)}
              className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-border overflow-hidden shadow-sm hover:shadow-xl hover:border-solar-green/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Frame with neutral background & object-contain to preserve poster/portrait aspect ratios */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-navy-950/95 overflow-hidden flex items-center justify-center">
                <Image
                  src={optimizeCloudinaryUrl(item.imageUrl, 700)}
                  alt={item.title || "Solar installation with customer"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy-950/15 group-hover:bg-navy-950/35 transition-colors" />

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                  {item.category ? (
                    <span className="px-2 py-0.5 rounded-md bg-navy-900/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 shadow-sm">
                      {item.category}
                    </span>
                  ) : (
                    <span />
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900/80 backdrop-blur-md text-white p-1.5 rounded-lg border border-white/20 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5 text-solar-yellow" />
                  </div>
                </div>
              </div>

              {/* Card Information */}
              <div className="p-3 sm:p-4 space-y-1">
                <h3 className="font-bold text-xs sm:text-sm text-navy-800 line-clamp-1 group-hover:text-solar-green transition-colors">
                  {item.title}
                </h3>

                <div className="flex flex-col gap-0.5 pt-0.5 text-[10px] sm:text-[11px] text-slate-muted">
                  {locationText && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-solar-green shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </span>
                  )}
                  {item.customerName && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-solar-green shrink-0" />
                      <span className="truncate">{item.customerName}</span>
                    </span>
                  )}
                  {item.capacityKw && (
                    <span className="inline-flex items-center gap-1 font-semibold text-navy-800">
                      <Zap className="w-3 h-3 text-solar-yellow shrink-0 fill-solar-yellow" />
                      <span>{item.capacityKw} kW System</span>
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lightbox Modal - Lazy loaded only on demand */}
      {lightboxOpen && (
        <GalleryLightbox
          images={filteredItems}
          currentIndex={activeIdx}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(idx) => setActiveIdx(idx)}
        />
      )}
    </div>
  );
}
