"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TESTIMONIALS } from "@/lib/content";
import s from "./TestimonialsSwap.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const remap = (v: number, a: number, b: number, c: number, d: number) =>
  c + clamp((v - a) / (b - a)) * (d - c);

/** Scene 10 — "من اشتروا". Card one holds still, card two rises out of the
 *  bottom of the viewport and settles over it as the section is scrolled
 *  through, one pinned 280vh stage. */
export default function TestimonialsSwap() {
  const sectionRef = useRef<HTMLElement>(null);
  const v1Ref = useRef<HTMLDivElement>(null);
  const v2Ref = useRef<HTMLDivElement>(null);
  const [t1, t2] = TESTIMONIALS;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const apply = (p: number) => {
        if (v1Ref.current) {
          v1Ref.current.style.transform = `scale(${remap(p, 0, 1, 1, 0.9)}) rotateX(${remap(p, 0, 1, 0, 10)}deg)`;
          v1Ref.current.style.opacity = String(remap(p, 0, 1, 1, 0.4));
        }
        if (v2Ref.current) {
          v2Ref.current.style.transform = `translateY(${remap(p, 0, 1, 110, 0)}vh) rotateX(${remap(p, 0, 1, -20, 0)}deg)`;
        }
      };
      apply(0);
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        onUpdate: (self) => apply(self.progress),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  if (!t1 || !t2) return null;

  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.stage}>
        <span className={`eyebrow ${s.eyebrow}`}>١٠ — من اشتروا</span>

        <div ref={v1Ref} className={s.card}>
          <div className={s.quoteMark}>”</div>
          <p className={s.quote}>{t1.quoteAr}</p>
          <div className={s.foot}>
            <span className={s.name}>{t1.nameAr}</span>
            <span className={s.detail}>{t1.detailAr}</span>
          </div>
        </div>

        <div ref={v2Ref} className={`${s.card} ${s.cardTwo}`}>
          <div className={s.quoteMark}>”</div>
          <p className={s.quote}>{t2.quoteAr}</p>
          <div className={s.foot}>
            <span className={s.name}>{t2.nameAr}</span>
            <span className={s.detail}>{t2.detailAr}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
