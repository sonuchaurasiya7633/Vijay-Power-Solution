import type { Metadata } from "next";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";

export const metadata: Metadata = {
  title: "Terms and Conditions | VIJOY POWER SOLUTION",
  description: "Terms and conditions governing solar consultation, engineering quotations, and installation contracts.",
};

export const revalidate = 60;

export default async function TermsPage() {
  let dynamicPage: any = null;
  try {
    await connectDB();
    dynamicPage = await Page.findOne({ slug: "terms-and-conditions", isPublished: true }).lean();
  } catch (e) {
    console.error("Error loading dynamic terms:", e);
  }

  if (dynamicPage && dynamicPage.contentHtml) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-navy-800">
          <h1 className="text-3xl font-display font-extrabold">{dynamicPage.title || "Terms & Conditions"}</h1>
          {dynamicPage.heroSubtitle && (
            <p className="text-sm text-slate-muted">{dynamicPage.heroSubtitle}</p>
          )}
          <div
            className="prose prose-slate max-w-none text-sm text-slate-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: dynamicPage.contentHtml }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-navy-800">
        <h1 className="text-3xl font-display font-extrabold">Terms & Conditions</h1>
        <p className="text-xs text-slate-muted">Last updated: January 2025</p>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">1. Commercial Quotations & Pricing</h2>
          <p>
            All commercial figures provided through internal quotations or consultation discussions are site-specific and subject to physical rooftop inspection, distance to distribution boards, and local utility infrastructure. Website calculators and content are educational and do not constitute a binding legal agreement until a formal EPC contract is signed.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">2. Warranties & Equipment</h2>
          <p>
            Solar panel warranties (10-12 year product and 25-30 year performance warranties) and inverter warranties are backed directly by the respective tier-1 manufacturers. VIJOY POWER SOLUTION provides workmanship and physical installation warranties in accordance with specific project contracts.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">3. Utility Approvals</h2>
          <p>
            While VIJOY POWER SOLUTION assists with document submission and technical liaison with electricity utilities, final net-metering approvals, meter commissioning timelines, and tariff credits are determined by the respective state DISCOMs.
          </p>
        </section>
      </div>
    </div>
  );
}
