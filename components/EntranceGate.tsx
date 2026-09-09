/**
 * The entrance decision, made BEFORE first paint.
 *
 * Why this exists: if the decision is made in a `useEffect`, the server
 * renders the settled state (the golden reveal), then hydration restarts the
 * sequence at the night corridor — so the visitor sees the ending, a jump
 * backwards, and then the ending again. It spoils the reveal and it is a
 * layout-stability problem.
 *
 * So it is resolved the same way a theme flash is: a tiny synchronous script
 * in <head> stamps `data-entrance` on <html>, and CSS keys off that. No
 * flash, no hydration mismatch, and React never owns the initial state.
 *
 * ON REPLAY: the sequence runs on every full page load of the homepage.
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
      // 4.5-second gate before they can see it.
      var p = location.pathname;
      if (p !== "/" && p !== "/ar") return "skip";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "skip";
      var c = navigator.connection;
      if (c) {
        // saveData is an explicit request from the user; always honour it.
        if (c.saveData === true) return "skip";
        // 3g is deliberately NOT in this list, even though the entrance now
        // costs real bytes. effectiveType is a rounded estimate and reports
        // "3g" on plenty of usable links — this very machine reports it while
        // serving from localhost. Gating on it would deny the entrance to
        // people whose connection is fine.
        //
        // The bandwidth is handled where it can be measured instead: the
        // component loads half the frames on a slow link, and draws the
        // nearest frame it actually has, so a genuinely slow connection
        // degrades to a coarser scrub rather than a blank screen.
        if (["slow-2g", "2g"].indexOf(c.effectiveType) !== -1) return "skip";
      }
      // There is deliberately no visibilityState check. A background tab
      // needed one while the entrance ran on a timer — the CSS timeline kept
      // running against a video the browser had paused, so the two clocks
      // drifted apart and the reader arrived at a settled header sitting on a
      // frozen first frame. Scroll has no clock: a tab nobody is looking at
      // is a tab nobody is scrolling, and it simply waits at frame one.
      return "play";
    } catch (e) {
      return "skip";
    }
  }
  d.setAttribute("data-entrance", decide());
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
