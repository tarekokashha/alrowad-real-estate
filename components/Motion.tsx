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
 * static and whole.
 *
 * Two kinds of motion live here:
 *
 *   ARRIVAL — happens once, when the element is reached. `once: true`.
 *   SCRUB   — a continuous function of scroll position, forwards and back.
 *
 * Plus three page-wide behaviours that are not tied to any one element:
 * the header's hide-on-scroll-down / blur-past-40px, the top progress bar,
 * and the custom cursor (fine pointers only). These live in the same
 * per-frame tick as everything else, one rAF for the whole page.
 *
 * Individual scroll-driven *scenes* on the landing page (the hero fly-
 * through, the pinned units stage, the compounds ring, …) are bespoke and
 * live in their own client components under components/landing/ — this file
 * is the generic engine every page shares, not those one-off set pieces.
 */

let registered = false;

const ARRIVAL = "expo.out";

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
    // none. (The header still gets its scrolled-state background — see the
    // plain `@media (prefers-reduced-motion: reduce)` rule in Header's CSS,
    // which is a contrast fallback, not motion.)
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rtl = document.documentElement.dir === "rtl";

      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        autoRaf: false,
        anchors: true,
      });

      const tick = (time: number) => {
        lenis.raf(time * 1000);
        ScrollTrigger.update();
        globalTick();
      };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      if (process.env.NODE_ENV !== "production") {
        (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
        (window as unknown as Record<string, unknown>).__lenis = lenis;
      }

      const arrival = (trigger: Element) =>
        ({ trigger, start: "top 86%", once: true }) as const;

      const scrubbed = (trigger: Element, start = "top bottom", end = "bottom top") =>
        ({ trigger, start, end, scrub: 0.35 }) as const;

      const cleanups: (() => void)[] = [];

      /* ---- Page-wide: header hide/blur, progress bar, custom cursor ---- */

      const fine = matchMedia("(pointer: fine)").matches;
      let ring: HTMLDivElement | null = null;
      let dot: HTMLDivElement | null = null;
      let px = innerWidth / 2,
        py = innerHeight / 2,
        cx = px,
        cy = py,
        cs = 1,
        hov = false;

      if (fine) {
        ring = document.createElement("div");
        dot = document.createElement("div");
        ring.style.cssText =
          "position:fixed;top:0;left:0;width:38px;height:38px;border:1px solid #1B1A17;border-radius:50%;z-index:90;pointer-events:none;mix-blend-mode:difference;filter:invert(1);";
        dot.style.cssText =
          "position:fixed;top:0;left:0;width:5px;height:5px;background:#8A5A2E;border-radius:50%;z-index:91;pointer-events:none;";
        document.body.append(ring, dot);
        document.documentElement.classList.add("cur-on");
      }
      const onMove = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        hov = !!(e.target as HTMLElement).closest?.("a,button,[data-hover],[role=slider]");
      };
      addEventListener("pointermove", onMove, { passive: true });
      cleanups.push(() => removeEventListener("pointermove", onMove));

      let lastY = scrollY;
      let hidden = false;

      const globalTick = () => {
        const sy = scrollY;
        const vh = innerHeight;

        document.querySelectorAll<HTMLElement>("[data-hdr]").forEach((h) => {
          if (sy > 300 && sy > lastY + 3) hidden = true;
          if (sy < lastY - 3 || sy < 300) hidden = false;
          h.style.transform = hidden ? "translateY(-110%)" : "none";
          h.style.background = sy > 40 ? "rgba(244,241,234,.86)" : "rgba(244,241,234,0)";
          h.style.backdropFilter = sy > 40 ? "blur(14px)" : "none";
          h.style.borderBottomColor = sy > 40 ? "rgba(27,26,23,.08)" : "rgba(27,26,23,0)";
        });
        lastY = sy;

        const max = Math.max(1, document.documentElement.scrollHeight - vh);
        document.querySelectorAll<HTMLElement>("[data-progress]").forEach((b) => {
          b.style.transform = `scaleX(${Math.min(1, Math.max(0, sy / max))})`;
        });

        if (ring && dot) {
          cx += (px - cx) * 0.18;
          cy += (py - cy) * 0.18;
          cs += ((hov ? 1.85 : 1) - cs) * 0.15;
          ring.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%) scale(${cs})`;
          dot.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%)`;
        }
      };

      cleanups.push(() => {
        ring?.remove();
        dot?.remove();
        document.documentElement.classList.remove("cur-on");
      });

      /* ---- Per-element reveals & scrubs, via data-anim ------------------ */

      const wire = (el: HTMLElement) => {
        el.dataset.animReady = "";
        const kind = el.dataset.anim;
        const delay = Number(el.dataset.delay || 0) * 0.08;
        const staggered = el.hasAttribute("data-stagger");
        const kids = Array.from(el.children) as HTMLElement[];

        switch (kind) {
          /* ---- arrivals ------------------------------------------------ */

          case "rise":
            gsap.from(staggered ? kids : el, {
              y: staggered ? 34 : 46,
              opacity: 0,
              duration: 1.05,
              ease: ARRIVAL,
              delay,
              stagger: staggered ? { each: 0.08, amount: Math.min(kids.length, 8) * 0.08 } : 0,
              scrollTrigger: arrival(el),
            });
            break;

          case "fade":
            gsap.from(el, {
              opacity: 0,
              duration: 0.9,
              ease: ARRIVAL,
              delay,
              scrollTrigger: arrival(el),
            });
            break;

          // A proportion-bar segment, or any block that should wipe open
          // from its own trailing edge (RTL: the right).
          case "wipe":
            gsap.from(el, {
              scaleX: 0,
              transformOrigin: rtl ? "right center" : "left center",
              duration: 1.1,
              ease: ARRIVAL,
              delay,
              scrollTrigger: arrival(el),
            });
            break;

          // A heading arrives from behind its own baseline, line by line.
          // Each line needs its own overflow-hidden wrapper (`.line`).
          case "lines":
            gsap.from(el.querySelectorAll<HTMLElement>(".line > *"), {
              yPercent: 105,
              duration: 1.2,
              ease: ARRIVAL,
              stagger: 0.09,
              delay,
              scrollTrigger: arrival(el),
            });
            break;

          case "img": {
            const inner = el.querySelector<HTMLElement>("img, picture, figure, canvas, video");
            const closed = rtl ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
            const tl = gsap.timeline({ scrollTrigger: arrival(el), delay });
            tl.from(el, { clipPath: closed, duration: 0.9, ease: ARRIVAL }, 0);
            if (inner) tl.from(inner, { scale: 1.14, duration: 1.1, ease: ARRIVAL }, 0);
            break;
          }

          // 0 → target over 1.6–1.8s, ease-out-quart, Western digits with
          // thousands separators — the same format as every other figure on
          // the site (see lib/format's formatNumber).
          case "counter": {
            const to = Number(el.dataset.to || 0);
            const box = { v: 0 };
            gsap.to(box, {
              v: to,
              duration: 1.7,
              ease: "power3.out",
              delay,
              scrollTrigger: arrival(el),
              onUpdate: () => {
                el.textContent = Math.round(box.v).toLocaleString("en-US");
              },
              onComplete: () => {
                el.textContent = to.toLocaleString("en-US");
              },
            });
            break;
          }

          // A heading arrives a word at a time. Split at runtime so the
          // served HTML stays one clean run of text for a crawler, a screen
          // reader, and a reader copying the sentence.
          case "words": {
            if (!el.dataset.split) {
              const words = (el.textContent ?? "").split(/(\s+)/);
              el.textContent = "";
              for (const w of words) {
                if (/^\s+$/.test(w)) {
                  el.appendChild(document.createTextNode(w));
                  continue;
                }
                const mask = document.createElement("span");
                mask.className = "w-mask";
                const inner = document.createElement("span");
                inner.textContent = w;
                mask.appendChild(inner);
                el.appendChild(mask);
              }
              el.dataset.split = "";
            }
            gsap.from(el.querySelectorAll<HTMLElement>(".w-mask > span"), {
              yPercent: 116,
              duration: 1.1,
              ease: ARRIVAL,
              stagger: 0.05,
              delay,
              scrollTrigger: arrival(el),
            });
            break;
          }

          // A pointer-only tilt toward the cursor. Touch never gets it.
          case "tilt": {
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) break;
            const max = Number(el.dataset.tilt || 6);
            const rx = gsap.quickTo(el, "rotationX", { duration: 0.45, ease: "power3" });
            const ry = gsap.quickTo(el, "rotationY", { duration: 0.45, ease: "power3" });
            gsap.set(el, { transformPerspective: 900, transformOrigin: "center" });
            const move = (e: PointerEvent) => {
              const b = el.getBoundingClientRect();
              rx(-((e.clientY - b.top) / b.height - 0.5) * 2 * max);
              ry(((e.clientX - b.left) / b.width - 0.5) * 2 * max);
            };
            const leave = () => {
              rx(0);
              ry(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
            break;
          }

          // A magnetic CTA (landing only, opted in by markup): leans toward
          // the cursor, springs back on leave.
          case "magnet": {
            if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) break;
            const pull = Number(el.dataset.magnet || 0.3);
            const mx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
            const my = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
            const move = (e: PointerEvent) => {
              const b = el.getBoundingClientRect();
              mx((e.clientX - (b.left + b.width / 2)) * pull);
              my((e.clientY - (b.top + b.height / 2)) * pull);
            };
            const leave = () => {
              mx(0);
              my(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
            break;
          }

          /* ---- scrubs -------------------------------------------------- */

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

          // An endless horizontal band. The track holds two identical runs
          // and travels exactly one run's width before wrapping. Scrolling
          // adds to the speed and direction; `data-skew` (the compounds
          // band only) also leans the whole track up to ±10° with velocity.
          case "marquee": {
            const track = el.querySelector<HTMLElement>("[data-marquee-track]");
            if (!track) break;
            const dir = el.dataset.dir === "reverse" ? 1 : -1;
            const base = Number(el.dataset.speed || 60);
            const width = () => track.scrollWidth / 2;
            const tween = gsap.to(track, {
              x: () => dir * width(),
              duration: () => width() / base,
              ease: "none",
              repeat: -1,
              modifiers: {
                x: (v) => `${gsap.utils.wrap(dir < 0 ? -width() : 0, dir < 0 ? 0 : width(), parseFloat(v))}px`,
              },
            });
            const skew = el.hasAttribute("data-skew");
            const st = ScrollTrigger.create({
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              onUpdate: (self) => {
                const v = self.getVelocity() / 1000;
                gsap.to(tween, {
                  timeScale: 1 + Math.min(Math.abs(v), 6) * (self.direction === -1 ? -0.9 : 0.9),
                  duration: 0.3,
                  overwrite: true,
                });
                if (skew) {
                  gsap.to(track, {
                    skewX: gsap.utils.clamp(-10, 10, -v * 3),
                    duration: 0.3,
                    overwrite: true,
                  });
                }
              },
            });
            cleanups.push(() => {
              tween.kill();
              st.kill();
            });
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

      let pending = 0;
      const mo = new MutationObserver(() => {
        if (pending) return;
        pending = requestAnimationFrame(() => {
          pending = 0;
          if (scan() > 0) ScrollTrigger.refresh();
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        cleanups.forEach((fn) => fn());
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

    return () => mm.revert();
  }, []);

  return null;
}
