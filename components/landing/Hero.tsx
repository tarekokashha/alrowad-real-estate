"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./Loader";
import s from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOutCubic = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);

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

/** The stat card and the headline are ordinary participants in the same
 *  camera-through-space system as the photo cards below — not a pair with
 *  their own bespoke crossfade. Depths from the handoff. */
const STAT_Z = -2600;
const HEADLINE_Z = 0;
const DEST_Z = -5400;

const DUST_COUNT = 80;
type Dust = { x: number; y: number; z: number; size: number; seed: number };

/** Deterministic PRNG (mulberry32) so the dust field's random depths are
 *  identical on server and client — Math.random() here would desync SSR
 *  and hydration. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dustRandom = mulberry32(20260926);
const DUST: Dust[] = Array.from({ length: DUST_COUNT }, (_, i) => ({
  x: dustRandom() * 150 - 75,
  y: dustRandom() * 120 - 60,
  z: -dustRandom() * 5200,
  size: 1 + dustRandom() * 3,
  seed: i,
}));

export default function Hero() {
  const [introPlayed, setIntroPlayed] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dustRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const headWrapRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const hintLineRef = useRef<HTMLDivElement>(null);
  const depthWrapRef = useRef<HTMLDivElement>(null);
  const depthNumRef = useRef<HTMLSpanElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const cmx = useRef(0);
  const cmy = useRef(0);
  const mx = useRef(0);
  const my = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onMove = (e: PointerEvent) => {
      mx.current = (e.clientX / window.innerWidth) * 2 - 1;
      my.current = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const dusts = dustRefs.current.filter(Boolean) as HTMLDivElement[];

      /* One camera depth (camZ), one opacity rule per item based on its
       * distance from the camera (rel = camZ + item.z) — the same system
       * driving every item at once, so nothing has its own bespoke fade
       * window to fall out of sync with another item's. Ported from
       * Alrowad Landing.dc.html's `frame()`. */
      const paint = (t: number) => {
        const scrollTrigger = ScrollTrigger.getById("hero-fly");
        const hp = scrollTrigger ? scrollTrigger.progress : 0;
        const cp = easeInOutCubic(clamp(hp / 0.84)) * 0.25 + clamp(hp / 0.84) * 0.75;
        const camZ = cp * 5400 + clamp((hp - 0.84) / 0.16) * 240;

        if (camRef.current) {
          camRef.current.style.transform = `rotateX(${(-cmy.current * 2.2).toFixed(3)}deg) rotateY(${(cmx.current * 3.2).toFixed(3)}deg)`;
        }
        if (worldRef.current) {
          worldRef.current.style.transform = `translateZ(${camZ.toFixed(1)}px)`;
        }

        const paintItem = (
          el: HTMLElement,
          x: number,
          y: number,
          z: number,
          ry: number,
          i: number,
          opts?: { keep?: boolean; dust?: boolean },
        ) => {
          const rel = camZ + z;
          let o = 1;
          if (!opts?.keep) {
            if (rel < -4300 || rel > 760) o = 0;
            else if (rel < -3100) o = (rel + 4300) / 1200;
            else if (rel > 260) o = 1 - (rel - 260) / 500;
          }
          if (opts?.dust) o *= 0.5 + 0.5 * Math.sin(t * 2 + i);
          else if (opts?.keep) o = clamp((camZ - 250) / 1700);
          else if (z < -100) o *= clamp((camZ - 40) / 380);

          el.style.opacity = o.toFixed(3);
          el.style.visibility = o <= 0.002 ? "hidden" : "visible";
          if (o > 0.002 || opts?.keep) {
            const bob = opts?.keep ? 0 : Math.sin(t * 0.8 + i * 1.7) * 12;
            const xScale = window.innerWidth < 700 ? 1.45 : 1;
            el.style.transform = `translate(-50%, -50%) translate3d(${((x * window.innerWidth) / 100 * xScale).toFixed(1)}px, ${((y * window.innerHeight) / 100 + bob).toFixed(1)}px, ${z}px) rotateY(${ry}deg)`;
          }
        };

        cards.forEach((el, i) => {
          const c = CARDS[i];
          if (!c) return;
          paintItem(el, c.x, c.y, c.z, c.ry, i);
        });
        if (statRef.current) paintItem(statRef.current, 0, 0, STAT_Z, 0, CARDS.length);
        if (headWrapRef.current) paintItem(headWrapRef.current, 0, 0, HEADLINE_Z, 0, CARDS.length + 1);
        if (destRef.current) paintItem(destRef.current, 0, 0, DEST_Z, 0, CARDS.length + 2, { keep: true });
        dusts.forEach((el, i) => {
          const d = DUST[i];
          if (!d) return;
          paintItem(el, d.x, d.y, d.z, 0, d.seed, { dust: true });
        });

        if (hintRef.current) hintRef.current.style.opacity = String(1 - clamp(hp * 14));
        if (hintLineRef.current) {
          hintLineRef.current.style.transform = `translateY(${((t * 0.7) % 1) * 200 - 100}%)`;
        }
        if (depthNumRef.current) depthNumRef.current.textContent = String(Math.round(cp * 100)).padStart(3, "0");
        const sk = clamp((hp - 0.8) / 0.1);
        if (scrimRef.current) scrimRef.current.style.opacity = sk.toFixed(3);
        if (depthWrapRef.current) depthWrapRef.current.style.opacity = (1 - sk).toFixed(3);
        if (endRef.current) {
          const k = clamp((hp - 0.86) / 0.09);
          endRef.current.style.opacity = String(k);
          endRef.current.style.transform = `translateY(${(1 - k) * 60}px)`;
          endRef.current.style.pointerEvents = k > 0.6 ? "auto" : "none";
        }
      };

      let smoothedY = window.scrollY;
      const tick = () => {
        smoothedY += (window.scrollY - smoothedY) * 0.1;
        cmx.current += (mx.current - cmx.current) * 0.05;
        cmy.current += (my.current - cmy.current) * 0.05;
        paint(performance.now() / 1000);
      };
      gsap.ticker.add(tick);

      const st = ScrollTrigger.create({ id: "hero-fly", trigger: root, start: "top top", end: "bottom bottom" });

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      mm.revert();
    };
  }, []);

  return (
    <section ref={rootRef} id="top" className={s.hero}>
      <div className={s.stage}>
        <div ref={camRef} className={s.cam}>
          <div ref={worldRef} className={s.world}>
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

            <div className={s.dust} aria-hidden="true">
              {DUST.map((d, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    dustRefs.current[i] = el;
                  }}
                  className={s.speck}
                  style={{ width: d.size, height: d.size } as CSSProperties}
                />
              ))}
            </div>

            {CARDS.map((c, i) => (
              <div
                key={c.img + i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={s.card}
                style={{ width: c.w, aspectRatio: c.ratio } as CSSProperties}
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
            <div ref={hintLineRef} className={s.hintFill} />
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
