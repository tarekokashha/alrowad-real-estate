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
 * The default with no JavaScript at all is `skip` — a crawler, a reader with
 * scripting off, and a locked-down browser all get the finished hero and the
 * complete page. The animation is the enhancement, never the gate.
 */

const SCRIPT = `
(function () {
  var d = document.documentElement;
  function decide() {
    try {
      var p = location.pathname;
      if (p !== "/" && p !== "/ar" && p !== "/en") return "skip";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "skip";
      var c = navigator.connection;
      if (c) {
        if (c.saveData === true) return "skip";
        if (["slow-2g", "2g", "3g"].indexOf(c.effectiveType) !== -1) return "skip";
      }
      if (sessionStorage.getItem("elrowad.intro.v1") === "1") return "skip";
      sessionStorage.setItem("elrowad.intro.v1", "1");
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
