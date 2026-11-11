import type { Metadata } from "next";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getRouteMetadata } from "@/lib/seo-server";

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "privacy-policy",
    path: "/privacy-policy",
    fallbackTitle: "Privacy Policy | VIJOY POWER SOLUTION",
    fallbackDescription:
      "Privacy policy regarding customer lead information, site survey data, and communications.",
  });
}

export const revalidate = 60;

export default async function PrivacyPolicyPage() {
  let dynamicPage: any = null;
  try {
    await connectDB();
    dynamicPage = await Page.findOne({ slug: "privacy-policy", isPublished: true }).lean();
  } catch (e) {
    console.error("Error loading dynamic privacy policy:", e);
  }

  if (dynamicPage && dynamicPage.contentHtml) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-navy-800">
          <h1 className="text-3xl font-display font-extrabold">{dynamicPage.title || "Privacy Policy"}</h1>
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
        <h1 className="text-3xl font-display font-extrabold">Privacy Policy</h1>
        <p className="text-xs text-slate-muted">Last updated: January 2025</p>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">1. Information We Collect</h2>
          <p>
            VIJOY POWER SOLUTION collects customer information strictly for the purpose of evaluating solar rooftop suitability, arranging engineering site surveys, providing private commercial quotations, and assisting with DISCOM net-metering applications. This includes full name, mobile number, installation address, electricity consumer numbers, and rooftop specifications.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">2. Customer Consent & Project Media</h2>
          <p>
            Photographs or videos of rooftop installations and customer testimonials are published on our public website or marketing materials strictly after receiving documented written or digital consent. Private residential addresses and phone numbers are never published.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">3. Third-Party Sharing</h2>
          <p>
            We never sell customer lead data to third-party telemarketers. Information is shared only with relevant government authorities and electricity distribution companies (e.g. SBPDCL, NBPDCL, JBVNL, UPPCL) solely for official net metering and subsidy processing.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">4. Contact Regarding Privacy</h2>
          <p>
            If you have any questions or wish to delete your recorded consultation data, please contact us at <strong>contact@vijoypowersolution.com</strong> or call <strong>+91 94310 00000</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
