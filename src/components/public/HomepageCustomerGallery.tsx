"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Zap, Maximize2, ShieldCheck, Sparkles } from "lucide-react";
import GalleryLightbox, { GalleryItem } from "@/components/public/GalleryLightbox";

interface HomepageCustomerGalleryProps {
  initialItems: GalleryItem[];
}

export default function HomepageCustomerGallery({
  initialItems = [],
}: HomepageCustomerGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // If no items, fallback to empty
  if (!initialItems || initialItems.length === 0) {
    return null;
  }

  // Display top 6 featured on homepage
  const displayItems = initialItems.slice(0, 6);

  const openLightbox = (index: number) => {
    setActiveIdx(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-20 bg-slate-bg border-t border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-green-light border border-solar-green/20 text-solar-green text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Verified Customer Installations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            Our Successful Solar Installations
          </h2>
          <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
            Real Installations. Real Customers. Trusted Solar Solutions Across India.
          </p>
        </div>

        {/* Gallery Grid: Desktop 3 cols, Tablet 2 cols, Mobile 2 cols */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {displayItems.map((item, idx) => {
            const locationText = [item.city, item.state].filter(Boolean).join(", ");
            return (
              <div
                key={item._id || idx}
                onClick={() => openLightbox(idx)}
                className="group relative bg-white rounded-2xl sm:rounded-3xl border border-slate-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container with neutral frame to protect portrait/poster aspect ratios */}
                <div className="relative aspect-[4/5] sm:aspect-[4/3] w-full bg-navy-950/90 overflow-hidden flex items-center justify-center">
                  <Image
                    src={item.imageUrl}
                    alt={item.title || "Solar installation with customer"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain sm:object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-navy-950/20 group-hover:bg-navy-950/40 transition-colors" />

                  {/* Expand Icon pill */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 opacity-0 group-hover:opacity-100 transition-opacity bg-navy-900/80 backdrop-blur-md text-white p-2 rounded-xl border border-white/20 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-solar-yellow" />
                  </div>

                  {item.category && (
                    <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-navy-900/80 backdrop-blur-md text-[10px] sm:text-xs font-bold text-white border border-white/10 shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Caption Footer */}
                <div className="p-3 sm:p-5 space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-navy-800 line-clamp-1 group-hover:text-solar-green transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-muted pt-0.5">
                    {locationText ? (
                      <span className="inline-flex items-center gap-1 truncate max-w-[150px]">
                        <MapPin className="w-3 h-3 text-solar-green shrink-0" />
                        <span className="truncate">{locationText}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-solar-green font-semibold">
                        Verified Installation
                      </span>
                    )}

                    {item.capacityKw && (
                      <span className="inline-flex items-center gap-0.5 font-bold text-navy-800">
                        <Zap className="w-3 h-3 text-solar-yellow shrink-0 fill-solar-yellow" />
                        <span>{item.capacityKw} kW</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-navy-800 text-white hover:bg-navy-900 shadow-md hover:shadow-lg transition-all"
          >
            <span>View All Installations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Section 9: Trust and Conversion Design CTA */}
        <div className="mt-14 bg-gradient-to-r from-navy-900 via-navy-950 to-navy-900 text-white rounded-3xl p-6 sm:p-10 border border-navy-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-solar-yellow text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Pan India Rooftop Solar Network</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Your Solar Installation Could Be Next!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Planning to install solar panels? Connect with Vijoy Power Solution for reliable solar solutions across India.
            </p>
          </div>

          <Link
            href="/get-quote"
            className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-lg shadow-solar-green/25 whitespace-nowrap flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Get a Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={displayItems}
        currentIndex={activeIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(idx) => setActiveIdx(idx)}
      />
    </section>
  );
}
