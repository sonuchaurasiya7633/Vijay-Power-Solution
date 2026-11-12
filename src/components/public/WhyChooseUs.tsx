import { Compass, ShieldCheck, Wrench, FileText, Headphones, CheckCircle2 } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

export default async function WhyChooseUs() {
  const defaultData = {
    badge: "Our Commitments",
    title: "Why Choose VIJOY POWER SOLUTION",
    subtitle:
      "Solar is a 25-year investment. We combine robust civil-electrical engineering with dedicated local service and nationwide support across India.",
    pillars: [
      {
        title: "Site-Specific Engineering",
        desc: "No cookie-cutter solar kits. We perform precision shadow modeling and roof load calculations before finalizing any array layout.",
      },
      {
        title: "Tier-1 ALMM Certified Panels",
        desc: "Exclusively tier-1 panels with 25 to 30 year performance warranties, fully compliant with national PM Surya Ghar subsidy guidelines.",
      },
      {
        title: "Heavy-Duty Mounting Structures",
        desc: "Engineered hot-dip galvanized steel structures capable of withstanding severe monsoon storms and extreme wind speeds up to 150 km/h.",
      },
      {
        title: "Hassle-Free Net Metering Liaison",
        desc: "Complete end-to-end liaison with state electricity boards (DISCOMs) across India for prompt bi-directional meter testing and grid connection.",
      },
      {
        title: "Nationwide Technical Support",
        desc: "Dedicated field engineers and rapid-response technical teams backed by major operational hubs across India for reliable long-term maintenance.",
      },
      {
        title: "Strict Commercial Transparency",
        desc: "Transparent private commercial line items with zero hidden charges, realistic ROI models, and clear documentation.",
      },
    ],
  };

  let data = defaultData;

  try {
    await connectDB();
    const homeSetting = await Setting.findOne({ key: "homepage" }).lean();
    if (homeSetting && homeSetting.value) {
      const val: any = homeSetting.value;
      if (val.whyUs) {
        data = {
          badge: val.whyUs.badge || defaultData.badge,
          title: val.whyUs.title || defaultData.title,
          subtitle: val.whyUs.subtitle || defaultData.subtitle,
          pillars: Array.isArray(val.whyUs.pillars) && val.whyUs.pillars.length > 0 ? val.whyUs.pillars : defaultData.pillars,
        };
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  const icons = [Compass, ShieldCheck, Wrench, FileText, Headphones, CheckCircle2];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            {data.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            {data.title}
          </h2>
          <p className="text-sm text-slate-muted">
            {data.subtitle}
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.pillars.map((p, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <StaggerItem
                key={idx}
                hoverLift
                className="p-6 rounded-2xl border border-slate-border bg-slate-bg/50 hover:bg-white hover:border-solar-green/40 hover:shadow-lg transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-800">{p.title}</h3>
                <p className="text-xs text-slate-muted leading-relaxed">{p.desc}</p>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
