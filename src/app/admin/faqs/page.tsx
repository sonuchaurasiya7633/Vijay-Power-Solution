"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Plus } from "lucide-react";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">Advisory Content</span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Frequently Asked Questions (FAQ) CMS
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Manage questions, answers, and categorization shown on the public site and inner pages.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f._id} className="p-5 bg-white rounded-2xl border border-slate-border shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2 py-0.5 rounded">
                {f.category}
              </span>
              <span className="text-xs text-slate-muted">Sort: {f.sortOrder}</span>
            </div>
            <h3 className="text-sm font-bold text-navy-800">{f.question}</h3>
            <p className="text-xs text-slate-muted leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
