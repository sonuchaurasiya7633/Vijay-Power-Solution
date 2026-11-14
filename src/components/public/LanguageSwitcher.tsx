"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "navbar" | "mobile-header" | "mobile-drawer" | "footer";
  className?: string;
}

export default function LanguageSwitcher({
  variant = "navbar",
  className = "",
}: LanguageSwitcherProps) {
  const { currentLang, setLanguage } = useLanguage();

  // Variant 1 & 2: Desktop Navbar & Mobile Header (Exact Pill Design from Reference Image)
  if (variant === "navbar" || variant === "mobile-header") {
    const isMobile = variant === "mobile-header";
    return (
      <div
        className={`inline-flex items-center rounded-full bg-white border border-[#E2E6E4] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.05)] select-none shrink-0 ${className}`}
        role="group"
        aria-label="Language selector"
      >
        {/* EN Button */}
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`cursor-pointer rounded-[14px] font-extrabold transition-all duration-150 flex items-center justify-center leading-none ${
            isMobile ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
          } ${
            currentLang === "en"
              ? "bg-[#1E4E38] text-white shadow-2xs"
              : "bg-transparent text-[#5C6670] hover:text-[#102D48]"
          }`}
          title="Switch to English"
          aria-pressed={currentLang === "en"}
        >
          EN
        </button>

        {/* हिन्दी Button */}
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`cursor-pointer rounded-[14px] font-extrabold transition-all duration-150 flex items-center justify-center leading-none ${
            isMobile ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"
          } ${
            currentLang === "hi"
              ? "bg-[#1E4E38] text-white shadow-2xs"
              : "bg-transparent text-[#5C6670] hover:text-[#1E4E38]"
          }`}
          title="हिन्दी में देखें"
          aria-pressed={currentLang === "hi"}
        >
          हिन्दी
        </button>
      </div>
    );
  }

  // Variant 3: Card in Mobile Navigation Drawer
  if (variant === "mobile-drawer") {
    return (
      <div className={`p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold text-navy-800">
          <span>Select Language / भाषा चुनें</span>
          <span className="text-[11px] font-semibold text-slate-500 uppercase">
            {currentLang === "en" ? "English" : "हिन्दी"}
          </span>
        </div>

        <div className="inline-flex w-full items-center rounded-full bg-white border border-[#E2E6E4] p-1 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`flex-1 h-10 rounded-full text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
              currentLang === "en"
                ? "bg-[#1E4E38] text-white shadow-2xs"
                : "text-[#5C6670] hover:text-[#102D48]"
            }`}
          >
            EN (English)
          </button>

          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className={`flex-1 h-10 rounded-full text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
              currentLang === "hi"
                ? "bg-[#1E4E38] text-white shadow-2xs"
                : "text-[#5C6670] hover:text-[#1E4E38]"
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>
      </div>
    );
  }

  // Variant 4: Footer Switcher
  return (
    <div className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="text-slate-400">Language:</span>
      <div className="inline-flex items-center rounded-full bg-white/10 border border-white/15 p-0.5">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-colors cursor-pointer ${
            currentLang === "en"
              ? "bg-[#1E4E38] text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("hi")}
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold transition-colors cursor-pointer ${
            currentLang === "hi"
              ? "bg-[#1E4E38] text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
