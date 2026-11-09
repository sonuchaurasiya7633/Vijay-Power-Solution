import { Award, Zap, MapPin, Calendar } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  suffix?: string;
  icon: typeof Zap;
}

export default function StatsSection() {
  const stats: StatItem[] = [
    {
      label: "Rooftop Installations",
      value: "350+",
      suffix: "Confirmed Sites",
      icon: Award,
    },
    {
      label: "Clean Capacity Installed",
      value: "2.8+",
      suffix: "Megawatts",
      icon: Zap,
    },
    {
      label: "Primary Service Regions",
      value: "3",
      suffix: "Bihar, JH, UP",
      icon: MapPin,
    },
    {
      label: "Engineering Experience",
      value: "8+",
      suffix: "Years Active",
      icon: Calendar,
    },
  ];

  return (
    <section className="bg-navy-50 py-12 border-y border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-border shadow-sm flex flex-col items-center text-center space-y-2 hover:border-solar-green/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-solar-green-light text-solar-green flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-navy-800 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-xs font-bold text-navy-800 uppercase tracking-wide">
                  {stat.label}
                </p>
                {stat.suffix && (
                  <span className="text-[11px] text-slate-muted">
                    {stat.suffix}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
