"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  MotionConfig,
  motion,
  useInView,
  useReducedMotion,
  animate,
  type Variants,
} from "framer-motion";

export const VPS_EASE = [0.22, 1, 0.36, 1] as const;
export const VPS_VIEWPORT = { once: true, amount: 0.12 } as const;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/**
 * Lightweight page transition: renders instantaneously on SSR / initial mount
 * (zero LCP delay or flash), then applies a fast 240ms fade-up on client navigations.
 */
export function PageTransition({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const [animateMount, setAnimateMount] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setAnimateMount(true);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={animateMount ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: VPS_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Above-the-fold Hero stagger wrapper (fast 350ms, no scroll trigger delay).
 */
export function HeroSlideUp({
  children,
  delay = 0,
  y = 14,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay, ease: VPS_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Subtle ambient settle for hero background photography.
 */
export function HeroAmbientZoom({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ scale: 1.04, opacity: 0.92 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: VPS_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scroll-triggered reveal block for headings, banners, and content groups.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  duration = 0.38,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VPS_VIEWPORT}
      transition={{ duration, delay, ease: VPS_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: (custom?: { stagger?: number; delay?: number }) => ({
    transition: {
      staggerChildren: custom?.stagger ?? 0.06,
      delayChildren: custom?.delay ?? 0.04,
    },
  }),
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.36,
      ease: VPS_EASE,
    },
  },
};

export function StaggerGrid({
  children,
  className = "",
  stagger = 0.06,
  delay = 0.04,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      custom={{ stagger, delay }}
      initial="hidden"
      whileInView="visible"
      viewport={VPS_VIEWPORT}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  hoverLift = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverLift?: boolean;
}) {
  return (
    <motion.div
      variants={staggerItemVariants}
      whileHover={hoverLift ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: VPS_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Smooth animated counter for metrics (e.g. "350+", "2.8+", "8+", "1240").
 * Non-numeric labels like "Pan India" render directly without layout shift.
 */
export function AnimatedCounter({
  value,
  duration = 0.85,
  className = "",
}: {
  value: string | number;
  duration?: number;
  className?: string;
}) {
  const strValue = String(value);
  const match = strValue.match(/^([^0-9.-]*)(-?\d+(?:,\d+)*(?:\.\d+)?)(.*)$/);

  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const shouldReduceMotion = useReducedMotion();

  const numericRaw = match ? parseFloat(match[2].replace(/,/g, "")) : NaN;
  const hasNumeric = Boolean(match) && Number.isFinite(numericRaw);
  const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
  const useCommas = Boolean(match && match[2].includes(","));

  const [display, setDisplay] = useState<string>(strValue);

  useEffect(() => {
    if (!hasNumeric || !isInView || shouldReduceMotion) {
      setDisplay(strValue);
      return;
    }

    const prefix = match![1] || "";
    const suffix = match![3] || "";

    const controls = animate(0, numericRaw, {
      duration,
      ease: VPS_EASE,
      onUpdate: (latest) => {
        const formatted =
          decimals > 0
            ? latest.toFixed(decimals)
            : useCommas
              ? Math.round(latest).toLocaleString("en-IN")
              : String(Math.round(latest));
        setDisplay(`${prefix}${formatted}${suffix}`);
      },
      onComplete: () => {
        setDisplay(strValue);
      },
    });

    return () => controls.stop();
  }, [hasNumeric, isInView, shouldReduceMotion, numericRaw, decimals, useCommas, strValue, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/**
 * Animated horizontal progress bar for analytics / state lead breakdown.
 */
export function AnimatedProgressBar({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${clamped}%` }}
      viewport={VPS_VIEWPORT}
      transition={{ duration: 0.45, ease: VPS_EASE }}
      className={className}
    />
  );
}
