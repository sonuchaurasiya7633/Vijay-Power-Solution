import Link from "next/link";
import { Sun, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-solar-green-light text-solar-green flex items-center justify-center mx-auto shadow-md">
          <Sun className="w-8 h-8 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl sm:text-6xl font-black font-display text-navy-800">
            404
          </span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
            The page you are looking for may have been moved, renamed, or is currently undergoing technical maintenance.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl font-bold text-xs bg-navy-800 text-white hover:bg-navy-900 transition-colors"
          >
            Contact Engineering Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
