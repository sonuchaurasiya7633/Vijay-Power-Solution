import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe, ArrowUpRight } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  let contact = {
    phone: "+91 94310 00000",
    whatsapp: "919431000000",
    email: "contact@vijoypowersolution.com",
    address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
    workingHours: "Monday – Saturday: 9:00 AM – 7:00 PM IST",
  };
  let headerFooterCms: any = null;

  try {
    await connectDB();
    const [generalDoc, hfDoc] = await Promise.all([
      Setting.findOne({ key: "general" }).lean(),
      Setting.findOne({ key: "header_footer" }).lean(),
    ]);

    if (generalDoc && generalDoc.value) {
      contact = { ...contact, ...(generalDoc.value as object) };
    }
    if (hfDoc && hfDoc.value) {
      headerFooterCms = hfDoc.value;
      if (headerFooterCms.footer) {
        contact = {
          ...contact,
          ...(headerFooterCms.footer.phone ? { phone: headerFooterCms.footer.phone } : {}),
          ...(headerFooterCms.footer.email ? { email: headerFooterCms.footer.email } : {}),
          ...(headerFooterCms.footer.address ? { address: headerFooterCms.footer.address } : {}),
          ...(headerFooterCms.footer.workingHours ? { workingHours: headerFooterCms.footer.workingHours } : {}),
        };
      }
    }
  } catch (e) {
    // Graceful fallback
  }

  const cleanPhone = contact.phone ? contact.phone.replace(/[^0-9+]/g, "") : "+919431000000";
  const cleanWa = contact.whatsapp ? contact.whatsapp.replace(/[^0-9]/g, "") : "919431000000";
  const description =
    headerFooterCms?.footer?.tagline ||
    "Vijoy Power Solution provides reliable solar panel supply and installation services for residential, commercial, industrial, and agricultural applications across India.";
  const copyrightText =
    headerFooterCms?.footer?.copyright ||
    `© ${currentYear} Vijoy Power Solution. All rights reserved.`;

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-10 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid: Col 1 (4 cols), Col 2 (2 cols), Col 3 (3 cols), Col 4 (3 cols) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-navy-800/80">
          {/* COLUMN 1 — COMPANY INFORMATION (4 of 12 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Vijoy Power Solution Logo"
                  fill
                  sizes="44px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg text-white tracking-tight">
                  VIJOY <span className="text-solar-green">POWER</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  SOLUTION • SOLAR EPC
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Service Availability Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900 border border-solar-green/30 text-solar-green text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-solar-green animate-pulse" />
              <span>Service Coverage: Across India</span>
            </div>

            {/* Compact Active Social & Communication Links */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={`https://wa.me/${cleanWa}?text=Hello%20Vijoy%20Power%20Solution,%20I%20would%20like%20to%20enquire%20about%20solar%20installation.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Vijoy Power Solution on WhatsApp"
                className="w-9 h-9 rounded-xl bg-navy-900 hover:bg-emerald-600 text-slate-300 hover:text-white border border-navy-800 flex items-center justify-center transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${cleanPhone}`}
                aria-label="Call Vijoy Power Solution"
                className="w-9 h-9 rounded-xl bg-navy-900 hover:bg-solar-green text-slate-300 hover:text-white border border-navy-800 flex items-center justify-center transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${contact.email}`}
                aria-label="Email Vijoy Power Solution"
                className="w-9 h-9 rounded-xl bg-navy-900 hover:bg-solar-yellow hover:text-navy-950 text-slate-300 border border-navy-800 flex items-center justify-center transition-all"
              >
                <Mail className="w-4 h-4" />
              </a>

              <Link
                href="/service-areas"
                aria-label="Pan India Solar Service Coverage"
                className="w-9 h-9 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-navy-800 flex items-center justify-center transition-all"
                title="Pan India Coverage"
              >
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* COLUMN 2 — QUICK LINKS (2 of 12 cols on desktop) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-300 hover:text-solar-green transition-colors inline-flex items-center gap-1">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-solar-green transition-colors inline-flex items-center gap-1">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-solar-green transition-colors inline-flex items-center gap-1">
                  <span>Our Services</span>
                </Link>
              </li>
              <li>
                <Link href="/solar-panels" className="text-slate-300 hover:text-solar-green transition-colors inline-flex items-center gap-1">
                  <span>Solar Products</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-300 hover:text-solar-green transition-colors inline-flex items-center gap-1">
                  <span>Our Projects</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-solar-green transition-colors inline-flex items-center gap-1">
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — OUR SOLAR SOLUTIONS (3 of 12 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Our Solar Solutions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/solar-solutions/residential-rooftop-solar"
                  className="text-slate-300 hover:text-solar-green transition-colors"
                >
                  Residential Solar Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/solar-solutions/commercial-institutional-solar"
                  className="text-slate-300 hover:text-solar-green transition-colors"
                >
                  Commercial Solar Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/solar-solutions/industrial-solar-power-plants"
                  className="text-slate-300 hover:text-solar-green transition-colors"
                >
                  Industrial Solar Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/solar-solutions/solar-agricultural-water-pumping"
                  className="text-slate-300 hover:text-solar-green transition-colors"
                >
                  Agricultural Solar Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/solar-solutions/on-grid-net-metering-systems"
                  className="text-slate-300 hover:text-solar-green transition-colors"
                >
                  On-Grid Net Metering Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/solar-solutions/off-grid-hybrid-solar"
                  className="text-slate-300 hover:text-solar-green transition-colors"
                >
                  Solar Water Pump & Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — CONTACT INFORMATION (3 of 12 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Contact Information
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                <a
                  href={`tel:${cleanPhone}`}
                  className="text-slate-300 hover:text-white transition-colors font-medium"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-solar-yellow shrink-0 mt-0.5" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-slate-300 hover:text-white transition-colors break-all"
                >
                  {contact.email}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">
                  {contact.address}
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-xs">
                  {contact.workingHours}
                </span>
              </div>

              <div className="pt-2">
                <Link
                  href="/get-quote"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-solar-yellow border border-navy-700 transition-colors shadow-sm"
                >
                  <span>Request Engineering Survey</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* MINIMAL BOTTOM FOOTER BAR */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p className="order-2 sm:order-1">{copyrightText}</p>

          <div className="order-1 sm:order-2 flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Regulatory Disclaimer
            </Link>
            <span className="text-slate-600">•</span>
            <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
