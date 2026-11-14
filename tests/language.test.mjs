import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

test("Language System: LanguageContext exports provider, hook and supported languages", () => {
  const filePath = path.join(root, "src/context/LanguageContext.tsx");
  assert.ok(fs.existsSync(filePath), "LanguageContext.tsx must exist");
  const content = fs.readFileSync(filePath, "utf8");

  assert.ok(content.includes('export type SupportedLanguage = "en" | "hi";'), "Supports English and Hindi");
  assert.ok(content.includes("export function LanguageProvider"), "Exports LanguageProvider");
  assert.ok(content.includes("export function useLanguage"), "Exports useLanguage hook");
  assert.ok(content.includes("googleTranslateElementInit"), "Defines Google Translate initializer");
  assert.ok(content.includes("googtrans"), "Handles googtrans cookie sync");
  assert.ok(content.includes("google-translate-script"), "Dynamically loads translation script");
});

test("Language System: LanguageSwitcher supports navbar, mobile-header, and mobile-drawer variants", () => {
  const filePath = path.join(root, "src/components/public/LanguageSwitcher.tsx");
  assert.ok(fs.existsSync(filePath), "LanguageSwitcher.tsx must exist");
  const content = fs.readFileSync(filePath, "utf8");

  assert.ok(content.includes('variant === "navbar"'), "Supports navbar variant");
  assert.ok(content.includes('variant === "mobile-header"'), "Supports mobile-header variant");
  assert.ok(content.includes('variant === "mobile-drawer"'), "Supports mobile-drawer variant");
  assert.ok(content.includes("toggleLanguage"), "Uses toggleLanguage action");
  assert.ok(content.includes("setLanguage"), "Uses setLanguage action");
  assert.ok(content.includes("हिंदी"), "Renders Hindi option");
});

test("Language System: Navbar and Footer integrate LanguageSwitcher and protect brand from translation", () => {
  const navbarPath = path.join(root, "src/components/public/Navbar.tsx");
  const footerPath = path.join(root, "src/components/public/Footer.tsx");
  const layoutPath = path.join(root, "src/app/layout.tsx");

  const navbarContent = fs.readFileSync(navbarPath, "utf8");
  const footerContent = fs.readFileSync(footerPath, "utf8");
  const layoutContent = fs.readFileSync(layoutPath, "utf8");

  assert.ok(navbarContent.includes("LanguageSwitcher"), "Navbar renders LanguageSwitcher");
  assert.ok(navbarContent.includes('notranslate'), "Navbar brand has notranslate class");
  assert.ok(footerContent.includes("LanguageSwitcher"), "Footer renders LanguageSwitcher");
  assert.ok(layoutContent.includes("<LanguageProvider>"), "RootLayout wraps content in LanguageProvider");
});

test("Language System: Global CSS cleanly suppresses default Google Translate banners and tooltips", () => {
  const cssPath = path.join(root, "src/app/globals.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  assert.ok(cssContent.includes(".goog-te-banner-frame"), "Suppresses banner frame");
  assert.ok(cssContent.includes("#goog-gt-tt"), "Suppresses Google tooltip popup");
  assert.ok(cssContent.includes("#google_translate_element"), "Suppresses raw translate dropdown");
  assert.ok(cssContent.includes("body {\n  top: 0px !important;"), "Prevents body top margin displacement");
});
