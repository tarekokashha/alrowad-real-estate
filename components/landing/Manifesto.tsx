"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./Manifesto.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const HEADLINE = "كل المنافسين بيقولوا «إحنا الأفضل». ولا واحد بيوريك الورق.".split(" ");
const BODY =
  "إحنا بننشر الحالة القانونية لكل وحدة، ومؤشر سعر متر مؤرَّخ بعيّنته، وسجل بيع مفتوح.".split(
    " ",
  );

/** Scene 03 — the sentence lights up word by word as the section is
 *  scrolled through, not on arrival: a karaoke sweep across both
 *  paragraphs, driven by one pinned 280vh section. */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const all = [...HEADLINE, ...BODY];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[];
      const M = words.length;
      const apply = (progress: number) => {
        const raw = clamp(progress) * M;
        words.forEach((w, i) => {
          const k = clamp(raw - i);
          w.style.opacity = String(0.13 + k * 0.87);
          w.style.transform = `translateY(${(1 - k) * 18}px)`;
        });
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

  let i = 0;
  return (
    <section ref={sectionRef} className={s.section}>
      <div className={s.stage}>
        <div className={s.photoA} aria-hidden="true">
          <img
            src="/img/office-interior.webp"
            alt=""
            className="kenBurns"
            style={{ "--kb-dur": "17s" } as CSSProperties}
          />
        </div>
        <div className={s.photoB} aria-hidden="true">
          <img
            src="/img/unit-03-stair.webp"
            alt=""
            className="kenBurns"
            style={{ "--kb-dur": "20s", "--kb-delay": "-5s" } as CSSProperties}
          />
        </div>

        <div className={s.copy}>
          <span className="eyebrow">٠٣ — الفكرة</span>
          <p className={s.headline}>
            {HEADLINE.map((w) => {
              const idx = i++;
              const isLast = w === "الورق.";
              return (
                <span key={idx}>
                  <span
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    className={`${s.word} ${isLast ? s.bronze : ""}`}
                  >
                    {w}
                  </span>{" "}
                </span>
              );
            })}
          </p>
          <p className={s.body}>
            {BODY.map((w) => {
              const idx = i++;
              return (
                <span key={idx}>
                  <span
                    ref={(el) => {
                      wordRefs.current[idx] = el;
                    }}
                    className={s.wordBody}
                  >
                    {w}
                  </span>{" "}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
