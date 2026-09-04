import type { MetadataRoute } from "next";
import { UNITS } from "@/lib/units";

const BASE = "https://alrowadrealestate.com";

/**
 * One language, so no hreflang alternates. They were here when the site
 * advertised an English locale; listing alternates for a language that no
 * longer exists points Google at a redirect and invites it to keep the dead
 * /en URLs in the index. The Arabic URL is now simply the only URL.
 */

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

  for (const p of staticPaths) {
    pages.push({
      url: `${BASE}/ar${p.path}`,
      changeFrequency: p.freq,
      priority: p.priority,
    });
  }
  for (const u of UNITS) {
    pages.push({
      url: `${BASE}/ar/properties/${u.code.toLowerCase()}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return pages;
}
