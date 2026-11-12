import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/ui/MotionPrimitives";

export default async function InstallationProcess() {
  const defaultData = {
    badge: "Clear Customer Journey",
    title: "How Your Solar Journey Works",
    subtitle:
      "From initial rooftop shadow assessment to final DISCOM net-meter synchronization in 8 transparent steps.",
    steps: [
      {
        step: "01",
        title: "Submit Enquiry",
        desc: "Share your location, electricity bill, and primary objectives via our online form or WhatsApp.",
      },
      {
        step: "02",
        title: "Initial Consultation",
        desc: "Our solar consultant reviews your sanctioned power load and discusses system options.",
      },
      {
        step: "03",
        title: "Site Survey",
        desc: "A field engineer inspects your roof orientation, shadow obstructions, and cable routes.",
      },
      {
        step: "04",
        title: "Engineering Design",
        desc: "Custom 3D layout, module count, and inverter capacity engineered for your property.",
      },
      {
        step: "05",
        title: "Private Quotation & Approval",
        desc: "Comprehensive transparent quotation with line items and subsidy projections for your review.",
      },
      {
        step: "06",
        title: "Installation Scheduling",
        desc: "Delivery of ALMM certified modules, inverters, and galvanized steel mounting structures.",
      },
      {
        step: "07",
        title: "Installation & Testing",
        desc: "Rigorous physical mounting, DC/AC wiring, multi-point chemical earthing, and lightning protection.",
      },
      {
        step: "08",
        title: "Handover & Net Metering",
        desc: "DISCOM synchronization, bi-directional meter testing, cloud monitoring app setup, and handover.",
      },
    ],
  };

  let data = defaultData;

  try {
    await connectDB();
    const homeSetting = await Setting.findOne({ key: "homepage" }).lean();
    if (homeSetting && homeSetting.value) {
      const val: any = homeSetting.value;
      if (val.process) {
        data = {
          badge: val.process.badge || defaultData.badge,
          title: val.process.title || defaultData.title,
          subtitle: val.process.subtitle || defaultData.subtitle,
          steps: Array.isArray(val.process.steps) && val.process.steps.length > 0 ? val.process.steps : defaultData.steps,
        };
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  return (
    <section className="py-20 bg-navy-800 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {data.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {data.title}
          </h2>
          <p className="text-sm text-slate-300">
            {data.subtitle}
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.steps.map((s, idx) => (
            <StaggerItem
              key={idx}
              hoverLift
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-solar-green/40 hover:bg-white/10 transition-all duration-300 space-y-3 relative group"
            >
              <span className="font-mono text-3xl font-extrabold text-solar-green/60 group-hover:text-solar-green transition-colors">
                {s.step || `0${idx + 1}`}
              </span>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
