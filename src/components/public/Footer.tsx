import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Sun,
  ArrowRight,
  ChevronRight,
  Layers,
  Settings,
  Building2,
  Grid2x2,
  Wrench,
  Images,
  FileText,
  ClipboardCheck,
  Leaf,
} from "lucide-react";
import { YouTubeIcon, InstagramIcon, FacebookIcon } from "@/components/public/SocialLinksBar";
import FooterAccordionSection from "@/components/public/FooterAccordionSection";
import { resolveSocialLinks } from "@/lib/constants/social";
import { getPublicShellSettings, type PublicShellSettings } from "@/lib/cms-server";

export default async function Footer({
  initialShell,
}: {
  initialShell?: PublicShellSettings;
} = {}) {
  const currentYear = new Date().getFullYear();
  let contact = {
    phone: "+91 94310 00000",
    email: "contact@vijoypowersolution.com",
    address: "Main Road, Near Power Grid Substation, Gaya, Bihar - 823001",
    workingHours: "Mon – Sat: 9:00 AM – 7:00 PM",
  };
  let headerFooterCms: any = null;

  try {
    const shell = initialShell || (await getPublicShellSettings());
    if (shell.general && Object.keys(shell.general).length > 0) {
      contact = { ...contact, ...shell.general };
    }
    if (shell.headerFooter && Object.keys(shell.headerFooter).length > 0) {
      headerFooterCms = shell.headerFooter;
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
    `© ${currentYear} VIJOY POWER SOLUTION (VPS SOLAR). All rights reserved. Pan India Registered Solar EPC Contractor.`;

  const resolvedSocial = resolveSocialLinks(headerFooterCms?.socialLinks);
  const socialItems = [
    {
      name: "YouTube",
      href: resolvedSocial.youtube,
      iconBg: "text-[#FF3D3D]",
      Icon: YouTubeIcon,
    },
    {
      name: "Instagram",
      href: resolvedSocial.instagram,
      iconBg: "text-[#F472B6]",
      Icon: InstagramIcon,
    },
    {
      name: "Facebook",
      href: resolvedSocial.facebook,
      iconBg: "text-[#3B82F6]",
      Icon: FacebookIcon,
    },
  ].filter((item) => Boolean(item.href));

  const exploreLinks = [
    { label: "About Us", href: "/about", Icon: Building2 },
    { label: "Solar Solutions", href: "/solar-solutions", Icon: Grid2x2 },
    { label: "Panel Catalogue (10W – 730W)", href: "/solar-panels", Icon: Layers },
    { label: "Installation Services", href: "/services", Icon: Wrench },
    { label: "Real Installations", href: "/projects", Icon: Images },
  ];

  const toolLinks = [
    { label: "Solar Savings Calculator", href: "/solar-calculator", Icon: Sun, featured: true },
    { label: "PM Surya Ghar Subsidy Guide", href: "/subsidy-information", Icon: FileText, featured: false },
    { label: "Pan-India Service Coverage", href: "/service-areas", Icon: MapPin, featured: false },
    { label: "Contact Us", href: "/contact", Icon: Phone, featured: false },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Staff Portal", href: "/admin/login" },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#061829] via-[#082238] to-[#051523] text-slate-200 pt-10 md:pt-14 pb-8 border-t border-solar-green/25">
      {/* Subtle Solar Backdrop Accent (Top-right on mobile, Bottom-right on desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-[230px] h-[165px] md:top-auto md:bottom-0 md:right-0 md:w-[500px] md:h-[290px] opacity-30 md:opacity-35 select-none"
        style={{
          maskImage: "radial-gradient(ellipse at 85% 60%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 85% 60%, black 20%, transparent 75%)",
        }}
      >
        <Image
          src="/images/hero-solar-rooftop.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 230px, 500px"
          className="object-cover object-center"
        />
      </div>

      {/* Subtle Ambient Emerald Horizon Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 w-[540px] h-[220px] rounded-full bg-solar-green/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-36 h-px bg-gradient-to-r from-transparent via-solar-green/40 to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pb-8">
          {/* Col 1: Brand, Tagline, Contact & Social Pills */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 p-0.5 border border-white/20 shadow-sm shrink-0">
                <Image
                  src={headerFooterCms?.logoUrl || "/images/logo.png"}
                  alt="VIJOY POWER SOLUTION"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-9 w-px bg-white/25" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl sm:text-[22px] text-white tracking-tight leading-none">
                  VIJOY <span className="text-solar-green">POWER</span>
                </span>
                <span className="text-[11px] font-semibold tracking-[0.18em] text-slate-300 uppercase mt-1">
                  SOLUTION • SOLAR EPC
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed md:border-l-2 md:border-solar-yellow/65 md:pl-3.5 max-w-md">
              {tagline}
            </p>

            <div className="pt-1 flex flex-col gap-2.5 text-xs sm:text-[13px] text-slate-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-solar-green md:text-solar-yellow shrink-0 mt-0.5" />
                <span>{contact.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-solar-green shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors">
                  {contact.phone} • <span className="text-slate-300">{contact.workingHours}</span>
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-solar-green md:text-solar-yellow shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                  {contact.email}
                </a>
              </div>
            </div>

            {socialItems.length > 0 && (
              <div className="pt-2 space-y-2.5 max-w-sm">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-white shrink-0">
                    FOLLOW US
                  </span>
                  <span
                    className="h-px flex-1 bg-gradient-to-r from-solar-green/80 md:from-solar-yellow/70 to-transparent"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {socialItems.map(({ name, href, iconBg, Icon }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow VIJOY POWER SOLUTION on ${name}`}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#092035]/90 border border-white/15 hover:border-solar-green/60 hover:bg-[#0D2B45] text-white text-xs font-semibold transition-all duration-200 shadow-sm"
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${iconBg}`} />
                      <span>{name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Col 2: Explore (Desktop Open List + Mobile Accordion Card) */}
          <div className="md:col-span-3">
            {/* Desktop Explore */}
            <div className="hidden md:block space-y-3">
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-solar-yellow shrink-0" />
                <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-white shrink-0">
                  EXPLORE
                </h4>
                <span
                  className="h-px flex-1 bg-gradient-to-r from-solar-yellow/70 via-solar-yellow/25 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <ul className="space-y-1 text-[13px]">
                {exploreLinks.map(({ label, href, Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between px-2.5 py-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                    >
                      <span className="flex items-center gap-2.5 text-slate-200 group-hover:text-white">
                        <Icon className="w-4 h-4 text-solar-yellow/85 group-hover:text-solar-yellow transition-colors shrink-0" />
                        <span>{label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-solar-green group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Accordion Explore */}
            <FooterAccordionSection title="EXPLORE" iconName="explore" defaultOpen>
              <ul className="divide-y divide-white/10 text-[13px]">
                {exploreLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between px-1.5 py-2.5 text-slate-200 hover:text-white transition-colors"
                    >
                      <span>{label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-solar-green group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordionSection>
          </div>

          {/* Col 3: Tools & Coverage (Desktop Open List + Mobile Accordion Card + Responsive Pill CTA) */}
          <div className="md:col-span-4 space-y-4">
            {/* Desktop Tools & Coverage */}
            <div className="hidden md:block space-y-3">
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4 text-solar-yellow shrink-0" />
                <h4 className="text-xs font-extrabold uppercase tracking-[0.14em] text-white shrink-0">
                  TOOLS &amp; COVERAGE
                </h4>
                <span
                  className="h-px flex-1 bg-gradient-to-r from-solar-yellow/70 via-solar-yellow/25 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <ul className="space-y-1 text-[13px]">
                {toolLinks.map(({ label, href, Icon, featured }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={
                        featured
                          ? "group flex items-center justify-between px-3.5 py-2 rounded-full bg-gradient-to-r from-solar-yellow/20 via-solar-green/15 to-transparent border border-solar-yellow/40 hover:border-solar-yellow/70 transition-all duration-200"
                          : "group flex items-center justify-between px-3 py-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
                      }
                    >
                      <span
                        className={`flex items-center gap-2.5 ${
                          featured
                            ? "font-bold text-[#F3C856]"
                            : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            featured
                              ? "text-[#F3C856]"
                              : "text-solar-yellow/85 group-hover:text-solar-yellow transition-colors"
                          }`}
                        />
                        <span>{label}</span>
                      </span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0 ${
                          featured ? "text-[#F3C856]" : "text-solar-green"
                        }`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Accordion Tools & Coverage */}
            <FooterAccordionSection title="TOOLS & COVERAGE" iconName="tools" defaultOpen>
              <ul className="divide-y divide-white/10 text-[13px]">
                {toolLinks.map(({ label, href, Icon, featured }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between px-1.5 py-2.5 transition-colors"
                    >
                      <span
                        className={`flex items-center gap-2.5 ${
                          featured ? "font-bold text-[#F3C856]" : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            featured ? "text-[#F3C856]" : "text-solar-green"
                          }`}
                        />
                        <span>{label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-solar-green group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordionSection>

            {/* Primary CTA Button (Emerald Pill on Mobile, Metallic Gold Pill on Desktop) */}
            <div className="pt-1 flex justify-center md:justify-start">
              <Link
                href="/request-site-survey"
                className="group inline-flex items-center justify-center gap-2.5 w-full max-w-[300px] md:max-w-[270px] py-3 px-6 rounded-full font-extrabold text-sm bg-gradient-to-r from-[#45B049] via-[#278463] to-[#1D6A4E] text-white border border-solar-green/60 shadow-[0_8px_24px_rgba(39,132,99,0.35)] md:bg-gradient-to-r md:from-[#F2CE68] md:via-[#D7A84B] md:to-[#C6902E] md:text-[#071828] md:border-[#F8DF8C]/60 md:shadow-[0_10px_28px_rgba(215,168,75,0.28)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                <ClipboardCheck className="w-4 h-4 shrink-0" />
                <span>Request Site Survey</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>

        {/* Strict Commercial Transparency Notice Card */}
        <div className="rounded-2xl bg-[#092B2E]/70 border border-solar-green/35 px-4 py-4 sm:px-6 backdrop-blur-sm shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
            <div className="flex items-center gap-3 shrink-0 md:pr-5 md:border-r md:border-white/15">
              <ShieldCheck className="w-5 h-5 text-solar-green md:text-solar-yellow shrink-0" />
              <div className="text-xs sm:text-[13px] font-bold text-white md:text-solar-yellow leading-tight">
                Strict Commercial
                <br className="hidden md:inline" /> Transparency Notice:
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              VIJOY POWER SOLUTION provides site-specific solar engineering and installation contracts. We do not offer public online ecommerce checkouts. All commercial quotations are provided privately following engineering load assessment. Subsidy eligibility, benefits, documentation, and approval depend on applicable government rules and DISCOM requirements under the PM Surya Ghar scheme.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-300 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Leaf className="hidden md:inline-block w-4 h-4 text-solar-green shrink-0" />
            <p>{copyrightText}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {legalLinks.map((item, idx) => (
              <div key={item.href} className="inline-flex items-center gap-3 sm:gap-4">
                {idx > 0 && (
                  <>
                    <span className="md:hidden text-solar-green/70" aria-hidden="true">|</span>
                    <span className="hidden md:inline text-solar-yellow" aria-hidden="true">•</span>
                  </>
                )}
                <Link
                  href={item.href}
                  className="hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
