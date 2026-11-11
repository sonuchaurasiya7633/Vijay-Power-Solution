import { cache } from "react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import {
  defaultPublicPagesCms,
  defaultSolarPanelsPageCms,
  mergeWithDefaults,
  type PublicPagesCms,
  type SolarPanelsPageCms,
} from "@/lib/cms-defaults";

export const getSolarPanelsPageCms = cache(async (): Promise<SolarPanelsPageCms> => {
  try {
    await connectDB();
    const doc = (await Setting.findOne({ key: "solar_panels_page" }).lean()) as {
      value?: Record<string, any>;
    } | null;
    return mergeWithDefaults(defaultSolarPanelsPageCms, doc?.value);
  } catch {
    return defaultSolarPanelsPageCms;
  }
});

export const getPublicPagesCms = cache(async (): Promise<PublicPagesCms> => {
  try {
    await connectDB();
    const doc = (await Setting.findOne({ key: "public_pages_cms" }).lean()) as {
      value?: Record<string, any>;
    } | null;
    return mergeWithDefaults(defaultPublicPagesCms, doc?.value);
  } catch {
    return defaultPublicPagesCms;
  }
});

export interface PublicShellSettings {
  general: Record<string, any>;
  headerFooter: Record<string, any>;
}

/**
 * Loads `general` and `header_footer` settings once per server render pass
 * so Navbar, Footer, and FloatingWhatsApp share data without duplicate queries or client fetches.
 */
export const getPublicShellSettings = cache(async (): Promise<PublicShellSettings> => {
  try {
    await connectDB();
    const docs = (await Setting.find({ key: { $in: ["general", "header_footer"] } }).lean()) as Array<{
      key: string;
      value?: Record<string, any>;
    }>;

    const map: PublicShellSettings = { general: {}, headerFooter: {} };
    for (const d of docs) {
      if (d.key === "general" && d.value) map.general = JSON.parse(JSON.stringify(d.value));
      if (d.key === "header_footer" && d.value) map.headerFooter = JSON.parse(JSON.stringify(d.value));
    }
    return map;
  } catch {
    return { general: {}, headerFooter: {} };
  }
});

export const getHomepageSetting = cache(async (): Promise<Record<string, any> | null> => {
  try {
    await connectDB();
    const doc = (await Setting.findOne({ key: "homepage" }).lean()) as {
      value?: Record<string, any>;
    } | null;
    return doc?.value ? JSON.parse(JSON.stringify(doc.value)) : null;
  } catch {
    return null;
  }
});
