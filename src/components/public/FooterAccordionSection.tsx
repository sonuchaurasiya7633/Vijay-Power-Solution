"use client";

import { useState } from "react";
import { ChevronDown, Layers, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { VPS_EASE } from "@/components/ui/MotionPrimitives";

interface FooterAccordionSectionProps {
  title: string;
  iconName: "explore" | "tools";
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function FooterAccordionSection({
  title,
  iconName,
  children,
  defaultOpen = true,
}: FooterAccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="md:hidden rounded-2xl border border-solar-green/35 bg-[#071D31]/85 backdrop-blur-sm overflow-hidden shadow-lg shadow-black/20">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
      >
        <span className="flex items-center gap-2.5 text-xs font-extrabold uppercase tracking-wider text-white">
          {iconName === "explore" ? (
            <Layers className="w-4 h-4 text-solar-green shrink-0" />
          ) : (
            <Wrench className="w-4 h-4 text-solar-green shrink-0" />
          )}
          <span>{title}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-solar-green transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: VPS_EASE }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="px-3 py-1.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
