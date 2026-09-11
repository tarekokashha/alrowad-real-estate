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
   The entrance — one continuous dolly through the gate, driven by scroll.

   A single 5.04s take at 24fps, 121 frames: outside a closed gate at night,
   the gate opens, the camera passes between the piers and comes to rest on
   the palm-lined water channel inside. No cuts — which is what makes it
   scrubbable, because a cut would tear under a slow drag.

   Played as a FRAME SEQUENCE on a canvas, not as <video>. Setting
   video.currentTime from a scroll handler stutters: h264 seeks to a keyframe
   and decodes forward, which cannot keep up with a finger, and iOS Safari is
   worse still. Decoded WebP frames scrub exactly.

   The source carried a generative-tool watermark in the bottom-right. It is
   painted out at export with ffmpeg's delogo, which interpolates from the
   surrounding pixels — clean here because that corner is the fast-moving,
   motion-blurred foreground of a dolly, which is the easy case.
   ------------------------------------------------------------------------- */

/**
 * Two tiers, because one does not fit both.
 *
 * hd is 1440px wide, every frame — a 1:1 match for a desktop hero, and the
 * reason the clip was re-shot at 1080p. sd is 960px and every second frame:
 * a quarter of the bytes, which on Egyptian mobile data is the difference
 * between an entrance and an apology.
 */
export const ENTRANCE_TIERS = {
  hd: { dir: "hd", frames: 121 },
  sd: { dir: "sd", frames: 61 },
} as const;

export type EntranceTier = keyof typeof ENTRANCE_TIERS;

export const framePath = (tier: EntranceTier, i: number) =>
  `/entrance/${ENTRANCE_TIERS[tier].dir}/f_${String(i).padStart(3, "0")}.webp`;

/**
 * How far the hero is scrolled through, as a multiple of the viewport.
 *
 * The first 100vh is the hero at rest; the remainder is the travel. 500vh
 * gives 400vh of travel across 121 frames — about 30px of scroll per frame on
 * a 900px viewport, so the dolly moves at roughly walking pace under an
 * unhurried wheel. Long on purpose: the whole point of scrubbing is that the
 * reader can dwell in it, and the earlier 340vh went past too briskly.
 */
export const ENTRANCE_SCROLL_VH = { desktop: 500, mobile: 340 } as const;

/**
 * Where the overlaid copy moves, in scroll progress rather than milliseconds.
 * Scroll-driven motion has no clock — the reader sets the pace — so every
 * timing here is a fraction of the journey, not a duration.
 */
export const ENTRANCE_CUES = {
  /** The centred wordmark fades as the gate starts to open. */
  wordmarkOut: [0.04, 0.24],
  /** The H1 and its aside rise once the camera is through the piers. */
  contentIn: [0.34, 0.56],
  /** The scroll hint goes as soon as the reader has taken the hint. */
  cueOut: [0.015, 0.1],
} as const;

/**
 * Every condition under which the entrance must NOT run.
 *
 * Evaluated before any asset is requested, so the worst-case user gets the
 * best-case performance. The path check is the one people forget and the one
 * that matters most here: Egyptian property leads arrive as WhatsApp links to
 * a specific unit, and someone sent a 2.8M EGP duplex does not want a
 * 4.5-second gate before they can see it.
 *
 * Note there is no "already seen it" condition. The sequence replays on every
 * full page load of the homepage — a refresh that showed a motionless hero
 * read as a frozen page.
 */
export function shouldSkipEntrance(pathname: string): boolean {
  if (typeof window === "undefined") return false;

  const homepages = ["/", "/ar"];
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


