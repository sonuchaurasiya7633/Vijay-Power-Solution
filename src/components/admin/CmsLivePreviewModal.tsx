"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, X } from "lucide-react";
import { motion } from "framer-motion";
import { VPS_EASE } from "@/components/ui/MotionPrimitives";

interface CmsLivePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  pageTitle?: string;
}

export default function CmsLivePreviewModal({
  isOpen,
  onClose,
  url,
  pageTitle = "Page Preview",
}: CmsLivePreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [key, setKey] = useState(0);

  if (!isOpen) return null;

  const reloadIframe = () => {
    setKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (device) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      default:
        return "w-full max-w-6xl";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy-950/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.24, ease: VPS_EASE }}
        className="bg-white rounded-3xl w-full h-[94vh] shadow-2xl border border-slate-border flex flex-col overflow-hidden"
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-border bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-navy-800 uppercase tracking-wider">
              Live Preview:
            </span>
            <span className="text-xs font-semibold text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
              {pageTitle}
            </span>
          </div>

          {/* Device Switcher */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-border shadow-sm">
            <button
              onClick={() => setDevice("desktop")}
              title="Desktop View"
              className={`p-1.5 rounded-lg transition-colors ${
                device === "desktop" ? "bg-navy-800 text-white" : "text-slate-500 hover:text-navy-800"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              title="Tablet View (768px)"
              className={`p-1.5 rounded-lg transition-colors ${
                device === "tablet" ? "bg-navy-800 text-white" : "text-slate-500 hover:text-navy-800"
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("mobile")}
              title="Mobile View (375px)"
              className={`p-1.5 rounded-lg transition-colors ${
                device === "mobile" ? "bg-navy-800 text-white" : "text-slate-500 hover:text-navy-800"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={reloadIframe}
              title="Refresh Preview"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open Public Tab"
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              title="Close Preview"
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="flex-1 bg-slate-200/70 p-2 sm:p-4 flex items-center justify-center overflow-auto">
          <div
            className={`${getContainerWidth()} h-full bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden transition-all duration-300 flex flex-col`}
          >
            <iframe
              key={key}
              src={url}
              title={pageTitle}
              className="w-full h-full border-none bg-white"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
