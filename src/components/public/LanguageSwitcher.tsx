"use client";

import React from "react";
import { ArrowLeftRight, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "navbar" | "mobile-header" | "mobile-drawer" | "footer";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "navbar",
  className = "",
}: LanguageSwitcherProps) {
  const { currentLang, toggleLanguage } = useLanguage();

  // Variant 1: Desktop Navbar (Premium Dual-Shuffle Pill)
  if (variant === "navbar") {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`group inline-flex items-center gap-2 h-9 px-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-solar-green/60 shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0 ${className}`}
        aria-label={`Current language is ${
          currentLang === "en" ? "English" : "हिन्दी"
        }. Click to shuffle language.`}
        title={
          currentLang === "en"
            ? "Switch to हिन्दी (Hindi)"
            : "Switch to English"
        }
      >
        <div className="w-5.5 h-5.5 rounded-full bg-solar-green-light text-solar-green flex items-center justify-center shrink-0 group-hover:bg-solar-green group-hover:text-white transition-colors duration-200">
          <Languages className="w-3 h-3 group-hover:rotate-12 transition-transform duration-200" />
        </div>

        <div className="flex items-center gap-1.5 text-xs leading-none">
          <span
            className={`transition-colors duration-150 ${
              currentLang === "en"
                ? "text-navy-900 font-extrabold"
                : "text-slate-400 font-semibold"
            }`}
          >
            EN
          </span>
          <ArrowLeftRight className="w-3 h-3 text-slate-300 group-hover:text-solar-green group-hover:rotate-180 transition-all duration-300 shrink-0" />
          <span
            className={`transition-colors duration-150 ${
              currentLang === "hi"
                ? "text-solar-green font-extrabold"
                : "text-slate-500 font-bold group-hover:text-solar-green"
            }`}
          >
            हिन्दी
          </span>
        </div>
      </button>
    );
  }

  // Variant 2: Mobile Header (Compact Shuffle Pill next to Call Button)
  if (variant === "mobile-header") {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`group inline-flex items-center gap-1.5 h-10 px-2.5 rounded-xl border border-slate-border bg-slate-bg text-navy-800 hover:bg-navy-50 shadow-2xs transition-all duration-200 cursor-pointer select-none active:scale-95 shrink-0 ${className}`}
        aria-label={`Current language: ${
          currentLang === "en" ? "English" : "Hindi"
        }. Tap to swap.`}
        title={
          currentLang === "en"
            ? "हिन्दी में बदलें"
            : "Switch to English"
        }
      >
        <div className="w-5 h-5 rounded-lg bg-solar-green/10 text-solar-green flex items-center justify-center shrink-0">
          <Languages className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-extrabold text-navy-800 leading-none">
          {currentLang === "en" ? "हिन्दी" : "EN"}
        </span>
      </button>
    );
  }

  // Variant 3: Card in Mobile Navigation Drawer
  if (variant === "mobile-drawer") {
    return (
      <div
        className={`p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center shrink-0 shadow-2xs">
            <Languages className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-navy-800 leading-tight">
              Language / भाषा
            </span>
            <span className="text-[11px] font-medium text-slate-500 leading-tight">
              Active:{" "}
              <strong className="text-solar-green font-extrabold">
                {currentLang === "en" ? "English" : "हिन्दी (Hindi)"}
              </strong>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="group inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-navy-800 hover:bg-navy-900 text-white text-xs font-extrabold shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
          title={
            currentLang === "en"
              ? "Click to switch to हिन्दी"
              : "Click to switch to English"
          }
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-solar-yellow group-hover:rotate-180 transition-transform duration-300 shrink-0" />
          <span>{currentLang === "en" ? "हिन्दी" : "English"}</span>
        </button>
      </div>
    );
  }

  // Variant 4: Footer Switcher
  return (
    <div className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="text-slate-400">Language:</span>
      <button
        type="button"
        onClick={toggleLanguage}
        className="group inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-[11px] font-bold transition-all duration-200 cursor-pointer active:scale-95"
        title={
          currentLang === "en"
            ? "Click to switch to हिन्दी"
            : "Click to switch to English"
        }
      >
        <Languages className="w-3 h-3 text-solar-green shrink-0" />
        <span className={currentLang === "en" ? "text-white font-extrabold" : "text-slate-300"}>
          EN
        </span>
        <ArrowLeftRight className="w-2.5 h-2.5 text-solar-yellow group-hover:rotate-180 transition-transform duration-300 shrink-0" />
        <span className={currentLang === "hi" ? "text-solar-yellow font-extrabold" : "text-slate-300"}>
          हिन्दी
        </span>
      </button>
    </div>
  );
}
