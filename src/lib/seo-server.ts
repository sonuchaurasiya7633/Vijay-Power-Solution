import { cache } from "react";
import connectDB from "@/lib/db/connection";
import Setting from "@/models/Setting";
import {
  buildNextMetadata,
  DEFAULT_GLOBAL_SEO_CONFIG,
  mergeGlobalSeoConfig,
  type BuildMetadataParams,
  type GlobalSeoConfig,
} from "@/lib/seo-config";
import type { Metadata } from "next";

export const getGlobalSeoSettings = cache(async (): Promise<GlobalSeoConfig> => {
  try {
    await connectDB();
    const doc = (await Setting.findOne({ key: "seo" }).lean()) as {
      value?: Record<string, any>;
    } | null;
    return mergeGlobalSeoConfig(doc?.value);
  } catch {
    return DEFAULT_GLOBAL_SEO_CONFIG;
  }
});

export async function getRouteMetadata(
  params: Omit<BuildMetadataParams, "seoConfig">
): Promise<Metadata> {
  const seoConfig = await getGlobalSeoSettings();
  return buildNextMetadata({ ...params, seoConfig });
}
