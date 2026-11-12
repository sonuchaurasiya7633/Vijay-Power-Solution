"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, VPS_EASE } from "@/components/ui/MotionPrimitives";

export interface FAQItem {
  question: string;
  answer: string;
}

export const DEFAULT_SOLAR_FAQS: FAQItem[] = [
  {
    question: "How much roof area is required for a 3 kW solar rooftop system?",
    answer: "A standard 3 kW solar rooftop plant using modern high-efficiency 550W modules requires approximately 180 to 220 square feet of shadow-free rooftop space. If you require usable terrace space below, we can install elevated galvanized structures.",
  },
  {
    question: "What is the subsidy under the PM Surya Ghar: Muft Bijli Yojana across India?",
    answer: "Under the PM Surya Ghar national scheme, residential rooftop systems receive up to ₹30,000 for 1 kW, ₹60,000 for 2 kW, and a maximum of ₹78,000 for systems 3 kW and above. The subsidy is disbursed directly to your bank account via DBT after DISCOM commissioning.",
  },
  {
    question: "What is the difference between On-Grid, Off-Grid, and Hybrid solar systems?",
    answer: "On-Grid solar connects directly with your DISCOM grid via net-metering without batteries; it is the most affordable and allows exporting surplus units. Off-Grid solar includes batteries and operates completely independently. Hybrid solar combines both: you get net-metering grid export plus battery backup during blackouts.",
  },
  {
    question: "How long does the complete installation and net metering process take?",
    answer: "The physical rooftop installation typically takes 2 to 4 days. DISCOM net-metering approvals, meter testing, and final synchronization generally take 2 to 4 weeks depending on your local electricity division.",
  },
  {
    question: "Why do you not show solar prices directly on your website?",
    answer: "Unlike retail consumer products, solar systems require site-specific structural and electrical engineering. Rooftop height, distance to the main electrical panel, elevated structure requirements, and DISCOM meter configurations vary on every building. We provide precise, itemized private quotations following a technical survey so you never encounter unexpected hidden costs.",
  },
];

export default function FaqAccordion({
  items,
}: {
  items?: FAQItem[];
} = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqList = items && items.length > 0 ? items : DEFAULT_SOLAR_FAQS;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            Clear Answers to Solar Questions
          </h2>
          <p className="text-sm text-slate-muted">
            Have questions about net metering, national subsidies, warranties, or roof feasibility?
          </p>
        </Reveal>

        <div className="space-y-3">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-colors duration-200 ${
                  isOpen ? "border-solar-green/40 shadow-sm" : "border-slate-border hover:border-navy-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-bg transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-navy-800">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-muted shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-solar-green" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: VPS_EASE }}
                      className="overflow-hidden border-t border-slate-100 bg-slate-bg/30"
                    >
                      <div className="p-5 pt-4 text-xs sm:text-sm text-slate-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
