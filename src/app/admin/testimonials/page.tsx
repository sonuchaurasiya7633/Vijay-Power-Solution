"use client";

import { useState, useEffect } from "react";
import { Star, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/testimonials?adminMode=true")
      .then((r) => r.json())
      .then((d) => setReviews(d.testimonials || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Review Moderation</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Customer Testimonials & Consent
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Strict consent enforcement: only reviews with verified client approval are displayed publicly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((t) => (
          <div key={t._id} className="p-6 bg-white rounded-2xl border border-slate-border shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-solar-yellow text-solar-yellow" />
                ))}
              </div>
              <p className="text-xs text-navy-800 italic leading-relaxed">
                &ldquo;{t.reviewText}&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-navy-800">{t.customerName}</h4>
                <p className="text-[10px] text-slate-muted">{t.customerCity}, {t.customerState}</p>
              </div>
              <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Consent</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
