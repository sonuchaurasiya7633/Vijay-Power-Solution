import Link from "next/link";
import { Phone, MessageCircle, ArrowRight, Sun } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white py-16 relative overflow-hidden">
      <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-solar-green/15 blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-sm">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-green/20 text-solar-yellow text-xs font-semibold">
              <Sun className="w-3.5 h-3.5" />
              <span>Free Engineering Consultation Across Bihar, JH & UP</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Ready to Switch to Solar?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Take the first step towards clean, reliable power and drastically lower monthly electricity bills. Book an appointment with our solar engineering specialist today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <Link
              href="/get-quote"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-lg shadow-solar-green/20 flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <span>Request Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="https://wa.me/919431000000?text=Hello%20VIJOY%20POWER%20SOLUTION,%20I%20would%20like%20to%20request%20a%20solar%20rooftop%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-green-400" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href="tel:+919431000000"
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl font-bold text-sm bg-white/10 text-white hover:bg-white/20 border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-4 h-4 text-solar-yellow" />
              <span className="hidden sm:inline">Call Now</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
