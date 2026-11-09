import type { Metadata } from "next";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CtaBanner from "@/components/public/CtaBanner";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Testimonials & Reviews | VIJOY POWER SOLUTION",
  description:
    "Read genuine, customer-confirmed reviews from residential and commercial solar clients across Bihar, Jharkhand, and Uttar Pradesh.",
};

export default function TestimonialsPage() {
  return (
    <div className="bg-white">
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Client Voices
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Customer Testimonials
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Real feedback from verified homeowners, doctors, hotels, and enterprise clients who have experienced the difference of engineering excellence.
          </p>
        </div>
      </div>

      <TestimonialsSection />

      <section className="py-12 bg-white border-t border-slate-border text-center">
        <div className="max-w-xl mx-auto px-4 space-y-3">
          <ShieldCheck className="w-8 h-8 text-solar-green mx-auto" />
          <h3 className="text-lg font-bold text-navy-800">100% Verified Consent Standard</h3>
          <p className="text-xs text-slate-muted leading-relaxed">
            VIJOY POWER SOLUTION strictly upholds privacy standards. Client names and testimonials are published solely with explicit permission. We never manufacture fictional ratings or fake profiles.
          </p>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
