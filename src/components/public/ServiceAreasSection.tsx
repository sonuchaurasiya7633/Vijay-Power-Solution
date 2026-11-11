import Link from "next/link";
import { MapPin, ArrowRight, Check, Compass, ShieldCheck, Truck, Building2 } from "lucide-react";

export default function ServiceAreasSection() {
  const regionalHubs = [
    {
      state: "Bihar",
      slug: "bihar",
      tagline: "Corporate Headquarters & Main Hub",
      cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
      discoms: "SBPDCL & NBPDCL",
      netMeteringStatus: "Active Net Metering & PM Surya Ghar Direct Subsidy",
    },
    {
      state: "Jharkhand",
      slug: "jharkhand",
      tagline: "Industrial & Mining Belt Hub",
      cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
      discoms: "JBVNL",
      netMeteringStatus: "Residential Net Metering & Industrial Heavy Solar",
    },
    {
      state: "Uttar Pradesh",
      slug: "uttar-pradesh",
      tagline: "Northern Operations Hub",
      cities: ["Lucknow", "Varanasi", "Prayagraj", "Kanpur", "Gorakhpur", "Noida"],
      discoms: "UPPCL & DISCOMs",
      netMeteringStatus: "UPNEDA State Support + PM Surya Ghar Direct DBT",
    },
  ];

  const nationwideHighlights = [
    {
      icon: Compass,
      title: "All 28 States & 8 UTs",
      desc: "Supply & installation capability across every Indian pin code.",
    },
    {
      icon: Truck,
      title: "Nationwide Safe Logistics",
      desc: "Transit-insured dispatch of Tier-1 solar panels from 10W to 730W.",
    },
    {
      icon: ShieldCheck,
      title: "Standardized EPC Engineering",
      desc: "Uniform MNRE-compliant structural and electrical standards.",
    },
    {
      icon: Building2,
      title: "Local DISCOM Facilitation",
      desc: "Assistance with state electricity regulatory net-metering approvals.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-green-light border border-solar-green/20 text-solar-green text-xs font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-solar-green animate-pulse" />
            <span>Pan India Service Coverage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            Serving Customers Across India
          </h2>
          <p className="text-sm text-slate-muted leading-relaxed">
            Vijoy Power Solution delivers reliable solar panel supply and professional turnkey installation solutions for residential, commercial, industrial, and agricultural requirements across India.
          </p>
        </div>

        {/* Pan India Coverage Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {nationwideHighlights.map((hl, i) => {
            const Icon = hl.icon;
            return (
              <div
                key={i}
                className="bg-navy-800 text-white rounded-2xl p-5 border border-navy-700 flex items-start gap-3.5 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-solar-green/20 border border-solar-green/30 flex items-center justify-center text-solar-yellow shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{hl.title}</h4>
                  <p className="text-xs text-slate-300 leading-snug">{hl.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Hubs Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
              Regional Operations
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-navy-800">
              Major Engineering & Rapid-Deployment Hubs
            </h3>
          </div>
          <Link
            href="/service-areas"
            className="text-xs font-bold text-solar-green hover:underline flex items-center gap-1.5"
          >
            <span>View All Service Locations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Regional Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {regionalHubs.map((reg) => (
            <div
              key={reg.slug}
              className="bg-navy-50/60 rounded-3xl p-6 sm:p-7 border border-navy-100 flex flex-col justify-between hover:border-solar-green/40 transition-all hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                    {reg.tagline}
                  </span>
                  <MapPin className="w-5 h-5 text-solar-green" />
                </div>

                <div>
                  <h4 className="text-2xl font-bold font-display text-navy-800">
                    Solar in {reg.state}
                  </h4>
                  <p className="text-xs text-slate-muted mt-1">
                    Utility boards: <strong>{reg.discoms}</strong>
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-navy-800 mb-2">Key Operational Districts:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {reg.cities.map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-border text-navy-800 font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-start gap-2 pt-2 text-xs text-navy-800">
                  <Check className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                  <span>{reg.netMeteringStatus}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-navy-100/80 mt-6">
                <Link
                  href={`/service-areas/${reg.slug}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-navy-800 text-white hover:bg-navy-900 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Explore {reg.state} Hub Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pan-India State Network Links */}
        <div className="mt-8 bg-slate-bg border border-slate-border rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h4 className="text-sm font-bold text-navy-800 uppercase tracking-wider">
              Active Pan-India EPC &amp; Dispatch Network
            </h4>
            <span className="text-[11px] font-semibold text-solar-green">
              All 28 States &amp; 8 Union Territories Supported
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "Delhi NCR", slug: "delhi" },
              { name: "Maharashtra", slug: "maharashtra" },
              { name: "Gujarat", slug: "gujarat" },
              { name: "Rajasthan", slug: "rajasthan" },
              { name: "Karnataka", slug: "karnataka" },
              { name: "Telangana", slug: "telangana" },
              { name: "Tamil Nadu", slug: "tamil-nadu" },
              { name: "Uttar Pradesh", slug: "uttar-pradesh" },
              { name: "Madhya Pradesh", slug: "madhya-pradesh" },
              { name: "West Bengal", slug: "west-bengal" },
              { name: "Bihar", slug: "bihar" },
              { name: "Jharkhand", slug: "jharkhand" },
            ].map((st) => (
              <Link
                key={st.slug}
                href={`/service-areas/${st.slug}`}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-border text-xs font-semibold text-navy-800 hover:border-solar-green hover:text-solar-green transition-colors"
              >
                {st.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Pan India Callout Banner */}
        <div className="mt-12 bg-solar-green-light border border-solar-green/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-navy-800">
              Pan-India Solar Supply &amp; Turnkey EPC Across All 28 States &amp; 8 UTs
            </h4>
            <p className="text-xs text-slate-muted max-w-2xl">
              From Delhi NCR, Mumbai, Ahmedabad, Jaipur, Bengaluru, Hyderabad, and Chennai to Patna, Ranchi, Lucknow, and Kolkata — we deliver Vikram Solar, Adani Solar, Waaree, and Loom Solar modules (10W to 730W) with complete installation teams nationwide.
            </p>
          </div>
          <Link
            href="/request-site-survey"
            className="px-6 py-3 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover shadow-md whitespace-nowrap flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
          >
            <span>Book Pan India Site Survey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
