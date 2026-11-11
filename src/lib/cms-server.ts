import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import {
  defaultPublicPagesCms,
  defaultSolarPanelsPageCms,
  mergeWithDefaults,
  type PublicPagesCms,
  type SolarPanelsPageCms,
} from "@/lib/cms-defaults";

export async function getSolarPanelsPageCms(): Promise<SolarPanelsPageCms> {
  try {
    await connectDB();
    const doc = (await Setting.findOne({ key: "solar_panels_page" }).lean()) as {
      value?: Record<string, any>;
    } | null;
    return mergeWithDefaults(defaultSolarPanelsPageCms, doc?.value);
  } catch {
    return defaultSolarPanelsPageCms;
  }
}

export async function getPublicPagesCms(): Promise<PublicPagesCms> {
  try {
    await connectDB();
    const doc = (await Setting.findOne({ key: "public_pages_cms" }).lean()) as {
      value?: Record<string, any>;
    } | null;
    return mergeWithDefaults(defaultPublicPagesCms, doc?.value);
  } catch {
    return defaultPublicPagesCms;
  }
}
