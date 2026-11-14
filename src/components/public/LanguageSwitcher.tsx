"use client";

import React from "react";
import { ArrowLeftRight } from "lucide-react";
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

  // Variant 1 & 2: Desktop Navbar & Mobile Header (Small Shuffle Button)
  if (variant === "navbar" || variant === "mobile-header") {
    const isMobile = variant === "mobile-header";
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        className={`group inline-flex items-center gap-1.5 rounded-full bg-[#1E4E38] hover:bg-[#163C2B] text-white border border-[#1E4E38] shadow-2xs transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          isMobile ? "h-9 px-3 text-xs" : "h-8.5 px-3.5 text-xs sm:text-[13px]"
        } ${className}`}
        aria-label={`Current language: ${
          currentLang === "en" ? "English" : "हिन्दी"
        }. Click to switch to ${currentLang === "en" ? "Hindi" : "English"}.`}
        title={
          currentLang === "en"
            ? "Click to switch to हिन्दी"
            : "Click to switch to English"
        }
      >
        <ArrowLeftRight
          className="w-3.5 h-3.5 text-solar-yellow group-hover:rotate-180 transition-transform duration-300 shrink-0"
          aria-hidden="true"
        />
        <span className="font-extrabold tracking-wide leading-none">
          {currentLang === "en" ? "हिन्दी" : "English"}
        </span>
      </button>
    );
  }

  // Variant 3: Compact Card in Mobile Navigation Drawer
  if (variant === "mobile-drawer") {
    return (
      <div
        className={`p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold text-navy-800">
            Language / भाषा
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            Currently:{" "}
            <strong className="text-[#1E4E38]">
              {currentLang === "en" ? "English" : "हिन्दी"}
            </strong>
          </span>
        </div>

        <button
          type="button"
          onClick={toggleLanguage}
          className="group inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#1E4E38] hover:bg-[#163C2B] text-white text-xs font-extrabold shadow-2xs transition-all duration-200 cursor-pointer active:scale-95"
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
        className="group inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-[#1E4E38] hover:bg-[#163C2B] text-white text-[11px] font-extrabold transition-all duration-200 cursor-pointer active:scale-95"
        title={
          currentLang === "en"
            ? "Click to switch to हिन्दी"
            : "Click to switch to English"
        }
      >
        <ArrowLeftRight className="w-3 h-3 text-solar-yellow group-hover:rotate-180 transition-transform duration-300 shrink-0" />
        <span>{currentLang === "en" ? "हिन्दी" : "English"}</span>
      </button>
    </div>
  );
}
