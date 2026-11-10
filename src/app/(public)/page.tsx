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

export default async function HomePage() {
  let galleryItems: any[] = [];
  try {
    await connectDB();
    galleryItems = await InstallationGallery.find({ isPublished: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();
  } catch (e) {
    // Graceful fallback
  }

  const cleanGalleryItems = JSON.parse(JSON.stringify(galleryItems));

  return (
    <>
      {/* 1 & 2. Hero Section */}
      <HeroSection />

      {/* 3. Trust Indicators & Milestones */}
      <StatsSection />

      {/* 4. Solar Solutions Categories */}
      <SolutionsGrid />

      {/* 5. Solar Panel Range (10W to 730W) */}
      <ProductWattageShowcase />

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
