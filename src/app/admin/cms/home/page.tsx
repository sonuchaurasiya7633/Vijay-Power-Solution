"use client";

import { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  CheckCircle2,
  Loader2,
  Sun,
  ShieldCheck,
  Award,
  Compass,
  Wrench,
  Video,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdminHomeCmsPage() {
  const [activeTab, setActiveTab] = useState<
    "hero" | "stats" | "whyUs" | "process" | "videos" | "ctaBanner"
  >("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form State
  const [hero, setHero] = useState({
    badge: "Certified Solar EPC • Bihar | Jharkhand | Uttar Pradesh",
    headline: "Power Your Future with Solar Energy",
    subheading:
      "Reliable Solar Panel Solutions & Professional Installation Across Bihar, Jharkhand, and Uttar Pradesh. Complete engineering, DISCOM net metering liaison, and PM Surya Ghar subsidy guidance.",
    backgroundImage: "/images/hero-solar-rooftop.jpg",
    checkpoints: [
      "Modules from 10W to 730W",
      "Up to ₹78,000 Govt Subsidy Guidance",
      "Heavy-Duty Hot-Dip Galvanized Mounts",
      "25-Year Linear Power Warranty",
    ],
    ctaPrimaryText: "Get Free Solar Consultation",
    ctaPrimaryLink: "/get-quote",
    ctaSecondaryText: "Explore Real Installations",
    ctaSecondaryLink: "/projects",
    transparencyNote:
      "Strict Transparency: No hidden costs. Zero public pricing fabrication. Private quotations only.",
  });

  const [stats, setStats] = useState([
    { label: "Rooftop Installations", value: "350+", suffix: "Confirmed Sites" },
    { label: "Clean Capacity Installed", value: "2.8+", suffix: "Megawatts" },
    { label: "Primary Service Regions", value: "3", suffix: "Bihar, JH, UP" },
    { label: "Engineering Experience", value: "8+", suffix: "Years Active" },
  ]);

  const [whyUs, setWhyUs] = useState({
    badge: "Our Commitments",
    title: "Why Choose VIJOY POWER SOLUTION",
    subtitle:
      "Solar is a 25-year investment. We combine robust civil-electrical engineering with dedicated local service across Bihar, Jharkhand, and Uttar Pradesh.",
    pillars: [
      {
        title: "Site-Specific Engineering",
        desc: "No cookie-cutter solar kits. We perform precision shadow modeling and roof load calculations before finalizing any array layout.",
      },
      {
        title: "Tier-1 ALMM Certified Panels",
        desc: "Exclusively tier-1 panels with 25 to 30 year performance warranties, fully compliant with national PM Surya Ghar subsidy guidelines.",
      },
      {
        title: "Heavy-Duty Mounting Structures",
        desc: "Engineered hot-dip galvanized steel structures capable of withstanding severe eastern Indian monsoon storm winds up to 150 km/h.",
      },
      {
        title: "Hassle-Free Net Metering Liaison",
        desc: "Complete end-to-end liaison with SBPDCL, NBPDCL, JBVNL, and UPPCL for prompt bi-directional meter testing and grid connection.",
      },
      {
        title: "Regional Support in Bihar, JH & UP",
        desc: "Dedicated field technicians based locally in Patna, Gaya, Ranchi, and Lucknow for swift on-site maintenance and troubleshooting.",
      },
      {
        title: "Strict Commercial Transparency",
        desc: "Transparent private commercial line items with zero hidden charges, realistic ROI models, and clear documentation.",
      },
    ],
  });

  const [process, setProcess] = useState({
    badge: "Clear Customer Journey",
    title: "How Your Solar Journey Works",
    subtitle:
      "From initial rooftop shadow assessment to final DISCOM net-meter synchronization in 8 transparent steps.",
    steps: [
      { step: "01", title: "Submit Enquiry", desc: "Share your location, electricity bill, and primary objectives via our online form or WhatsApp." },
      { step: "02", title: "Initial Consultation", desc: "Our solar consultant reviews your sanctioned power load and discusses system options." },
      { step: "03", title: "Site Survey", desc: "A field engineer inspects your roof orientation, shadow obstructions, and cable routes." },
      { step: "04", title: "Engineering Design", desc: "Custom 3D layout, module count, and inverter capacity engineered for your property." },
      { step: "05", title: "Private Quotation & Approval", desc: "Comprehensive transparent quotation with line items and subsidy projections for your review." },
      { step: "06", title: "Installation Scheduling", desc: "Delivery of ALMM certified modules, inverters, and galvanized steel mounting structures." },
      { step: "07", title: "Installation & Testing", desc: "Rigorous physical mounting, DC/AC wiring, multi-point chemical earthing, and lightning protection." },
      { step: "08", title: "Handover & Net Metering", desc: "DISCOM synchronization, bi-directional meter testing, cloud monitoring app setup, and handover." },
    ],
  });

  const [videos, setVideos] = useState({
    badge: "Video Stories & Walkthroughs",
    title: "See Our Installations in Action",
    subtitle:
      "Watch real site surveys, rooftop mounting structure erections, inverter synchronization, and client reviews.",
    items: [
      {
        title: "10 kW Elevated Rooftop Solar Walkthrough in Patna",
        location: "Kankarbagh, Patna",
        duration: "1:05",
        thumbnail: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      },
      {
        title: "25 kW Bodh Gaya Hotel Solar Commissioning & SBPDCL Inspection",
        location: "Bodh Gaya, Bihar",
        duration: "1:42",
        thumbnail: "https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&q=80",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
    ],
  });

  const [ctaBanner, setCtaBanner] = useState({
    badge: "Free Engineering Consultation Across Bihar, JH & UP",
    title: "Ready to Switch to Solar?",
    description:
      "Take the first step towards clean, reliable power and drastically lower monthly electricity bills. Book an appointment with our solar engineering specialist today.",
    buttonText: "Request Free Consultation",
    buttonLink: "/get-quote",
  });

  // Fetch live settings on mount
  useEffect(() => {
    fetch("/api/settings?key=homepage")
      .then((r) => r.json())
      .then((d) => {
        if (d.setting) {
          const val = d.setting;
          if (val.hero) setHero(val.hero);
          else if (val.headline) {
            setHero((prev) => ({
              ...prev,
              headline: val.headline,
              subheading: val.subheading || prev.subheading,
            }));
          }
          if (Array.isArray(val.stats) && val.stats.length === 4) setStats(val.stats);
          if (val.whyUs) setWhyUs(val.whyUs);
          if (val.process) setProcess(val.process);
          if (val.videos) setVideos(val.videos);
          if (val.ctaBanner) setCtaBanner(val.ctaBanner);
        }
      })
      .catch((e) => console.error("Error loading homepage CMS:", e))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        hero,
        stats,
        whyUs,
        process,
        videos,
        ctaBanner,
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "homepage",
          value: payload,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save homepage settings");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-border shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-solar-green">
            Interactive Page Builder
          </span>
          <h1 className="text-2xl font-bold font-display text-navy-800">
            Homepage CMS Management
          </h1>
          <p className="text-xs text-slate-muted mt-0.5">
            Modify Hero headline, trust checkpoints, CTA buttons, metrics, pillars, and video stories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="font-bold">Homepage changes successfully saved to database! Public homepage will reflect updates immediately.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-border pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "hero"
              ? "bg-navy-800 text-white shadow-sm"
              : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>1. Hero & Checkpoints</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "stats"
              ? "bg-navy-800 text-white shadow-sm"
              : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>2. Trust Milestones</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("whyUs")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "whyUs"
              ? "bg-navy-800 text-white shadow-sm"
              : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>3. Why Choose Us (6 Pillars)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("process")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "process"
              ? "bg-navy-800 text-white shadow-sm"
              : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>4. Installation Steps</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("videos")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "videos"
              ? "bg-navy-800 text-white shadow-sm"
              : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>5. Video Stories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ctaBanner")}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === "ctaBanner"
              ? "bg-navy-800 text-white shadow-sm"
              : "bg-white text-navy-800 border border-slate-border hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>6. Bottom CTA Banner</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-border text-center text-xs text-slate-muted flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solar-green" />
          <span>Loading homepage configuration...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* TAB 1: HERO */}
          {activeTab === "hero" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
              <div className="border-b border-slate-border pb-4">
                <h3 className="text-base font-bold text-navy-800">Hero Section Configuration</h3>
                <p className="text-xs text-slate-muted">
                  Configure the primary value proposition, highlights, buttons, and badges that greet visitors on the homepage.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Top Badge Text</label>
                  <input
                    type="text"
                    value={hero.badge}
                    onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Hero Main Headline *</label>
                  <input
                    type="text"
                    required
                    value={hero.headline}
                    onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border font-extrabold text-base text-navy-800 outline-none focus:border-solar-green"
                  />
                  <p className="text-[11px] text-slate-muted mt-1">
                    Tip: Writing &quot;Solar Energy&quot; in the title automatically styles it in emerald green.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Hero Subheading / Narrative *</label>
                  <textarea
                    rows={3}
                    required
                    value={hero.subheading}
                    onChange={(e) => setHero({ ...hero, subheading: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border leading-relaxed outline-none focus:border-solar-green"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Hero Background Image</label>
                  <input
                    type="text"
                    value={hero.backgroundImage || "/images/hero-solar-banner.jpg"}
                    onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={hero.backgroundImage || "/images/hero-solar-banner.jpg"}
                      alt="Hero Background Preview"
                      className="w-32 h-20 object-cover rounded-lg border border-slate-border shadow-sm"
                    />
                    <span className="text-[11px] text-slate-muted">
                      Solar EPC Collage banner: Residential, Commercial, Agro pumping & Mill (/images/hero-solar-banner.jpg)
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-navy-800 block mb-2">
                    Hero Trust Checkpoints (4 Key Selling Points)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hero.checkpoints.map((cp, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-solar-green-light text-solar-green font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={cp}
                          onChange={(e) => {
                            const updated = [...hero.checkpoints];
                            updated[idx] = e.target.value;
                            setHero({ ...hero, checkpoints: updated });
                          }}
                          className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-border">
                  <div className="space-y-3">
                    <h4 className="font-bold text-navy-800 text-xs uppercase">Primary CTA Button</h4>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Button Label</label>
                      <input
                        type="text"
                        value={hero.ctaPrimaryText}
                        onChange={(e) => setHero({ ...hero, ctaPrimaryText: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
                      />
                    </div>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Button Link Destination</label>
                      <input
                        type="text"
                        value={hero.ctaPrimaryLink}
                        onChange={(e) => setHero({ ...hero, ctaPrimaryLink: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-border font-mono outline-none focus:border-solar-green"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-navy-800 text-xs uppercase">Secondary CTA Button</h4>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Button Label</label>
                      <input
                        type="text"
                        value={hero.ctaSecondaryText}
                        onChange={(e) => setHero({ ...hero, ctaSecondaryText: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
                      />
                    </div>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Button Link Destination</label>
                      <input
                        type="text"
                        value={hero.ctaSecondaryLink}
                        onChange={(e) => setHero({ ...hero, ctaSecondaryLink: e.target.value })}
                        className="w-full p-2 rounded-xl border border-slate-border font-mono outline-none focus:border-solar-green"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-navy-800 block mb-1">Transparency Disclaimer Note</label>
                  <input
                    type="text"
                    value={hero.transparencyNote}
                    onChange={(e) => setHero({ ...hero, transparencyNote: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border text-slate-muted outline-none focus:border-solar-green"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATS */}
          {activeTab === "stats" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
              <div className="border-b border-slate-border pb-4">
                <h3 className="text-base font-bold text-navy-800">Trust Metrics & Operational Milestones</h3>
                <p className="text-xs text-slate-muted">
                  These 4 figures appear immediately below the hero on the homepage and about page.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {stats.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-bg/30 space-y-3">
                    <span className="font-bold text-navy-800 text-xs uppercase">Metric #{idx + 1}</span>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Display Value</label>
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setStats(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-border font-bold text-base outline-none focus:border-solar-green"
                      />
                    </div>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Suffix / Sub-label</label>
                      <input
                        type="text"
                        value={s.suffix}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx] = { ...updated[idx], suffix: e.target.value };
                          setStats(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                      />
                    </div>
                    <div>
                      <label className="text-slate-muted block mb-1 text-[11px]">Metric Description</label>
                      <input
                        type="text"
                        value={s.label}
                        onChange={(e) => {
                          const updated = [...stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setStats(updated);
                        }}
                        className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: WHY CHOOSE US */}
          {activeTab === "whyUs" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
              <div className="border-b border-slate-border pb-4">
                <h3 className="text-base font-bold text-navy-800">Why Choose VIJOY POWER SOLUTION</h3>
                <p className="text-xs text-slate-muted">
                  Configure the 6 core pillars that communicate your engineering and service superiority.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={whyUs.badge}
                      onChange={(e) => setWhyUs({ ...whyUs, badge: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Section Title</label>
                    <input
                      type="text"
                      value={whyUs.title}
                      onChange={(e) => setWhyUs({ ...whyUs, title: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Section Subtitle</label>
                  <textarea
                    rows={2}
                    value={whyUs.subtitle}
                    onChange={(e) => setWhyUs({ ...whyUs, subtitle: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green leading-relaxed"
                  />
                </div>

                <div className="pt-2">
                  <label className="font-bold text-navy-800 block mb-3 text-xs uppercase">6 Value Pillars</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {whyUs.pillars.map((p, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-bg/30 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-navy-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={p.title}
                            onChange={(e) => {
                              const updated = [...whyUs.pillars];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setWhyUs({ ...whyUs, pillars: updated });
                            }}
                            className="w-full p-1.5 rounded-lg border border-slate-border font-bold outline-none focus:border-solar-green"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={p.desc}
                          onChange={(e) => {
                            const updated = [...whyUs.pillars];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setWhyUs({ ...whyUs, pillars: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-border text-[11px] outline-none focus:border-solar-green"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROCESS */}
          {activeTab === "process" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
              <div className="border-b border-slate-border pb-4">
                <h3 className="text-base font-bold text-navy-800">8-Step Installation Process Journey</h3>
                <p className="text-xs text-slate-muted">
                  The step-by-step roadmap demonstrating your structured EPC workflow to prospects.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={process.badge}
                      onChange={(e) => setProcess({ ...process, badge: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Section Title</label>
                    <input
                      type="text"
                      value={process.title}
                      onChange={(e) => setProcess({ ...process, title: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={process.subtitle}
                    onChange={(e) => setProcess({ ...process, subtitle: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>

                <div className="pt-2">
                  <label className="font-bold text-navy-800 block mb-3 text-xs uppercase">8 Process Steps</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {process.steps.map((s, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-border bg-slate-bg/30 space-y-2">
                        <span className="font-mono font-bold text-xs text-solar-green block">
                          Step {s.step || `0${idx + 1}`}
                        </span>
                        <input
                          type="text"
                          value={s.title}
                          onChange={(e) => {
                            const updated = [...process.steps];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setProcess({ ...process, steps: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-border font-bold text-xs outline-none focus:border-solar-green"
                        />
                        <textarea
                          rows={3}
                          value={s.desc}
                          onChange={(e) => {
                            const updated = [...process.steps];
                            updated[idx] = { ...updated[idx], desc: e.target.value };
                            setProcess({ ...process, steps: updated });
                          }}
                          className="w-full p-1.5 rounded-lg border border-slate-border text-[11px] outline-none focus:border-solar-green"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VIDEOS */}
          {activeTab === "videos" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
              <div className="border-b border-slate-border pb-4">
                <h3 className="text-base font-bold text-navy-800">Video Walkthroughs & Stories</h3>
                <p className="text-xs text-slate-muted">
                  Manage the video cards displayed on both the Homepage and the `/videos` page.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Badge Text</label>
                    <input
                      type="text"
                      value={videos.badge}
                      onChange={(e) => setVideos({ ...videos, badge: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Section Title</label>
                    <input
                      type="text"
                      value={videos.title}
                      onChange={(e) => setVideos({ ...videos, title: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={videos.subtitle}
                    onChange={(e) => setVideos({ ...videos, subtitle: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                  />
                </div>

                <div className="pt-2 space-y-4">
                  {videos.items.map((v, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-border bg-slate-bg/30 space-y-3">
                      <span className="font-bold text-navy-800 text-xs uppercase">Video #{idx + 1}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-slate-muted block mb-1 text-[11px]">Video Title</label>
                          <input
                            type="text"
                            value={v.title}
                            onChange={(e) => {
                              const updated = [...videos.items];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setVideos({ ...videos, items: updated });
                            }}
                            className="w-full p-2 rounded-xl border border-slate-border font-bold outline-none focus:border-solar-green"
                          />
                        </div>
                        <div>
                          <label className="text-slate-muted block mb-1 text-[11px]">Location</label>
                          <input
                            type="text"
                            value={v.location}
                            onChange={(e) => {
                              const updated = [...videos.items];
                              updated[idx] = { ...updated[idx], location: e.target.value };
                              setVideos({ ...videos, items: updated });
                            }}
                            className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-slate-muted block mb-1 text-[11px]">Duration (e.g. 1:45)</label>
                          <input
                            type="text"
                            value={v.duration}
                            onChange={(e) => {
                              const updated = [...videos.items];
                              updated[idx] = { ...updated[idx], duration: e.target.value };
                              setVideos({ ...videos, items: updated });
                            }}
                            className="w-full p-2 rounded-xl border border-slate-border font-mono outline-none focus:border-solar-green"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="text-slate-muted block mb-1 text-[11px]">Thumbnail Image URL (Unsplash or Cloudinary)</label>
                          <input
                            type="text"
                            value={v.thumbnail}
                            onChange={(e) => {
                              const updated = [...videos.items];
                              updated[idx] = { ...updated[idx], thumbnail: e.target.value };
                              setVideos({ ...videos, items: updated });
                            }}
                            className="w-full p-2 rounded-xl border border-slate-border font-mono text-xs outline-none focus:border-solar-green"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-muted block mb-1 text-[11px]">Video Stream / MP4 URL</label>
                        <input
                          type="text"
                          value={v.videoUrl}
                          onChange={(e) => {
                            const updated = [...videos.items];
                            updated[idx] = { ...updated[idx], videoUrl: e.target.value };
                            setVideos({ ...videos, items: updated });
                          }}
                          className="w-full p-2 rounded-xl border border-slate-border font-mono text-xs outline-none focus:border-solar-green"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CTA BANNER */}
          {activeTab === "ctaBanner" && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-border shadow-sm space-y-6">
              <div className="border-b border-slate-border pb-4">
                <h3 className="text-base font-bold text-navy-800">Bottom Lead Capture CTA Banner</h3>
                <p className="text-xs text-slate-muted">
                  The prominent banner at the footer of the homepage and educational pages.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-navy-800 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={ctaBanner.badge}
                    onChange={(e) => setCtaBanner({ ...ctaBanner, badge: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={ctaBanner.title}
                    onChange={(e) => setCtaBanner({ ...ctaBanner, title: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold text-base"
                  />
                </div>

                <div>
                  <label className="font-bold text-navy-800 block mb-1">Banner Description</label>
                  <textarea
                    rows={3}
                    value={ctaBanner.description}
                    onChange={(e) => setCtaBanner({ ...ctaBanner, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-border outline-none focus:border-solar-green leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Button Text</label>
                    <input
                      type="text"
                      value={ctaBanner.buttonText}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, buttonText: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-navy-800 block mb-1">Button Link</label>
                    <input
                      type="text"
                      value={ctaBanner.buttonLink}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, buttonLink: e.target.value })}
                      className="w-full p-2 rounded-xl border border-slate-border outline-none focus:border-solar-green font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Homepage Changes</span>
            </button>

            {saved && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="font-bold">Saved successfully!</span>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
