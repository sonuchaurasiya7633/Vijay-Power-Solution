"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
  Search,
  Camera,
  FolderGit2,
  Settings,
  LayoutGrid,
} from "lucide-react";
const CmsLivePreviewModal = dynamic(() => import("@/components/admin/CmsLivePreviewModal"), { ssr: false });

interface WebsitePageItem {
  id: string;
  title: string;
  slug: string;
  category: "core" | "catalogue" | "proof" | "legal";
  publicUrl: string;
  cmsHref: string;
  sectionsCount: number;
  sectionsList: string;
  icon: any;
  status: "Published" | "Active";
  lastUpdated: string;
  badge: string;
  badgeColor: string;
}

export default function AdminCmsAllPages() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("/");
  const [previewTitle, setPreviewTitle] = useState("Live Page Preview");

  // Complete inventory of all public website pages
  const websitePages: WebsitePageItem[] = [
    {
      id: "home",
      title: "Homepage",
      slug: "home",
      category: "core",
      publicUrl: "/",
      cmsHref: "/admin/cms/home",
      sectionsCount: 6,
      sectionsList: "Hero Banner, Trust Metrics, Why Choose Us, 8-Step Journey, Video Walkthroughs, CTA Banner",
      icon: Sliders,
      status: "Published",
      lastUpdated: "Today",
      badge: "Core Page",
      badgeColor: "bg-solar-yellow/20 text-yellow-800 border-solar-yellow/40",
    },
    {
      id: "about",
      title: "About Us",
      slug: "about",
      category: "core",
      publicUrl: "/about",
      cmsHref: "/admin/cms/about",
      sectionsCount: 4,
      sectionsList: "Hero Showcase, Heritage Narrative, 4 Quality Pillars, Leadership Quote",
      icon: Building2,
      status: "Published",
      lastUpdated: "Recently",
      badge: "Brand Identity",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "pages-content",
      title: "All Public Pages Content CMS",
      slug: "pages-content",
      category: "core",
      publicUrl: "/",
      cmsHref: "/admin/cms/pages-content",
      sectionsCount: 13,
      sectionsList: "Manage Badges, Headings & Info Blocks across Solutions, Services, Projects, FAQs, Blog, Calculator & Forms",
      icon: LayoutGrid,
      status: "Active",
      lastUpdated: "Unified Editor",
      badge: "Global Pages CMS",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "products",
      title: "Solar Panels Page & Catalogue (10W - 730W)",
      slug: "solar-panels",
      category: "catalogue",
      publicUrl: "/solar-panels",
      cmsHref: "/admin/cms/solar-panels",
      sectionsCount: 5,
      sectionsList: "Page Hero Header, 10W–730W Showcase, Engineering Policy Banner, Technology Primer & Cards",
      icon: Package,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Solar Panels CMS",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "solutions",
      title: "Solar Solutions Page & Cards",
      slug: "solar-solutions",
      category: "catalogue",
      publicUrl: "/solar-solutions",
      cmsHref: "/admin/cms/pages-content?tab=solutionsPage",
      sectionsCount: 6,
      sectionsList: "Solutions Page Header + Residential, Commercial, Industrial, Agro, On-Grid, Hybrid",
      icon: Sparkles,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Solutions",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "services",
      title: "Turnkey EPC Services Page",
      slug: "services",
      category: "catalogue",
      publicUrl: "/services",
      cmsHref: "/admin/cms/pages-content?tab=servicesPage",
      sectionsCount: 4,
      sectionsList: "Services Header, Feasibility Surveys, DISCOM Liaison, Mounting & AMC",
      icon: Wrench,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Services",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "projects",
      title: "Completed Projects Page",
      slug: "projects",
      category: "proof",
      publicUrl: "/projects",
      cmsHref: "/admin/cms/pages-content?tab=projectsPage",
      sectionsCount: 4,
      sectionsList: "Projects Header, Residential Case Studies, Commercial Plants, Consent Badges",
      icon: FolderGit2,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Portfolio",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "gallery",
      title: "Customer Installation Gallery Page",
      slug: "gallery",
      category: "proof",
      publicUrl: "/gallery",
      cmsHref: "/admin/cms/pages-content?tab=galleryPage",
      sectionsCount: 3,
      sectionsList: "Gallery Header, Authentic Customer Photos, Lightbox & Tag Filters",
      icon: Camera,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Authentic Photos",
      badgeColor: "bg-solar-yellow-light text-solar-yellow-hover border-solar-yellow/40",
    },
    {
      id: "videos",
      title: "Video Walkthroughs & Stories Page",
      slug: "videos",
      category: "proof",
      publicUrl: "/videos",
      cmsHref: "/admin/cms/pages-content?tab=videosPage",
      sectionsCount: 2,
      sectionsList: "Videos Page Header, Rooftop Video Stories, Site Walkthroughs",
      icon: FilmIcon,
      status: "Published",
      lastUpdated: "Recently",
      badge: "Media",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "faqs",
      title: "FAQs Knowledge Base Page",
      slug: "faqs",
      category: "proof",
      publicUrl: "/faqs",
      cmsHref: "/admin/cms/pages-content?tab=faqsPage",
      sectionsCount: 2,
      sectionsList: "FAQs Page Header & Interactive Questions Accordion",
      icon: HelpCircle,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Support",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "testimonials",
      title: "Customer Testimonials Page",
      slug: "testimonials",
      category: "proof",
      publicUrl: "/testimonials",
      cmsHref: "/admin/cms/pages-content?tab=testimonialsPage",
      sectionsCount: 3,
      sectionsList: "Testimonials Header, Verified Client Stories & Consent Standard Box",
      icon: MessageSquareQuote,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Client Proof",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "blog",
      title: "Solar Engineering Blog Index",
      slug: "blog",
      category: "proof",
      publicUrl: "/blog",
      cmsHref: "/admin/cms/pages-content?tab=blogPage",
      sectionsCount: 2,
      sectionsList: "Blog Page Header & Published Solar Guides",
      icon: FileText,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Knowledge Hub",
      badgeColor: "bg-solar-yellow-light text-solar-yellow-hover border-solar-yellow/40",
    },
    {
      id: "subsidy",
      title: "PM Surya Ghar Subsidy Guide",
      slug: "subsidy-information",
      category: "core",
      publicUrl: "/subsidy-information",
      cmsHref: "/admin/cms/subsidy",
      sectionsCount: 5,
      sectionsList: "Subsidy Slabs (₹30K-₹78K), State Policies, Application Steps, Required Documents",
      icon: Landmark,
      status: "Published",
      lastUpdated: "Recently",
      badge: "Govt Schemes",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "calculator",
      title: "Solar Savings Calculator Page",
      slug: "solar-calculator",
      category: "core",
      publicUrl: "/solar-calculator",
      cmsHref: "/admin/cms/pages-content?tab=calculatorPage",
      sectionsCount: 3,
      sectionsList: "Calculator Header, Engineering Methodology Cards & Disclaimer",
      icon: CalcIcon,
      status: "Active",
      lastUpdated: "System Tool",
      badge: "Calculator",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "get-quote",
      title: "Get Solar Quotation Page",
      slug: "get-quote",
      category: "core",
      publicUrl: "/get-quote",
      cmsHref: "/admin/cms/pages-content?tab=getQuotePage",
      sectionsCount: 3,
      sectionsList: "Quotation Hero Header, Lead Capture Form & 3 Trust Guarantees",
      icon: ArrowRight,
      status: "Active",
      lastUpdated: "Lead Funnel",
      badge: "Lead Funnel",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "request-site-survey",
      title: "Request Site Survey Page",
      slug: "request-site-survey",
      category: "core",
      publicUrl: "/request-site-survey",
      cmsHref: "/admin/cms/pages-content?tab=siteSurveyPage",
      sectionsCount: 2,
      sectionsList: "Survey Hero Header & Engineer Appointment Form",
      icon: MapPin,
      status: "Active",
      lastUpdated: "Lead Funnel",
      badge: "Site Survey",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "service-areas",
      title: "Pan India Service Coverage",
      slug: "service-areas",
      category: "core",
      publicUrl: "/service-areas",
      cmsHref: "/admin/cms/pages-content?tab=serviceAreasPage",
      sectionsCount: 3,
      sectionsList: "Service Areas Header, Regional Partner Hubs, DISCOM Liaisons",
      icon: MapPin,
      status: "Published",
      lastUpdated: "Live Sync",
      badge: "Pan India",
      badgeColor: "bg-solar-green-light text-solar-green border-solar-green/30",
    },
    {
      id: "contact",
      title: "Contact & Regional Desks",
      slug: "contact",
      category: "core",
      publicUrl: "/contact",
      cmsHref: "/admin/cms/contact",
      sectionsCount: 4,
      sectionsList: "Gaya HQ, Patna Branch, Ranchi Desk, Lucknow Desk, Interactive Map",
      icon: Phone,
      status: "Published",
      lastUpdated: "Recently",
      badge: "Lead Routing",
      badgeColor: "bg-navy-50 text-navy-800 border-slate-border",
    },
    {
      id: "header-footer",
      title: "Header, Marquee & Footer Shell",
      slug: "global-shell",
      category: "core",
      publicUrl: "/",
      cmsHref: "/admin/cms/header-footer",
      sectionsCount: 4,
      sectionsList: "Brand Logo, Top Marquee Ticker, Emergency Hotline, Footer Office Address, Copyright",
      icon: Megaphone,
      status: "Active",
      lastUpdated: "Global Shell",
      badge: "All Pages Shell",
      badgeColor: "bg-navy-100 text-navy-800 border-navy-200",
    },
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      slug: "privacy-policy",
      category: "legal",
      publicUrl: "/privacy-policy",
      cmsHref: "/admin/pages",
      sectionsCount: 2,
      sectionsList: "Data Privacy Standards, Lead Information Safety, Customer Rights",
      icon: FileCode2,
      status: "Published",
      lastUpdated: "Policy",
      badge: "Legal",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    },
    {
      id: "terms-and-conditions",
      title: "Terms and Conditions",
      slug: "terms-and-conditions",
      category: "legal",
      publicUrl: "/terms-and-conditions",
      cmsHref: "/admin/pages",
      sectionsCount: 2,
      sectionsList: "EPC Service Terms, Site Survey Protocols, Quotation Policies",
      icon: FileCode2,
      status: "Published",
      lastUpdated: "Policy",
      badge: "Legal",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    },
    {
      id: "disclaimer",
      title: "Solar Generation Disclaimer",
      slug: "disclaimer",
      category: "legal",
      publicUrl: "/disclaimer",
      cmsHref: "/admin/pages",
      sectionsCount: 2,
      sectionsList: "Regulatory Disclaimers, Solar Generation & Irradiance Assumptions",
      icon: FileCode2,
      status: "Published",
      lastUpdated: "Policy",
      badge: "Legal",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    },
  ];

  function FilmIcon(props: any) {
    return <ImageIcon {...props} />;
  }
  function CalcIcon(props: any) {
    return <Sliders {...props} />;
  }

  // Filtered pages
  const filteredPages = websitePages.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      p.sectionsList.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-navy-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-navy-700 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-solar-yellow bg-white/10 px-3 py-1 rounded-full border border-solar-yellow/30">
              Central Content Control
            </span>
            <span className="text-[11px] font-bold text-solar-green bg-solar-green/20 px-2.5 py-0.5 rounded-full border border-solar-green/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All {websitePages.length} Pages Admin Editable
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
            Website Pages & Visual Content Management
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Manage every public webpage on <strong>VIJOY POWER SOLUTION</strong> from one central hub.
            Edit sections, replace Cloudinary images, customize button links, and preview changes across Desktop, Tablet, and Mobile.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleOpenPreview("/", "Homepage Live Preview")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-solar-green hover:bg-solar-green-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Live Website</span>
            </button>

            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
            >
              <Globe className="w-4 h-4 text-solar-yellow" />
              <span>Global SEO Manager</span>
            </Link>

            <Link
              href="/admin/pages"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20"
            >
              <FileCode2 className="w-4 h-4 text-solar-green" />
              <span>Custom Page Builder</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-navy-800 text-white"
                : "text-slate-muted hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            All Pages ({websitePages.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("core")}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === "core"
                ? "bg-navy-800 text-white"
                : "text-slate-muted hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            Core Pages
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("catalogue")}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === "catalogue"
                ? "bg-navy-800 text-white"
                : "text-slate-muted hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            Catalogue & Services
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("proof")}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === "proof"
                ? "bg-navy-800 text-white"
                : "text-slate-muted hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            Projects & Gallery
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("legal")}
            className={`px-3 py-2 rounded-xl transition-colors whitespace-nowrap ${
              selectedCategory === "legal"
                ? "bg-navy-800 text-white"
                : "text-slate-muted hover:text-navy-800 hover:bg-slate-50"
            }`}
          >
            Legal & Policies
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pages or sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-border text-xs outline-none focus:border-solar-green bg-slate-50/50"
          />
        </div>
      </div>

      {/* Pages Management Table */}
      <div className="bg-white rounded-2xl border border-slate-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-bg text-slate-muted uppercase font-bold text-[10px] tracking-wider border-b border-slate-border">
              <tr>
                <th className="p-4">Page Name</th>
                <th className="p-4">Public URL</th>
                <th className="p-4">Managed Sections</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Sync</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPages.map((page) => {
                const Icon = page.icon;
                return (
                  <tr key={page.id} className="hover:bg-slate-bg/50 transition-colors">
                    {/* Page Name */}
                    <td className="p-4 font-bold text-navy-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 text-navy-800 flex items-center justify-center shrink-0 border border-slate-200">
                          <Icon className="w-4 h-4 text-solar-green" />
                        </div>
                        <div>
                          <span className="block font-bold text-navy-800">{page.title}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${page.badgeColor}`}>
                            {page.badge}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Public URL */}
                    <td className="p-4 font-mono font-bold text-slate-600">
                      {page.publicUrl}
                    </td>

                    {/* Managed Sections */}
                    <td className="p-4 max-w-xs">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold text-navy-800">
                          {page.sectionsCount} Sections
                        </span>
                        <p className="text-[10px] text-slate-muted line-clamp-1 truncate">
                          {page.sectionsList}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-green-100 text-green-700">
                        {page.status}
                      </span>
                    </td>

                    {/* Last Sync */}
                    <td className="p-4 text-slate-muted font-medium">
                      {page.lastUpdated}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit Content Button */}
                        <Link
                          href={page.cmsHref}
                          className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
                        >
                          <span>Edit</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>

                        {/* Live Preview Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(page.publicUrl, `${page.title} Live Preview`)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-800 transition-colors"
                          title="Preview in responsive modal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Manage SEO Link */}
                        <Link
                          href="/admin/seo"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy-800 transition-colors"
                          title="Manage SEO Meta Tags"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </Link>

                        {/* Open Public Page */}
                        <Link
                          href={page.publicUrl}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-navy-800 hover:bg-slate-100 transition-colors"
                          title="Open public page in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPages.length === 0 && (
          <div className="p-16 text-center space-y-2">
            <LayoutGrid className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-navy-800">No pages found matching &ldquo;{search}&rdquo;</h3>
            <p className="text-xs text-slate-muted">Try clearing the search or category filter.</p>
          </div>
        )}
      </div>

      {/* In-App Live Responsive Preview Modal */}
      {previewOpen && (
        <CmsLivePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          url={previewUrl}
          pageTitle={previewTitle}
        />
      )}
    </div>
  );
}
