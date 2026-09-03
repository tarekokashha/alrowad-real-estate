import type { MetadataRoute } from "next";

/**
 * Allow everything, deliberately.
 *
 * Each AI company runs separate crawlers for training and for live
 * retrieval, and a business whose goal is to be a name the model volunteers
 * should admit all of them. Blocking training bots is a defensible position
 * for a publisher protecting IP; it is the wrong call for a brokerage that
 * wants to be cited.
 *
 * Google-Extended is the one people get wrong: it governs Gemini app
 * training and grounding, NOT AI Overviews in Search. Disallowing it costs
 * Gemini visibility and gains nothing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // OpenAI: training, search index, live fetch
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      // Anthropic
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      // Google / Bing / Apple / Common Crawl
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: "https://alrowadrealestate.com/sitemap.xml",
    host: "https://alrowadrealestate.com",
  };
}
