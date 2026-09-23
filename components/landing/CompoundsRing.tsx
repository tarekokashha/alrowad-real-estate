"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPOUNDS, DISTRICTS } from "@/lib/content";
import { unitsLabel } from "@/lib/units";
import s from "./CompoundsRing.module.css";

gsap.registerPlugin(ScrollTrigger);

const N = 16;
const RADIUS = 620;

const RING = Array.from({ length: N }, (_, i) => {
  const half = Math.floor(i / 2);
  const isCompound = i % 2 === 0;
  const item = isCompound ? COMPOUNDS[half] : DISTRICTS[half];
  return { kind: isCompound ? "كمبوند" : "منطقة", nameAr: item.nameAr, count: item.count };
});

/** Scene 06 — 16 cards arranged in a 3D ring, rotating with the scroll and
 *  drifting at 5°/s on its own even when the page is still. A card's
 *  opacity follows how directly it faces the viewer as the ring turns. */
export default function CompoundsRing() {
  const sectionRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const ring = ringRef.current;
    if (!section || !ring) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let scrollRot = 0;
      let idleRot = 0;
      let raf = 0;
      let last = performance.now();

      const paint = () => {
        const rotation = scrollRot + idleRot;
        ring.style.transform = `rotateY(${rotation}deg)`;
        cardRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = i * (360 / N);
          const eff = angle + rotation;
          const norm = ((((eff + 180) % 360) + 360) % 360) - 180;
          el.style.opacity = String(Math.min(1, Math.max(0, 1 - Math.abs(norm) / 95)));
        });
      };

      const loop = (t: number) => {
        idleRot += ((t - last) / 1000) * 5;
        last = t;
        paint();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => {
          scrollRot = -300 * self.progress;
        },
      });

      return () => {
        cancelAnimationFrame(raf);
        st.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.stage}>
        <div className={s.head}>
          <span className={s.eyebrow}>٠٦ — النطاق</span>
          <h2 className={s.h2}>كمبوند كمبوند، ومنطقة منطقة.</h2>
          <p className={s.sub}>أسماء هذا النطاق بس. من غير زايد ولا المستقبل.</p>
        </div>

        <div className={s.perspective}>
          <div className={s.tilt}>
            <div ref={ringRef} className={s.ring}>
              {RING.map((r, i) => (
                <div
                  key={r.nameAr}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={s.card}
                  style={{
                    transform: `rotateY(${i * (360 / N)}deg) translateZ(${RADIUS}px)`,
                  }}
                >
                  <div className={r.kind === "كمبوند" ? s.tagGold : s.tagMuted}>{r.kind}</div>
                  <div className={s.name}>{r.nameAr}</div>
                  <div className={s.count}>
                    {r.count} {unitsLabel(r.count)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
