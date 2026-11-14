"use client";

import React from "react";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "navbar" | "mobile-header" | "mobile-drawer" | "footer";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "navbar",
  className = "",
}: LanguageSwitcherProps) {
  const { currentLang, setLanguage, toggleLanguage } = useLanguage();

  // Variant 1: Desktop Navbar Segmented Pill [ EN | हिंदी ]
  if (variant === "navbar") {
    return (
      <div
        className={`inline-flex items-center rounded-xl bg-slate-100/90 border border-slate-200/90 p-1 shadow-2xs ${className}`}
        role="group"
        aria-label="Language selector"
      >
        <span className="pl-2 pr-1 text-slate-500 flex items-center shrink-0">
          <Globe className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
        </span>

        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
            currentLang === "en"
              ? "bg-navy-800 text-white shadow-2xs"
              : "text-slate-600 hover:text-navy-800 hover:bg-white/60"
          }`}
          title="Switch to English"
          aria-pressed={currentLang === "en"}
        >
          EN
        </button>

        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer ${
            currentLang === "hi"
              ? "bg-solar-green text-white shadow-2xs"
              : "text-slate-600 hover:text-solar-green hover:bg-white/60"
          }`}
          title="हिंदी में देखें"
          aria-pressed={currentLang === "hi"}
        >
          हिंदी
        </button>
      </div>
    );
  }

  // Variant 2: Compact Mobile Header Button (Next to phone icon)
  if (variant === "mobile-header") {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`h-10 px-2.5 rounded-xl border border-slate-border bg-slate-bg text-navy-800 flex items-center gap-1.5 hover:bg-navy-50 transition-colors shadow-2xs cursor-pointer ${className}`}
        aria-label={`Current language: ${currentLang === "en" ? "English" : "Hindi"}. Tap to switch.`}
        title={currentLang === "en" ? "हिंदी में बदलें" : "Switch to English"}
      >
        <Globe className="w-3.5 h-3.5 text-solar-green shrink-0" />
        <span className="text-xs font-extrabold uppercase tracking-tight">
          {currentLang === "en" ? "हिं" : "EN"}
        </span>
      </button>
    );
  }

  // Variant 3: Prominent Card in Mobile Navigation Drawer
  if (variant === "mobile-drawer") {
    return (
      <div className={`p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold text-navy-800">
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-solar-green" />
            <span>Select Language / भाषा चुनें</span>
          </span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            {currentLang === "en" ? "English" : "हिंदी"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentLang === "en"
                ? "bg-navy-800 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {currentLang === "en" && <Check className="w-3.5 h-3.5 text-solar-green" />}
            <span>English</span>
          </button>

          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`h-11 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentLang === "hi"
                ? "bg-solar-green text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {currentLang === "hi" && <Check className="w-3.5 h-3.5 text-white" />}
            <span>हिंदी (Hindi)</span>
          </button>
        </div>
      </div>
    );
  }

  // Variant 4: Footer Switcher
  return (
    <div className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="text-slate-400 flex items-center gap-1">
        <Globe className="w-3.5 h-3.5 text-solar-green" />
        <span>Language:</span>
      </span>
      <div className="inline-flex rounded-lg bg-white/10 p-0.5 border border-white/15">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
            currentLang === "en"
              ? "bg-solar-green text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
            currentLang === "hi"
              ? "bg-solar-green text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          हिंदी
        </button>
      </div>
    </div>
  );
}
