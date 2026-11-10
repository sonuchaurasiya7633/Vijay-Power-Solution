import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, ExternalLink, CheckCircle2, FileText, Landmark, ArrowRight } from "lucide-react";
import LeadCaptureForm from "@/components/forms/LeadCaptureForm";
import CtaBanner from "@/components/public/CtaBanner";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import Setting from "@/models/Setting";

export const metadata: Metadata = {
  title: "PM Surya Ghar Subsidy Guide | Rooftop Solar in Bihar, JH & UP",
  description:
    "Comprehensive educational guide on PM Surya Ghar: Muft Bijli Yojana subsidies (up to ₹78,000), DISCOM net metering requirements, eligibility, and application procedure in Bihar, Jharkhand, and UP.",
};

export const revalidate = 60;

export default async function SubsidyInformationPage() {
  let dynamicPage: any = null;
  let cmsSubsidy: any = null;

  try {
    await connectDB();
    const [pageDoc, settingDoc] = await Promise.all([
      Page.findOne({ slug: "subsidy-information", isPublished: true }).lean(),
      Setting.findOne({ key: "subsidy_page" }).lean(),
    ]);
    dynamicPage = pageDoc;
    if (settingDoc && settingDoc.value) {
      cmsSubsidy = settingDoc.value;
    }
  } catch (err) {
    console.error("Error loading dynamic subsidy page:", err);
  }

  const heroBadge = cmsSubsidy?.hero?.badge || "Government Initiatives & Schemes";
  const title = cmsSubsidy?.hero?.title || dynamicPage?.title || "PM Surya Ghar: Muft Bijli Yojana";
  const heroSubtitle =
    cmsSubsidy?.hero?.subtitle ||
    dynamicPage?.heroSubtitle ||
    "Educational guide to national financial assistance, eligibility guidelines, DISCOM technical requirements, and step-by-step application workflow for rooftop solar in Bihar, Jharkhand, and Uttar Pradesh.";

  const slabs = cmsSubsidy?.slabs || [
    {
      capacity: "1 kW System",
      subsidyAmount: "₹30,000",
      application: "Small homes (1-2 fans, TV, LED lights)",
    },
    {
      capacity: "2 kW System",
      subsidyAmount: "₹60,000",
      application: "Medium homes (1 AC, refrigerator, washing machine)",
    },
    {
      capacity: "3 kW to 10 kW System",
      subsidyAmount: "₹78,000 (Maximum Cap)",
      application: "Large homes & multi-floor residences (2-3 ACs, heavy loads)",
    },
    {
      capacity: "Group Housing Societies (GHS/RWA)",
      subsidyAmount: "₹18,000 per kW (up to 500 kW)",
      application: "Common facilities (lifts, water pumping, corridors)",
    },
  ];

  const workflow = cmsSubsidy?.workflow || [
    {
      step: "01",
      title: "Portal Registration",
      desc: "Register on the official national portal (pmsuryaghar.gov.in) with your State, DISCOM name, electricity consumer account number, mobile number, and email.",
    },
    {
      step: "02",
      title: "DISCOM Technical Feasibility Approval",
      desc: "Submit the rooftop application. Your regional utility (SBPDCL/NBPDCL in Bihar, JBVNL in Jharkhand, UPPCL in UP) reviews local distribution transformer capacity and issues technical clearance.",
    },
    {
      step: "03",
      title: "Installation by Authorized Solar EPC",
      desc: "Install your solar plant using ALMM-certified panels, BIS-approved inverters, and hot-dip galvanized mounting structures with dedicated chemical earthing pits.",
    },
    {
      step: "04",
      title: "Net Meter Inspection & Direct DBT Disbursement",
      desc: "DISCOM officials inspect the plant and install the bi-directional meter. Once the commissioning certificate is generated on the portal, subsidy funds are credited directly to the homeowner's bank account via Direct Benefit Transfer (DBT).",
    },
  ];

  const states = cmsSubsidy?.states || [
    {
      state: "Bihar",
      discoms: "SBPDCL & NBPDCL",
      perks:
        "Online Suvidha Portal integration for seamless Net-Metering application. Bi-directional meter installation fee adjusted in upcoming electricity bills.",
    },
    {
      state: "Jharkhand",
      discoms: "JBVNL",
      perks:
        "Single-window rooftop portal with expedited feeder feasibility checks. Zero meter security deposit for domestic consumers under 5 kW.",
    },
    {
      state: "Uttar Pradesh",
      discoms: "UPPCL (MVVNL, PVVNL, DVVNL, PuVVNL)",
      perks:
        "Direct DISCOM portal sync with central PM Surya Ghar national portal. State additional incentive of up to ₹30,000 credited under the UP Solar Energy Policy 2022.",
    },
  ];

  const documents = cmsSubsidy?.documents || [
    { name: "Latest Electricity Bill", note: "Should be in consumer's name showing sanctioned load & CA number" },
    { name: "Aadhaar Card", note: "Linked to the bank account and mobile number" },
    { name: "Cancelled Bank Cheque / Passbook", note: "For direct subsidy deposit via PFMS DBT" },
    { name: "Rooftop Photograph", note: "Photograph showing rooftop space with consumer" },
  ];

  const disclaimer =
    cmsSubsidy?.disclaimer ||
    "Subsidy eligibility, benefits, documentation, and approval depend strictly on applicable government rules, quota availability, and DISCOM requirements under the PM Surya Ghar scheme. VIJOY POWER SOLUTION does not guarantee subsidy approval, which is solely determined by utility and central nodal agencies. Always verify latest official guidelines through the official national government portal.";

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-solar-yellow bg-white/10 px-3 py-1 rounded-full">
            {heroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Educational Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* National Subsidy Slab Table */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                Financial Assistance Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-navy-800">
                Residential Subsidy Slabs
              </h2>
              <p className="text-sm text-slate-muted leading-relaxed">
                Under the PM Surya Ghar scheme, residential households with an active domestic electricity connection are eligible for central financial assistance:
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-border">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-navy-800 text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 sm:p-4">Rooftop Solar Capacity</th>
                      <th className="p-3.5 sm:p-4">Central Subsidy Amount</th>
                      <th className="p-3.5 sm:p-4">Typical Application</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {slabs.map((slab: any, idx: number) => (
                      <tr key={idx} className={`hover:bg-slate-bg ${idx === 2 ? "bg-solar-green-light/20" : ""}`}>
                        <td className="p-3.5 sm:p-4 font-bold text-navy-800">{slab.capacity}</td>
                        <td className="p-3.5 sm:p-4 font-bold text-solar-green">{slab.subsidyAmount}</td>
                        <td className="p-3.5 sm:p-4 text-slate-muted">{slab.application}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* State Additional Benefits */}
            {states && states.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-border">
                <span className="text-xs font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Regional Policies
                </span>
                <h3 className="text-xl font-bold font-display text-navy-800">
                  State-Specific Net Metering Provisions (Bihar, JH & UP)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {states.map((st: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-border bg-slate-50 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2 py-0.5 rounded-full">
                        {st.state}
                      </span>
                      <h4 className="text-sm font-bold text-navy-800">{st.discoms}</h4>
                      <p className="text-xs text-slate-muted leading-relaxed">{st.perks}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Application Procedure */}
            <div className="space-y-4 pt-4 border-t border-slate-border">
              <h3 className="text-xl font-bold font-display text-navy-800">
                Step-by-Step Portal Application Process
              </h3>
              <div className="space-y-3 text-xs sm:text-sm">
                {workflow.map((wf: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-bg border border-slate-border flex gap-3.5">
                    <span className="w-7 h-7 rounded-full bg-navy-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {wf.step || idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-navy-800">{wf.title}</h4>
                      <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                        {wf.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div className="space-y-4 pt-4 border-t border-slate-border">
              <h3 className="text-xl font-bold font-display text-navy-800">
                Documents Required for Subsidy Claim
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {documents.map((doc: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-border flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-solar-green shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-navy-800 block">{doc.name}</span>
                      {doc.note && <span className="text-[11px] text-slate-muted block">{doc.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Portal Link */}
            <div className="p-6 rounded-2xl bg-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-solar-yellow font-bold uppercase tracking-wider">Official Government Portal</span>
                <h4 className="text-base font-bold">National Rooftop Solar Portal</h4>
                <p className="text-xs text-slate-300">Access official notifications, DISCOM lists, and vendor registries.</p>
              </div>
              <a
                href="https://pmsuryaghar.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-solar-green text-white hover:bg-solar-green-hover flex items-center gap-2 shrink-0 transition-colors"
              >
                <span>Visit pmsuryaghar.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mandatory Regulatory Disclaimer */}
            <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-900 space-y-2 text-xs leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-yellow-950">
                <ShieldAlert className="w-4 h-4 text-yellow-700 shrink-0" />
                <span>Regulatory Notice & Vendor Disclaimer:</span>
              </div>
              <p>{disclaimer}</p>
            </div>
          </div>

          {/* Right Column: Guidance Request Form */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-border shadow-xl space-y-4 sticky top-24">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-solar-green bg-solar-green-light px-2.5 py-0.5 rounded-full">
                  Liaison & Guidance
                </span>
                <h3 className="text-xl font-display font-extrabold text-navy-800 mt-2">
                  Need Help with Subsidy Filing?
                </h3>
                <p className="text-xs text-slate-muted mt-1">
                  Our regulatory desk assists homeowners in Bihar, Jharkhand, and UP with portal registration and technical document preparation.
                </p>
              </div>

              <LeadCaptureForm
                defaultEnquiryType="subsidy_guidance"
                defaultSolution="PM Surya Ghar Subsidy Guidance"
                compact
                buttonText="Request Subsidy Assistance"
              />
            </div>
          </div>
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
