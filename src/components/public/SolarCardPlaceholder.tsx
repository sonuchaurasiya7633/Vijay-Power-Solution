import { Sun } from "lucide-react";

interface SolarCardPlaceholderProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export default function SolarCardPlaceholder({
  title,
  subtitle,
  compact = false,
}: SolarCardPlaceholderProps) {
  return (
    <div className="relative w-full h-full bg-navy-800 flex items-center justify-center p-5 overflow-hidden select-none">
      {/* Subtle architectural grid lines */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Framed Title Box Card */}
      <div
        className={`relative z-10 w-full max-w-[92%] rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-center flex flex-col items-center justify-center shadow-inner ${
          compact ? "px-3 py-3 space-y-1.5" : "px-4 py-4 space-y-2"
        }`}
      >
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-solar-green/20 border border-solar-green/40 text-solar-yellow">
          <Sun className="w-4 h-4" />
        </div>
        {subtitle && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-solar-yellow/90 line-clamp-1">
            {subtitle}
          </span>
        )}
        <p
          className={`font-display font-bold text-white leading-snug line-clamp-2 ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
