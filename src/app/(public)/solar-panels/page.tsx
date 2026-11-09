import type { Metadata } from "next";
import ProductWattageShowcase from "@/components/public/ProductWattageShowcase";
import CtaBanner from "@/components/public/CtaBanner";
import { ShieldCheck, Zap, HelpCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solar Panel Catalogue (10W to 730W) | VIJOY POWER SOLUTION",
  description:
    "Explore our complete range of certified solar panels from 10W up to 730W. Monocrystalline, Mono PERC, Bifacial, N-Type TOPCon, and Heterojunction modules for Bihar, Jharkhand, and UP.",
};

export default function SolarPanelsPage() {
  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Engineering Catalogue
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Solar Modules from 10W to 730W
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            From compact rural lighting panels (10W–50W) up to utility-grade Heterojunction and N-Type TOPCon bifacial modules (730W). Verified engineering specifications with private quotations.
          </p>
        </div>
      </div>

      {/* Catalogue & Wattage Filter Section */}
      <ProductWattageShowcase />

      {/* Technology Taxonomy Explanations */}
      <section className="py-16 bg-white border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
              Technology Primer
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-800 mt-1">
              Understanding Solar Cell Technologies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-muted leading-relaxed">
            <div className="p-5 rounded-2xl border border-slate-border space-y-2">
              <h3 className="text-sm font-bold text-navy-800">Mono PERC (Passivated Emitter & Rear Cell)</h3>
              <p>The contemporary industry benchmark for residential rooftop solar. Features an extra reflective layer on the back of the cell that reflects unabsorbed light back through the silicon, increasing energy yield in hazy weather.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-border space-y-2">
              <h3 className="text-sm font-bold text-navy-800">Bifacial Dual-Glass Modules</h3>
              <p>Produces electricity from both the front and rear sides. Ideal for light concrete terraces, mosaic tiles, or elevated structures where reflected ground light (albedo) can boost generation by an additional 10% to 25%.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-border space-y-2">
              <h3 className="text-sm font-bold text-navy-800">N-Type TOPCon Technology</h3>
              <p>Advanced tunnel oxide passivated contact technology with near-zero Light Induced Degradation (LID) and an ultra-low temperature coefficient (-0.30%/°C), maintaining higher peak wattage in extreme 45°C summer climates.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-border space-y-2">
              <h3 className="text-sm font-bold text-navy-800">Heterojunction (HJT) Technology</h3>
              <p>Combines crystalline silicon with amorphous thin-film silicon layers. Boasts the highest commercial efficiency up to 23.5% and the best thermal stability in the industry, ideal for maximum power generation from limited roof spaces.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-border space-y-2">
              <h3 className="text-sm font-bold text-navy-800">Half-Cut Cell Architecture</h3>
              <p>By cutting standard solar cells in half, electrical current in each cell ribbon is halved, drastically reducing resistive power losses and lowering the operating temperature of the module for extended longevity.</p>
            </div>
            <div className="p-5 rounded-2xl border border-slate-border space-y-2">
              <h3 className="text-sm font-bold text-navy-800">Small-Wattage Modules (10W–100W)</h3>
              <p>Heavy-duty, compact 12V modules designed for solar streetlights, security cameras, garden illumination, DC poultry lighting, and rural cottage backup battery chargers.</p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
