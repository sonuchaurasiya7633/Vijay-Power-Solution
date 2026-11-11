import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Sun } from "lucide-react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  let contact = {
    phone: "+91 94310 00000",
    email: "contact@vijoypowersolution.com",
    address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
    workingHours: "Mon – Sat: 9:00 AM – 7:00 PM",
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
  const tagline =
    headerFooterCms?.footer?.tagline ||
    "Premier solar engineering, supply, and rooftop installation specialist empowering households, commercial enterprises, and agricultural farms across India.";
  const copyrightText =
    headerFooterCms?.footer?.copyright ||
    `© ${currentYear} VIJOY POWER SOLUTION. All rights reserved.`;

  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-10 border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-700/60">
          {/* Col 1: About & Logo */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20">
                <Image
                  src={headerFooterCms?.logoUrl || "/images/logo.png"}
                  alt="VIJOY POWER SOLUTION"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl text-white tracking-tight">
                  VIJOY <span className="text-solar-green">POWER</span>
                </span>
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  SOLUTION • SOLAR EPC
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed pr-6">
              {tagline}
            </p>
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-solar-yellow shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-solar-green shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">
                  {contact.phone} ({contact.workingHours})
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-solar-yellow shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Solar Solutions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solar-solutions/residential-rooftop-solar" className="hover:text-solar-green transition-colors">
                  Residential Rooftop Solar
                </Link>
              </li>
              <li>
                <Link href="/solar-solutions/commercial-rooftop-solar" className="hover:text-solar-green transition-colors">
                  Commercial Rooftop Solar
                </Link>
              </li>
              <li>
                <Link href="/solar-solutions/industrial-solar-systems" className="hover:text-solar-green transition-colors">
                  Industrial Solar Plants
                </Link>
              </li>
              <li>
                <Link href="/solar-solutions/on-grid-solar-systems" className="hover:text-solar-green transition-colors">
                  On-Grid Net Metering
                </Link>
              </li>
              <li>
                <Link href="/solar-solutions/off-grid-hybrid-solar" className="hover:text-solar-green transition-colors">
                  Hybrid & Battery Systems
                </Link>
              </li>
              <li>
                <Link href="/solar-solutions/solar-water-pumping" className="hover:text-solar-green transition-colors">
                  Solar Agricultural Pumps
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Services & Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solar-calculator" className="text-solar-yellow hover:text-white flex items-center gap-1 font-medium">
                  <Sun className="w-3.5 h-3.5" />
                  <span>Solar Savings Calculator</span>
                </Link>
              </li>
              <li>
                <Link href="/subsidy-information" className="hover:text-solar-green transition-colors">
                  PM Surya Ghar Subsidy Guide
                </Link>
              </li>
              <li>
                <Link href="/services/solar-consultation-site-survey" className="hover:text-solar-green transition-colors">
                  Rooftop Site Survey
                </Link>
              </li>
              <li>
                <Link href="/services/solar-panel-installation" className="hover:text-solar-green transition-colors">
                  Turnkey Installation
                </Link>
              </li>
              <li>
                <Link href="/services/net-metering-guidance" className="hover:text-solar-green transition-colors">
                  DISCOM Net Metering Liaison
                </Link>
              </li>
              <li>
                <Link href="/solar-panels" className="hover:text-solar-green transition-colors">
                  Panel Catalogue (10W - 730W)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-solar-green transition-colors">
                  Recent Installations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Primary Coverage */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Service Coverage</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/service-areas" className="text-solar-yellow hover:text-white font-bold transition-colors">
                  Pan-India Solar EPC (All 28 States &amp; 8 UTs) →
                </Link>
              </li>
              <li>
                <Link href="/service-areas/delhi" className="hover:text-solar-green transition-colors">
                  North India (Delhi NCR, UP, Rajasthan, Punjab)
                </Link>
              </li>
              <li>
                <Link href="/service-areas/maharashtra" className="hover:text-solar-green transition-colors">
                  West &amp; South (Maharashtra, Gujarat, Karnataka, TN)
                </Link>
              </li>
              <li>
                <Link href="/service-areas/west-bengal" className="hover:text-solar-green transition-colors">
                  East &amp; Central (WB, Bihar, Jharkhand, MP, Odisha)
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/request-site-survey"
                  className="inline-block py-2 px-3 text-xs font-semibold rounded-lg bg-navy-800 text-solar-yellow border border-navy-600 hover:bg-navy-700 transition-colors"
                >
                  Book Pan India Feasibility Visit
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Transparency Note */}
        <div className="py-6 border-b border-navy-700/60 text-xs text-slate-400 space-y-2">
          <p className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-solar-green" />
            <span>Strict Commercial Transparency Notice:</span>
          </p>
          <p>
            VIJOY POWER SOLUTION provides site-specific solar engineering and installation contracts. We do not offer public online ecommerce checkouts. All commercial quotations are provided privately following engineering load assessment. Subsidy eligibility, benefits, documentation, and approval depend on applicable government rules and DISCOM requirements under the PM Surya Ghar scheme.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{copyrightText}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Regulatory Disclaimer
            </Link>
            <span>•</span>
            <Link href="/faqs" className="hover:text-white transition-colors">
              FAQs
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="text-slate-400 hover:text-slate-200 transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
