import { Award, Zap, MapPin, Calendar } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import { StaggerGrid, StaggerItem, AnimatedCounter } from "@/components/ui/MotionPrimitives";

export default async function StatsSection() {
  const defaultStats = [
    {
      label: "Rooftop Installations",
      value: "350+",
      suffix: "Confirmed Sites",
    },
    {
      label: "Clean Capacity Installed",
      value: "2.8+",
      suffix: "Megawatts",
    },
    {
      label: "Service Coverage",
      value: "Pan India",
      suffix: "All States & UTs",
    },
    {
      label: "Engineering Experience",
      value: "8+",
      suffix: "Years Active",
    },
  ];

  let displayStats = defaultStats;

  try {
    await connectDB();
    const homeSetting = await Setting.findOne({ key: "homepage" }).lean();
    if (homeSetting && homeSetting.value) {
      const val: any = homeSetting.value;
      if (Array.isArray(val.stats) && val.stats.length === 4) {
        displayStats = val.stats;
      } else if (val.installationsCount || val.capacityMw || val.experienceYears) {
        displayStats = [
          {
            label: "Rooftop Installations",
            value: `${val.installationsCount || 350}+`,
            suffix: "Confirmed Sites",
          },
          {
            label: "Clean Capacity Installed",
            value: `${val.capacityMw || 2.8}+`,
            suffix: "Megawatts",
          },
          {
            label: "Service Coverage",
            value: "Pan India",
            suffix: "All States & UTs",
          },
          {
            label: "Engineering Experience",
            value: `${val.experienceYears || 8}+`,
            suffix: "Years Active",
          },
        ];
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  const icons = [Award, Zap, MapPin, Calendar];

  return (
    <section className="bg-navy-50 py-12 border-y border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <StaggerItem
                key={idx}
                hoverLift
                className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm flex flex-col items-center text-center space-y-2 hover:border-solar-green/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </div>
                <p className="text-xs font-bold text-navy-800 uppercase tracking-wide">
                  {stat.label}
                </p>
                {stat.suffix && (
                  <span className="text-[11px] text-slate-muted">
                    {stat.suffix}
                  </span>
                )}
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
