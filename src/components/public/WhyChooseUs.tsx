import { Compass, ShieldCheck, Wrench, FileText, Headphones, CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: Compass,
      title: "Site-Specific Engineering",
      desc: "No cookie-cutter solar kits. We perform precision shadow modeling and roof load calculations before finalizing any array layout.",
    },
    {
      icon: ShieldCheck,
      title: "Tier-1 ALMM Certified Panels",
      desc: "Exclusively tier-1 panels with 25 to 30 year performance warranties, fully compliant with national PM Surya Ghar subsidy guidelines.",
    },
    {
      icon: Wrench,
      title: "Heavy-Duty Mounting Structures",
      desc: "Engineered hot-dip galvanized steel structures capable of withstanding severe eastern Indian monsoon storm winds up to 150 km/h.",
    },
    {
      icon: FileText,
      title: "Hassle-Free Net Metering Liaison",
      desc: "Complete end-to-end liaison with SBPDCL, NBPDCL, JBVNL, and UPPCL for prompt bi-directional meter testing and grid connection.",
    },
    {
      icon: Headphones,
      title: "Regional Support in Bihar, JH & UP",
      desc: "Dedicated field technicians based locally in Patna, Gaya, Ranchi, and Lucknow for swift on-site maintenance and troubleshooting.",
    },
    {
      icon: CheckCircle2,
      title: "Strict Commercial Transparency",
      desc: "Transparent private commercial line items with zero hidden charges, realistic ROI models, and clear documentation.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            Our Commitments
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            Why Choose VIJOY POWER SOLUTION
          </h2>
          <p className="text-sm text-slate-muted">
            Solar is a 25-year investment. We combine robust civil-electrical engineering with dedicated local service across Bihar, Jharkhand, and Uttar Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-border bg-slate-bg/50 hover:bg-white hover:border-solar-green/40 hover:shadow-lg transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-800">{p.title}</h3>
                <p className="text-xs text-slate-muted leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
