import type { MetadataRoute } from "next";
import { UNITS } from "@/lib/units";

const BASE = "https://alrowadrealestate.com";
const LOCALES = ["ar", "en"] as const;

/**
 * Every URL carries hreflang alternates so ar-EG and en are understood as the
 * same page in two languages rather than as duplicates competing with each
 * other. x-default points at Arabic: it is the primary language and the
 * primary audience.
 */
function alternates(path: string) {
  return {
    languages: {
      "ar-EG": `${BASE}/ar${path}`,
      en: `${BASE}/en${path}`,
      "x-default": `${BASE}/ar${path}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1.0, freq: "weekly" },
    { path: "/properties", priority: 0.9, freq: "daily" },
    { path: "/areas/hadayek-october", priority: 0.9, freq: "monthly" },
    { path: "/sold", priority: 0.8, freq: "weekly" },
    { path: "/gulf", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.7, freq: "monthly" },
  ];

  const pages: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const p of staticPaths) {
      pages.push({
        url: `${BASE}/${locale}${p.path}`,
        changeFrequency: p.freq,
        priority: p.priority,
        alternates: alternates(p.path),
      });
    }
    for (const u of UNITS) {
      const path = `/properties/${u.code.toLowerCase()}`;
      pages.push({
        url: `${BASE}/${locale}${path}`,
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: alternates(path),
      });
    }
  }

  return pages;
}
