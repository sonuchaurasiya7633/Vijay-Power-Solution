"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sliders,
  Globe,
  FileCode2,
  Package,
  Layers,
  Sparkles,
  Wrench,
  MapPin,
  FileText,
  HelpCircle,
  MessageSquareQuote,
  ImageIcon,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Phone,
  Landmark,
  Building2,
  Megaphone,
  Compass,
  Cpu,
  FolderGit2,
} from "lucide-react";

export default function AdminCmsHubPage() {
  const [stats, setStats] = useState({
    products: 21,
    solutions: 12,
    services: 15,
    projects: 9,
    testimonials: 6,
    faqs: 30,
    blogs: 10,
    pages: 7,
  });

  useEffect(() => {
    // Attempt to fetch live counts
    Promise.all([
      fetch("/api/products").then((r) => r.json()).catch(() => ({ total: 21 })),
      fetch("/api/solutions").then((r) => r.json()).catch(() => ({ total: 12 })),
      fetch("/api/services").then((r) => r.json()).catch(() => ({ total: 15 })),
      fetch("/api/projects").then((r) => r.json()).catch(() => ({ total: 9 })),
      fetch("/api/faqs").then((r) => r.json()).catch(() => ({ total: 30 })),
      fetch("/api/blogs").then((r) => r.json()).catch(() => ({ total: 10 })),
      fetch("/api/pages").then((r) => r.json()).catch(() => ({ pages: [] })),
    ]).then(([prod, sol, serv, proj, faqs, blogs, pgs]) => {
      setStats({
        products: prod.total || 21,
        solutions: sol.total || 12,
        services: serv.total || 15,
        projects: proj.total || 9,
        testimonials: 6,
        faqs: faqs.total || 30,
        blogs: blogs.total || 10,
        pages: pgs.pages?.length || 7,
      });
    });
  }, []);

  const coreCmsModules = [
    {
      title: "Homepage CMS",
      slug: "home",
      description: "Hero headline, 10W-730W showcase, trust stats, 8-step journey, video walkthroughs, and CTA banner.",
      href: "/admin/cms/home",
      publicUrl: "/",
      icon: Sliders,
      badge: "Highest Traffic",
      badgeColor: "bg-solar-yellow/20 text-yellow-800 border-solar-yellow/40",
      status: "100% Dynamic",
    },
    {
      title: "About Us CMS",
      slug: "about",
      description: "Engineering heritage narrative, mission, vision, 4 quality pillars, team leadership note, and regional footprint.",
      href: "/admin/cms/about",
      publicUrl: "/about",
      icon: Building2,
      badge: "Brand Identity",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      status: "100% Dynamic",
    },
    {
      title: "PM Surya Ghar & Subsidy CMS",
      slug: "subsidy",
      description: "Central subsidy slabs (₹30K-₹78K), Bihar/JH/UP state policies, DISCOM guidelines, and document checklist.",
      href: "/admin/cms/subsidy",
      publicUrl: "/subsidy-information",
      icon: Landmark,
      badge: "Govt Schemes",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      status: "100% Dynamic",
    },
    {
      title: "Contact & Regional Desks CMS",
      slug: "contact",
      description: "Gaya HQ, Patna branch, Ranchi desk, Lucknow desk, emergency helplines, WhatsApp desk, and Google Maps embed.",
      href: "/admin/cms/contact",
      publicUrl: "/contact",
      icon: Phone,
      badge: "Lead Routing",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      status: "100% Dynamic",
    },
    {
      title: "Header, Notice Bar & Footer CMS",
      slug: "header-footer",
      description: "Top announcement marquee ticker, emergency hotline, navbar branding, footer about blurb, and copyright.",
      href: "/admin/cms/header-footer",
      publicUrl: "/",
      icon: Megaphone,
      badge: "Global Shell",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
      status: "100% Dynamic",
    },
    {
      title: "Custom Pages & Legal CMS",
      slug: "pages",
      description: "Terms & Conditions, Privacy Policy, Solar Generation Disclaimer, and custom marketing landing pages.",
      href: "/admin/pages",
      publicUrl: "/privacy-policy",
      icon: FileCode2,
      badge: `${stats.pages} Active Pages`,
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
      status: "Page Builder",
    },
  ];

  const catalogueModules = [
    {
      title: "Solar Panels Catalog",
      count: `${stats.products} Models (10W-730W)`,
      description: "Mono PERC, TOPCon, HJT, Poly, Bifacial modules with cell count, efficiency, and dimensions.",
      href: "/admin/products",
      icon: Package,
    },
    {
      title: "Product Categories",
      count: "12 Categories",
      description: "Module families, inverters, hybrid batteries, mounting structures, and solar pumps.",
      href: "/admin/categories",
      icon: Layers,
    },
    {
      title: "Solar Solutions",
      count: `${stats.solutions} Solutions`,
      description: "Residential, Commercial, Industrial, Agricultural, Petrol Pumps, Hospitals, and Cold Storages.",
      href: "/admin/solutions",
      icon: Sparkles,
    },
    {
      title: "Turnkey EPC Services",
      count: `${stats.services} Services`,
      description: "Engineering surveys, net metering liaison, shadow analysis, pergola solar, and AMC contracts.",
      href: "/admin/services",
      icon: Wrench,
    },
    {
      title: "Nationwide Service Coverage",
      count: "Pan India",
      description: "Service presence, DISCOM net metering liaisons, and certified installation coverage across India.",
      href: "/admin/service-areas",
      icon: MapPin,
    },
  ];

  const socialProofModules = [
    {
      title: "Installation Customer Gallery",
      count: "Cloudinary CDN",
      description: "Authentic installation & customer photos, photo replacement, delete, hide/show, and lightbox display.",
      href: "/admin/gallery",
      icon: ImageIcon,
    },
    {
      title: "Portfolio Projects",
      count: `${stats.projects} Case Studies`,
      description: "Verified customer installations across India with signed customer consent flags.",
      href: "/admin/projects",
      icon: FolderGit2,
    },
    {
      title: "Customer Testimonials",
      count: `${stats.testimonials} Reviews`,
      description: "5-star residential and commercial testimonials with consent-enforced media verification.",
      href: "/admin/testimonials",
      icon: MessageSquareQuote,
    },
    {
      title: "Solar FAQs Knowledge Hub",
      count: `${stats.faqs} Answered FAQs`,
      description: "Categorized into Subsidies, Net Metering, Battery Hybrid, Pergola Structures, and Commercial ROI.",
      href: "/admin/faqs",
      icon: HelpCircle,
    },
    {
      title: "Educational Blogs & Guides",
      count: `${stats.blogs} Articles`,
      description: "Guides on PM Surya Ghar, TOPCon vs Mono, Bihar/UP net metering tariffs, and ALMM lists.",
      href: "/admin/blogs",
      icon: FileText,
    },
    {
      title: "Media Assets Library",
      count: "Cloudinary CDN",
      description: "High-resolution project photos, technical diagrams, video walkthroughs, and certificates.",
      href: "/admin/media",
      icon: ImageIcon,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-navy-700 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-solar-yellow bg-white/10 px-3 py-1 rounded-full border border-solar-yellow/30">
              A to Z Content Management System
            </span>
            <span className="text-[11px] font-bold text-solar-green bg-solar-green/20 px-2.5 py-0.5 rounded-full border border-solar-green/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Dynamic Database Driven
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-extrabold tracking-tight">
            Central Content Control Hub
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Manage every single piece of content on <strong>VIJOY POWER SOLUTION</strong> without touching any code. 
            All headlines, subsidy rates, contact desks, product catalogues, and legal guidelines are dynamically linked to MongoDB Atlas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-solar-green hover:bg-solar-green/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>

            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
            >
              <FileCode2 className="w-4 h-4 text-solar-yellow" />
              <span>Dynamic Page Builder</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block">Dynamic Pages</span>
          <p className="text-2xl font-black text-navy-800 mt-1 font-display">{stats.pages} Pages</p>
          <span className="text-[10px] text-solar-green font-semibold">100% Admin Editable</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block">Solar Catalogue</span>
          <p className="text-2xl font-black text-navy-800 mt-1 font-display">{stats.products} Panels</p>
          <span className="text-[10px] text-solar-green font-semibold">10W to 730W Range</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block">Solutions & EPC</span>
          <p className="text-2xl font-black text-navy-800 mt-1 font-display">{stats.solutions + stats.services} Tiers</p>
          <span className="text-[10px] text-solar-green font-semibold">Residential, C&I, Agro</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-muted block">Knowledge & FAQs</span>
          <p className="text-2xl font-black text-navy-800 mt-1 font-display">{stats.faqs + stats.blogs} Items</p>
          <span className="text-[10px] text-solar-green font-semibold">PM Surya Ghar & Technical</span>
        </div>
      </div>

      {/* Group 1: Core Website Pages CMS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-navy-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-solar-green" />
              <span>Core Public Pages CMS</span>
            </h2>
            <p className="text-xs text-slate-muted">
              Dedicated visual section editors for high-traffic customer-facing pages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreCmsModules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.slug}
                className="bg-white rounded-2xl border border-slate-border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center border border-slate-border group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-solar-green" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-navy-800 group-hover:text-solar-green transition-colors flex items-center gap-1.5">
                      <span>{m.title}</span>
                    </h3>
                    <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {m.status}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={m.publicUrl}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-navy-800 hover:bg-slate-100 transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={m.href}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy-800 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <span>Edit Content</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group 2: Solar Catalogue & Service Content */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-navy-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-solar-yellow" />
            <span>Catalogue & Engineering Modules</span>
          </h2>
          <p className="text-xs text-slate-muted">
            Manage product specs (10W-730W strictly), categories, EPC service cards, and state service areas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalogueModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="bg-white p-5 rounded-2xl border border-slate-border hover:border-solar-green/50 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-navy-800 flex items-center justify-center border border-slate-border shrink-0 group-hover:bg-solar-green-light transition-colors">
                  <Icon className="w-5 h-5 text-navy-800 group-hover:text-solar-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-navy-800 group-hover:text-solar-green transition-colors truncate">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-muted mt-1 leading-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Group 3: Social Proof, Media & Knowledge Hub */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold font-display text-navy-800 flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-solar-green" />
            <span>Social Proof, Media & Knowledge Hub</span>
          </h2>
          <p className="text-xs text-slate-muted">
            Installations case studies with customer consent, verified testimonials, educational blogs, and FAQs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {socialProofModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="bg-white p-5 rounded-2xl border border-slate-border hover:border-solar-green/50 hover:shadow-md transition-all flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-navy-800 flex items-center justify-center border border-slate-border shrink-0 group-hover:bg-solar-green-light transition-colors">
                  <Icon className="w-5 h-5 text-navy-800 group-hover:text-solar-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-navy-800 group-hover:text-solar-green transition-colors truncate">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-muted mt-1 leading-normal line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Compliance & Policy Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Non-Ecommerce & Compliance Policy Enforced:</strong> All product modules across the CMS strictly prohibit public price listings, cart buttons, and online checkouts. All quotations remain private, engineered per customer rooftop survey across Bihar, Jharkhand, and Uttar Pradesh.
        </div>
      </div>
    </div>
  );
}
