"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Phone,
  Menu,
  X,
  Sun,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  FolderGit2,
  Images,
  Video,
  Calculator,
  Compass,
  FileText,
} from "lucide-react";
import SocialLinksBar from "@/components/public/SocialLinksBar";
import { DEFAULT_SOCIAL_LINKS } from "@/lib/constants/social";
import { AnimatePresence, motion } from "framer-motion";
import { VPS_EASE } from "@/components/ui/MotionPrimitives";

export default function Navbar({
  initialCms,
}: {
  initialCms?: Record<string, any>;
} = {}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accordion toggle state in mobile drawer
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);

  const [headerCms, setHeaderCms] = useState(() => ({
    logoUrl: initialCms?.logoUrl || "/images/logo.png",
    noticeBar: {
      enabled: false,
      badge: "PM Surya Ghar 2026",
      text: "Serving Customers Across India | Solar Modules 10W to 730W",
      linkText: "Check Subsidy",
      linkUrl: "/subsidy-information",
      ...(initialCms?.noticeBar || {}),
    },
    topBar: {
      phone: "+91 94310 00000",
      whatsapp: "919431000000",
      email: "contact@vijoypowersolution.com",
      ...(initialCms?.topBar || {}),
    },
    socialLinks: {
      ...DEFAULT_SOCIAL_LINKS,
      ...(initialCms?.socialLinks || {}),
    },
  }));

  useEffect(() => {
    // Skip redundant client fetch when server layout already supplied header_footer CMS
    if (initialCms) return;
    fetch("/api/settings?key=header_footer")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && Object.keys(d.setting).length > 0) {
          setHeaderCms((prev) => ({
            logoUrl: d.setting.logoUrl || prev.logoUrl,
            noticeBar: { ...prev.noticeBar, ...(d.setting.noticeBar || {}) },
            topBar: { ...prev.topBar, ...(d.setting.topBar || {}) },
            socialLinks: { ...prev.socialLinks, ...(d.setting.socialLinks || {}) },
          }));
        }
      })
      .catch(() => {});
  }, [initialCms]);

  // Lock background body scroll and signal floating contact buttons when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.body.setAttribute("data-mobile-menu", "open");
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.removeAttribute("data-mobile-menu");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.removeAttribute("data-mobile-menu");
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile drawer when viewport resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const cleanPhone = headerCms.topBar.phone
    ? headerCms.topBar.phone.replace(/[^0-9+]/g, "")
    : "+919431000000";
  const cleanWa = headerCms.topBar.whatsapp
    ? headerCms.topBar.whatsapp.replace(/[^0-9]/g, "")
    : "919431000000";

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-border shadow-sm">
      {/* Top Notice Marquee Bar (if enabled) */}
      {headerCms.noticeBar.enabled && (
        <div className="bg-navy-800 text-white text-[11px] py-1.5 px-4 text-center border-b border-navy-700">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
            <span className="font-bold text-solar-yellow bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase">
              {headerCms.noticeBar.badge}
            </span>
            <span>{headerCms.noticeBar.text}</span>
            {headerCms.noticeBar.linkText && (
              <Link
                href={headerCms.noticeBar.linkUrl}
                className="text-solar-green underline font-bold ml-1 hover:text-solar-green-hover"
              >
                {headerCms.noticeBar.linkText} &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-border bg-navy-800 p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <Image
                src={headerCms.logoUrl || "/images/logo.png"}
                alt="VIJOY POWER SOLUTION Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl text-navy-800 tracking-tight leading-none">
                VIJOY <span className="text-solar-green">POWER</span>
              </span>
              <span className="text-xs font-semibold tracking-wider text-slate-muted uppercase">
                SOLUTION • SOLAR
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-navy-800">
            <Link
              href="/"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/") ? "text-solar-green font-bold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/about") ? "text-solar-green font-bold" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="/solar-panels"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/solar-panels") ? "text-solar-green font-bold" : ""
              }`}
            >
              Solar Panels
            </Link>

            <Link
              href="/solar-solutions"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/solar-solutions") ? "text-solar-green font-bold" : ""
              }`}
            >
              Solutions
            </Link>

            <Link
              href="/services"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/services") ? "text-solar-green font-bold" : ""
              }`}
            >
              Services
            </Link>
            <Link
              href="/projects"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/projects") || isLinkActive("/gallery") ? "text-solar-green font-bold" : ""
              }`}
            >
              Projects
            </Link>
            <Link
              href="/solar-calculator"
              className="flex items-center gap-1 text-solar-green font-semibold hover:text-solar-green-hover"
            >
              <Sun className="w-4 h-4" />
              <span>Calculator</span>
            </Link>
            <Link
              href="/subsidy-information"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/subsidy-information") ? "text-solar-green font-bold" : ""
              }`}
            >
              Subsidy Guide
            </Link>
            <Link
              href="/contact"
              className={`hover:text-solar-green transition-colors ${
                isLinkActive("/contact") ? "text-solar-green font-bold" : ""
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/get-quote"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm bg-solar-green text-white hover:bg-solar-green-hover shadow-md shadow-solar-green/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Quote
            </Link>
          </div>

          {/* Mobile Right Action & Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${cleanPhone}`}
              className="w-10 h-10 rounded-xl bg-slate-bg text-navy-800 border border-slate-border flex items-center justify-center hover:bg-navy-50 transition-colors"
              aria-label="Call VPS Solar Helpline"
            >
              <Phone className="w-4 h-4 text-solar-green" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="w-11 h-11 rounded-xl text-navy-800 hover:bg-slate-bg flex items-center justify-center transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* =========================================================================
          PREMIUM MOBILE NAVIGATION DRAWER & OVERLAY
          Rendered outside <header> stacking context so it cleanly layers above
          all page content & floating call/WhatsApp buttons on mobile.
          ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-[70] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Right-Side Drawer Container */}
            <motion.aside
              key="mobile-nav-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.26, ease: VPS_EASE }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              className="fixed top-0 right-0 bottom-0 z-[70] w-[min(85vw,360px)] h-[100dvh] max-h-[100dvh] bg-white shadow-2xl flex flex-col lg:hidden border-l border-slate-200/80"
            >
        {/* Drawer Header */}
        <div className="shrink-0 h-20 px-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-navy-800 p-0.5 shrink-0 shadow-sm">
              <Image
                src={headerCms.logoUrl || "/images/logo.png"}
                alt="VIJOY POWER SOLUTION Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base text-navy-800 tracking-tight leading-none">
                VIJOY <span className="text-solar-green">POWER</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider text-slate-muted uppercase mt-0.5">
                SOLUTION • SOLAR
              </span>
            </div>
          </Link>

          {/* Close Button - 44x44 touch friendly target */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-navy-800 hover:bg-slate-100 transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-navy-800" />
          </button>
        </div>

        {/* Drawer Scrollable Navigation Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-1 overscroll-contain">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>Home</span>
          </Link>

          {/* 2. About Us */}
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/about")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>About Us</span>
          </Link>

          {/* 3. Solar Products */}
          <Link
            href="/solar-panels"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/solar-panels")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>Solar Panels (10W – 730W)</span>
          </Link>

          {/* 4. Solar Solutions */}
          <Link
            href="/solar-solutions"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/solar-solutions")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>Solar Solutions</span>
          </Link>

          {/* 5. Installation Services */}
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/services")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>Installation Services</span>
          </Link>

          {/* 6. Our Projects & Gallery (Accordion) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between rounded-xl hover:bg-slate-50 transition-colors">
              <Link
                href="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex-1 px-3.5 py-3 text-[15px] font-semibold ${
                  isLinkActive("/projects") || isLinkActive("/gallery") || isLinkActive("/videos")
                    ? "text-solar-green font-bold"
                    : "text-navy-800"
                }`}
              >
                <span>Our Projects</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileProjectsOpen(!mobileProjectsOpen)}
                className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-navy-800 transition-colors"
                aria-label="Toggle Projects Submenu"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileProjectsOpen ? "rotate-180 text-solar-green" : ""
                  }`}
                />
              </button>
            </div>

            {/* Projects Submenu */}
            <AnimatePresence initial={false}>
              {mobileProjectsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: VPS_EASE }}
                  className="overflow-hidden pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-100 ml-4"
                >
                <Link
                  href="/projects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-solar-green hover:bg-slate-50"
                >
                  Real Installation Case Studies
                </Link>
                <Link
                  href="/gallery"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-solar-green hover:bg-slate-50"
                >
                  Customer Photo Gallery
                </Link>
                <Link
                  href="/videos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-solar-green hover:bg-slate-50"
                >
                  Video Walkthroughs & Stories
                </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 7. Solar Savings Calculator */}
          <Link
            href="/solar-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/solar-calculator")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-solar-green hover:bg-solar-green/5"
            }`}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 fill-solar-green" />
              <span>Solar Savings Calculator</span>
            </span>
          </Link>

          {/* 8. PM Surya Ghar Subsidy */}
          <Link
            href="/subsidy-information"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/subsidy-information")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>PM Surya Ghar Subsidy</span>
          </Link>

          {/* 9. Pan India Service Coverage */}
          <Link
            href="/service-areas"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/service-areas")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>Service Coverage (Pan India)</span>
          </Link>

          {/* 10. Contact Us */}
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-semibold transition-all ${
              isLinkActive("/contact")
                ? "bg-solar-green/10 text-solar-green font-bold"
                : "text-navy-800 hover:bg-slate-50"
            }`}
          >
            <span>Contact Us</span>
          </Link>
        </div>

        {/* Drawer Fixed Footer & Primary Action */}
        <div
          className="shrink-0 p-4 border-t border-slate-border bg-white space-y-2.5"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {/* Primary CTA */}
          <Link
            href="/get-quote"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-solar-green hover:bg-solar-green-hover text-white font-bold text-sm shadow-md shadow-solar-green/20 transition-transform active:scale-[0.98]"
          >
            <span>Get Free Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Compact Verified Support Desk */}
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <a
              href={`tel:${cleanPhone}`}
              className="h-10 flex items-center justify-center gap-1.5 rounded-lg border border-slate-border bg-slate-bg text-navy-800 hover:bg-navy-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-solar-green" />
              <span>Call Helpline</span>
            </a>
            <a
              href={`https://wa.me/${cleanWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 flex items-center justify-center gap-1.5 rounded-lg border border-slate-border bg-slate-bg text-navy-800 hover:bg-navy-50 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-solar-green" />
              <span>WhatsApp Desk</span>
            </a>
          </div>

          <SocialLinksBar links={headerCms.socialLinks} variant="compact" />
        </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
