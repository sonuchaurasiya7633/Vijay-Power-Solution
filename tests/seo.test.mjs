import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readSrc = (rel) => fs.readFileSync(path.join(root, rel), "utf-8");

test("SEO Config: Defines Pan-India defaults, canonical helper, and 20 static routes", () => {
  const seoConfig = readSrc("src/lib/seo-config.ts");
  assert.ok(seoConfig.includes("SEO_ROUTE_DEFINITIONS"), "Should export SEO_ROUTE_DEFINITIONS");
  assert.ok(seoConfig.includes("alternates"), "buildNextMetadata must configure canonicals");
  assert.ok(seoConfig.includes("openGraph"), "buildNextMetadata must configure Open Graph");
  assert.ok(seoConfig.includes("twitter"), "buildNextMetadata must configure Twitter Cards");
  assert.ok(seoConfig.includes("analyzeSeoQuality"), "Should expose SERP validation analyzer");

  for (const brand of ["Vikram Solar", "Adani Solar", "Waaree", "Loom Solar"]) {
    assert.ok(seoConfig.includes(brand), `SEO defaults must reference ${brand}`);
  }
});

test("SEO Schema: Implements required schema.org types without fake pricing or fake ratings", () => {
  const schemaSrc = readSrc("src/lib/seo-schema.ts");
  for (const builder of [
    "buildOrganizationSchema",
    "buildWebSiteSchema",
    "buildBreadcrumbSchema",
    "buildFaqSchema",
    "buildProductSchema",
    "buildServiceSchema",
    "buildArticleSchema",
    "buildVideoObjectSchema",
  ]) {
    assert.ok(schemaSrc.includes(builder), `Missing schema builder: ${builder}`);
  }

  assert.equal(
    schemaSrc.includes("aggregateRating"),
    false,
    "Must never emit fabricated aggregateRating schema"
  );
  assert.equal(
    schemaSrc.includes("priceCurrency"),
    false,
    "Must respect zero-public-pricing policy in Product schema"
  );
});

test("Technical SEO: Admin is noindexed, robots.ts blocks /admin & /api, sitemap covers state & dynamic routes", () => {
  const adminLayout = readSrc("src/app/admin/layout.tsx");
  assert.match(adminLayout, /index:\s*false/);
  assert.match(adminLayout, /follow:\s*false/);

  const robots = readSrc("src/app/robots.ts");
  assert.ok(robots.includes("/admin/"));
  assert.ok(robots.includes("/api/"));
  assert.ok(robots.includes("sitemap.xml"));

  const sitemap = readSrc("src/app/sitemap.ts");
  assert.ok(sitemap.includes("stateRoutes"));
  assert.ok(sitemap.includes("excludeFromSitemap"));
  assert.ok(sitemap.includes("/service-areas/"));
  assert.ok(sitemap.includes("/solar-panels/"));

  const revalidate = readSrc("src/lib/revalidate-public.ts");
  assert.ok(revalidate.includes("/sitemap.xml"));
  assert.ok(revalidate.includes("/robots.txt"));
});

test("Public Routes: Every public page uses generateMetadata and includes no empty Image alts", () => {
  const publicDir = path.join(root, "src/app/(public)");
  const pageFiles = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === "page.tsx") pageFiles.push(full);
    }
  }
  walk(publicDir);

  assert.ok(pageFiles.length >= 22, `Expected >=22 public pages, found ${pageFiles.length}`);

  for (const file of pageFiles) {
    const content = fs.readFileSync(file, "utf-8");
    const rel = path.relative(root, file).replace(/\\/g, "/");
    if (rel === "src/app/(public)/get-quote/page.tsx") {
      const layoutPath = path.join(path.dirname(file), "layout.tsx");
      assert.ok(fs.existsSync(layoutPath), "get-quote must have server layout.tsx for metadata");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");
      assert.ok(
        layoutContent.includes("generateMetadata"),
        "get-quote layout must export generateMetadata"
      );
    } else {
      assert.ok(
        content.includes("generateMetadata"),
        `${rel} must export generateMetadata with dynamic SEO & canonical support`
      );
    }
    assert.equal(
      /alt\s*=\s*["{]\s*["}]/.test(content),
      false,
      `${rel} must not contain empty alt attributes`
    );
  }
});

test("Analytics & Root Layout: Google verification, GA4 consent mode, and lead conversion tracking are wired", () => {
  const rootLayout = readSrc("src/app/layout.tsx");
  assert.ok(rootLayout.includes("generateMetadata"));
  assert.ok(rootLayout.includes("googleSiteVerification"));
  assert.ok(rootLayout.includes("GoogleAnalyticsConsent"));
  assert.ok(rootLayout.includes("buildOrganizationSchema"));
  assert.ok(rootLayout.includes("buildWebSiteSchema"));

  const leadForm = readSrc("src/components/forms/LeadCaptureForm.tsx");
  assert.ok(leadForm.includes("trackConversionEvent"));
  assert.ok(leadForm.includes("generate_lead"));
});
