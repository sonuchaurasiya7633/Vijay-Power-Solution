import type { Metadata } from "next";
import Link from "next/link";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CtaBanner from "@/components/public/CtaBanner";
import { ShieldCheck } from "lucide-react";
import { getPublicPagesCms } from "@/lib/cms-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Testimonials & Reviews | VIJOY POWER SOLUTION",
  description:
    "Read genuine, customer-confirmed reviews from residential and commercial solar clients across India.",
};

export default async function TestimonialsPage() {
  const cms = await getPublicPagesCms();
  const h = cms.testimonialsPage;

  return (
    <div className="bg-white">
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {h.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {h.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {h.subtitle}
          </p>
        </div>
      </div>

      <TestimonialsSection />

      <section className="py-12 bg-white border-t border-slate-border text-center">
        <div className="max-w-xl mx-auto px-4 space-y-3">
          <ShieldCheck className="w-8 h-8 text-solar-green mx-auto" />
          <h3 className="text-lg font-bold text-navy-800">{h.consentTitle}</h3>
          <p className="text-xs text-slate-muted leading-relaxed">
            {h.consentText}
          </p>
          {h.consentCtaText && (
            <div className="pt-2">
              <Link
                href={h.consentCtaLink || "/get-quote"}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-solar-green text-white text-xs font-bold hover:bg-solar-green-dark transition-colors"
              >
                {h.consentCtaText}
              </Link>
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
