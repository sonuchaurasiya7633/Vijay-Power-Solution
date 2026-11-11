import { MetadataRoute } from "next";
import connectDB from "@/lib/db/connection";
import SolarProduct from "@/models/SolarProduct";
import SolarService from "@/models/SolarService";
import PortfolioProject from "@/models/PortfolioProject";
import Location from "@/models/Location";
import Blog from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vijoypowersolution.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/solar-panels",
    "/solar-solutions",
    "/services",
    "/projects",
    "/gallery",
    "/videos",
    "/testimonials",
    "/service-areas",
    "/solar-calculator",
    "/subsidy-information",
    "/blog",
    "/faqs",
    "/contact",
    "/get-quote",
    "/request-site-survey",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    await connectDB();
    const [products, services, projects, locations, blogs] = await Promise.all([
      SolarProduct.find({ isPublished: true }, "slug updatedAt").lean(),
      SolarService.find({ isAvailable: true }, "slug updatedAt").lean(),
      PortfolioProject.find({ isPublished: true }, "slug updatedAt").lean(),
      Location.find({ isPublished: true }, "stateSlug citySlug updatedAt").lean(),
      Blog.find({ isPublished: true }, "slug updatedAt").lean(),
    ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...products.map((p) => ({
        url: `${baseUrl}/solar-panels/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...services.map((s) => ({
        url: `${baseUrl}/services/${s.slug}`,
        lastModified: s.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...projects.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...locations.map((l) => ({
        url: `${baseUrl}/service-areas/${l.stateSlug}/${l.citySlug}`,
        lastModified: l.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...blogs.map((b) => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
