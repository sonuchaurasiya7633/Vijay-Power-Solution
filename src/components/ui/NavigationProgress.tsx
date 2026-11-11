"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Slim global top loading indicator styled with VPS Solar energy colors
 * (#102D48 navy base, #278463 emerald beam, #D7A84B solar-gold leading glow).
 * Includes a 70ms show threshold so instant cached transitions never flicker.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const visibleRef = useRef(false);
  const revealRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = () => {
    if (revealRef.current) clearTimeout(revealRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyRef.current) clearTimeout(safetyRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);
  };

  // Complete progress bar smoothly ONLY when pathname or searchParams actually commit
  useEffect(() => {
    clearAllTimers();
    if (!visibleRef.current) {
      setProgress(0);
      return;
    }
    setProgress(100);
    hideRef.current = setTimeout(() => {
      visibleRef.current = false;
      setVisible(false);
      setProgress(0);
    }, 200);
    return () => {
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [pathname, searchParams]);

  // Listen to internal <Link> clicks across desktop, tablet, and mobile
  useEffect(() => {
    const startBar = () => {
      clearAllTimers();
      // Short 70ms delay suppresses flash on instant prefetched routes
      revealRef.current = setTimeout(() => {
        visibleRef.current = true;
        setVisible(true);
        setProgress(24);
        timerRef.current = setInterval(() => {
          setProgress((prev) => (prev < 88 ? prev + (90 - prev) * 0.22 : prev));
        }, 120);
      }, 70);

      // Failsafe reset after 6s if navigation is cancelled or fails
      safetyRef.current = setTimeout(() => {
        clearAllTimers();
        visibleRef.current = false;
        setVisible(false);
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
      if (
        !href ||
        !href.startsWith("/") ||
        target.getAttribute("target") === "_blank" ||
        target.hasAttribute("download")
      ) {
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
      clearAllTimers();
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page navigation loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none bg-navy-800/15"
    >
      <div
        className="relative h-full bg-gradient-to-r from-navy-800 via-solar-green to-solar-gold shadow-[0_0_10px_rgba(39,132,99,0.55)] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      >
        <span
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-solar-gold blur-[1px]"
        />
      </div>
    </div>
  );
}
