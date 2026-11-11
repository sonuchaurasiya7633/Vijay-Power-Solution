import type { Metadata } from "next";
import ProductWattageShowcase from "@/components/public/ProductWattageShowcase";
import CtaBanner from "@/components/public/CtaBanner";
import connectDB from "@/lib/db/connection";
import SolarProduct from "@/models/SolarProduct";
import { getSolarPanelsPageCms } from "@/lib/cms-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Solar Panel Catalogue (10W to 730W) | VIJOY POWER SOLUTION",
  description:
    "Explore our complete range of certified solar panels from 10W up to 730W. Monocrystalline, Mono PERC, Bifacial, N-Type TOPCon, and Heterojunction modules delivered across India.",
};

const badgeStyles: Record<string, string> = {
  navy: "bg-navy-800/10 text-navy-800",
  green: "bg-solar-green-light text-solar-green",
  gold: "bg-solar-yellow-light text-solar-yellow-hover",
};

export default async function SolarPanelsPage() {
  const cms = await getSolarPanelsPageCms();
  let products: any[] = [];

  try {
    await connectDB();
    const docs = await SolarProduct.find({ isPublished: true })
      .sort({ ratedPowerWp: 1 })
      .lean();
    products = JSON.parse(JSON.stringify(docs));
  } catch {
    products = [];
  }

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-navy-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {cms.heroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {cms.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {cms.heroSubtitle}
          </p>
        </div>
      </div>

      {/* Catalogue & Wattage Filter Section */}
      <ProductWattageShowcase
        initialProducts={products.length > 0 ? products : undefined}
        cms={cms}
        showViewAllButton={false}
      />

      {/* Technology Taxonomy Explanations */}
      <section className="py-16 bg-white border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
              {cms.primerBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-800">
              {cms.primerTitle}
            </h2>
            {cms.primerSubtitle && (
              <p className="text-sm text-slate-muted leading-relaxed">
                {cms.primerSubtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-muted leading-relaxed">
            {cms.techCards.map((card, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-slate-border space-y-2.5 bg-white hover:border-solar-green/40 transition-colors"
              >
                {card.badge && (
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      badgeStyles[card.badgeColor] || badgeStyles.navy
                    }`}
                  >
                    {card.badge}
                  </span>
                )}
                <h3 className="text-sm font-bold text-navy-800">{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
