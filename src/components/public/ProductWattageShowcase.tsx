"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BatteryCharging, Check, Cpu, ShieldCheck, Zap } from "lucide-react";
import { getLocalSolarGalleryImage, getSafeSolarImage } from "@/lib/image-fallback";
import { defaultSolarPanelsPageCms, type SolarPanelsPageCms } from "@/lib/cms-defaults";

export interface ShowcaseProductItem {
  _id?: string;
  slug: string;
  name: string;
  brand: string;
  ratedPowerWp: number;
  wattageGroup?: string;
  technology: string;
  efficiency: string;
  warranty: string;
  image: string;
  features: string[];
}

interface WattageTab {
  label: string;
  value: string;
  minWp: number;
  maxWp: number;
}

const wattageTabs: WattageTab[] = [
  { label: "All Wattages (10W–730W)", value: "all", minWp: 10, maxWp: 730 },
  { label: "10W – 50W", value: "10-50", minWp: 10, maxWp: 50 },
  { label: "51W – 100W", value: "51-100", minWp: 51, maxWp: 100 },
  { label: "101W – 300W", value: "101-300", minWp: 101, maxWp: 300 },
  { label: "301W – 500W", value: "301-500", minWp: 301, maxWp: 500 },
  { label: "501W – 600W", value: "501-600", minWp: 501, maxWp: 600 },
  { label: "601W – 730W", value: "601-730", minWp: 601, maxWp: 730 },
];

const fallbackCatalog: ShowcaseProductItem[] = [
  {
    slug: "20w-12v-monocrystalline-module",
    name: "20W 12V Monocrystalline Module",
    brand: "Loom Solar",
    ratedPowerWp: 20,
    technology: "Mono PERC",
    efficiency: "18.5%",
    warranty: "10 Years",
    image: getLocalSolarGalleryImage(0),
    features: ["Compact rural lighting", "Battery charging", "Weatherproof aluminum frame"],
  },
  {
    slug: "50w-12v-polycrystalline-module",
    name: "50W 12V Polycrystalline Module",
    brand: "Waaree",
    ratedPowerWp: 50,
    technology: "Polycrystalline",
    efficiency: "17.2%",
    warranty: "10 Years",
    image: getLocalSolarGalleryImage(1),
    features: ["Street lighting & DC fans", "Low-light performance", "Rugged tempered glass"],
  },
  {
    slug: "100w-12v-mono-perc-panel",
    name: "100W 12V Mono PERC Solar Panel",
    brand: "Vikram Solar",
    ratedPowerWp: 100,
    technology: "Mono PERC",
    efficiency: "19.8%",
    warranty: "25 Years",
    image: getLocalSolarGalleryImage(2),
    features: ["12V battery bank charging", "IP68 junction box", "Hail & wind resistant"],
  },
  {
    slug: "225w-monocrystalline-panel",
    name: "225W Monocrystalline Panel",
    brand: "Luminous",
    ratedPowerWp: 225,
    technology: "Mono PERC",
    efficiency: "20.2%",
    warranty: "25 Years",
    image: getLocalSolarGalleryImage(3),
    features: ["Off-grid home UPS pairing", "Anti-PID technology", "High conversion efficiency"],
  },
  {
    slug: "450w-mono-perc-half-cut",
    name: "450W Mono PERC Half-Cut Module",
    brand: "Tata Power Solar",
    ratedPowerWp: 450,
    technology: "Mono PERC Half-Cut",
    efficiency: "21.0%",
    warranty: "25 Years",
    image: getLocalSolarGalleryImage(4),
    features: ["Residential 3kW-5kW roofs", "Reduced hot-spot risk", "MNRE ALMM approved"],
  },
  {
    slug: "550w-topcon-bifacial-module",
    name: "550W N-Type TOPCon Bifacial Module",
    brand: "Waaree / Adani",
    ratedPowerWp: 550,
    technology: "N-Type TOPCon Bifacial",
    efficiency: "22.3%",
    warranty: "30 Years",
    image: getLocalSolarGalleryImage(5),
    features: ["Bifacial rear energy gain", "PM Surya Ghar compliant", "Ultra-low LID degradation"],
  },
  {
    slug: "600w-bifacial-glass-to-glass",
    name: "600W Bifacial Dual-Glass Module",
    brand: "Vikram Solar",
    ratedPowerWp: 600,
    technology: "N-Type TOPCon Bifacial",
    efficiency: "22.5%",
    warranty: "30 Years",
    image: getLocalSolarGalleryImage(6),
    features: ["Commercial & factory roofs", "Heavy snow & wind load", "Dual-glass moisture seal"],
  },
  {
    slug: "730w-hjt-utility-module",
    name: "730W Heterojunction (HJT) Flagship",
    brand: "Tier-1 Utility Grade",
    ratedPowerWp: 730,
    technology: "Heterojunction (HJT)",
    efficiency: "23.4%",
    warranty: "30 Years",
    image: getLocalSolarGalleryImage(7),
    features: ["Highest module power density", "Superior 45°C+ summer coefficient", "Utility & industrial plants"],
  },
];

function normalizeProduct(raw: any, index: number): ShowcaseProductItem {
  const tech =
    raw.technology ||
    (Array.isArray(raw.technologyCategories) && raw.technologyCategories.length > 0
      ? raw.technologyCategories[0]
      : "Mono PERC / TOPCon");

  const effNum = raw.moduleEfficiencyPercent;
  const efficiency =
    raw.efficiency ||
    (typeof effNum === "number" ? `${effNum}%` : "21.5%");

  const warrantyYears = raw.performanceWarrantyYears;
  const warranty =
    raw.warranty ||
    (typeof warrantyYears === "number" ? `${warrantyYears} Years` : "25 Years");

  const features =
    Array.isArray(raw.features) && raw.features.length > 0
      ? raw.features
      : Array.isArray(raw.keyFeatures) && raw.keyFeatures.length > 0
      ? raw.keyFeatures
      : ["ALMM & BIS certified", "High thermal stability", "Weatherproof aluminum frame"];

  return {
    _id: raw._id ? String(raw._id) : undefined,
    slug: raw.slug || `solar-module-${raw.ratedPowerWp || index}`,
    name: raw.name || `${raw.ratedPowerWp || 550}W Solar Module`,
    brand: raw.brand || "Tier-1 Manufacturer",
    ratedPowerWp: Number(raw.ratedPowerWp) || 550,
    wattageGroup: raw.wattageGroup,
    technology: tech,
    efficiency,
    warranty,
    image: getSafeSolarImage(raw.coverImage || raw.image, index),
    features: features.slice(0, 3),
  };
}

interface ProductWattageShowcaseProps {
  initialProducts?: any[];
  cms?: Partial<SolarPanelsPageCms>;
  showViewAllButton?: boolean;
}

export default function ProductWattageShowcase({
  initialProducts,
  cms,
  showViewAllButton = true,
}: ProductWattageShowcaseProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<ShowcaseProductItem[]>(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      return initialProducts.map((p, idx) => normalizeProduct(p, idx));
    }
    return [];
  });
  const [loading, setLoading] = useState(!(Array.isArray(initialProducts) && initialProducts.length > 0));

  useEffect(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      setProducts(initialProducts.map((p, idx) => normalizeProduct(p, idx)));
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data?.products) && data.products.length > 0) {
          setProducts(data.products.map((p: any, idx: number) => normalizeProduct(p, idx)));
        } else {
          setProducts(fallbackCatalog);
        }
      })
      .catch(() => {
        if (!cancelled) setProducts(fallbackCatalog);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialProducts]);

  const effectiveProducts = products.length > 0 ? products : fallbackCatalog;

  const filteredProducts = useMemo(() => {
    const selectedTab = wattageTabs.find((t) => t.value === activeTab) || wattageTabs[0];
    if (selectedTab.value === "all") return effectiveProducts;
    return effectiveProducts.filter(
      (item) => item.ratedPowerWp >= selectedTab.minWp && item.ratedPowerWp <= selectedTab.maxWp
    );
  }, [activeTab, effectiveProducts]);

  const showcaseBadge = cms?.showcaseBadge || defaultSolarPanelsPageCms.showcaseBadge;
  const showcaseTitle = cms?.showcaseTitle || defaultSolarPanelsPageCms.showcaseTitle;
  const showcaseSubtitle = cms?.showcaseSubtitle || defaultSolarPanelsPageCms.showcaseSubtitle;
  const showcaseViewAllText = cms?.showcaseViewAllText || defaultSolarPanelsPageCms.showcaseViewAllText;
  const policyTitle = cms?.policyTitle || defaultSolarPanelsPageCms.policyTitle;
  const policyText = cms?.policyText || defaultSolarPanelsPageCms.policyText;
  const policyCtaText = cms?.policyCtaText || defaultSolarPanelsPageCms.policyCtaText;
  const policyCtaLink = cms?.policyCtaLink || defaultSolarPanelsPageCms.policyCtaLink;

  return (
    <section className="py-20 bg-slate-bg border-t border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
              {showcaseBadge}
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
              {showcaseTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-muted">
              {showcaseSubtitle}
            </p>
          </div>
          {showViewAllButton && (
            <Link
              href="/solar-panels"
              className="inline-flex items-center gap-2 text-sm font-bold text-solar-green hover:text-navy-800 transition-colors shrink-0"
            >
              <span>{showcaseViewAllText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Wattage Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {wattageTabs.map((tab) => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  active
                    ? "bg-navy-900 text-white shadow-md"
                    : "bg-white text-navy-800 border border-slate-border hover:border-solar-green"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading skeleton or Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-96 rounded-2xl bg-white border border-slate-border animate-pulse"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-border p-10 text-center space-y-2">
            <p className="text-base font-bold text-navy-800">
              No published solar modules in this wattage band yet.
            </p>
            <p className="text-xs text-slate-muted">
              Select another wattage tab or explore All Wattages (10W–730W).
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id || p.slug}
                className="group bg-white rounded-2xl border border-slate-border hover:border-solar-green/50 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative h-48 w-full bg-navy-900/5 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-solar-green text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{p.ratedPowerWp} Wp</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-navy-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {p.brand}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-solar-green flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      <span>{p.technology}</span>
                    </div>
                    <h3 className="font-display font-bold text-navy-800 text-base leading-snug line-clamp-2">
                      {p.name}
                    </h3>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="bg-slate-bg px-2.5 py-1.5 rounded-lg">
                      <span className="text-slate-muted block">Efficiency</span>
                      <span className="font-bold text-navy-800">{p.efficiency}</span>
                    </div>
                    <div className="bg-slate-bg px-2.5 py-1.5 rounded-lg">
                      <span className="text-slate-muted block">Warranty</span>
                      <span className="font-bold text-navy-800">{p.warranty}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-1 text-xs text-slate-600">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-solar-green shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/solar-panels/${p.slug}`}
                      className="text-xs font-bold text-navy-800 hover:text-solar-green hover:underline"
                    >
                      View Specs
                    </Link>
                    <Link
                      href={`/get-quote?module=${encodeURIComponent(p.name)}`}
                      className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-solar-green text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <BatteryCharging className="w-3.5 h-3.5" />
                      <span>Enquire</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Policy Note */}
        <div className="mt-10 bg-white border border-slate-border rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-solar-green shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-navy-800 text-sm">{policyTitle}</h4>
              <p className="text-xs text-slate-muted mt-0.5">{policyText}</p>
            </div>
          </div>
          <Link
            href={policyCtaLink}
            className="px-5 py-2.5 rounded-xl bg-solar-green hover:bg-solar-green-dark text-white text-xs font-bold whitespace-nowrap transition-colors shadow-sm"
          >
            {policyCtaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
