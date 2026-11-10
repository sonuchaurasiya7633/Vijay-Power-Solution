import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Zap, ShieldCheck, CheckCircle2, FileText, ArrowLeft, Phone } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import connectDB from "@/lib/db/connection";
import SolarProduct from "@/models/SolarProduct";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  await connectDB();
  const product = await SolarProduct.findOne({ slug: params.slug }).lean();
  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} (${product.ratedPowerWp}Wp) | Specifications & Quote`,
    description: `Technical specifications for ${product.name}. Rated at ${product.ratedPowerWp}Wp with ${product.moduleEfficiencyPercent || 'high'}% efficiency. Request a site survey and quotation across India.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();
  const product: any = await SolarProduct.findOne({ slug: params.slug }).lean();

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb Bar */}
      <div className="bg-slate-bg border-b border-slate-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-muted flex items-center gap-2">
          <Link href="/" className="hover:text-navy-800">Home</Link>
          <span>/</span>
          <Link href="/solar-panels" className="hover:text-navy-800">Solar Panels</Link>
          <span>/</span>
          <span className="text-navy-800 font-bold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Images & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Product Image */}
            <div className="relative h-96 sm:h-[450px] w-full bg-navy-50 rounded-3xl border border-slate-border overflow-hidden shadow-sm">
              <Image
                src={product.coverImage}
                alt={product.name}
                fill
                className="object-contain p-6"
                priority
              />
              <div className="absolute top-4 left-4 bg-solar-green text-white font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" />
                <span>{product.ratedPowerWp} Wp Rated Power</span>
              </div>
              <div className="absolute top-4 right-4 bg-white/95 text-navy-800 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200">
                {product.brand}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {product.technologyCategories?.map((cat: string) => (
                  <span
                    key={cat}
                    className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-navy-800">
                {product.name}
              </h1>
              {product.modelNumber && (
                <p className="text-xs text-slate-muted font-mono">
                  Model: {product.modelNumber}
                </p>
              )}
              <p className="text-sm text-slate-muted leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Key Engineering Specifications Grid */}
            <div className="space-y-4 pt-4 border-t border-slate-border">
              <h3 className="text-lg font-bold text-navy-800">
                Technical Specifications (STC)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                  <span className="text-slate-muted block text-[10px]">Rated Max Power (Pmax)</span>
                  <strong className="text-navy-800 text-sm">{product.ratedPowerWp} Wp</strong>
                </div>
                {product.moduleEfficiencyPercent && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Module Efficiency</span>
                    <strong className="text-navy-800 text-sm">{product.moduleEfficiencyPercent}%</strong>
                  </div>
                )}
                {product.openCircuitVoltageVoc && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Open Circuit Voltage (Voc)</span>
                    <strong className="text-navy-800 text-sm">{product.openCircuitVoltageVoc} V</strong>
                  </div>
                )}
                {product.optOperatingVoltageVmp && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Voltage at Pmax (Vmp)</span>
                    <strong className="text-navy-800 text-sm">{product.optOperatingVoltageVmp} V</strong>
                  </div>
                )}
                {product.shortCircuitCurrentIsc && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Short Circuit Current (Isc)</span>
                    <strong className="text-navy-800 text-sm">{product.shortCircuitCurrentIsc} A</strong>
                  </div>
                )}
                {product.optOperatingCurrentImp && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Current at Pmax (Imp)</span>
                    <strong className="text-navy-800 text-sm">{product.optOperatingCurrentImp} A</strong>
                  </div>
                )}
                {product.dimensionsMm && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Dimensions</span>
                    <strong className="text-navy-800 text-xs">{product.dimensionsMm}</strong>
                  </div>
                )}
                {product.weightKg && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Weight</span>
                    <strong className="text-navy-800 text-sm">{product.weightKg} kg</strong>
                  </div>
                )}
                {product.performanceWarrantyYears && (
                  <div className="p-3 rounded-xl border border-slate-border bg-slate-bg/50">
                    <span className="text-slate-muted block text-[10px]">Power Warranty</span>
                    <strong className="text-solar-green text-sm">{product.performanceWarrantyYears} Years Linear</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-border">
                <h3 className="text-base font-bold text-navy-800">Key Engineering Features</h3>
                <ul className="space-y-2">
                  {product.keyFeatures.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-navy-800">
                      <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column: Enquiry Form & Fast Contact */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-border shadow-xl space-y-4 sticky top-24">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Direct Module Enquiry
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Request Quotation & Site Survey
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Enquiring for <strong>{product.name} ({product.ratedPowerWp}Wp)</strong>. Our regional team will prepare an itemized commercial quotation.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="product"
                defaultProductId={product._id.toString()}
                defaultProductName={product.name}
                defaultWattage={product.ratedPowerWp}
                compact
                buttonText="Enquire For This Module"
              />

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-muted">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-solar-green" />
                  <span>No Public Price Display Policy</span>
                </div>
                <a
                  href={`https://wa.me/919431000000?text=${encodeURIComponent(`Hello VIJOY POWER SOLUTION, I would like to enquire about the ${product.name} (${product.ratedPowerWp}Wp).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-solar-green hover:underline"
                >
                  WhatsApp Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
