import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";

test("Gallery: public images folder has all 10 customer photos", () => {
  const galleryDir = path.join(process.cwd(), "public", "images", "gallery");
  assert.ok(fs.existsSync(galleryDir), "Gallery directory exists");
  const files = fs.readdirSync(galleryDir).filter((f) => f.endsWith(".jpg"));
  assert.ok(files.length >= 10, `Expected at least 10 images, found ${files.length}`);
});

test("Gallery: Model and API routes exist", () => {
  const modelPath = path.join(process.cwd(), "src", "models", "InstallationGallery.ts");
  assert.ok(fs.existsSync(modelPath), "InstallationGallery model exists");

  const apiRoutePath = path.join(process.cwd(), "src", "app", "api", "gallery", "route.ts");
  assert.ok(fs.existsSync(apiRoutePath), "API gallery route exists");

  const apiIdRoutePath = path.join(process.cwd(), "src", "app", "api", "gallery", "[id]", "route.ts");
  assert.ok(fs.existsSync(apiIdRoutePath), "API gallery [id] route exists");
});

test("Gallery: Components exist for Homepage and Lightbox", () => {
  const lightboxPath = path.join(process.cwd(), "src", "components", "public", "GalleryLightbox.tsx");
  assert.ok(fs.existsSync(lightboxPath), "GalleryLightbox exists");

  const homeGalleryPath = path.join(process.cwd(), "src", "components", "public", "HomepageCustomerGallery.tsx");
  assert.ok(fs.existsSync(homeGalleryPath), "HomepageCustomerGallery exists");

  const dedicatedViewPath = path.join(process.cwd(), "src", "components", "public", "DedicatedGalleryView.tsx");
  assert.ok(fs.existsSync(dedicatedViewPath), "DedicatedGalleryView exists");
});

test("Gallery: Admin CMS page exists", () => {
  const adminPagePath = path.join(process.cwd(), "src", "app", "admin", "gallery", "page.tsx");
  assert.ok(fs.existsSync(adminPagePath), "Admin Gallery CMS page exists");
});
