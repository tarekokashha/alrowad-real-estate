import s from "./Loader.module.css";

/**
 * The screen shown while the very first page load settles.
 *
 * Server-rendered markup plus one inline script — not a client component.
 * A client component would not paint until React hydrates, which is well
 * after the browser's first paint; this has to be visible from that first
 * paint or it does not do its job. The inline script runs the moment the
 * parser reaches it, before anything below it on the page.
 *
 * No wordmark, by request. A track and a count — which suits a site whose
 * whole argument is that its numbers can be checked, even the number on its
 * own loading screen.
 *
 * THE RULE: additive, never gating. `.loader` is `opacity: 0` in the
 * stylesheet. With no JavaScript the inline script below never runs, so this
 * div sits at opacity 0 forever, `pointer-events: none`, `aria-hidden`,
 * containing no text a screen reader would announce and no fact a crawler
 * would want — which is to say a reader with the bundle blocked never knows
 * it exists, and the real page is never covered for them, only for a JS
 * browser deciding what to load.
 *
 * Bounded twice over, so it can never get stuck: shown for at least
 * MIN_SHOW_MS regardless of how fast the page is, but removed at HARD_CAP_MS
 * no matter what — a slow font, a stalled image, a `load` event that never
 * fires cannot leave a reader staring at a screen with nothing under it.
 */
const MIN_SHOW_MS = 450;
const HARD_CAP_MS = 2200;

const SCRIPT = `
(function () {
  var el = document.getElementById("site-loader");
  if (!el) return;
  var fill = el.querySelector("[data-loader-fill]");
  var pct = el.querySelector("[data-loader-pct]");
  var eastern = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  function toEastern(n) {
    return String(n).replace(/[0-9]/g, function (d) { return eastern[+d]; });
  }

  // Visible on the very next frame, not this one: a style written in the
  // same tick it is read can be collapsed by the browser and never paint at
  // all, which is the one failure mode that would make this component do
  // the opposite of its job.
  requestAnimationFrame(function () {
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
  });

  var start = Date.now();
  var shown = 0; // 0–100, eased toward 90 while the real page loads
  var raf = null;
  var done = false;

  // A per-frame transform write is animation whether or not a CSS
  // transition is involved, so the global reduced-motion rule — which only
  // clamps transitions and CSS animations — cannot catch it. Checked here
  // instead: a reduced-motion reader gets a still track and a still number
  // until the page is actually ready, then a single instant change to
  // finished, never a count.
  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paint() {
    shown += (90 - shown) * 0.06;
    if (fill) fill.style.transform = "scaleX(" + (shown / 100).toFixed(3) + ")";
    if (pct) pct.textContent = toEastern(Math.round(shown)) + "٪";
    raf = requestAnimationFrame(paint);
  }
  if (!reduced) paint();

  function finish() {
    if (done) return;
    done = true;
    if (raf) cancelAnimationFrame(raf);
    var wait = Math.max(0, ${MIN_SHOW_MS} - (Date.now() - start));
    setTimeout(function () {
      if (fill) fill.style.transform = "scaleX(1)";
      if (pct) pct.textContent = "١٠٠٪";
      setTimeout(function () {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        setTimeout(function () { el.remove(); }, 520);
      }, 140);
    }, wait);
  }

  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish, { once: true });
  setTimeout(finish, ${HARD_CAP_MS});
})();
`;

export default function Loader() {
  return (
    <>
      {/* suppressHydrationWarning on the three nodes the inline script
          mutates. Without it React's hydration pass finds this subtree does
          not match what it would have rendered — because the script has
          already run natively, well before React ever loads — decides the
          tree is wrong, and replaces it wholesale with a fresh, unrevealed
          copy carrying a brand-new <script> that (per React's own rule for
          scripts inserted by a client-side render) never executes. The
          practical effect without this: the overlay can be silently reset
          to hidden-and-permanently-stuck right as the real page becomes
          interactive. suppressHydrationWarning tells React to trust the
          live DOM for exactly these three nodes and leave them alone. */}
      <div
        id="site-loader"
        className={s.loader}
        aria-hidden="true"
        suppressHydrationWarning
      >
        <div className={s.stage}>
          <div className={s.track}>
            <div className={s.fill} data-loader-fill suppressHydrationWarning />
          </div>
          <span className={`mono ${s.pct}`} data-loader-pct suppressHydrationWarning>
            ٠٪
          </span>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}
