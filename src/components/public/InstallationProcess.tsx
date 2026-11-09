export default function InstallationProcess() {
  const steps = [
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
  ];

  return (
    <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            Clear Customer Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            How Solar Installation Works
          </h2>
          <p className="text-sm text-slate-300">
            A structured 8-step journey from first consultation to clean, green electricity on your rooftop.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-navy-800/80 border border-navy-700/80 rounded-2xl p-6 relative flex flex-col justify-between hover:border-solar-green transition-colors"
            >
              <div className="space-y-3">
                <span className="text-2xl font-black text-solar-green font-display">
                  {s.step}
                </span>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
