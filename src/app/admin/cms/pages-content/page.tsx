"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import toast from "@/lib/toast";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  Eye,
  FileText,
  FolderKanban,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  MapPin,
  MessageSquareQuote,
  Save,
  Send,
  Settings2,
  Sparkles,
  Video,
  Wrench,
} from "lucide-react";
const CmsLivePreviewModal = dynamic(() => import("@/components/admin/CmsLivePreviewModal"), { ssr: false });
import { SolarPanelLoader } from "@/components/ui/SolarLoader";
import {
  defaultPublicPagesCms,
  mergeWithDefaults,
  type PageHeaderCms,
  type PublicPagesCms,
} from "@/lib/cms-defaults";

type TabKey = keyof PublicPagesCms;

interface TabMeta {
  key: TabKey;
  label: string;
  liveRoute: string;
  dataAdminHref?: { label: string; href: string };
  icon: any;
  description: string;
}

const TABS: TabMeta[] = [
  {
    key: "solutionsSection",
    label: "Solutions (Home)",
    liveRoute: "/",
    dataAdminHref: { label: "Manage Solutions Cards", href: "/admin/solutions" },
    icon: Sparkles,
    description: "Homepage 'Tailored Solar Solutions' section heading and subtitle.",
  },
  {
    key: "solutionsPage",
    label: "Solutions Page",
    liveRoute: "/solar-solutions",
    dataAdminHref: { label: "Manage Solutions Cards", href: "/admin/solutions" },
    icon: LayoutGrid,
    description: "Top hero badge, headline, and subtitle on /solar-solutions.",
  },
  {
    key: "servicesPage",
    label: "Services Page",
    liveRoute: "/services",
    dataAdminHref: { label: "Manage Services List", href: "/admin/services" },
    icon: Wrench,
    description: "Top hero header and subtitle on /services.",
  },
  {
    key: "projectsPage",
    label: "Projects Page",
    liveRoute: "/projects",
    dataAdminHref: { label: "Manage Projects", href: "/admin/projects" },
    icon: FolderKanban,
    description: "Top hero header and subtitle on /projects.",
  },
  {
    key: "galleryPage",
    label: "Customer Gallery",
    liveRoute: "/gallery",
    dataAdminHref: { label: "Manage Gallery Photos", href: "/admin/gallery" },
    icon: ImageIcon,
    description: "Top hero header and subtitle on /gallery.",
  },
  {
    key: "videosPage",
    label: "Videos Page",
    liveRoute: "/videos",
    dataAdminHref: { label: "Manage Videos", href: "/admin/videos" },
    icon: Video,
    description: "Top hero header and subtitle on /videos.",
  },
  {
    key: "faqsPage",
    label: "FAQs Page",
    liveRoute: "/faqs",
    dataAdminHref: { label: "Manage FAQ Items", href: "/admin/faqs" },
    icon: HelpCircle,
    description: "Top hero header and subtitle on /faqs.",
  },
  {
    key: "testimonialsPage",
    label: "Testimonials Page",
    liveRoute: "/testimonials",
    dataAdminHref: { label: "Manage Testimonials", href: "/admin/testimonials" },
    icon: MessageSquareQuote,
    description: "Page header + Verified Consent Standard block on /testimonials.",
  },
  {
    key: "serviceAreasPage",
    label: "Service Areas",
    liveRoute: "/service-areas",
    dataAdminHref: { label: "Manage Locations", href: "/admin/service-areas" },
    icon: MapPin,
    description: "Top hero header and subtitle on /service-areas.",
  },
  {
    key: "calculatorPage",
    label: "Solar Calculator",
    liveRoute: "/solar-calculator",
    icon: Calculator,
    description: "Header, 3 Engineering Assumptions cards, and disclaimer on /solar-calculator.",
  },
  {
    key: "blogPage",
    label: "Blog Page",
    liveRoute: "/blog",
    dataAdminHref: { label: "Manage Blog Posts", href: "/admin/blogs" },
    icon: FileText,
    description: "Top hero header and subtitle on /blog.",
  },
  {
    key: "getQuotePage",
    label: "Get Quote Page",
    liveRoute: "/get-quote",
    icon: Send,
    description: "Page header and 3 bottom trust guarantees on /get-quote.",
  },
  {
    key: "siteSurveyPage",
    label: "Site Survey Page",
    liveRoute: "/request-site-survey",
    icon: ClipboardCheck,
    description: "Top hero header and subtitle on /request-site-survey.",
  },
];

export default function AdminPublicPagesCmsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("solutionsPage");
  const [form, setForm] = useState<PublicPagesCms>(defaultPublicPagesCms);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get("tab") as TabKey | null;
    if (requestedTab && TABS.some((t) => t.key === requestedTab)) {
      setActiveTab(requestedTab);
    }

    fetch("/api/settings?key=public_pages_cms")
      .then((res) => res.json())
      .then((data) => {
        if (data?.setting && Object.keys(data.setting).length > 0) {
          setForm(mergeWithDefaults(defaultPublicPagesCms, data.setting));
        }
      })
      .catch(() => {
        toast.error("Failed to load Public Pages CMS configuration");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "public_pages_cms", value: form }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save CMS settings");
      }
      setSaved(true);
      toast.saved("All Public Pages CMS settings saved!");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Error saving Public Pages CMS");
    } finally {
      setSaving(false);
    }
  };

  const currentTabMeta = TABS.find((t) => t.key === activeTab) || TABS[0];
  const currentData = form[activeTab] as any;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [activeTab]: {
        ...(prev[activeTab] as Record<string, any>),
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <SolarPanelLoader
        title="Loading Public Pages Content CMS..."
        subtitle="Syncing headers, SEO badges, and page metadata"
      />
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/cms"
            className="p-2 rounded-xl border border-slate-border bg-white hover:bg-slate-bg text-navy-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-bold text-navy-800 flex items-center gap-2">
              <Settings2 className="w-6 h-6 text-solar-green" />
              <span>All Public Pages CMS Editor</span>
            </h1>
            <p className="text-xs text-slate-muted mt-0.5">
              Dynamically control page headings, badges, subtitles, and informational blocks across every public website page.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-border bg-white hover:bg-slate-bg text-xs font-bold text-navy-800 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview {currentTabMeta.label}</span>
          </button>
          <Link
            href={currentTabMeta.liveRoute}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-border bg-white hover:bg-slate-bg text-xs font-bold text-navy-800 transition-colors"
          >
            <span>Open {currentTabMeta.liveRoute}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-solar-green hover:bg-solar-green-dark disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Saving..." : saved ? "Saved!" : "Save All Pages CMS"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Tab Rail */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-border p-3 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-muted px-3 py-1.5">
            Select Website Page
          </p>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? "bg-navy-900 text-white shadow-sm"
                    : "text-navy-800 hover:bg-slate-bg"
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-solar-gold" : "text-solar-green"
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? "bg-white/10 text-slate-200" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.liveRoute}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Editor Form */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-border p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-display font-bold text-navy-800">
                  {currentTabMeta.label}
                </h2>
                <p className="text-xs text-slate-muted mt-0.5">
                  {currentTabMeta.description}
                </p>
              </div>
              {currentTabMeta.dataAdminHref && (
                <Link
                  href={currentTabMeta.dataAdminHref.href}
                  className="px-3.5 py-2 rounded-xl bg-solar-green-light text-solar-green hover:bg-solar-green hover:text-white text-xs font-bold whitespace-nowrap transition-colors"
                >
                  {currentTabMeta.dataAdminHref.label} →
                </Link>
              )}
            </div>

            {/* Standard Header Fields (All tabs share badge, title, subtitle) */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-800">
                    Top Badge / Pill Text
                  </label>
                  <input
                    type="text"
                    value={(currentData as PageHeaderCms).badge || ""}
                    onChange={(e) => updateField("badge", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-800">
                    Main Page Heading (H1/H2)
                  </label>
                  <input
                    type="text"
                    value={(currentData as PageHeaderCms).title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-navy-800">
                  Page Subtitle / Intro Description
                </label>
                <textarea
                  rows={3}
                  value={(currentData as PageHeaderCms).subtitle || ""}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                />
              </div>
            </div>

            {/* Extra Fields: Testimonials Consent Standard */}
            {activeTab === "testimonialsPage" && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-navy-800">
                  Verified Consent Standard Box
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy-800">Box Title</label>
                    <input
                      type="text"
                      value={form.testimonialsPage.consentTitle}
                      onChange={(e) => updateField("consentTitle", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-800">CTA Text</label>
                      <input
                        type="text"
                        value={form.testimonialsPage.consentCtaText}
                        onChange={(e) => updateField("consentCtaText", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-border text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-navy-800">CTA Route</label>
                      <input
                        type="text"
                        value={form.testimonialsPage.consentCtaLink}
                        onChange={(e) => updateField("consentCtaLink", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-border text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-800">Box Description</label>
                  <textarea
                    rows={2}
                    value={form.testimonialsPage.consentText}
                    onChange={(e) => updateField("consentText", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm"
                  />
                </div>
              </div>
            )}

            {/* Extra Fields: Calculator Methodology */}
            {activeTab === "calculatorPage" && (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-800">
                    Methodology Section Title
                  </label>
                  <input
                    type="text"
                    value={form.calculatorPage.methodologyTitle}
                    onChange={(e) => updateField("methodologyTitle", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-bg border border-slate-border space-y-2">
                    <input
                      type="text"
                      value={form.calculatorPage.card1Title}
                      onChange={(e) => updateField("card1Title", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={form.calculatorPage.card1Text}
                      onChange={(e) => updateField("card1Text", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-bg border border-slate-border space-y-2">
                    <input
                      type="text"
                      value={form.calculatorPage.card2Title}
                      onChange={(e) => updateField("card2Title", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={form.calculatorPage.card2Text}
                      onChange={(e) => updateField("card2Text", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-bg border border-slate-border space-y-2">
                    <input
                      type="text"
                      value={form.calculatorPage.card3Title}
                      onChange={(e) => updateField("card3Title", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                    />
                    <textarea
                      rows={4}
                      value={form.calculatorPage.card3Text}
                      onChange={(e) => updateField("card3Text", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-navy-800">Disclaimer Notice</label>
                  <textarea
                    rows={3}
                    value={form.calculatorPage.disclaimerText}
                    onChange={(e) => updateField("disclaimerText", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm"
                  />
                </div>
              </div>
            )}

            {/* Extra Fields: Get Quote Trust Guarantees */}
            {activeTab === "getQuotePage" && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-navy-800">
                  Bottom 3 Trust Guarantees
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-bg border border-slate-border space-y-2">
                    <input
                      type="text"
                      value={form.getQuotePage.guarantee1Title}
                      onChange={(e) => updateField("guarantee1Title", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={form.getQuotePage.guarantee1Subtitle}
                      onChange={(e) => updateField("guarantee1Subtitle", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-bg border border-slate-border space-y-2">
                    <input
                      type="text"
                      value={form.getQuotePage.guarantee2Title}
                      onChange={(e) => updateField("guarantee2Title", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={form.getQuotePage.guarantee2Subtitle}
                      onChange={(e) => updateField("guarantee2Subtitle", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-bg border border-slate-border space-y-2">
                    <input
                      type="text"
                      value={form.getQuotePage.guarantee3Title}
                      onChange={(e) => updateField("guarantee3Title", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={form.getQuotePage.guarantee3Subtitle}
                      onChange={(e) => updateField("guarantee3Subtitle", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-border bg-white text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-solar-green hover:bg-solar-green-dark disabled:opacity-60 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Saving..." : "Save Public Pages CMS"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {previewOpen && (
        <CmsLivePreviewModal
          isOpen={previewOpen}
          onClose={() => setPreviewOpen(false)}
          pageTitle={`${currentTabMeta.label} Live Preview`}
          url={currentTabMeta.liveRoute}
        />
      )}
    </div>
  );
}
