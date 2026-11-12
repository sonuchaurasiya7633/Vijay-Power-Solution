import Link from "next/link";
import { Phone, MessageCircle, ArrowRight, Sun } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import { Reveal } from "@/components/ui/MotionPrimitives";

export default async function CtaBanner() {
  let ctaData = {
    badge: "Free Engineering Consultation Across India",
    title: "Ready to Switch to Solar?",
    description:
      "Take the first step towards clean, reliable power and drastically lower monthly electricity bills. Book an appointment with our solar engineering specialist today.",
    buttonText: "Request Free Consultation",
    buttonLink: "/get-quote",
    phone: "+91 94310 00000",
    whatsapp: "919431000000",
  };

  try {
    await connectDB();
    const [homeSetting, generalSetting] = await Promise.all([
      Setting.findOne({ key: "homepage" }).lean(),
      Setting.findOne({ key: "general" }).lean(),
    ]);

    if (homeSetting && homeSetting.value) {
      const val: any = homeSetting.value;
      if (val.ctaBanner) {
        ctaData = { ...ctaData, ...val.ctaBanner };
      }
    }

    if (generalSetting && generalSetting.value) {
      const g: any = generalSetting.value;
      if (g.phone) ctaData.phone = g.phone;
      if (g.whatsapp) ctaData.whatsapp = g.whatsapp;
    }
  } catch (e) {
    // Graceful fallback
  }

  const cleanPhone = ctaData.phone ? ctaData.phone.replace(/[^0-9+]/g, "") : "+919431000000";
  const cleanWa = ctaData.whatsapp ? ctaData.whatsapp.replace(/[^0-9]/g, "") : "919431000000";

  return (
    <section className="bg-navy-800 text-white py-16 relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-solar-green/15 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-sm hover:border-white/20 transition-colors">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-green/20 text-solar-yellow text-xs font-semibold">
              <Sun className="w-3.5 h-3.5" />
              <span>{ctaData.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {ctaData.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              {ctaData.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href={ctaData.buttonLink || "/get-quote"}
              className="group w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-lg shadow-solar-green/20 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
            >
              <span>{ctaData.buttonText || "Request Free Consultation"}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <a
              href={`https://wa.me/${cleanWa}?text=Hello%20VIJOY%20POWER%20SOLUTION,%20I%20would%20like%20to%20request%20a%20solar%20rooftop%20consultation.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center justify-center gap-1.5 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <Phone className="w-4 h-4 text-solar-yellow" />
              <span className="hidden sm:inline">Call Now</span>
            </a>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
