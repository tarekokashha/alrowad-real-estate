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

   The clip is a single 4.04s take at 24fps: it starts outside a closed gate
   at night, the gate opens, the camera passes between the piers and comes to
   rest on the palm-lined water channel inside. No cuts. That is why it can be
   scrubbed — a cut would tear under a slow drag.

   It is played as a FRAME SEQUENCE on a canvas, not as <video>.
   Setting video.currentTime from a scroll handler stutters badly: h264 has to
   seek to the nearest keyframe and decode forward, which cannot keep up with
   a finger, and iOS Safari is worse still. Ninety-seven decoded WebP frames
   scrub exactly, and at 2.7 MB the whole sequence is smaller than the source
   mp4 was.
   ------------------------------------------------------------------------- */

/** Frames exported from the source clip, 1-indexed: /entrance/f_001.webp … */
export const ENTRANCE_FRAMES = 97;

export const framePath = (i: number) =>
  `/entrance/f_${String(i).padStart(3, "0")}.webp`;

/**
 * How far the hero is scrolled through, as a multiple of the viewport.
 *
 * The first 100vh is the hero at rest; the remainder is the travel. Desktop
 * gets 240vh of travel across 97 frames — about 22px of scroll per frame on a
 * 900px viewport, which is roughly two unhurried wheel flicks. Less than this
 * and the dolly snaps past; more and it turns into work.
 */
export const ENTRANCE_SCROLL_VH = { desktop: 340, mobile: 260 } as const;

/**
 * Where the overlaid copy moves, in scroll progress rather than milliseconds.
 * Scroll-driven motion has no clock — the reader sets the pace — so every
 * timing here is a fraction of the journey, not a duration.
 */
export const ENTRANCE_CUES = {
  /** The centred wordmark fades as the gate starts to open. */
  wordmarkOut: [0.04, 0.26],
  /** The H1 and its aside rise once the camera is through the piers. */
  contentIn: [0.30, 0.52],
  /** The scroll hint disappears as soon as the reader has taken the hint. */
  cueOut: [0.02, 0.12],
} as const;

/**
 * Halve the payload where it is most expensive.
 *
 * Every second frame still reads as continuous under a thumb, and it takes
 * the sequence from 2.7 MB to about 1.4 MB — which on Egyptian mobile data is
 * the difference between an entrance and an apology.
 */
export const MOBILE_FRAME_STEP = 2;

/** The session key. Version-stamped so a redesign can re-show the entrance. */

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


