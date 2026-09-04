/**
 * The motion system: two curves, three durations, one stagger.
 *
 * Nothing in the codebase declares its own easing or duration. This is the
 * single reason a site reads as designed rather than assembled, and it is
 * the part the client can hold a future contractor to.
 *
 * These mirror the custom properties in globals.css exactly. Import from
 * here for anything JS-driven (the entrance timeline, the card→hero morph);
 * use the CSS variables for anything declarative.
 */

export const EASE = {
  /** «الوصول» — anything entering. */
  arrival: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** «الاستقرار» — anything landing. */
  settle: "cubic-bezier(0.33, 1, 0.68, 1)",
  /** Camera travel only. A dolly at constant speed reads as a real camera. */
  travel: "linear",
} as const;

export const DUR = {
  micro: 200,
  element: 400,
  section: 800,
} as const;

export const STAGGER = 60;

/** Micro-parallax ratios. Anything more visible than this reads as a plugin. */
export const PARALLAX = { foreground: 1.0, mid: 0.94, background: 0.88 } as const;

/* -------------------------------------------------------------------------
   The entrance — one continuous take, 4.04s, silent.

   This replaced a four-still cross-dissolve sequence. A real camera move
   through the gate says the thing the stills were only implying, and it
   says it in one shot, so there are no joins left to get wrong.

   ENTRANCE_MS is the clip's true length (97 frames at 24fps). It is the
   source of truth for anything timed against the shot — the wordmark flight
   in Entrance.module.css is expressed as percentages of it, so the two can
   never drift apart.

   The track is muxed without an audio stream, not merely muted: a hero that
   can make noise is a hero that will eventually make noise on someone's
   phone in a meeting.
   ------------------------------------------------------------------------- */

export const ENTRANCE_MS = 4040;

export const ENTRANCE_VIDEO = {
  /** VP9 first — roughly half the bytes of the H.264 at the same quality. */
  webm: "/video/entrance.webm",
  /** H.264 baseline of last resort; every browser that exists plays it. */
  mp4: "/video/entrance.mp4",
  /** Frame 0. The <video> poster, so the take never opens on black. */
  poster: "/img/entrance-poster.webp",
  /**
   * Frame 96 — the last one. This is the settled hero: it is what a crawler,
   * a reduced-motion visitor, a save-data visitor and a deep link all get,
   * and it is the LCP element in every one of those cases. Because it is cut
   * from the clip itself rather than art-directed separately, the moment the
   * take ends there is nothing to cross-fade to.
   */
  still: "/img/entrance-still.webp",
  width: 864,
  height: 496,
} as const;

/**
 * Every condition under which the entrance must NOT run.
 *
 * Evaluated before any asset is requested, so the worst-case user gets the
 * best-case performance. The path check is the one people forget and the one
 * that matters most here: Egyptian property leads arrive as WhatsApp links to
 * a specific unit, and someone sent a 2.8M EGP duplex does not want a
 * four-second gate before they can see it.
 *
 * Note there is no "already seen it" condition. The take replays on every
 * full page load of the homepage — a refresh that showed a motionless hero
 * read as a frozen page.
 */
export function shouldSkipEntrance(pathname: string): boolean {
  if (typeof window === "undefined") return false;

  const homepages = ["/", "/ar", "/en"];
  if (!homepages.includes(pathname)) return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData === true) return true;
  if (conn?.effectiveType && ["slow-2g", "2g"].includes(conn.effectiveType))
    return true;

  return false;
}


