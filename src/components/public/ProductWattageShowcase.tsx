"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface ProductItem {
  slug: string;
  name: string;
  brand: string;
  ratedPowerWp: number;
  wattageGroup: string;
  technology: string;
  efficiency: string;
  warranty: string;
  coverImage: string;
  features: string[];
}

const sampleCatalog: ProductItem[] = [
  {
    slug: "20w-12v-monocrystalline-solar-module",
    name: "20W 12V Monocrystalline Module",
    brand: "Loom Solar",
    ratedPowerWp: 20,
    wattageGroup: "10W-50W",
    technology: "Monocrystalline",
    efficiency: "16.5%",
    warranty: "25 Years Performance",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&q=80",
    features: ["Compact aluminum frame", "Ideal for streetlights & small DC batteries"],
  },
  {
    slug: "50w-12v-polycrystalline-solar-module",
    name: "50W 12V Polycrystalline Module",
    brand: "Waaree",
    ratedPowerWp: 50,
    wattageGroup: "10W-50W",
    technology: "Polycrystalline",
    efficiency: "15.2%",
    warranty: "25 Years Performance",
    coverImage: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=80",
    features: ["TUV certified IP65 junction box", "Home lighting & rural DC setups"],
  },
  {
    slug: "100w-12v-mono-perc-solar-panel",
    name: "100W 12V Mono PERC Panel",
    brand: "Vikram Solar",
    ratedPowerWp: 100,
    wattageGroup: "51W-100W",
    technology: "Mono PERC",
    efficiency: "18.4%",
    warranty: "25 Years Linear Warranty",
    coverImage: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&q=80",
    features: ["High generation in cloudy winter light", "Single battery 12V inverters"],
  },
  {
    slug: "225w-mono-perc-solar-module",
    name: "225W High-Density Mono PERC",
    brand: "Loom Solar",
    ratedPowerWp: 225,
    wattageGroup: "101W-300W",
    technology: "Mono PERC Half-Cut",
    efficiency: "20.2%",
    warranty: "25 Years Linear Warranty",
    coverImage: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=600&q=80",
    features: ["30% higher generation on compact roofs", "9-busbar low resistance"],
  },
  {
    slug: "335w-24v-polycrystalline-solar-panel",
    name: "335W 24V Polycrystalline Panel",
    brand: "Tata Power Solar",
    ratedPowerWp: 335,
    wattageGroup: "301W-500W",
    technology: "Polycrystalline 72-Cell",
    efficiency: "17.3%",
    warranty: "25 Years Power Retention",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&q=80",
    features: ["PID-free heavy duty construction", "Residential & commercial plants"],
  },
  {
    slug: "550w-mono-perc-half-cut-solar-panel",
    name: "550W Mono PERC Half-Cut Panel",
    brand: "Waaree",
    ratedPowerWp: 550,
    wattageGroup: "501W-600W",
    technology: "Mono PERC Bifacial Half-Cut",
    efficiency: "21.3%",
    warranty: "30 Years Performance",
    coverImage: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&q=80",
    features: ["ALMM approved for PM Surya Ghar subsidy", "Top choice for rooftop net-metering"],
  },
  {
    slug: "590w-n-type-topcon-bifacial-module",
    name: "590W N-Type TOPCon Bifacial",
    brand: "Tata Power Solar",
    ratedPowerWp: 590,
    wattageGroup: "501W-600W",
    technology: "N-Type TOPCon Dual-Glass",
    efficiency: "22.8%",
    warranty: "30 Years 88% Retention",
    coverImage: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&q=80",
    features: ["Up to 25% rear albedo absorption", "Zero initial light degradation (LID)"],
  },
  {
    slug: "730w-hjt-dual-glass-solar-module",
    name: "730W HJT Dual-Glass High-Yield",
    brand: "VIJOY Flagship / Tier-1",
    ratedPowerWp: 730,
    wattageGroup: "601W-730W",
    technology: "Heterojunction (HJT) Dual Glass",
    efficiency: "23.5%",
    warranty: "30 Years Linear Guarantee",
    coverImage: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&q=80",
    features: ["Unbeatable 23.5% cell efficiency", "Lowest heat loss (-0.26%/°C) in 45°C summers"],
  },
];

const wattageTabs = [
  { label: "All Wattages (10W–730W)", key: "all" },
  { label: "10W – 50W", key: "10W-50W" },
  { label: "51W – 100W", key: "51W-100W" },
  { label: "101W – 300W", key: "101W-300W" },
  { label: "301W – 500W", key: "301W-500W" },
  { label: "501W – 600W", key: "501W-600W" },
  { label: "601W – 730W", key: "601W-730W" },
];

export default function ProductWattageShowcase() {
  const [selectedGroup, setSelectedGroup] = useState("all");

  const filteredProducts =
    selectedGroup === "all"
      ? sampleCatalog
      : sampleCatalog.filter((p) => p.wattageGroup === selectedGroup);

  return (
    <section className="py-20 bg-slate-bg border-t border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
              Full Spectrum Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
              Solar Modules from 10W to 730W
            </h2>
            <p className="text-sm text-slate-muted">
              Explore genuine manufacturer modules spanning small rural lighting kits (10W) up to utility-grade Heterojunction and N-Type TOPCon powerhouses (730W).
            </p>
          </div>

          <Link
            href="/solar-panels"
            className="inline-flex items-center gap-2 text-sm font-bold text-solar-green hover:underline shrink-0"
          >
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Wattage Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {wattageTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedGroup(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedGroup === tab.key
                  ? "bg-navy-800 text-white shadow-md shadow-navy-800/20"
                  : "bg-white text-navy-800 border border-slate-border hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.slug}
              className="group bg-white rounded-2xl border border-slate-border hover:border-solar-green/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 w-full bg-navy-50 overflow-hidden">
                <Image
                  src={p.coverImage}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-solar-green text-white font-extrabold text-xs px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{p.ratedPowerWp} Wp</span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 text-navy-800 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm border border-slate-200">
                  {p.brand}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-solar-green">
                    {p.technology}
                  </span>
                  <h3 className="text-base font-bold text-navy-800 line-clamp-2 leading-snug group-hover:text-solar-green transition-colors">
                    {p.name}
                  </h3>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 text-slate-muted">
                  <div>
                    <span className="text-[10px] block">Efficiency</span>
                    <strong className="text-navy-800">{p.efficiency}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block">Warranty</span>
                    <strong className="text-navy-800">{p.warranty.split(" ")[0]} Yrs</strong>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-1 text-xs text-navy-800">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-solar-green shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-muted">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs (NO PRICES!) */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <Link
                    href={`/solar-panels/${p.slug}`}
                    className="w-full text-center py-2 px-2 text-xs font-semibold rounded-lg border border-slate-border text-navy-800 hover:bg-slate-50 transition-colors"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/get-quote?product=${encodeURIComponent(p.name)}&wattage=${p.ratedPowerWp}`}
                    className="w-full text-center py-2 px-2 text-xs font-bold rounded-lg bg-solar-green text-white hover:bg-solar-green-hover transition-colors shadow-sm"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strict pricing policy callout banner */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-border p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-solar-green shrink-0" />
            <p className="text-xs text-slate-muted leading-relaxed">
              <strong>Transparent Engineering Policy:</strong> VIJOY POWER SOLUTION does not display misleading fixed prices online. Every installation is custom-quoted based on roof structural requirements, cable distance, and DISCOM net-metering parameters.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-800 text-white hover:bg-navy-900 shrink-0 transition-colors"
          >
            Talk to Solar Engineer
          </Link>
        </div>
      </div>
    </section>
  );
}
