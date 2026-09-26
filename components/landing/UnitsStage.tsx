"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./UnitsStage.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const remap = (v: number, a: number, b: number, c: number, d: number) =>
  c + clamp((v - a) / (b - a)) * (d - c);
const eo = (k: number) => 1 - Math.pow(1 - clamp(k), 3);
const ei = (k: number) => Math.pow(clamp(k), 3);

export type StageUnit = {
  code: string;
  legalAr: string;
  titleLine: string;
  price: number;
  size: number;
  perM: number;
  finishing: string;
  handover: string;
  checkedAr: string;
  href: string;
  img: string;
  img2: string;
  img3: string;
};

/**
 * Scene 02 — "اتفرج على الوحدات." A 680vh pinned stage: scroll only hands
 * one unit over to the next, alternating sides, never feeling like scrolling
 * down. Ported from Alrowad Landing.dc.html; the per-unit text block is
 * animated as two groups (top/bottom) rather than line-by-line, which keeps
 * the same handover feel with far less state.
 */
export default function UnitsStage({
  units,
  totalLabel,
  allHref,
}: {
  units: StageUnit[];
  totalLabel: string;
  allHref: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const N = units.length;

  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const photoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const thumbARefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbBRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textBottomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const priceRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const applyFrame = (progress: number) => {
        const raw = clamp(progress * 1.08) * (N - 1);
        const base = Math.floor(raw);
        const tt = base + clamp((raw - base - 0.22) / 0.56);

        units.forEach((u, i) => {
          const d = tt - i;
          const inP = d <= 0 ? clamp(1 + d) : 1;
          const outP = d > 0 ? clamp(d) : 0;
          const wrapper = wrapperRefs.current[i];
          if (!wrapper) return;

          const hide = inP === 0 || outP >= 1;
          wrapper.style.visibility = hide ? "hidden" : "visible";
          if (hide) return;

          const fout = ei(outP / 0.6);
          const fin = eo((inP - 0.35) / 0.65);
          const entering = outP <= 0;

          const frame = frameRefs.current[i];
          if (frame) {
            frame.style.clipPath = entering
              ? `inset(${(1 - fin) * 100}% 0 0 0 round 22px)`
              : `inset(0 0 ${fout * 100}% 0 round 22px)`;
          }
          wrapper.style.transform = entering
            ? `translateY(${(1 - fin) * 70}px)`
            : `translateY(${-fout * 90}px) scale(${1 - 0.05 * fout})`;

          const photo = photoRefs.current[i];
          if (photo) {
            photo.style.transform = entering
              ? `translateY(${remap(fin, 0, 1, 12, 0)}%) scale(${remap(fin, 0, 1, 1.32, 1.1)})`
              : `translateY(${-10 * fout}%) scale(1.1)`;
          }

          const thumbA = thumbARefs.current[i];
          if (thumbA) {
            if (entering) {
              const p = clamp(remap(fin, 0.55, 1, 0, 1));
              thumbA.style.opacity = String(p);
              thumbA.style.transform = `translateY(${remap(p, 0, 1, 120, 0)}px) translateX(${remap(p, 0, 1, 40, 0)}px) rotate(${remap(p, 0, 1, 17, 4)}deg) scale(${remap(p, 0, 1, 0.6, 1)})`;
            } else {
              thumbA.style.opacity = String(1 - fout);
              thumbA.style.transform = `translateY(${-fout * 2.4 * 90}px) rotate(${4 + fout * 30}deg) scale(${1 - 0.3 * fout})`;
            }
          }
          const thumbB = thumbBRefs.current[i];
          if (thumbB) {
            if (entering) {
              const p = clamp(remap(fin, 0.68, 1, 0, 1));
              thumbB.style.opacity = String(p);
              thumbB.style.transform = `translateY(${remap(p, 0, 1, 90, 0)}px) translateX(${remap(p, 0, 1, -40, 0)}px) rotate(${remap(p, 0, 1, -22, -5)}deg) scale(${remap(p, 0, 1, 0.6, 1)})`;
            } else {
              thumbB.style.opacity = String(1 - fout);
              thumbB.style.transform = `translateY(${-fout * 2.4 * 70}px) rotate(${-5 - fout * 26}deg) scale(${1 - 0.3 * fout})`;
            }
          }

          const textTop = textTopRefs.current[i];
          if (textTop) {
            if (entering) {
              const j = eo((inP - 0.3) / 0.45);
              textTop.style.transform = `translateY(${(1 - j) * 105}%)`;
              textTop.style.opacity = String(j);
            } else {
              // The next slide's textTop starts fading in at inP=0.3 (its own
              // outP === this slide's inP, since they share the same scroll
              // position) — this one has to be fully transparent before
              // then, or the two slides' price lines print on top of each
              // other and merge into one illegible number.
              const j = ei(outP / 0.26);
              textTop.style.transform = `translateY(${-j * 105}%)`;
              textTop.style.opacity = String(1 - j);
            }
          }
          const textBottom = textBottomRefs.current[i];
          if (textBottom) {
            if (entering) {
              const j = eo((inP - 0.37) / 0.45);
              textBottom.style.transform = `translateY(${(1 - j) * 105}%)`;
              textBottom.style.opacity = String(j);
            } else {
              // Same handoff fix as textTop, against the next slide's own
              // textBottom fade-in starting at inP=0.37.
              const j = ei((outP - 0.05) / 0.26);
              textBottom.style.transform = `translateY(${-j * 105}%)`;
              textBottom.style.opacity = String(1 - j);
            }
          }

          const priceEl = priceRefs.current[i];
          if (priceEl) {
            const j = entering ? clamp(remap(fin, 0, 0.8, 0, 1)) : 1;
            priceEl.textContent = Math.round(u.price * j).toLocaleString("en-US");
          }
        });

        units.forEach((_, i) => {
          const bar = barRefs.current[i];
          if (bar) bar.style.transform = `scaleX(${clamp(raw - i + 1)})`;
          const name = nameRefs.current[i];
          if (name) name.style.opacity = Math.round(tt) === i ? "1" : "0.45";
        });
      };

      applyFrame(0);
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => applyFrame(self.progress),
      });
      return () => st.kill();
    });

    return () => mm.revert();
  }, [units, N]);

  const jumpTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const height = section.offsetHeight - window.innerHeight;
    const p = clamp(i / (1.08 * (N - 1)));
    window.scrollTo({ top: sectionTop + height * p, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} id="units" className={s.section}>
      <div className={s.stage}>
        <div className={s.head}>
          <div>
            <span className="eyebrow">٠٢ — الوحدات المتاحة</span>
            <h2 className={s.h2}>اتفرج على الوحدات.</h2>
          </div>
          <a href={allHref} className={s.allLink}>
            شوف كل الوحدات · <bdi>{totalLabel}</bdi>
            <span aria-hidden="true">←</span>
          </a>
        </div>

        <div className={s.slides}>
          {units.map((u, i) => (
            <div
              key={u.code}
              ref={(el) => {
                wrapperRefs.current[i] = el;
              }}
              className={s.slide}
              style={{
                flexDirection: i % 2 ? "row-reverse" : "row",
                visibility: i === 0 ? "visible" : "hidden",
              }}
            >
              <div className={s.imgCol}>
                <a
                  href={u.href}
                  ref={(el) => {
                    frameRefs.current[i] = el;
                  }}
                  className={s.frame}
                  aria-label={u.titleLine}
                >
                  <img
                    ref={(el) => {
                      photoRefs.current[i] = el;
                    }}
                    src={`/img/${u.img}.webp`}
                    alt=""
                    className={s.photo}
                  />
                  <span className={s.idxBadge}>{String(i + 1).padStart(2, "0")}</span>
                </a>
                <div
                  ref={(el) => {
                    thumbARefs.current[i] = el;
                  }}
                  className={s.thumbA}
                  aria-hidden="true"
                >
                  <img src={`/img/${u.img2}.webp`} alt="" />
                </div>
                <div
                  ref={(el) => {
                    thumbBRefs.current[i] = el;
                  }}
                  className={s.thumbB}
                  aria-hidden="true"
                >
                  <img src={`/img/${u.img3}.webp`} alt="" />
                </div>
              </div>

              <div className={s.details}>
                <div
                  ref={(el) => {
                    textTopRefs.current[i] = el;
                  }}
                  className={s.textTop}
                >
                  <div className={s.chips}>
                    <bdi className={`mono ${s.codeChip}`}>{u.code}</bdi>
                    <span className={s.legalChip}>{u.legalAr}</span>
                  </div>
                  <span className={s.title}>{u.titleLine}</span>
                  <span className={s.priceLine}>
                    <bdi
                      ref={(el) => {
                        priceRefs.current[i] = el;
                      }}
                    >
                      {u.price.toLocaleString("en-US")}
                    </bdi>{" "}
                    <span className={s.currency}>ج.م</span>
                  </span>
                </div>
                <div
                  ref={(el) => {
                    textBottomRefs.current[i] = el;
                  }}
                  className={s.textBottom}
                >
                  <div className={s.specs}>
                    <div className={s.spec}>
                      <span>المساحة</span>
                      <span>
                        <bdi>{u.size}</bdi> م²
                      </span>
                    </div>
                    <div className={s.spec}>
                      <span>سعر المتر</span>
                      <span>
                        <bdi>{u.perM.toLocaleString("en-US")}</bdi> ج.م/م²
                      </span>
                    </div>
                    <div className={s.spec}>
                      <span>التشطيب</span>
                      <span>{u.finishing}</span>
                    </div>
                    <div className={s.spec}>
                      <span>الاستلام</span>
                      <span>{u.handover}</span>
                    </div>
                  </div>
                  <span className={s.checked}>آخر تحديث للسعر: {u.checkedAr}</span>
                  <a href={u.href} className={s.cta}>
                    شوف الوحدة كاملة<span>←</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={s.index}>
          {units.map((u, i) => (
            <button key={u.code} onClick={() => jumpTo(i)} className={s.indexBtn}>
              <div className={s.indexTrack}>
                <div
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                  className={s.indexBar}
                />
              </div>
              <span className={s.indexRow}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <span
                  ref={(el) => {
                    nameRefs.current[i] = el;
                  }}
                  className={s.indexName}
                >
                  {u.titleLine.split(" — ")[1] ?? u.titleLine}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
