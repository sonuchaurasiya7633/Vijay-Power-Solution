"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim global top loading indicator that triggers immediately on internal <Link>
 * navigation clicks and finishes smoothly when the destination route commits.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Complete progress bar whenever URL finishes updating
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyRef.current) clearTimeout(safetyRef.current);
    setProgress(100);
    const doneTimeout = setTimeout(() => {
      setNavigating(false);
      setProgress(0);
    }, 180);
    return () => clearTimeout(doneTimeout);
  }, [pathname, searchParams]);

  // Listen to internal link clicks across desktop/tablet/mobile
  useEffect(() => {
    const startBar = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyRef.current) clearTimeout(safetyRef.current);
      setNavigating(true);
      setProgress(20);
      timerRef.current = setInterval(() => {
        setProgress((prev) => (prev < 88 ? prev + (90 - prev) * 0.22 : prev));
      }, 120);
      // Failsafe reset after 6s if navigation is cancelled or identical URL
      safetyRef.current = setTimeout(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        setNavigating(false);
        setProgress(0);
      }, 6000);
    };

    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("/") || target.getAttribute("target") === "_blank" || target.hasAttribute("download")) {
        return;
      }
      const currentFull = `${window.location.pathname}${window.location.search}`;
      if (href === currentFull || href.split("#")[0] === window.location.pathname) {
        return;
      }
      startBar();
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (safetyRef.current) clearTimeout(safetyRef.current);
    };
  }, []);

  if (!navigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-solar-green shadow-[0_0_8px_rgba(39,132,99,0.55)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
