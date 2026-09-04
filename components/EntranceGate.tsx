/**
 * The entrance decision, made BEFORE first paint.
 *
 * Why this exists: if the decision is made in a `useEffect`, the server
 * renders the settled state (the courtyard the camera ends on), then
 * hydration restarts the take at the closed gate — so the visitor sees the
 * ending, a jump backwards, and then the ending again. It spoils the reveal
 * and it is a layout-stability problem.
 *
 * So it is resolved the same way a theme flash is: a tiny synchronous script
 * in <head> stamps `data-entrance` on <html>, and CSS keys off that. No
 * flash, no hydration mismatch, and React never owns the initial state.
 *
 * ON REPLAY: the take runs on every full page load of the homepage.
 * There is deliberately no once-per-session gate — a refresh that showed a
 * motionless hero read as a frozen page rather than as restraint. Because
 * this script only runs on a real document load, client-side navigation back
 * to the homepage does NOT replay it; only a refresh or a fresh visit does.
 *
 * The default with no JavaScript at all is `skip` — a crawler, a reader with
 * scripting off, and a locked-down browser all get the finished hero and the
 * complete page. The animation is the enhancement, never the gate.
 */

const SCRIPT = `
(function () {
  var d = document.documentElement;
  function decide() {
    try {
      // Deep links skip: Egyptian property leads arrive as WhatsApp links to
      // a specific unit, and someone sent a 2.8M EGP duplex does not want a
      // four-second gate before they can see it.
      var p = location.pathname;
      if (p !== "/" && p !== "/ar" && p !== "/en") return "skip";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "skip";
      // A tab opened in the background — middle-click, "open in new tab",
      // a restored session — runs the CSS timeline on wall-clock time while
      // the browser holds the <video> at frame 0. The visitor then switches
      // to a settled header and H1 sitting on top of a frozen closed gate.
      // There are two clocks and only one of them is paused, so the honest
      // answer is not to start: give a tab nobody is looking at the settled
      // hero, the same as a crawler gets.
      if (document.visibilityState === "hidden") return "skip";
      var c = navigator.connection;
      if (c) {
        // saveData is an explicit request from the user; always honour it.
        if (c.saveData === true) return "skip";
        // effectiveType only blocks genuinely slow links. It is a rounded
        // estimate that reports "3g" on plenty of usable connections, and a
        // 0.5 MB clip is not what makes a 3g page slow — so blocking 3g cost
        // real users the take for very little bandwidth saved.
        if (["slow-2g", "2g"].indexOf(c.effectiveType) !== -1) return "skip";
      }
      return "play";
    } catch (e) {
      return "skip";
    }
  }
  var decision = decide();
  d.setAttribute("data-entrance", decision);

  // On a play decision only, warm the poster — the take's first frame, and
  // the one asset the playing state needs before the clip itself arrives.
  // This still runs inside <head> before the body paints, so the CSS fade-up
  // lands on the gate rather than on an empty box. A visitor who skips makes
  // neither this request nor any other entrance request at all.
  if (decision === "play") {
    try {
      var l = document.createElement("link");
      l.rel = "preload";
      l.as = "image";
      l.type = "image/webp";
      l.href = "/img/entrance-poster.webp";
      document.head.appendChild(l);
    } catch (e) {}
  }
})();
`;

export default function EntranceGate() {
  return (
    <script
      // Runs before the body paints, so the first frame is already correct.
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  );
}
