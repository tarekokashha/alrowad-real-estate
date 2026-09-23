"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./AreaReveal.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const remap = (v: number, a: number, b: number, c: number, d: number) =>
  c + clamp((v - a) / (b - a)) * (d - c);
const easeInOutCubic = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

/** Scene 05 — a courtyard photo grows from a cropped frame to full-bleed as
 *  «حدائق» and «أكتوبر» split apart over it, night ground so the split
 *  words stay legible off the photograph. */
export default function AreaReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const w1Ref = useRef<HTMLSpanElement>(null);
  const w2Ref = useRef<HTMLSpanElement>(null);
  const capRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const apply = (p: number) => {
        const growK = easeInOutCubic(clamp(p / 0.55));
        if (clipRef.current) {
          const v = remap(growK, 0, 1, 24, 0);
          const h = remap(growK, 0, 1, 32, 0);
          const r = remap(growK, 0, 1, 24, 0);
          clipRef.current.style.clipPath = `inset(${v}% ${h}% round ${r}px)`;
        }
        if (imgRef.current) {
          imgRef.current.style.transform = `scale(${remap(growK, 0, 1, 1.35, 1.02)})`;
        }
        const split = remap(p, 0, 0.6, 0, 1);
        if (w1Ref.current) {
          w1Ref.current.style.transform = `translateX(${-55 * split}vw) rotate(${-6 * split}deg)`;
        }
        if (w2Ref.current) {
          w2Ref.current.style.transform = `translateX(${55 * split}vw) rotate(${6 * split}deg)`;
        }
        if (capRef.current) {
          const k = remap(p, 0.58, 0.74, 0, 1);
          capRef.current.style.opacity = String(k);
          capRef.current.style.transform = `translateY(${(1 - k) * 24}px)`;
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

  return (
    <section ref={sectionRef} id="area" className={s.section}>
      <div className={s.stage}>
        <div ref={clipRef} className={s.clip}>
          <img
            ref={imgRef}
            src="/img/courtyard-dusk.webp"
            alt="حدائق أكتوبر"
            className={s.img}
          />
          <div className={s.veil} />
        </div>

        <div className={s.words} aria-hidden="true">
          <span ref={w1Ref} className={s.w1}>
            حدائق
          </span>
          <span ref={w2Ref} className={s.w2}>
            أكتوبر
          </span>
        </div>

        <div ref={capRef} className={s.caption}>
          <div className={s.captionText}>
            <span className={s.eyebrow}>٠٥ — المنطقة</span>
            <div className={s.h2}>نعرف كل متر في حدائق أكتوبر</div>
            <div className={s.sub}>حدائق أكتوبر، الجيزة، مصر</div>
          </div>
          <div className={s.stats}>
            <div>
              <div className={s.stat}>8</div>
              <div className={s.statLabel}>كمبوندات</div>
            </div>
            <div>
              <div className={s.stat}>8</div>
              <div className={s.statLabel}>مناطق</div>
            </div>
            <div>
              <div className={`${s.stat} ${s.gold}`}>148</div>
              <div className={s.statLabel}>وحدة</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
