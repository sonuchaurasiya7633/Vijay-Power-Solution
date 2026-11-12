"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Zap, User, Tag } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/lib/image-optimize";
import { AnimatePresence, motion } from "framer-motion";
import { VPS_EASE } from "@/components/ui/MotionPrimitives";

export interface GalleryItem {
  _id?: string;
  imageUrl: string;
  title: string;
  customerName?: string;
  city?: string;
  state?: string;
  category?: string;
  capacityKw?: number;
  description?: string;
}

interface GalleryLightboxProps {
  images: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function GalleryLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const currentItem = images[currentIndex];

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex - 1 + images.length) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIdx = (currentIndex + 1) % images.length;
    onNavigate(nextIdx);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation & body scroll locking
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (!isOpen || !currentItem) return null;

  const locationText = [currentItem.city, currentItem.state].filter(Boolean).join(", ");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen image preview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-200 animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Bar Header */}
      <div
        className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm border border-white/10">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="hidden sm:inline-block text-xs text-slate-300 font-medium truncate max-w-md">
            {currentItem.title}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close image preview"
          className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative w-full h-full max-h-[82vh] max-w-6xl mx-auto flex items-center justify-center p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.imageUrl + currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: VPS_EASE }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src={optimizeCloudinaryUrl(currentItem.imageUrl, 1600)}
              alt={currentItem.title || "Solar Installation"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-contain"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons (Desktop & Tablet) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous photograph"
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next photograph"
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/30 text-white items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Caption & Project Details Bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-5 px-4 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto text-center space-y-1.5">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight">
            {currentItem.title}
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-300">
            {locationText && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-solar-yellow shrink-0" />
                <span>{locationText}</span>
              </span>
            )}
            {currentItem.customerName && (
              <span className="inline-flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-solar-green shrink-0" />
                <span>Customer: {currentItem.customerName}</span>
              </span>
            )}
            {currentItem.capacityKw && (
              <span className="inline-flex items-center gap-1 font-semibold text-solar-yellow">
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>{currentItem.capacityKw} kW Capacity</span>
              </span>
            )}
            {currentItem.category && (
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                <span>{currentItem.category}</span>
              </span>
            )}
          </div>

          {currentItem.description && (
            <p className="text-xs text-slate-400 max-w-xl mx-auto pt-1 line-clamp-2">
              {currentItem.description}
            </p>
          )}

          {/* Mobile Navigation Indicators */}
          <div className="sm:hidden pt-2 flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-bold"
            >
              ← Prev
            </button>
            <span className="text-[11px] text-slate-400">Swipe Left / Right</span>
            <button
              onClick={handleNext}
              className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-bold"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
