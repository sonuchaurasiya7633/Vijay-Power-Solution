import Link from "next/link";
import { MapPin, ArrowRight, Check } from "lucide-react";

export default function ServiceAreasSection() {
  const regions = [
    {
      state: "Bihar",
      slug: "bihar",
      tagline: "Primary Central Hub",
      cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
      discoms: "SBPDCL & NBPDCL",
      netMeteringStatus: "Active Net Metering & PM Surya Ghar Subsidy",
    },
    {
      state: "Jharkhand",
      slug: "jharkhand",
      tagline: "Industrial & Off-Grid Reach",
      cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
      discoms: "JBVNL",
      netMeteringStatus: "Residential Net Metering & Industrial Captive Solar",
    },
    {
      state: "Uttar Pradesh",
      slug: "uttar-pradesh",
      tagline: "Fast Growing Urban Rooftop Market",
      cities: ["Lucknow", "Varanasi", "Prayagraj", "Kanpur", "Gorakhpur"],
      discoms: "UPPCL",
      netMeteringStatus: "UPNEDA State Subsidy + PM Surya Ghar Direct DBT",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            Geographic Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            Solar Engineering Across Three Key States
          </h2>
          <p className="text-sm text-slate-muted">
            We provide verified site survey teams, local DISCOM liaison, and rapid physical maintenance deployment in key cities across Bihar, Jharkhand, and Uttar Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {regions.map((reg) => (
            <div
              key={reg.slug}
              className="bg-navy-50/60 rounded-3xl p-6 sm:p-8 border border-navy-100 flex flex-col justify-between hover:border-solar-green/40 transition-all hover:shadow-lg"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                    {reg.tagline}
                  </span>
                  <MapPin className="w-5 h-5 text-solar-green" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-display text-navy-800">
                    Solar in {reg.state}
                  </h3>
                  <p className="text-xs text-slate-muted mt-1">
                    Utility boards: <strong>{reg.discoms}</strong>
                  </p>
                </div>

                <div className="pt-2">
                  <p className="text-xs font-bold text-navy-800 mb-2">Key Service Districts:</p>
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
                  <span>Explore {reg.state} Solar Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
