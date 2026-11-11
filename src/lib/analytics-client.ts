"use client";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackConversionEvent(
  eventName: string,
  metadata?: Record<string, any>
): void {
  if (typeof window === "undefined") return;

  const pagePath = window.location.pathname || "/";
  const params = new URLSearchParams(window.location.search);
  const source = params.get("utm_source") || undefined;
  const medium = params.get("utm_medium") || undefined;
  const campaign = params.get("utm_campaign") || undefined;
  const deviceType = window.innerWidth < 768 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, {
        page_path: pagePath,
        ...(metadata || {}),
      });
    }
  } catch {
    // Non-blocking
  }

  try {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        pagePath,
        source,
        medium,
        campaign,
        referrer: document.referrer || undefined,
        deviceType,
        metadata: metadata || {},
      }),
    }).catch(() => {});
  } catch {
    // Non-blocking
  }
}
