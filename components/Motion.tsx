"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * One motion owner for the whole site.
 *
 * Anything, anywhere, opts into scroll motion by carrying `data-anim="…"` —
 * including server components, which is most of this codebase. That is the
 * reason this is a single mounted component rather than a wrapper: a wrapper
 * would force a client boundary around every section it touched, and the
 * point of this site is that the markup arrives from the server complete.
 *
 * THE RULE: additive, never gating. No stylesheet anywhere parks content at
 * opacity 0 waiting to be released. Every starting state below is set by
 * `gsap.from()` at init, so if this bundle never arrives the page is simply
 * static and whole. That property is what makes the site readable without
 * JavaScript, indexable, and quotable by an answer engine — and
 * scripts/verify-design.mjs fails the build if a rule ever breaks it.
 *
 * Two kinds of motion live here, and the distinction is the whole design:
 *
 *   ARRIVAL — happens once, when the element is reached. `once: true`.
 *   SCRUB   — a continuous function of scroll position, forwards and back.
 *
 * The previous system could only do arrivals, which is why it was replaced;
 * six of the twelve sections on the new homepage are scrub-driven.
 */

let registered = false;

/** Eastern Arabic numerals. Inlined rather than imported from lib/format so
 *  this bundle does not pull a React component tree in behind it. */
const eastern = (n: number) =>
  String(Math.round(n)).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);

const ARRIVAL = "power3.out";

export default function Motion() {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const mm = gsap.matchMedia();

    // Everything is inside this one condition. Under `reduce` no Lenis is
    // constructed and no trigger is created — the page is an ordinary
    // document, which is what the preference asks for. Not "less motion":
    // none.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rtl = document.documentElement.dir === "rtl";

      const lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        // One requestAnimationFrame loop for the page. Lenis driven from
        // GSAP's ticker rather than its own means scroll position and
        // animation are computed in the same frame, in that order — drive
        // them separately and the scrubbed elements trail the scroll by a
        // frame, which reads as lag on exactly the effects meant to feel
        // attached to the finger.
        autoRaf: false,
        // The footer links to #index and the skip-link to #main. Left to the
        // browser those jump natively, Lenis snaps back from wherever it
        // thought it was, and the reader ends up somewhere neither of them
        // intended.
        anchors: true,
      });

      const tick = (time: number) => {
        lenis.raf(time * 1000);
        // Updated every frame rather than only from Lenis's own scroll
        // event, and this is not belt and braces — it is a bug fix.
        //
        // Lenis genuinely moves the window, so any scroll it did not
        // initiate leaves its listeners silent: an anchor link, the
        // skip-link, browser scroll restoration on a back navigation, a
        // find-in-page hit, a screen reader moving focus. With the update
        // hanging off Lenis's event alone, every one of those left the
        // triggers unevaluated — measured here as sixteen blocks still at
        // opacity 0 after a jump to the bottom of the page, which is
        // content made invisible by a decoration.
        //
        // ScrollTrigger.update is built to be called per frame and returns
        // immediately when the position has not moved, so the cost of being
        // right about this is nil.
        ScrollTrigger.update();
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Dev-only handle so the verification pass can interrogate the real
      // trigger state instead of inferring it from what the page looks like.
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
        (window as unknown as Record<string, unknown>).__lenis = lenis;
      }

      const arrival = (trigger: Element) =>
        ({ trigger, start: "top 82%", once: true }) as const;

      const scrubbed = (trigger: Element, start = "top bottom", end = "bottom top") =>
        ({ trigger, start, end, scrub: 0.6 }) as const;

      const wire = (el: HTMLElement) => {
        el.dataset.animReady = "";
        const kind = el.dataset.anim;
        const delay = Number(el.dataset.delay || 0) * 0.06;
        const staggered = el.hasAttribute("data-stagger");
        const kids = Array.from(el.children) as HTMLElement[];

        switch (kind) {
          /* ---- arrivals ------------------------------------------------ */

          case "rise":
            gsap.from(staggered ? kids : el, {
              y: staggered ? 38 : 48,
              opacity: 0,
              duration: 0.8,
              ease: ARRIVAL,
              delay,
              // Capped at eight: past that the last child waits half a
              // second and the effect reads as lag rather than rhythm.
              stagger: staggered ? { each: 0.06, amount: Math.min(kids.length, 8) * 0.06 } : 0,
              scrollTrigger: arrival(el),
            });
            break;

          case "fade":
            gsap.from(el, {
              opacity: 0,
              duration: 0.8,
              ease: ARRIVAL,
              delay,
              scrollTrigger: arrival(el),
            });
            break;

          case "wipe":
            gsap.from(el, {
              scaleX: 0,
              transformOrigin: rtl ? "right center" : "left center",
              duration: 0.8,
              ease: ARRIVAL,
              delay,
              scrollTrigger: arrival(el),
            });
            break;

          // A heading arrives from behind its own baseline. Each line needs
          // its own overflow-hidden wrapper in the markup; the stylesheet
          // does that for `.line`.
          case "lines":
            gsap.from(el.querySelectorAll<HTMLElement>(".line > *"), {
              yPercent: 105,
              duration: 0.9,
              ease: ARRIVAL,
              stagger: 0.06,
              delay,
              scrollTrigger: arrival(el),
            });
            break;

          // A photograph is not faded in, it is uncovered: the clip opens
          // from the inline-start edge while the picture inside eases down
          // out of a slight over-scale, so it settles rather than slides.
          case "img": {
            const inner = el.querySelector<HTMLElement>("img, picture, figure, canvas, video");
            const closed = rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
            const tl = gsap.timeline({ scrollTrigger: arrival(el), delay });
            tl.from(el, { clipPath: closed, duration: 0.9, ease: ARRIVAL }, 0);
            if (inner) tl.from(inner, { scale: 1.14, duration: 1.1, ease: ARRIVAL }, 0);
            break;
          }

          case "counter": {
            const to = Number(el.dataset.to || 0);
            const box = { v: 0 };
            gsap.to(box, {
              v: to,
              duration: 1.4,
              ease: "power2.out",
              delay,
              scrollTrigger: arrival(el),
              onUpdate: () => {
                el.textContent = eastern(box.v);
              },
              // If the tween is ever interrupted mid-count the element must
              // still end on the true figure. On this site a number that
              // stops one short of the truth is the worst possible bug.
              onComplete: () => {
                el.textContent = eastern(to);
              },
            });
            break;
          }

          /* ---- scrubs -------------------------------------------------- */

          // Each child fills with colour in turn as the block is passed.
          // CSS paints from --f; this only moves the number. --f defaults to
          // 1 in the stylesheet, so with no JavaScript the list is solid and
          // legible rather than a row of empty outlines.
          case "fill":
            kids.forEach((kid, i) => {
              gsap.fromTo(
                kid,
                { "--f": 0 },
                {
                  "--f": 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: el,
                    start: `top ${70 - i * 4}%`,
                    end: `+=${260}`,
                    scrub: 0.6,
                  },
                },
              );
            });
            break;

          case "parallax": {
            const inner = el.querySelector<HTMLElement>("img, picture, figure, video") || el;
            const depth = Number(el.dataset.depth || 0.12);
            gsap.fromTo(
              inner,
              { yPercent: -depth * 50 },
              { yPercent: depth * 50, ease: "none", scrollTrigger: scrubbed(el) },
            );
            break;
          }

          case "grow":
            gsap.fromTo(
              el,
              { scale: Number(el.dataset.from || 0.86) },
              {
                scale: Number(el.dataset.to || 1),
                ease: "none",
                scrollTrigger: scrubbed(el, "top bottom", "center center"),
              },
            );
            break;

          // The amber flood between the dark hero and the first light
          // section: in over the first half of its own height, out over the
          // second.
          case "wash": {
            const tl = gsap.timeline({ scrollTrigger: scrubbed(el) });
            tl.fromTo(el, { opacity: 0 }, { opacity: 1, ease: "none" })
              .to(el, { opacity: 0, ease: "none" });
            break;
          }

          // The hero. Named rather than generic because it is one element on
          // one page driving four different properties at once, and spelling
          // that out beats inventing an attribute language for a single use.
          case "hero": {
            const img = el.querySelector<HTMLElement>("[data-hero-img]");
            const veil = el.querySelector<HTMLElement>("[data-hero-veil]");
            const copy = el.querySelector<HTMLElement>("[data-hero-copy]");
            const tl = gsap.timeline({
              scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
            });
            if (img) tl.to(img, { scale: 1.18, filter: "blur(8px)", ease: "none" }, 0);
            if (veil) tl.to(veil, { opacity: 0.92, ease: "none" }, 0);
            if (copy) tl.to(copy, { y: -80, opacity: 0, ease: "none" }, 0);
            break;
          }
        }
      };

      const scan = () => {
        const fresh = document.querySelectorAll<HTMLElement>(
          "[data-anim]:not([data-anim-ready])",
        );
        fresh.forEach(wire);
        return fresh.length;
      };

      scan();

      // The catalogue rebuilds its grid on every filter change, and those
      // cards arrive with no triggers attached. The previous system lost
      // exactly this case — filtered-in cards stayed invisible for the rest
      // of the session — so the re-scan is not optional.
      let pending = 0;
      const mo = new MutationObserver(() => {
        if (pending) return;
        pending = requestAnimationFrame(() => {
          pending = 0;
          // Refresh ONLY when something new was actually wired.
          //
          // Refreshing on every mutation looks harmless and is not: a
          // refresh part-way through a scrub re-anchors the trigger without
          // re-rendering the timeline, so the playhead stops where it was
          // while the trigger reports its true progress. In development the
          // observer fires constantly, and the symptom was the hero frozen
          // at 56% of its timeline — blurred, veiled, headline at 0.44
          // opacity — at the top of the page, on first paint. The trigger
          // said progress 0 the whole time, which is why it had to be
          // measured rather than reasoned about.
          if (scan() > 0) ScrollTrigger.refresh();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });

      // Images settle after first paint and move every trigger's boundaries
      // with them.
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        mo.disconnect();
        if (pending) cancelAnimationFrame(pending);
        window.removeEventListener("load", onLoad);
        gsap.ticker.remove(tick);
        lenis.destroy();
        document
          .querySelectorAll<HTMLElement>("[data-anim-ready]")
          .forEach((el) => delete el.dataset.animReady);
      };
    });

    // Reverts every tween and every inline style either branch set, so a
    // reader who turns reduced motion on mid-session lands on a clean page
    // rather than on whatever half-state the tweens were in.
    return () => mm.revert();
  }, []);

  return null;
}
