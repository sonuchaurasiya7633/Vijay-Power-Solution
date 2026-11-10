"use client";

import { Toaster as SonnerToaster } from "sonner";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";

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
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
        info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-emerald-600 animate-spin shrink-0" />,
      }}
      toastOptions={{
        unstyled: false,
        className:
          "!bg-white !text-navy-900 !border !border-slate-200 !shadow-xl !shadow-navy-950/10 !rounded-2xl !p-4 !font-sans !text-sm",
        classNames: {
          toast:
            "group flex items-center gap-3 p-4 rounded-2xl border bg-white text-navy-900 shadow-xl transition-all duration-200 ease-out",
          title: "text-sm font-bold text-navy-900 tracking-tight",
          description: "text-xs font-medium text-slate-500 mt-0.5",
          actionButton:
            "!bg-navy-900 !text-white !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg !hover:bg-navy-800 transition-colors",
          cancelButton:
            "!bg-slate-100 !text-slate-700 !text-xs !font-semibold !px-3 !py-1.5 !rounded-lg !hover:bg-slate-200 transition-colors",
          closeButton:
            "!bg-white !text-slate-400 !border-slate-200 !hover:text-navy-900 !hover:bg-slate-100 !transition-all !rounded-full !w-5 !h-5",
          success: "!border-emerald-200 !bg-emerald-50/40",
          error: "!border-rose-200 !bg-rose-50/40",
          warning: "!border-amber-200 !bg-amber-50/40",
          info: "!border-sky-200 !bg-sky-50/40",
        },
      }}
    />
  );
}
