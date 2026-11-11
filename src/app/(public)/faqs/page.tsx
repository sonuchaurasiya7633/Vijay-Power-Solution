import type { Metadata } from "next";
import FaqAccordion, {
  DEFAULT_SOLAR_FAQS,
  type FAQItem,
} from "@/components/public/FaqAccordion";
import CtaBanner from "@/components/public/CtaBanner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import connectDB from "@/lib/db/connection";
import FAQ from "@/models/FAQ";
import { getPublicPagesCms } from "@/lib/cms-server";
import { getRouteMetadata } from "@/lib/seo-server";
import { buildFaqSchema } from "@/lib/seo-schema";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "faqs",
    path: "/faqs",
    fallbackTitle: "Frequently Asked Questions | VIJOY POWER SOLUTION Solar",
    fallbackDescription:
      "Find answers to common rooftop solar questions: subsidies, DISCOM net metering, payback periods, warranties, and maintenance across India.",
  });
}

export default async function FaqsPage() {
  const cms = await getPublicPagesCms();
  const h = cms.faqsPage;

  let faqItems: FAQItem[] = DEFAULT_SOLAR_FAQS;
  try {
    await connectDB();
    const dbFaqs = (await FAQ.find({ isPublished: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean()) as Array<{ question: string; answer: string }>;
    if (dbFaqs.length > 0) {
      faqItems = dbFaqs.map((f) => ({
        question: f.question,
        answer: f.answer,
      }));
    }
  } catch {
    // Graceful fallback to DEFAULT_SOLAR_FAQS
  }

  const faqSchema = buildFaqSchema(faqItems);

  return (
    <div className="bg-white">
      {faqSchema && <JsonLd data={faqSchema} />}
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumbs items={[{ name: "FAQs", path: "/faqs" }]} variant="dark" />
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

      <FaqAccordion items={faqItems} />
      <CtaBanner />
    </div>
  );
}
