"use client";

import React from "react";

interface SolarEmblemSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "brand" | "white" | "gold";
  label?: string;
  className?: string;
}

const SIZE_MAP = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-7 h-7",
  lg: "w-11 h-11",
};

/**
 * Custom solar-energy-inspired animated SVG loader.
 * Features an outer precision orbit ring, emerald PV arc, and a 4-cell solar module core
 * with subtle gold irradiance dot. Supports prefers-reduced-motion cleanly.
 */
export function SolarEmblemSpinner({
  size = "sm",
  variant = "brand",
  label = "Loading",
  className = "",
}: SolarEmblemSpinnerProps) {
  const trackColor =
    variant === "white"
      ? "rgba(255,255,255,0.22)"
      : variant === "gold"
      ? "rgba(215,168,75,0.25)"
      : "#E2E8E5";

  const arcColor =
    variant === "white"
      ? "#FFFFFF"
      : variant === "gold"
      ? "#D7A84B"
      : "#278463";

  const cellColor =
    variant === "white"
      ? "#FFFFFF"
      : variant === "gold"
      ? "#D7A84B"
      : "#102D48";

  const sunColor =
    variant === "white" ? "#D7A84B" : variant === "gold" ? "#FFFFFF" : "#D7A84B";

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={label}
      className={`inline-flex items-center justify-center shrink-0 ${SIZE_MAP[size]} ${className}`}
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        {/* Static Precision Track */}
        <circle
          cx="18"
          cy="18"
          r="15.5"
          stroke={trackColor}
          strokeWidth="2.5"
        />

        {/* Smooth Rotating Solar Orbit Arc + Gold Sun Node */}
        <g className="vps-solar-orb origin-center" style={{ transformOrigin: "18px 18px" }}>
          <path
            d="M18 2.5A15.5 15.5 0 0 1 33.5 18"
            stroke={arcColor}
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          <circle cx="18" cy="2.5" r="2.2" fill={sunColor} />
        </g>

        {/* 2x2 Photovoltaic Solar Panel Core */}
        <rect
          x="11.5"
          y="11.5"
          width="5.5"
          height="5.5"
          rx="1.2"
          fill={cellColor}
          className="vps-solar-cell-1"
          style={{ transformOrigin: "14.25px 14.25px" }}
        />
        <rect
          x="19"
          y="11.5"
          width="5.5"
          height="5.5"
          rx="1.2"
          fill={arcColor}
          className="vps-solar-cell-2"
          style={{ transformOrigin: "21.75px 14.25px" }}
        />
        <rect
          x="11.5"
          y="19"
          width="5.5"
          height="5.5"
          rx="1.2"
          fill={arcColor}
          className="vps-solar-cell-4"
          style={{ transformOrigin: "14.25px 21.75px" }}
        />
        <rect
          x="19"
          y="19"
          width="5.5"
          height="5.5"
          rx="1.2"
          fill={cellColor}
          className="vps-solar-cell-3"
          style={{ transformOrigin: "21.75px 21.75px" }}
        />
      </svg>
    </span>
  );
}

interface SolarPanelLoaderProps {
  title?: string;
  subtitle?: string;
  variant?: "light" | "dark" | "compact";
  className?: string;
}

/**
 * Clean, calm container loader for CMS data loading, file uploads, and Suspense boundaries.
 * Zero artificial timeouts; displays strictly during real pending states.
 */
export function SolarPanelLoader({
  title = "Syncing Solar Workspace...",
  subtitle,
  variant = "light",
  className = "",
}: SolarPanelLoaderProps) {
  if (variant === "dark") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex flex-col items-center justify-center gap-3 text-center px-4 py-6 ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <SolarEmblemSpinner size="lg" variant="gold" label={title} />
        </div>
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-bold text-white tracking-tight">{title}</p>
          {subtitle && (
            <p className="text-[11px] text-slate-300 max-w-xs leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-bg border border-slate-border text-navy-800 ${className}`}
      >
        <SolarEmblemSpinner size="sm" variant="brand" label={title} />
        <span className="text-xs font-bold tracking-tight">{title}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`bg-white p-10 sm:p-14 rounded-2xl border border-slate-border flex flex-col items-center justify-center text-center gap-3.5 ${className}`}
    >
      <div className="relative w-16 h-16 rounded-2xl bg-slate-bg border border-slate-border flex items-center justify-center shadow-sm">
        <SolarEmblemSpinner size="lg" variant="brand" label={title} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-navy-800 font-display tracking-tight">{title}</p>
        {subtitle && <p className="text-xs text-slate-muted max-w-sm">{subtitle}</p>}
      </div>
      {/* Slim horizontal solar energy flow bar */}
      <div className="w-40 h-1 rounded-full bg-slate-border overflow-hidden relative mt-1" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-navy-800 via-solar-green to-solar-gold vps-energy-sweep" />
      </div>
    </div>
  );
}
