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
   The entrance sequence — 4.5s, four stills, one continuous camera move.
   Timings are the source of truth; the CSS keyframes are generated from
   these percentages so the two can never drift apart.
   ------------------------------------------------------------------------- */

export const ENTRANCE_MS = 4500;

export type EntranceShot = {
  key: string;
  /** Arabic name of the movement. */
  name: string;
  src: string;
  alt: string;
  start: number;
  end: number;
};

export const ENTRANCE_SHOTS: EntranceShot[] = [
  {
    key: "arcade",
    name: "الوصول",
    src: "/img/arcade-night.webp",
    alt: "ممر مقنطر مضاء ليلًا داخل كمبوند سكني بحدائق أكتوبر",
    start: 0,
    end: 1200,
  },
  {
    key: "gate",
    name: "العبور",
    src: "/img/gate-night.webp",
    alt: "بوابة كمبوند سكني من الحجر الجيري مضاءة ليلًا",
    start: 1200,
    end: 2200,
  },
  {
    key: "aerial",
    name: "الصعود",
    src: "/img/aerial-sunset.webp",
    alt: "منظر جوي مرتفع فوق فناء الكمبوند وقت الزرقة، وأضواء المدينة في الأفق",
    start: 2200,
    end: 3200,
  },
  {
    key: "courtyard",
    name: "الانكشاف",
    src: "/img/courtyard-dusk.webp",
    alt: "منظر جوي واسع لحدائق أكتوبر وقت الذهبي — مبانٍ من الحجر الجيري وشوارع مشجّرة وهضبة الصحراء في الأفق",
    start: 3200,
    end: 4500,
  },
];

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


