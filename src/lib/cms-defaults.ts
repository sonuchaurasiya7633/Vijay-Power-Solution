export interface SolarPanelsTechCard {
  badge: string;
  badgeColor: "navy" | "green" | "gold";
  title: string;
  description: string;
}

export interface SolarPanelsPageCms {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  showcaseViewAllText: string;
  policyTitle: string;
  policyText: string;
  policyCtaText: string;
  policyCtaLink: string;
  primerBadge: string;
  primerTitle: string;
  primerSubtitle: string;
  techCards: SolarPanelsTechCard[];
}

export const defaultSolarPanelsPageCms: SolarPanelsPageCms = {
  heroBadge: "MNRE & ALMM Compliant Hardware",
  heroTitle: "Tier-1 Solar Panel Portfolio (10W – 730W)",
  heroSubtitle:
    "Explore genuine, high-efficiency solar modules spanning small 10W DC micro-panels for lighting and rural telemetry up to massive 730W N-Type TOPCon & HJT bifacial utility modules.",
  showcaseBadge: "Full Spectrum Portfolio",
  showcaseTitle: "Solar Modules from 10W to 730W",
  showcaseSubtitle:
    "Explore genuine manufacturer modules spanning small rural lighting kits (10W) up to utility-grade Heterojunction and N-Type TOPCon powerhouses (730W).",
  showcaseViewAllText: "View Complete Catalogue",
  policyTitle: "Engineering-Driven Selection & Zero Public Pricing Policy",
  policyText:
    "As an engineering-led EPC, we do not publish speculative online cart prices. Actual project sizing depends on mounting angle, roof strength, structural load, and wiring topology.",
  policyCtaText: "Request Project Feasibility",
  policyCtaLink: "/request-site-survey",
  primerBadge: "Technology Primer",
  primerTitle: "Understanding Solar Cell Technologies",
  primerSubtitle:
    "Choosing the right cell architecture maximizes kWh generation based on your roof size and local temperature conditions.",
  techCards: [
    {
      badge: "Standard Budget",
      badgeColor: "navy",
      title: "Polycrystalline & Mono PERC",
      description:
        "Proven, reliable technology covering 10W to 450W modules. Ideal for off-grid battery setups, DC solar lighting, agricultural telemetry, and cost-sensitive residential installations.",
    },
    {
      badge: "High Efficiency",
      badgeColor: "green",
      title: "N-Type TOPCon & Bifacial",
      description:
        "Modern flagship tier (550W to 700W+) capturing both direct sunlight and rear-side ambient ground reflections. Delivers superior low-light morning/evening generation and minimal annual degradation.",
    },
    {
      badge: "Maximum Density",
      badgeColor: "gold",
      title: "Heterojunction (HJT)",
      description:
        "Ultra-high-efficiency modules reaching up to 730W. Features exceptional temperature coefficients, meaning minimal power drop during extreme 45°C+ Indian summer heatwaves across all regions.",
    },
  ],
};

export interface PageHeaderCms {
  badge: string;
  title: string;
  subtitle: string;
}

export interface PublicPagesCms {
  solutionsSection: {
    badge: string;
    title: string;
    subtitle: string;
  };
  solutionsPage: PageHeaderCms;
  servicesPage: PageHeaderCms;
  projectsPage: PageHeaderCms;
  galleryPage: PageHeaderCms;
  videosPage: PageHeaderCms;
  faqsPage: PageHeaderCms;
  serviceAreasPage: PageHeaderCms;
  blogPage: PageHeaderCms;
  testimonialsPage: PageHeaderCms & {
    consentTitle: string;
    consentText: string;
    consentCtaText: string;
    consentCtaLink: string;
  };
  calculatorPage: PageHeaderCms & {
    methodologyTitle: string;
    card1Title: string;
    card1Text: string;
    card2Title: string;
    card2Text: string;
    card3Title: string;
    card3Text: string;
    disclaimerText: string;
  };
  getQuotePage: PageHeaderCms & {
    guarantee1Title: string;
    guarantee1Subtitle: string;
    guarantee2Title: string;
    guarantee2Subtitle: string;
    guarantee3Title: string;
    guarantee3Subtitle: string;
  };
  siteSurveyPage: PageHeaderCms;
}

export const defaultPublicPagesCms: PublicPagesCms = {
  solutionsSection: {
    badge: "Engineered For Every Need",
    title: "Tailored Solar Solutions",
    subtitle:
      "From urban rooftops to rural farmhouses and heavy industries, explore our customized clean energy architectures designed specifically for homes, businesses, and enterprises across India.",
  },
  solutionsPage: {
    badge: "Custom Engineering Systems",
    title: "Comprehensive Solar Energy Solutions",
    subtitle:
      "Every property has distinct electricity load curves and rooftop shading constraints. We engineer grid-tied, off-grid, hybrid, and agricultural solar power systems tailored for Indian grids and extreme temperatures.",
  },
  servicesPage: {
    badge: "End-to-End Lifecycle Support",
    title: "Technical Solar Services & Maintenance",
    subtitle:
      "Beyond sales, our certified technical engineering crew provides comprehensive site evaluation, structural installation, annual maintenance contracts, and emergency troubleshooting.",
  },
  projectsPage: {
    badge: "Executed EPC Track Record",
    title: "Our Completed Solar Projects",
    subtitle:
      "Explore completed residential rooftop, commercial institutional, industrial captive, and agricultural solar installations engineered across India.",
  },
  galleryPage: {
    badge: "Verified Field Installations",
    title: "Customer Installation Gallery",
    subtitle:
      "Real residential, commercial, institutional, and agricultural solar projects engineered and handed over by our certified field team.",
  },
  videosPage: {
    badge: "Video Knowledge Base & Site Walkthroughs",
    title: "Solar Installations, Field Tours & Guides",
    subtitle:
      "Watch real solar installations in action across homes and agricultural farms, learn about net metering meters, and discover how to maintain your panels.",
  },
  faqsPage: {
    badge: "Knowledge & Support Base",
    title: "Frequently Asked Solar Questions",
    subtitle:
      "Everything you need to know about solar panel sizing, government subsidies under PM Surya Ghar, DISCOM net metering, warranties, and maintenance.",
  },
  serviceAreasPage: {
    badge: "Pan-India Presence & Engineering Dispatch",
    title: "Our Solar Service Footprint Across India",
    subtitle:
      "Vijay Power Solution provides comprehensive turnkey rooftop solar EPC, state DISCOM liaison, and field warranty maintenance across all 28 States & 8 Union Territories in India.",
  },
  blogPage: {
    badge: "Solar Engineering & Policy Insights",
    title: "Solar Guides, Subsidies & Maintenance Blog",
    subtitle:
      "Practical articles written by solar field engineers covering PM Surya Ghar Muft Bijli Yojana updates, net-metering rules, and panel maintenance across India.",
  },
  testimonialsPage: {
    badge: "Real Stories, Verified Performance",
    title: "What Our Solar Customers Say",
    subtitle:
      "Read feedback from homeowners, business owners, school principals, and farmers who switched to clean solar power with Vijay Power Solution.",
    consentTitle: "100% Verified Consent Standard",
    consentText:
      "Every customer testimonial published on this website is verified by project completion status and includes direct customer approval. We never fabricate reviews or inflate client feedback.",
    consentCtaText: "Become a Solar Reference Client",
    consentCtaLink: "/get-quote",
  },
  calculatorPage: {
    badge: "Engineering Sizing Simulator",
    title: "Solar System Size & Savings Calculator",
    subtitle:
      "Estimate the right rooftop solar system capacity, installation area, monthly electricity bill savings, and CO₂ emission offsets customized for your monthly billing cycle.",
    methodologyTitle: "Calculation Methodology & Engineering Assumptions",
    card1Title: "1. Pan-India Irradiance Yield",
    card1Text:
      "Simulations use average daily solar insolation parameters across India, assuming an average annual yield of ~4.0 to 4.5 kWh per kW per day after typical thermal and wiring derating.",
    card2Title: "2. Roof Area Allocation",
    card2Text:
      "Standard sizing accounts for 80 to 100 sq. ft. per kW using high-efficiency 550W+ Mono PERC / TOPCon modules, including inter-row shadow spacing and walkway maintenance tolerances.",
    card3Title: "3. PM Surya Ghar Subsidy Norms",
    card3Text:
      "Subsidy highlights strictly reflect central residential MNRE Direct Benefit Transfer slabs (₹30k for 1kW, ₹60k for 2kW, capped at ₹78k for 3kW and above). Commercial systems receive tax accelerated depreciation.",
    disclaimerText:
      "Disclaimer: Online estimates provide an architectural feasibility baseline. Exact generation yield depends on south-facing azimuth orientation, shading obstructions (parapets, trees, water tanks), structural angle, and local transformer voltage stability. Our site feasibility engineer validates all exact parameters prior to quotation.",
  },
  getQuotePage: {
    badge: "Engineering Feasibility Desk",
    title: "Get Your Custom Solar Quotation",
    subtitle:
      "Provide your monthly electricity consumption and location details. Our certified solar consultant will prepare a customized technical layout, ROI calculation, and official project quotation.",
    guarantee1Title: "Zero Spam Policy",
    guarantee1Subtitle: "Direct consultation from engineering desk only.",
    guarantee2Title: "Free Feasibility Check",
    guarantee2Subtitle: "Full shadow analysis & generation simulation.",
    guarantee3Title: "Official Warranty Guarantee",
    guarantee3Subtitle: "25-year linear performance documentation.",
  },
  siteSurveyPage: {
    badge: "Pan-India On-Site Roof Inspection",
    title: "Schedule a Free Engineering Site Survey",
    subtitle:
      "Book a visit by our field technical team anywhere across India for laser roof measurements, shading analysis, and load feasibility assessment.",
  },
};

export function mergeWithDefaults<T extends Record<string, any>>(
  defaults: T,
  overrides?: Record<string, any> | null
): T {
  if (!overrides || typeof overrides !== "object") return defaults;
  const result: Record<string, any> = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const defVal = defaults[key];
    const ovVal = overrides[key];
    if (ovVal === undefined || ovVal === null) continue;
    if (Array.isArray(defVal)) {
      result[key] = Array.isArray(ovVal) && ovVal.length > 0 ? ovVal : defVal;
    } else if (typeof defVal === "object" && defVal !== null) {
      result[key] = mergeWithDefaults(defVal, ovVal);
    } else if (typeof ovVal === "string") {
      result[key] = ovVal.trim() !== "" ? ovVal : defVal;
    } else {
      result[key] = ovVal;
    }
  }
  return result as T;
}
