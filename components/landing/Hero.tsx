"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./Loader";
import s from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const remap = (v: number, a: number, b: number, c: number, d: number) =>
  c + clamp((v - a) / (b - a)) * (d - c);

type Card = {
  img: string;
  x: number;
  y: number;
  z: number;
  ry: number;
  w: string;
  ratio: string;
  dur: number;
  delay: number;
  label?: string;
};

/** Positions, depths and Ken Burns timings straight from the design handoff
 *  (Alrowad Landing.dc.html, scene 01). */
const CARDS: Card[] = [
  { img: "/img/unit-03-exterior.webp", x: -27, y: 6, z: -700, ry: 14, w: "24vw", ratio: "4/5", dur: 15, delay: 0 },
  { img: "/img/unit-05-exterior.webp", x: 29, y: -14, z: -1300, ry: -14, w: "25vw", ratio: "5/4", dur: 18, delay: -4, label: "تاون هاوس · أو ويست" },
  { img: "/img/unit-06-exterior.webp", x: -31, y: -18, z: -1900, ry: 14, w: "28vw", ratio: "16/10", dur: 16, delay: -8 },
  { img: "/img/unit-06-roof.webp", x: 27, y: 16, z: -3100, ry: -12, w: "25vw", ratio: "4/5", dur: 20, delay: -11, label: "تراس · هوم أكتوبر جاردنز" },
  { img: "/img/area-landscape.webp", x: -25, y: 18, z: -3700, ry: 12, w: "24vw", ratio: "5/4", dur: 17, delay: -6 },
  { img: "/img/aerial-sunset.webp", x: 30, y: -12, z: -4200, ry: -12, w: "27vw", ratio: "16/10", dur: 19, delay: -9 },
  { img: "/img/unit-02-reception.webp", x: -29, y: -16, z: -4700, ry: 12, w: "22vw", ratio: "4/5", dur: 21, delay: -13 },
];

export default function Hero() {
  const [introPlayed, setIntroPlayed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const headWrapRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const depthWrapRef = useRef<HTMLDivElement>(null);
  const depthNumRef = useRef<HTMLSpanElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const N = cards.length;

      const applyFrame = (p: number) => {
        cards.forEach((el, i) => {
          const t0 = 0.03 + (i / N) * 0.6;
          const finEnd = t0 + 0.05;
          const foutStart = t0 + 0.1;
          const foutEnd = t0 + 0.17;
          let op = 0;
          let dz = -260;
          if (p < t0) {
            op = 0;
            dz = -260;
          } else if (p < finEnd) {
            op = remap(p, t0, finEnd, 0, 1);
            dz = remap(p, t0, finEnd, -260, 0);
          } else if (p < foutStart) {
            op = 1;
            dz = 0;
          } else if (p < foutEnd) {
            op = remap(p, foutStart, foutEnd, 1, 0);
            dz = remap(p, foutStart, foutEnd, 0, 320);
          } else {
            op = 0;
            dz = 320;
          }
          el.style.opacity = String(op);
          el.style.setProperty("--dz", `${dz}px`);
        });

        if (statRef.current) {
          const op = p < 0.34 ? 0 : p < 0.4 ? remap(p, 0.34, 0.4, 0, 1) : p < 0.5 ? 1 : p < 0.57 ? remap(p, 0.5, 0.57, 1, 0) : 0;
          statRef.current.style.opacity = String(op);
        }
        if (destRef.current) {
          const op = remap(p, 0.42, 0.62, 0, 1);
          destRef.current.style.opacity = String(op);
          destRef.current.style.transform = `translate(-50%, -50%) scale(${remap(p, 0.42, 0.9, 1.12, 1.02)})`;
        }
        if (headWrapRef.current) {
          // Both this headline and the «148» stat card below sit dead-center
          // on top of each other by design (a crossfade handoff, not a
          // composited pair like the stat card and the dest photo — the
          // stat card's own text-shadow glow is tuned to sit *over a photo*,
          // not over another block of foreground type). The stat card is
          // fully opaque for p in [0.4, 0.5], so the headline has to be
          // fully gone before p=0.34, when the stat card starts fading in.
          const op = 1 - remap(p, 0.24, 0.32, 0, 1);
          headWrapRef.current.style.opacity = String(op);
          headWrapRef.current.style.transform = `translate(-50%, calc(-50% + ${remap(p, 0.24, 0.32, 0, -40)}px))`;
        }
        if (hintRef.current) {
          hintRef.current.style.opacity = String(1 - remap(p, 0.02, 0.06, 0, 1));
        }
        if (depthWrapRef.current) {
          depthWrapRef.current.style.opacity = String(1 - remap(p, 0.68, 0.78, 0, 1));
        }
        if (depthNumRef.current) {
          depthNumRef.current.textContent = String(Math.round(clamp(p / 0.84) * 100)).padStart(3, "0");
        }
        if (scrimRef.current) {
          scrimRef.current.style.opacity = String(remap(p, 0.78, 0.88, 0, 1));
        }
        if (endRef.current) {
          const op = remap(p, 0.84, 0.93, 0, 1);
          endRef.current.style.opacity = String(op);
          endRef.current.style.transform = `translateY(${remap(p, 0.84, 0.93, 40, 0)}px)`;
          endRef.current.style.pointerEvents = op > 0.6 ? "auto" : "none";
        }
      };

      applyFrame(0);
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => applyFrame(self.progress),
      });

      return () => st.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id="top" className={s.hero}>
      <div className={s.stage}>
        <div className={s.cam} data-anim="tilt" data-tilt="2.5">
          <div className={s.world}>
            <div ref={destRef} className={s.dest}>
              <Image
                src="/img/hero-final.png"
                alt="منظر جوي لكمبوند في حدائق أكتوبر وقت الغروب: بوابة، بحيرات، ونخيل"
                fill
                priority
                sizes="104vw"
                className={`${s.destImg} kenBurns`}
                style={{ "--kb-dur": "26s" } as CSSProperties}
              />
            </div>

            {CARDS.map((c, i) => (
              <div
                key={c.img + i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={s.card}
                style={
                  {
                    "--x": c.x,
                    "--y": c.y,
                    "--z": c.z,
                    "--ry": c.ry,
                    width: c.w,
                    aspectRatio: c.ratio,
                  } as CSSProperties
                }
              >
                <img
                  src={c.img}
                  alt=""
                  className={`${s.cardImg} kenBurns`}
                  style={{ "--kb-dur": `${c.dur}s`, "--kb-delay": `${c.delay}s` } as CSSProperties}
                />
                {c.label && <span className={s.cardLabel}>{c.label}</span>}
              </div>
            ))}

            <div ref={statRef} className={s.statCard}>
              <div className={s.statNum}>148</div>
              <div className={s.statLabel}>وحدة معروضة، وكل وحدة بحالتها القانونية</div>
            </div>

            <div ref={headWrapRef} className={s.headWrap}>
              <div className={s.mask}>
                <div
                  className={s.eyebrow}
                  style={{ transform: introPlayed ? "translateY(0)" : "translateY(110%)" }}
                >
                  شركة الرواد للتطوير العقاري — حدائق أكتوبر، الجيزة
                </div>
              </div>
              <h1 className={s.h1}>
                <span className={s.mask}>
                  <span
                    className={s.line}
                    style={{ transform: introPlayed ? "translateY(0)" : "translateY(110%)", transitionDelay: "0.14s" }}
                  >
                    نعرف كل متر
                  </span>
                </span>
                <span className={s.mask}>
                  <span
                    className={s.line}
                    style={{ transform: introPlayed ? "translateY(0)" : "translateY(110%)", transitionDelay: "0.28s" }}
                  >
                    في حدائق <span className={s.bronze}>أكتوبر</span>
                  </span>
                </span>
              </h1>
            </div>
          </div>
        </div>

        <div ref={scrimRef} className={s.scrim} aria-hidden="true" />

        <div ref={hintRef} className={s.hint}>
          <span>اسحب لتحت وادخل</span>
          <div className={s.hintTrack}>
            <div className={s.hintFill} />
          </div>
        </div>

        <div ref={depthWrapRef} className={s.depthWrap}>
          <span ref={depthNumRef} className="mono">
            000
          </span>
          <span className={s.depthRule} />
          <span className="mono">100</span>
        </div>

        <div ref={endRef} className={s.end}>
          <div>
            <div className={s.endEyebrow}>حدائق أكتوبر · الجيزة · مصر</div>
            <div className={s.endLine}>وصلت. دلوقتي نوريك الورق.</div>
          </div>
          <div className={s.endCtas}>
            <a href="#units" className={s.endGo}>
              اتفرج على الوحدات<span>↓</span>
            </a>
            <a
              href="https://wa.me/201098098026"
              target="_blank"
              rel="noopener"
              className={s.endWa}
            >
              واتساب
            </a>
          </div>
        </div>
      </div>

      <Loader onDone={() => setIntroPlayed(true)} />
    </section>
  );
}
