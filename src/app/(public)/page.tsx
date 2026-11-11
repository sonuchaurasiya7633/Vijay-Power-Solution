import HeroSection from "@/components/public/HeroSection";
import StatsSection from "@/components/public/StatsSection";
import SolutionsGrid from "@/components/public/SolutionsGrid";
import ProductWattageShowcase from "@/components/public/ProductWattageShowcase";
import HomepageCustomerGallery from "@/components/public/HomepageCustomerGallery";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import InstallationProcess from "@/components/public/InstallationProcess";
import RecentProjectsSection from "@/components/public/RecentProjectsSection";
import VideoSection from "@/components/public/VideoSection";
import ServiceAreasSection from "@/components/public/ServiceAreasSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import CalculatorWidget from "@/components/public/CalculatorWidget";
import FaqAccordion from "@/components/public/FaqAccordion";
import CtaBanner from "@/components/public/CtaBanner";
import connectDB from "@/lib/db/connection";
import InstallationGallery from "@/models/InstallationGallery";
import SolarProduct from "@/models/SolarProduct";
import SolarSolution from "@/models/SolarSolution";
import { getPublicPagesCms, getSolarPanelsPageCms } from "@/lib/cms-server";
import { getSafeSolarImage } from "@/lib/image-fallback";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let galleryItems: any[] = [];
  let products: any[] = [];
  let solutions: any[] = [];
  const [solarPanelsCms, publicPagesCms] = await Promise.all([
    getSolarPanelsPageCms(),
    getPublicPagesCms(),
  ]);

  try {
    await connectDB();
    const [rawGallery, rawProducts, rawSolutions] = await Promise.all([
      InstallationGallery.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
      SolarProduct.find({ isPublished: true }).sort({ ratedPowerWp: 1 }).lean(),
      SolarSolution.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: 1 }).lean(),
    ]);
    galleryItems = rawGallery;
    products = rawProducts;
    solutions = rawSolutions.map((doc: any, idx: number) => ({
      slug: doc.slug,
      title: doc.title,
      category: doc.category || "Solar Architecture",
      tagline: doc.tagline || doc.description || "",
      capacity: doc.typicalCapacityRange || "Custom kW",
      image: getSafeSolarImage(doc.image, idx),
      benefits:
        Array.isArray(doc.keyBenefits) && doc.keyBenefits.length > 0
          ? doc.keyBenefits.slice(0, 3)
          : ["Custom EPC engineering", "MNRE compliant hardware"],
    }));
  } catch (e) {
    // Graceful fallback
  }

  const cleanGalleryItems = JSON.parse(JSON.stringify(galleryItems));
  const cleanProducts = JSON.parse(JSON.stringify(products));

  return (
    <>
      {/* 1 & 2. Hero Section */}
      <HeroSection />

      {/* 3. Trust Indicators & Milestones */}
      <StatsSection />

      {/* 4. Solar Solutions Categories */}
      <SolutionsGrid
        initialSolutions={solutions.length > 0 ? solutions : undefined}
        headerCms={publicPagesCms.solutionsSection}
      />

      {/* 5. Solar Panel Range (10W to 730W) */}
      <ProductWattageShowcase
        initialProducts={cleanProducts.length > 0 ? cleanProducts : undefined}
        cms={solarPanelsCms}
      />

      {/* 5.5. Real Customer Solar Installation Gallery */}
      <HomepageCustomerGallery initialItems={cleanGalleryItems} />

      {/* 6. Why Choose VIJOY POWER SOLUTION */}
      <WhyChooseUs />

      {/* 7. How Installation Works (8-Step Journey) */}
      <InstallationProcess />

      {/* 8. Recent Installations (Customer-Confirmed) */}
      <RecentProjectsSection />

      {/* 9. Video Stories & Walkthroughs */}
      <VideoSection />

      {/* 10. Service Coverage (Pan India & Regional Hubs) */}
      <ServiceAreasSection />

      {/* 11. Customer Reviews (Strictly Consent-Backed) */}
      <TestimonialsSection />

      {/* 12. Solar Calculator Section */}
      <section className="py-20 bg-slate-bg border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculatorWidget />
        </div>
      </section>

      {/* 13. Frequently Asked Questions */}
      <FaqAccordion />

      {/* 14. Lead Generation CTA */}
      <CtaBanner />
    </>
  );
}
