import { MetadataRoute } from "next";
import connectDB from "@/lib/db/connection";
import SolarProduct from "@/models/SolarProduct";
import SolarService from "@/models/SolarService";
import PortfolioProject from "@/models/PortfolioProject";
import Location from "@/models/Location";
import Blog from "@/models/Blog";
import {
  BASE_URL,
  SEO_ROUTE_DEFINITIONS,
} from "@/lib/seo-config";
import { getGlobalSeoSettings } from "@/lib/seo-server";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seoConfig = await getGlobalSeoSettings();
  const overrides = seoConfig.routeOverrides || {};

  const staticRoutes: MetadataRoute.Sitemap = SEO_ROUTE_DEFINITIONS.filter(
    (def) => {
      const ov = overrides[def.key];
      return !ov?.noIndex && !ov?.excludeFromSitemap;
    }
  ).map((def) => ({
    url: def.path === "/" ? BASE_URL : `${BASE_URL}${def.path}`,
    lastModified: new Date(),
    changeFrequency:
      def.path === "/"
        ? "daily"
        : def.path === "/solar-panels" || def.path === "/projects"
          ? "weekly"
          : "monthly",
    priority:
      def.path === "/"
        ? 1.0
        : ["/solar-panels", "/services", "/solar-solutions", "/service-areas"].includes(
              def.path
            )
          ? 0.9
          : 0.8,
  }));

  try {
    await connectDB();
    const [products, services, projects, locations, blogs] = await Promise.all([
      SolarProduct.find({ isPublished: true }, "slug updatedAt").lean(),
      SolarService.find({ isAvailable: true }, "slug updatedAt").lean(),
      PortfolioProject.find({ isPublished: true }, "slug updatedAt").lean(),
      Location.find(
        { isPublished: true },
        "stateSlug citySlug updatedAt"
      ).lean(),
      Blog.find({ isPublished: true }, "slug updatedAt").lean(),
    ]);

    // Deduplicated State landing pages (/service-areas/[state]) derived from published locations
    const stateLastModMap = new Map<string, Date>();
    for (const loc of locations) {
      if (!loc.stateSlug) continue;
      const existing = stateLastModMap.get(loc.stateSlug);
      const dt = loc.updatedAt ? new Date(loc.updatedAt) : new Date();
      if (!existing || dt > existing) {
        stateLastModMap.set(loc.stateSlug, dt);
      }
    }

    const stateRoutes: MetadataRoute.Sitemap = Array.from(
      stateLastModMap.entries()
    ).map(([stateSlug, lastModified]) => ({
      url: `${BASE_URL}/service-areas/${stateSlug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...products.map((p) => ({
        url: `${BASE_URL}/solar-panels/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
      ...services.map((s) => ({
        url: `${BASE_URL}/services/${s.slug}`,
        lastModified: s.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...projects.map((p) => ({
        url: `${BASE_URL}/projects/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...stateRoutes,
      ...locations.map((l) => ({
        url: `${BASE_URL}/service-areas/${l.stateSlug}/${l.citySlug}`,
        lastModified: l.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })),
      ...blogs.map((b) => ({
        url: `${BASE_URL}/blog/${b.slug}`,
        lastModified: b.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.65,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    return staticRoutes;
  }
}
