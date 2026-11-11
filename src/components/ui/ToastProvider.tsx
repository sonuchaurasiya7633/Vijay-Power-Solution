"use client";

import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { SolarEmblemSpinner } from "@/components/ui/SolarLoader";

export default function ToastProvider() {
  return (
    <SonnerToaster
      position="top-right"
      duration={3000}
      closeButton
      expand={false}
      gap={8}
      visibleToasts={5}
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-solar-green shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-solar-yellow-hover shrink-0" />,
        info: <Info className="w-5 h-5 text-navy-800 shrink-0" />,
        loading: <SolarEmblemSpinner size="sm" label="Processing" />,
      }}
      toastOptions={{
        unstyled: false,
        className:
          "!bg-white !text-slate-main !border !border-slate-border !shadow-xl !shadow-navy-900/10 !rounded-2xl !p-4 !font-sans !text-sm",
        classNames: {
          toast:
            "group flex items-center gap-3 p-4 rounded-2xl border bg-white text-slate-main shadow-xl transition-all duration-200 ease-out",
          title: "text-sm font-bold text-navy-800 tracking-tight",
          description: "text-xs font-medium text-slate-muted mt-0.5",
          actionButton:
            "!bg-navy-800 !text-white !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg !hover:bg-navy-900 transition-colors",
          cancelButton:
            "!bg-slate-bg !text-slate-main !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg !hover:bg-slate-border transition-colors",
          closeButton:
            "!bg-white !text-slate-muted !border-slate-border !hover:text-navy-800 !hover:bg-slate-bg !transition-all !rounded-full !w-5 !h-5",
          success: "!border-solar-green/30 !bg-solar-green-light/60",
          error: "!border-rose-200 !bg-rose-50/40",
          warning: "!border-solar-yellow/40 !bg-solar-yellow-light/70",
          info: "!border-slate-border !bg-slate-bg",
        },
      }}
    />
  );
}
