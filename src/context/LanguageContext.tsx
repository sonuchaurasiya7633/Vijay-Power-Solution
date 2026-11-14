"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

export type SupportedLanguage = "en" | "hi";

interface LanguageContextType {
  currentLang: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  isReady: false,
});

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

function setGoogTransCookie(lang: SupportedLanguage) {
  const value = lang === "hi" ? "/en/hi" : "/en/en";
  const host = typeof window !== "undefined" ? window.location.hostname : "";

  // Set for current path
  document.cookie = `googtrans=${value}; path=/; max-age=31536000; SameSite=Lax`;

  // Set for root domain if applicable
  if (host && !host.includes("localhost") && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    document.cookie = `googtrans=${value}; path=/; domain=${host}; max-age=31536000; SameSite=Lax`;
    const parts = host.split(".");
    if (parts.length >= 2) {
      const rootDomain = parts.slice(-2).join(".");
      document.cookie = `googtrans=${value}; path=/; domain=.${rootDomain}; max-age=31536000; SameSite=Lax`;
    }
  }

  // If returning to English, also expire blank cookies to clear cached translations
  if (lang === "en") {
    const expired = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; ${expired}`;
    if (host && !host.includes("localhost") && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      document.cookie = `googtrans=; ${expired} domain=${host};`;
      const parts = host.split(".");
      if (parts.length >= 2) {
        const rootDomain = parts.slice(-2).join(".");
        document.cookie = `googtrans=; ${expired} domain=.${rootDomain};`;
      }
    }
  }
}

function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem("vps_language");
    if (stored === "hi" || stored === "en") return stored;

    // Check googtrans cookie
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (match && match[1]) {
      if (match[1].endsWith("/hi")) return "hi";
    }
  } catch {
    // ignore
  }
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentLang, setCurrentLangState] = useState<SupportedLanguage>("en");
  const [isReady, setIsReady] = useState(false);

  // Initialize stored language preference on mount
  useEffect(() => {
    const saved = getStoredLanguage();
    if (saved !== "en") {
      setCurrentLangState(saved);
    }
  }, []);

  // Dynamically load Google Translate element script
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi",
            autoDisplay: false,
          },
          "google_translate_element"
        );
        setIsReady(true);
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      setIsReady(true);
    }
  }, []);

  // Trigger DOM translation using Google's select element
  const triggerTranslation = useCallback((targetLang: SupportedLanguage) => {
    if (typeof window === "undefined") return;

    setGoogTransCookie(targetLang);
    try {
      localStorage.setItem("vps_language", targetLang);
    } catch {
      // ignore
    }

    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event("change"));
    } else {
      // Fallback reload if combo element is not ready or when reverting cleanly to English
      window.location.reload();
    }
  }, []);

  // Public setter
  const setLanguage = useCallback(
    (lang: SupportedLanguage) => {
      if (lang === currentLang) return;
      setCurrentLangState(lang);
      triggerTranslation(lang);
    },
    [currentLang, triggerTranslation]
  );

  // Toggle between English and Hindi
  const toggleLanguage = useCallback(() => {
    const nextLang = currentLang === "en" ? "hi" : "en";
    setLanguage(nextLang);
  }, [currentLang, setLanguage]);

  // Maintain Hindi translation across client-side route navigations
  useEffect(() => {
    if (currentLang === "hi" && typeof window !== "undefined") {
      const timer = setTimeout(() => {
        const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (select && select.value !== "hi") {
          select.value = "hi";
          select.dispatchEvent(new Event("change"));
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, currentLang]);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        toggleLanguage,
        isReady,
      }}
    >
      {/* Hidden container for Google Translate element */}
      <div
        id="google_translate_element"
        className="hidden"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
