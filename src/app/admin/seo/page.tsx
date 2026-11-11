"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Globe,
  Search,
  Save,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Code2,
  BarChart3,
  FileCode2,
  RotateCcw,
  EyeOff,
  Map as MapIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import toast from "@/lib/toast";
import CmsImageUploader from "@/components/admin/CmsImageUploader";
import { SolarPanelLoader, SolarEmblemSpinner } from "@/components/ui/SolarLoader";
import {
  analyzeSeoQuality,
  BASE_URL,
  DEFAULT_GLOBAL_SEO_CONFIG,
  mergeGlobalSeoConfig,
  SEO_ROUTE_DEFINITIONS,
  toAbsoluteUrl,
  type GlobalSeoConfig,
  type RouteSeoOverride,
} from "@/lib/seo-config";

type ActiveTab = "global" | "pages" | "audit";

export default function AdminSeoPage() {
  const [config, setConfig] = useState<GlobalSeoConfig>(DEFAULT_GLOBAL_SEO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("pages");
  const [selectedRouteKey, setSelectedRouteKey] = useState<string>("home");
  const [serpMode, setSerpMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    fetch("/api/settings?key=seo")
      .then((res) => res.json())
      .then((data) => {
        if (data?.setting && Object.keys(data.setting).length > 0) {
          setConfig(mergeGlobalSeoConfig(data.setting));
        }
      })
      .catch(() => {
        toast.error("Failed to load SEO settings.");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedDef = useMemo(
    () =>
      SEO_ROUTE_DEFINITIONS.find((r) => r.key === selectedRouteKey) ||
      SEO_ROUTE_DEFINITIONS[0],
    [selectedRouteKey]
  );

  const selectedOverride: RouteSeoOverride =
    config.routeOverrides?.[selectedDef.key] || {};

  const effectiveTitle =
    selectedOverride.title?.trim() || selectedDef.defaultTitle;
  const effectiveDesc =
    selectedOverride.description?.trim() || selectedDef.defaultDescription;
  const effectiveKeyword =
    selectedOverride.primaryKeyword?.trim() || selectedDef.primaryKeyword;
  const effectiveCanonical = toAbsoluteUrl(
    selectedOverride.canonicalUrl?.trim() || selectedDef.path
  );

  const selectedQuality = useMemo(
    () =>
      analyzeSeoQuality({
        title: effectiveTitle,
        description: effectiveDesc,
        keyword: effectiveKeyword,
        canonical: effectiveCanonical,
      }),
    [effectiveTitle, effectiveDesc, effectiveKeyword, effectiveCanonical]
  );

  const updateRouteOverride = (
    key: string,
    patch: Partial<RouteSeoOverride>
  ) => {
    setConfig((prev) => ({
      ...prev,
      routeOverrides: {
        ...prev.routeOverrides,
        [key]: {
          ...(prev.routeOverrides?.[key] || {}),
          ...patch,
        },
      },
    }));
  };

  const resetRouteToDefault = (key: string) => {
    setConfig((prev) => {
      const next = { ...prev.routeOverrides };
      delete next[key];
      return { ...prev, routeOverrides: next };
    });
    toast.success("Route reset to recommended Pan-India SEO defaults.");
  };

  const extractVerificationCode = (raw: string) => {
    const trimmed = raw.trim();
    const match = trimmed.match(/content=["']([^"']+)["']/i);
    return match ? match[1].trim() : trimmed;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: GlobalSeoConfig = {
        ...config,
        googleSiteVerification: extractVerificationCode(
          config.googleSiteVerification
        ),
        ga4MeasurementId: config.ga4MeasurementId.trim(),
      };
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "seo", value: payload }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setConfig(payload);
      toast.success(
        "SEO configuration saved & public sitemap/metadata revalidated."
      );
    } catch {
      toast.error("Failed to save SEO configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 max-w-6xl">
        <SolarPanelLoader title="Loading Pan-India SEO Command Center..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
            Pan-India Search Optimization
          </span>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-navy-800 mt-1">
            SEO Command Center & Analytics
          </h1>
          <p className="text-xs text-slate-muted">
            Manage meta titles, descriptions, canonicals, Open Graph, schema markup, Google Search Console, and GA4 tracking.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-solar-green hover:bg-solar-green-dark text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60 self-start sm:self-auto"
        >
          {saving ? (
            <SolarEmblemSpinner size="sm" variant="white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? "Publishing SEO..." : "Save & Publish SEO"}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-border w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("pages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === "pages"
              ? "bg-navy-800 text-white"
              : "text-slate-muted hover:text-navy-800 hover:bg-slate-bg"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Per-Page SEO & SERP Preview ({SEO_ROUTE_DEFINITIONS.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === "global"
              ? "bg-navy-800 text-white"
              : "text-slate-muted hover:text-navy-800 hover:bg-slate-bg"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Global, Search Console & GA4</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
            activeTab === "audit"
              ? "bg-navy-800 text-white"
              : "text-slate-muted hover:text-navy-800 hover:bg-slate-bg"
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>Sitemap, Robots & Schema Status</span>
        </button>
      </div>

      {/* TAB 1: Per-Page SEO Editor + SERP Preview */}
      {activeTab === "pages" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Route Selector Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-border p-3 shadow-sm max-h-[760px] overflow-y-auto space-y-1">
            <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-muted">
              Public Website Routes
            </div>
            {SEO_ROUTE_DEFINITIONS.map((def) => {
              const ov = config.routeOverrides?.[def.key] || {};
              const q = analyzeSeoQuality({
                title: ov.title?.trim() || def.defaultTitle,
                description: ov.description?.trim() || def.defaultDescription,
                keyword: ov.primaryKeyword?.trim() || def.primaryKeyword,
                canonical: ov.canonicalUrl?.trim() || def.path,
              });
              const isSelected = def.key === selectedDef.key;

              return (
                <button
                  key={def.key}
                  type="button"
                  onClick={() => setSelectedRouteKey(def.key)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? "bg-solar-green-light/70 border-solar-green text-navy-800"
                      : "bg-white border-transparent hover:bg-slate-bg text-slate-main"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{def.label}</div>
                    <div className="text-[11px] font-mono text-slate-muted truncate">
                      {def.path}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {ov.noIndex && (
                      <span
                        title="Marked noindex"
                        className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800"
                      >
                        NoIndex
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.score >= 85
                          ? "bg-emerald-100 text-emerald-800"
                          : q.score >= 65
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {q.score}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Page Editor & Live SERP Preview */}
          <div className="lg:col-span-8 space-y-6">
            {/* Google SERP Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-border p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-solar-green" />
                  <h2 className="text-sm font-bold text-navy-800">
                    Live Google Search Snippet Preview
                  </h2>
                </div>
                <div className="flex items-center gap-1 bg-slate-bg p-1 rounded-lg border border-slate-border">
                  <button
                    type="button"
                    onClick={() => setSerpMode("desktop")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      serpMode === "desktop"
                        ? "bg-white text-navy-800 shadow-sm"
                        : "text-slate-muted"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpMode("mobile")}
                    className={`px-2.5 py-1 rounded text-[11px] font-semibold ${
                      serpMode === "mobile"
                        ? "bg-white text-navy-800 shadow-sm"
                        : "text-slate-muted"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl bg-slate-bg/60 border border-slate-border ${
                  serpMode === "mobile" ? "max-w-sm" : "w-full"
                }`}
              >
                <div className="text-xs text-slate-700 truncate">
                  {effectiveCanonical}
                </div>
                <div className="text-base sm:text-lg font-medium text-[#1a0dab] leading-snug mt-0.5 line-clamp-2">
                  {effectiveTitle}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-3">
                  {effectiveDesc}
                </p>
              </div>

              {/* Validation Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {selectedQuality.checks.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-bg border border-slate-border text-xs"
                  >
                    {c.status === "pass" ? (
                      <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                    ) : c.status === "warn" ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold text-navy-800">{c.label}</div>
                      <div className="text-[11px] text-slate-muted">
                        {c.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Metadata Form */}
            <div className="bg-white rounded-2xl border border-slate-border p-5 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-border">
                <div>
                  <h3 className="text-sm font-bold text-navy-800">
                    {selectedDef.label} Metadata
                  </h3>
                  <p className="text-[11px] text-slate-muted">
                    Schema Type: <strong>{selectedDef.schemaType}</strong> • Path:{" "}
                    <code>{selectedDef.path}</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => resetRouteToDefault(selectedDef.key)}
                  className="px-3 py-1.5 rounded-lg border border-slate-border text-[11px] font-semibold text-slate-muted hover:text-navy-800 hover:bg-slate-bg flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                  <label>Meta Title</label>
                  <span className="text-[11px] text-slate-muted">
                    {effectiveTitle.length} / 68 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={selectedOverride.title ?? ""}
                  onChange={(e) =>
                    updateRouteOverride(selectedDef.key, { title: e.target.value })
                  }
                  placeholder={selectedDef.defaultTitle}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-navy-800 mb-1">
                  <label>Meta Description</label>
                  <span className="text-[11px] text-slate-muted">
                    {effectiveDesc.length} / 165 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={selectedOverride.description ?? ""}
                  onChange={(e) =>
                    updateRouteOverride(selectedDef.key, {
                      description: e.target.value,
                    })
                  }
                  placeholder={selectedDef.defaultDescription}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-navy-800 block mb-1">
                    Primary Focus Keyword
                  </label>
                  <input
                    type="text"
                    value={selectedOverride.primaryKeyword ?? ""}
                    onChange={(e) =>
                      updateRouteOverride(selectedDef.key, {
                        primaryKeyword: e.target.value,
                      })
                    }
                    placeholder={selectedDef.primaryKeyword}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-navy-800 block mb-1">
                    Canonical URL Override (Optional)
                  </label>
                  <input
                    type="text"
                    value={selectedOverride.canonicalUrl ?? ""}
                    onChange={(e) =>
                      updateRouteOverride(selectedDef.key, {
                        canonicalUrl: e.target.value,
                      })
                    }
                    placeholder={selectedDef.path}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm font-mono focus:outline-none focus:border-solar-green"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy-800 block mb-1">
                  Page-Specific Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={selectedOverride.keywords ?? ""}
                  onChange={(e) =>
                    updateRouteOverride(selectedDef.key, {
                      keywords: e.target.value,
                    })
                  }
                  placeholder="Solar Panel Installation in India, Rooftop Solar..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                />
              </div>

              {/* Open Graph Overrides */}
              <div className="pt-4 border-t border-slate-border space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                  Open Graph & Social Sharing Overrides
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-navy-800 block mb-1">
                      OG Title (defaults to Meta Title)
                    </label>
                    <input
                      type="text"
                      value={selectedOverride.ogTitle ?? ""}
                      onChange={(e) =>
                        updateRouteOverride(selectedDef.key, {
                          ogTitle: e.target.value,
                        })
                      }
                      placeholder={effectiveTitle}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-navy-800 block mb-1">
                      OG Description (defaults to Meta Description)
                    </label>
                    <input
                      type="text"
                      value={selectedOverride.ogDescription ?? ""}
                      onChange={(e) =>
                        updateRouteOverride(selectedDef.key, {
                          ogDescription: e.target.value,
                        })
                      }
                      placeholder={effectiveDesc}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
                    />
                  </div>
                </div>

                <CmsImageUploader
                  label="Custom Open Graph Image (1200x630 recommended)"
                  value={selectedOverride.ogImage || ""}
                  onChange={(url) =>
                    updateRouteOverride(selectedDef.key, { ogImage: url })
                  }
                  folder="seo"
                  aspectRatio="banner"
                  previewHeightClass="h-28"
                />
              </div>

              {/* Indexing Controls */}
              <div className="pt-4 border-t border-slate-border flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-navy-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedOverride.noIndex)}
                    onChange={(e) =>
                      updateRouteOverride(selectedDef.key, {
                        noIndex: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-solar-green focus:ring-solar-green"
                  />
                  <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Set Meta Robots to noindex (hides from Google Search)</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-navy-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(selectedOverride.excludeFromSitemap)}
                    onChange={(e) =>
                      updateRouteOverride(selectedDef.key, {
                        excludeFromSitemap: e.target.checked,
                      })
                    }
                    className="rounded border-slate-300 text-solar-green focus:ring-solar-green"
                  />
                  <MapIcon className="w-3.5 h-3.5 text-slate-muted" />
                  <span>Exclude from /sitemap.xml</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Global Defaults, Google Search Console & GA4 */}
      {activeTab === "global" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Global Meta & Social */}
          <div className="bg-white rounded-2xl border border-slate-border p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 text-navy-800">
              <Globe className="w-5 h-5 text-solar-green" />
              <h2 className="text-base font-bold">
                Global Fallback Meta & Image Defaults
              </h2>
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-800 block mb-1">
                Default Site Meta Title
              </label>
              <input
                type="text"
                value={config.defaultTitle}
                onChange={(e) =>
                  setConfig({ ...config, defaultTitle: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-800 block mb-1">
                Title Suffix Template (use %s for page title)
              </label>
              <input
                type="text"
                value={config.titleTemplate}
                onChange={(e) =>
                  setConfig({ ...config, titleTemplate: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm font-mono focus:outline-none focus:border-solar-green"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-800 block mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={config.defaultDesc}
                onChange={(e) =>
                  setConfig({ ...config, defaultDesc: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-800 block mb-1">
                Pan-India Core Search Keywords
              </label>
              <textarea
                rows={3}
                value={config.keywords}
                onChange={(e) =>
                  setConfig({ ...config, keywords: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-800 block mb-1">
                Default Image Alt Text Suffix
              </label>
              <input
                type="text"
                value={config.defaultImageAltSuffix}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    defaultImageAltSuffix: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm focus:outline-none focus:border-solar-green"
              />
            </div>

            <CmsImageUploader
              label="Global Fallback Open Graph Share Image"
              value={config.defaultOgImage}
              onChange={(url) => setConfig({ ...config, defaultOgImage: url })}
              folder="seo"
              aspectRatio="banner"
              previewHeightClass="h-32"
            />
          </div>

          {/* Google Search Console, GA4 & Schema Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-navy-800">
                <ShieldCheck className="w-5 h-5 text-solar-green" />
                <h2 className="text-base font-bold">
                  Google Search Console Verification
                </h2>
              </div>
              <p className="text-xs text-slate-muted leading-relaxed">
                Paste your Google Search Console HTML tag verification token (or the full{" "}
                <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>{" "}
                snippet — we extract the token automatically).
              </p>
              <div>
                <label className="text-xs font-semibold text-navy-800 block mb-1">
                  Verification Token
                </label>
                <input
                  type="text"
                  value={config.googleSiteVerification}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      googleSiteVerification: e.target.value,
                    })
                  }
                  placeholder="e.g. abc123XYZ_google_verification_token"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm font-mono focus:outline-none focus:border-solar-green"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-navy-800">
                <BarChart3 className="w-5 h-5 text-solar-green" />
                <h2 className="text-base font-bold">
                  Google Analytics 4 (GA4) & Consent Mode
                </h2>
              </div>
              <p className="text-xs text-slate-muted leading-relaxed">
                Tracks public pageviews and lead conversion events (<code>generate_lead</code>) without collecting PII inside GA4. First-party CRM analytics remain active in MongoDB.
              </p>
              <div>
                <label className="text-xs font-semibold text-navy-800 block mb-1">
                  GA4 Measurement ID
                </label>
                <input
                  type="text"
                  value={config.ga4MeasurementId}
                  onChange={(e) =>
                    setConfig({ ...config, ga4MeasurementId: e.target.value })
                  }
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-border text-sm font-mono focus:outline-none focus:border-solar-green"
                />
              </div>
              <label className="inline-flex items-center gap-2.5 text-xs font-semibold text-navy-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={config.enableConsentBanner}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableConsentBanner: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-solar-green focus:ring-solar-green"
                />
                <span>
                  Enable Google Consent Mode v2 privacy banner before loading GA4 cookies
                </span>
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-slate-border p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-navy-800">
                <Code2 className="w-5 h-5 text-solar-green" />
                <h2 className="text-base font-bold">
                  Structured Data (JSON-LD) Controls
                </h2>
              </div>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableOrganizationSchema}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableOrganizationSchema: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-solar-green focus:ring-solar-green"
                />
                <span>
                  Emit LocalBusiness & Organization JSON-LD with Pan-India coverage
                </span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-navy-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.enableBreadcrumbSchema}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      enableBreadcrumbSchema: e.target.checked,
                    })
                  }
                  className="rounded border-slate-300 text-solar-green focus:ring-solar-green"
                />
                <span>Emit BreadcrumbList JSON-LD across public subpages</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Sitemap, Robots & Technical SEO Status */}
      {activeTab === "audit" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-border p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-800">
              Live Crawlability & Sitemap Endpoints
            </h2>
            <p className="text-xs text-slate-muted leading-relaxed">
              Your dynamic XML sitemap automatically merges all indexable public routes, published 10W–730W solar products, installation services, portfolio case studies, Pan-India state & city landing pages, and blog guides.
            </p>
            <div className="space-y-2.5">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-bg border border-slate-border hover:border-solar-green text-xs font-bold text-navy-800 transition-colors"
              >
                <span>Open Live XML Sitemap (/sitemap.xml)</span>
                <ExternalLink className="w-4 h-4 text-solar-green" />
              </a>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-bg border border-slate-border hover:border-solar-green text-xs font-bold text-navy-800 transition-colors"
              >
                <span>Inspect Crawl Directives (/robots.txt)</span>
                <ExternalLink className="w-4 h-4 text-solar-green" />
              </a>
              <a
                href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(BASE_URL)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-bg border border-slate-border hover:border-solar-green text-xs font-bold text-navy-800 transition-colors"
              >
                <span>Test Structured Data in Google Rich Results</span>
                <ExternalLink className="w-4 h-4 text-solar-green" />
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-border p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-800">
              Technical SEO Safeguards Active
            </h2>
            <ul className="space-y-2.5 text-xs text-slate-main">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                <span>
                  <strong>Admin & API No-Index Enforcement:</strong> <code>/admin/*</code> and <code>/api/*</code> are disallowed in <code>robots.txt</code> and emit <code>noindex, nofollow, nocache</code> headers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                <span>
                  <strong>Self-Referencing Canonicals:</strong> All static and dynamic public routes emit explicit <code>alternates.canonical</code> links preventing duplicate query-param indexing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                <span>
                  <strong>Policy-Compliant Product Schema:</strong> <code>Product</code> JSON-LD outputs wattage, technology, ALMM certifications & warranty specs without fabricated pricing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                <span>
                  <strong>Multi-Entity Schema Coverage:</strong> <code>LocalBusiness</code>, <code>WebSite</code>, <code>Service</code>, <code>Article</code>, <code>FAQPage</code>, <code>VideoObject</code>, and <code>BreadcrumbList</code>.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
