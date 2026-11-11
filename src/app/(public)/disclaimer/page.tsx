import type { Metadata } from "next";
import connectDB from "@/lib/db/connection";
import Page from "@/models/Page";
import { getRouteMetadata } from "@/lib/seo-server";

export async function generateMetadata(): Promise<Metadata> {
  return getRouteMetadata({
    routeKey: "disclaimer",
    path: "/disclaimer",
    fallbackTitle: "Regulatory Disclaimer | VIJOY POWER SOLUTION",
    fallbackDescription:
      "Official disclaimers on solar generation estimates, government subsidies, and pricing.",
  });
}

export const revalidate = 60;

export default async function DisclaimerPage() {
  let dynamicPage: any = null;
  try {
    await connectDB();
    dynamicPage = await Page.findOne({ slug: "disclaimer", isPublished: true }).lean();
  } catch (e) {
    console.error("Error loading dynamic disclaimer:", e);
  }

  if (dynamicPage && dynamicPage.contentHtml) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-navy-800">
          <h1 className="text-3xl font-display font-extrabold">{dynamicPage.title || "Regulatory & Engineering Disclaimer"}</h1>
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
        <h1 className="text-3xl font-display font-extrabold">Regulatory & Engineering Disclaimer</h1>
        <p className="text-xs text-slate-muted">Last updated: January 2025</p>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">1. Generation Estimates</h2>
          <p>
            Any solar generation figures (kWh/year), electricity bill offsets, or savings approximations shown on this website or calculated by our interactive calculator are estimated based on regional average solar irradiance. Actual energy output varies depending on local weather, rooftop tilt angle, seasonal shadow obstructions, and periodic panel cleaning.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">2. PM Surya Ghar Subsidy Disclaimer</h2>
          <p>
            Subsidy eligibility, benefits, documentation, and approval depend on applicable government rules and DISCOM requirements under the PM Surya Ghar: Muft Bijli Yojana. VIJOY POWER SOLUTION does not guarantee subsidy sanction or disbursement, which remains under the exclusive purview of the Ministry of New and Renewable Energy (MNRE) and the respective state DISCOMs. Please verify current rules on the official portal at <strong>pmsuryaghar.gov.in</strong>.
          </p>
        </section>

        <section className="space-y-3 text-sm text-slate-muted leading-relaxed">
          <h2 className="text-lg font-bold text-navy-800">3. Non-Ecommerce Policy</h2>
          <p>
            VIJOY POWER SOLUTION is an engineering EPC contractor. We do not provide public online ecommerce sales, shopping carts, or online payment gateways for solar modules or installation packages. All services and sales are contracted through private consultations and formal agreements.
          </p>
        </section>
      </div>
    </div>
  );
}
