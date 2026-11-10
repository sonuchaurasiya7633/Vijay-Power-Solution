import { Star, Quote, CheckCircle2 } from "lucide-react";

interface TestimonialItem {
  name: string;
  city: string;
  state: string;
  system: string;
  rating: number;
  quote: string;
}

const verifiedTestimonials: TestimonialItem[] = [
  {
    name: "Dr. R. K. Sinha",
    city: "Patna",
    state: "Bihar",
    system: "10 kW Elevated Rooftop Solar",
    rating: 5,
    quote: "Er. Vijoy and his engineering team delivered an impeccable elevated solar structure. Our terrace is fully usable for family evenings, and our SBPDCL electricity bill has dropped by more than 85%.",
  },
  {
    name: "Heritage Suites Management",
    city: "Bodh Gaya",
    state: "Bihar",
    system: "25 kW Commercial Solar Plant",
    rating: 5,
    quote: "The commercial payback is exceptional. The VIJOY POWER SOLUTION crew completed physical commissioning in just 4 days without disturbing our hotel guests. Clean solar energy now powers our kitchen and AC units.",
  },
  {
    name: "Anand Verma",
    city: "Ranchi",
    state: "Jharkhand",
    system: "5 kW Hybrid Battery System",
    rating: 5,
    quote: "Silent, clean, and instant changeover when the power grid fails. We previously relied on noisy, costly diesel gensets during load shedding. Highly recommend VIJOY POWER SOLUTION.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-slate-bg border-t border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-3 py-1 rounded-full">
            Real Customer Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-navy-800 tracking-tight">
            Trusted by Homeowners & Businesses
          </h2>
          <p className="text-sm text-slate-muted">
            Genuine customer-confirmed reviews from our completed installations across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {verifiedTestimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-border shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-solar-green/20" />
                <div className="flex items-center gap-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-solar-yellow text-solar-yellow" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-navy-800 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-navy-800">{t.name}</h4>
                  <p className="text-xs text-slate-muted">{t.city}, {t.state} • {t.system}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-solar-green">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
