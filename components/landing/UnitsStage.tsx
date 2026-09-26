"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./UnitsStage.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eo = (k: number) => 1 - Math.pow(1 - k, 3);
const ei = (k: number) => k * k * k;

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
 * down. Ported from Alrowad Landing.dc.html's `frame()` almost verbatim —
 * one continuous d/inP/outP-driven formula per element (frame clip-path,
 * photo-card tilt + idle breathing, thumbnail handover, per-line stagger),
 * plus the pointer-tilt on the active photo card.
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
  const imgColRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const photoRefs = useRef<(HTMLImageElement | null)[]>([]);
  const thumbARefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbBRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const priceRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tiltRefs = useRef<{ tx: number; ty: number }[]>(units.map(() => ({ tx: 0, ty: 0 })));
  const px = useRef(0);
  const py = useRef(0);

  const setLineRef = (i: number, j: number) => (el: HTMLDivElement | null) => {
    if (!lineRefs.current[i]) lineRefs.current[i] = [];
    lineRefs.current[i][j] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: PointerEvent) => {
      px.current = e.clientX;
      py.current = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const fine = window.matchMedia("(pointer: fine)").matches;

      const paint = (t: number) => {
        const scrollTrigger = ScrollTrigger.getById("units-stage");
        const progress = scrollTrigger ? scrollTrigger.progress : 0;
        const raw = Math.min(N - 1, clamp(progress * 1.08) * (N - 1));
        const base = Math.floor(raw);
        const fr = raw - base;
        const tt = Math.min(N - 1, base + clamp((fr - 0.22) / 0.56));

        units.forEach((u, i) => {
          const d = tt - i;
          const inP = d <= 0 ? clamp(1 + d) : 1;
          const outP = d > 0 ? clamp(d) : 0;
          const live = inP > 0 && outP < 1;
          const wrapper = wrapperRefs.current[i];
          if (!wrapper) return;

          wrapper.style.visibility = live ? "visible" : "hidden";
          wrapper.style.pointerEvents = Math.abs(d) < 0.25 ? "auto" : "none";
          if (!live) return;

          const sg = i % 2 ? -1 : 1;
          const fin = eo(clamp((inP - 0.35) / 0.65));
          const fout = ei(clamp(outP / 0.6));

          const frame = frameRefs.current[i];
          if (frame) {
            frame.style.clipPath =
              fout > 0
                ? `inset(0 0 ${(fout * 100).toFixed(2)}% 0 round 22px)`
                : fin >= 0.999
                  ? "inset(0 0 0 0 round 22px)"
                  : `inset(${((1 - fin) * 100).toFixed(2)}% 0 0 0 round 22px)`;
          }

          const imgCol = imgColRefs.current[i];
          if (imgCol) {
            const tilt = tiltRefs.current[i];
            const wr = imgCol.getBoundingClientRect();
            const inside =
              fine &&
              Math.abs(d) < 0.1 &&
              px.current > wr.left &&
              px.current < wr.right &&
              py.current > wr.top &&
              py.current < wr.bottom;
            tilt.tx = lerp(tilt.tx, inside ? ((px.current - wr.left) / wr.width - 0.5) * 7 : 0, 0.07);
            tilt.ty = lerp(tilt.ty, inside ? ((py.current - wr.top) / wr.height - 0.5) * -5 : 0, 0.07);
            const y = (1 - fin) * 70 - fout * 90;
            imgCol.style.transform = `perspective(1600px) translate3d(0,${y.toFixed(1)}px,0) rotateY(${tilt.tx.toFixed(2)}deg) rotateX(${tilt.ty.toFixed(2)}deg) scale(${(1 - fout * 0.05).toFixed(4)})`;
          }

          const photo = photoRefs.current[i];
          if (photo) {
            const idle = 1 + Math.sin(t * 0.35 + i * 1.3) * 0.016;
            const px2 = Math.sin(t * 0.2 + i) * 0.9;
            const py2 = (1 - fin) * 12 - fout * 10 + Math.sin(t * 0.27 + i) * 0.8;
            const scale = (1.1 + (1 - fin) * 0.22 + fout * 0.06) * idle;
            photo.style.transform = `translate3d(${px2.toFixed(2)}%,${py2.toFixed(2)}%,0) scale(${scale.toFixed(4)})`;
          }

          const thumb = (
            el: HTMLDivElement | null,
            delay: number,
            rise: number,
            rot: number,
            bob: number,
            ph: number,
          ) => {
            if (!el) return;
            const ki = eo(clamp((inP - delay) / (1 - delay)));
            const ko = eo(clamp((outP - 0.05) / 0.5));
            el.style.opacity = (ki * (1 - ko)).toFixed(3);
            const y = (1 - ki) * rise - ko * rise * 2.4 + Math.sin(t * bob + ph) * 9;
            const r = sg * ((1 - ki) * rot * 2.2 + rot * 0.4 - ko * rot * 1.6);
            const scale = 0.6 + 0.4 * ki - ko * 0.2;
            el.style.transform = `translate3d(${(sg * (1 - ki) * -40).toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${r.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          };
          thumb(thumbARefs.current[i], 0.55, 120, -8, 0.8, i);
          thumb(thumbBRefs.current[i], 0.68, 90, 10, 0.65, i * 2);

          const lines = lineRefs.current[i] ?? [];
          const n = lines.length;
          lines.forEach((ln, j) => {
            if (!ln) return;
            const ji = eo(clamp((inP - 0.3 - j * 0.07) / 0.45));
            const jo = ei(clamp((outP - (n - 1 - j) * 0.04) / 0.4));
            const y = jo > 0 ? -jo * 105 : (1 - ji) * 105;
            ln.style.transform = Math.abs(y) < 0.05 ? "none" : `translate3d(0,${y.toFixed(2)}%,0)`;
          });

          const priceEl = priceRefs.current[i];
          if (priceEl) {
            const kp = eo(clamp((inP - 0.4) / 0.6));
            const str = (Math.round((u.price * kp) / 1000) * 1000).toLocaleString("en-US");
            if (priceEl.textContent !== str) priceEl.textContent = str;
          }
        });

        units.forEach((_, i) => {
          const bar = barRefs.current[i];
          if (bar) bar.style.transform = `scaleX(${clamp(raw - i + 1).toFixed(3)})`;
        });
        const act = Math.min(N - 1, Math.round(tt));
        units.forEach((_, i) => {
          const name = nameRefs.current[i];
          if (name) name.style.opacity = i === act ? "1" : "0.45";
        });
      };

      const tick = () => paint(performance.now() / 1000);
      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({ id: "units-stage", trigger: section, start: "top top", end: "bottom bottom" });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      mm.revert();
    };
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
              <div
                ref={(el) => {
                  imgColRefs.current[i] = el;
                }}
                className={s.imgCol}
              >
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
                <div className={s.lineWrap}>
                  <div ref={setLineRef(i, 0)} className={s.sl}>
                    <div className={s.chips}>
                      <bdi className={`mono ${s.codeChip}`}>{u.code}</bdi>
                      <span className={s.legalChip}>{u.legalAr}</span>
                    </div>
                  </div>
                </div>
                <div className={s.lineWrap}>
                  <div ref={setLineRef(i, 1)} className={s.sl}>
                    <span className={s.title}>{u.titleLine}</span>
                  </div>
                </div>
                <div className={s.lineWrap}>
                  <div ref={setLineRef(i, 2)} className={s.sl}>
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
                </div>
                <div className={s.lineWrap}>
                  <div ref={setLineRef(i, 3)} className={s.sl}>
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
                  </div>
                </div>
                <div className={`${s.lineWrap} ${s.checked}`}>
                  <div ref={setLineRef(i, 4)} className={s.sl}>
                    <span>آخر تحديث للسعر: {u.checkedAr}</span>
                  </div>
                </div>
                <div className={s.lineWrap}>
                  <div ref={setLineRef(i, 5)} className={s.sl}>
                    <a href={u.href} className={s.cta}>
                      شوف الوحدة كاملة<span>←</span>
                    </a>
                  </div>
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
