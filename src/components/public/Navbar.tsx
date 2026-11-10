"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Sun, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);

  const [headerCms, setHeaderCms] = useState({
    noticeBar: {
      enabled: false,
      badge: "PM Surya Ghar 2026",
      text: "Serving Bihar, Jharkhand & Uttar Pradesh | Solar Modules 10W to 730W",
      linkText: "Check Subsidy",
      linkUrl: "/subsidy-information",
    },
    topBar: {
      phone: "+91 94310 00000",
      whatsapp: "919431000000",
      email: "contact@vijoypowersolution.com",
    },
  });

  useEffect(() => {
    fetch("/api/settings?key=header_footer")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting && Object.keys(d.setting).length > 0) {
          setHeaderCms((prev) => ({
            noticeBar: { ...prev.noticeBar, ...(d.setting.noticeBar || {}) },
            topBar: { ...prev.topBar, ...(d.setting.topBar || {}) },
          }));
        }
      })
      .catch(() => {});
  }, []);

  const cleanPhone = headerCms.topBar.phone ? headerCms.topBar.phone.replace(/[^0-9+]/g, "") : "+919431000000";
  const cleanWa = headerCms.topBar.whatsapp ? headerCms.topBar.whatsapp.replace(/[^0-9]/g, "") : "919431000000";

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-border shadow-sm">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-border bg-navy-800 p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
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
            <Link href="/" className="hover:text-solar-green transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-solar-green transition-colors">
              About
            </Link>
            <Link href="/solar-panels" className="hover:text-solar-green transition-colors">
              Solar Panels
            </Link>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsDropdown(true)}
              onMouseLeave={() => setSolutionsDropdown(false)}
            >
              <Link
                href="/solar-solutions"
                className="flex items-center gap-1 hover:text-solar-green transition-colors py-2"
              >
                <span>Solutions</span>
                <ChevronDown className="w-4 h-4 text-slate-muted" />
              </Link>
              {solutionsDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-border p-2 space-y-1">
                  <Link
                    href="/solar-solutions/residential-rooftop-solar"
                    className="block px-3 py-2 text-xs font-medium text-navy-800 hover:bg-solar-green-light hover:text-solar-green rounded-lg"
                  >
                    Residential Rooftop
                  </Link>
                  <Link
                    href="/solar-solutions/commercial-rooftop-solar"
                    className="block px-3 py-2 text-xs font-medium text-navy-800 hover:bg-solar-green-light hover:text-solar-green rounded-lg"
                  >
                    Commercial & Institutional
                  </Link>
                  <Link
                    href="/solar-solutions/industrial-solar-systems"
                    className="block px-3 py-2 text-xs font-medium text-navy-800 hover:bg-solar-green-light hover:text-solar-green rounded-lg"
                  >
                    Industrial Solar Plants
                  </Link>
                  <Link
                    href="/solar-solutions/on-grid-solar-systems"
                    className="block px-3 py-2 text-xs font-medium text-navy-800 hover:bg-solar-green-light hover:text-solar-green rounded-lg"
                  >
                    On-Grid Net Metering
                  </Link>
                  <Link
                    href="/solar-solutions/off-grid-hybrid-solar"
                    className="block px-3 py-2 text-xs font-medium text-navy-800 hover:bg-solar-green-light hover:text-solar-green rounded-lg"
                  >
                    Hybrid & Battery-Backed
                  </Link>
                </div>
              )}
            </div>

            <Link href="/services" className="hover:text-solar-green transition-colors">
              Services
            </Link>
            <Link href="/projects" className="hover:text-solar-green transition-colors">
              Projects
            </Link>
            <Link href="/solar-calculator" className="flex items-center gap-1 text-solar-green font-semibold">
              <Sun className="w-4 h-4" />
              <span>Calculator</span>
            </Link>
            <Link href="/subsidy-information" className="hover:text-solar-green transition-colors">
              Subsidy Guide
            </Link>
            <Link href="/contact" className="hover:text-solar-green transition-colors">
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${cleanPhone}`}
              className="p-2 rounded-lg bg-navy-50 text-navy-800 border border-slate-border"
              aria-label="Call"
            >
              <Phone className="w-4 h-4 text-solar-green" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-navy-800 hover:bg-navy-50"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-border bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            About Us
          </Link>
          <Link
            href="/solar-panels"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Solar Panels (10W - 730W)
          </Link>
          <Link
            href="/solar-solutions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Solar Solutions
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Installation Services
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Real Installations Portfolio
          </Link>
          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Photo Gallery
          </Link>
          <Link
            href="/videos"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Video Stories & Walkthroughs
          </Link>
          <Link
            href="/solar-calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-solar-green border-b border-slate-100"
          >
            Solar Savings Calculator
          </Link>
          <Link
            href="/subsidy-information"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            PM Surya Ghar Subsidy Guide
          </Link>
          <Link
            href="/service-areas"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Service Areas (Bihar, JH, UP)
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-navy-800 border-b border-slate-100"
          >
            Contact & Office
          </Link>

          <div className="pt-2 grid grid-cols-2 gap-2">
            <Link
              href="/get-quote"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl font-bold bg-solar-green text-white text-sm"
            >
              Get Free Quote
            </Link>
            <Link
              href="/request-site-survey"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl font-bold bg-navy-800 text-white text-sm"
            >
              Request Site Survey
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
