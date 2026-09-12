"use client";

import { useEffect } from "react";

/**
 * One observer for the whole page.
 *
 * Anything, anywhere, can opt into a scroll arrival by carrying
 * `data-reveal="rise|image|line|wipe"` — including server components, which
 * is most of this site. That is the reason this is a single mounted observer
 * rather than a wrapper component: a wrapper would force a client boundary
 * around every section it touched, and the whole point of this codebase is
 * that the markup arrives from the server complete.
 *
 * THE RULE, same as the entrance: additive, never gating. The stylesheet only
 * has a hidden state under [data-motion="on"], which the pre-paint script in
 * <EntranceGate> sets when JavaScript is running and the reader has not asked
 * for reduced motion. If this component never mounts, nothing is hidden.
 *
 * IntersectionObserver, not a scroll handler: the browser does the work off
 * the main thread, so fifty arrivals cost nothing per frame. The entrance
 * canvas is the one thing that genuinely needs every frame, and it is the
 * only thing that gets one.
 *
 * Each element fires once. Re-hiding on the way back up is a party trick that
 * makes a long page feel like it is fighting the reader.
 */
export default function ScrollMotion() {
  useEffect(() => {
    if (document.documentElement.getAttribute("data-motion") !== "on") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      {
        // Start slightly before the fold so an arrival is finishing as the
        // element is reached, rather than starting once it is being read.
        // -18%: the arrival starts once the element is properly into the
        // viewport rather than the instant its top edge appears, so the
        // reader actually watches it happen instead of finding it already
        // finished.
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.05,
      },
    );

    const scan = () => {
      document
        .querySelectorAll("[data-reveal]:not([data-shown])")
        .forEach((el) => {
          // Anything already above the fold has been passed, not approached —
          // an anchor link, a restored scroll position, a back navigation.
          // Without this it would never intersect, never be marked, and stay
          // hidden for the rest of the session: content permanently invisible
          // because of a decoration. Mark it shown and skip the animation.
          if (el.getBoundingClientRect().bottom < 0) {
            el.setAttribute("data-shown", "");
            return;
          }
          io.observe(el);
        });
    };

    /**
     * The safety net, and the reason this component is not just an observer.
     *
     * IntersectionObserver samples; it does not track. Scroll fast enough —
     * a flick on a phone, Page Down, dragging the scrollbar — and an element
     * can enter and leave between two samples without ever being reported.
     * It then keeps its hidden state for the rest of the session. Measured on
     * this page: walking it in 630px steps left twelve of nineteen blocks
     * permanently invisible.
     *
     * Content disappearing because of a decoration is the worst failure this
     * file could have, so it does not rely on the observer alone. On every
     * frame where the reader has scrolled, anything still hidden that is now
     * above the fold is simply marked shown. It has been passed; there is no
     * arrival left to play.
     */
    let rafId = 0;
    const sweep = () => {
      rafId = 0;
      const left = document.querySelectorAll("[data-reveal]:not([data-shown])");
      left.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) {
          el.setAttribute("data-shown", "");
          io.unobserve(el);
        }
      });
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(sweep);
    };

    scan();

    // Client-side navigation and anything rendered after mount — the
    // catalogue re-renders its grid on every filter change — bring their own
    // un-observed elements with them.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
