"use client";

import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp({
  phone = "919431000000",
  message = "Hello VIJOY POWER SOLUTION, I would like to enquire about rooftop solar installation in Bihar/Jharkhand/UP.",
}: {
  phone?: string;
  message?: string;
}) {
  const handleClick = async () => {
    try {
      // Record privacy-safe analytics event
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName: "whatsapp_click",
          pagePath: typeof window !== "undefined" ? window.location.pathname : "/",
          metadata: { channel: "floating_button" },
        }),
      }).catch(() => {});
    } catch {}
  };

  const cleanPhone = phone.replace(/[^\d]/g, "");
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Chat with solar engineer on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
}
