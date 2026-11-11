"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { ShieldCheck, X } from "lucide-react";

const CONSENT_STORAGE_KEY = "vps_analytics_consent_v1";

export default function GoogleAnalyticsConsent({
  ga4MeasurementId,
  enableConsentBanner = true,
}: {
  ga4MeasurementId?: string;
  enableConsentBanner?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const lastTrackedPath = useRef<string>("");
  const [consentChoice, setConsentChoice] = useState<
    "granted" | "denied" | "unset"
  >("unset");
  const [mounted, setMounted] = useState(false);

  const cleanGaId = (ga4MeasurementId || "").trim();
  const hasGa4 = /^G-[A-Z0-9]+$/i.test(cleanGaId);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (saved === "granted" || saved === "denied") {
        setConsentChoice(saved);
      } else if (!enableConsentBanner) {
        setConsentChoice("granted");
      }
    } catch {
      // Ignore storage failures in restricted browsing modes
    }
  }, [enableConsentBanner]);

  // First-party privacy-safe pageview tracking (public routes only)
  useEffect(() => {
    if (!pathname || isAdmin || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    const params = new URLSearchParams(window.location.search);
    const deviceType =
      window.innerWidth < 768
        ? "mobile"
        : window.innerWidth < 1024
        ? "tablet"
        : "desktop";

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName: "page_view",
        pagePath: pathname,
        source: params.get("utm_source") || undefined,
        medium: params.get("utm_medium") || undefined,
        campaign: params.get("utm_campaign") || undefined,
        referrer: document.referrer || undefined,
        deviceType,
      }),
    }).catch(() => {});

    if (hasGa4 && typeof window.gtag === "function" && consentChoice === "granted") {
      window.gtag("config", cleanGaId, { page_path: pathname });
    }
  }, [pathname, isAdmin, hasGa4, cleanGaId, consentChoice]);

  const handleConsent = (choice: "granted" | "denied") => {
    setConsentChoice(choice);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignore
    }
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: choice,
      });
    }
  };

  if (isAdmin) return null;

  return (
    <>
      {hasGa4 && (
        <>
          <Script id="vps-gtag-consent-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                'analytics_storage': '${consentChoice === "granted" || !enableConsentBanner ? "granted" : "denied"}',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
              });
              gtag('js', new Date());
              gtag('config', '${cleanGaId}', { anonymize_ip: true });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cleanGaId)}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {mounted &&
        hasGa4 &&
        enableConsentBanner &&
        consentChoice === "unset" && (
          <div
            role="dialog"
            aria-label="Analytics consent preference"
            className="fixed bottom-4 left-4 z-40 max-w-sm bg-white border border-border-subtle rounded-2xl shadow-xl p-4 text-xs text-slate-main space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-semibold text-navy-800">
                <ShieldCheck className="w-4 h-4 text-solar-green shrink-0" />
                <span>Privacy & Analytics Settings</span>
              </div>
              <button
                type="button"
                aria-label="Dismiss analytics banner"
                onClick={() => handleConsent("denied")}
                className="text-slate-400 hover:text-navy-800 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-muted leading-relaxed">
              We use privacy-safe analytics to measure solar enquiry helpfulness
              across India. Personal phone numbers and enquiry details are never
              shared with ad networks.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleConsent("granted")}
                className="flex-1 px-3 py-1.5 rounded-lg bg-solar-green hover:bg-solar-green-dark text-white font-semibold transition-colors"
              >
                Accept Analytics
              </button>
              <button
                type="button"
                onClick={() => handleConsent("denied")}
                className="px-3 py-1.5 rounded-lg bg-slate-light hover:bg-slate-200 text-navy-800 font-semibold border border-border-subtle transition-colors"
              >
                Essential Only
              </button>
            </div>
          </div>
        )}
    </>
  );
}
