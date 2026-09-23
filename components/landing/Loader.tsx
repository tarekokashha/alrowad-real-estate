"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Loader.module.css";

/**
 * The landing page's own loader — scene 0 of Alrowad Landing.dc.html.
 * Nowhere else on the site: every interior page uses the ordinary page
 * header instead. Locks scroll while it runs, then curtains up and hands
 * off to the hero's own intro lines.
 *
 * Bounded so it can never get stuck: shown for a fixed run (2.3s bar fill)
 * then a 1.2s curtain, whatever the page's own load state is doing.
 */
export default function Loader({ onDone }: { onDone?: () => void }) {
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      onDone?.();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    const DURATION = 2300;
    let raf = 0;

    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / DURATION);
      const eased = 1 - Math.pow(1 - k, 3);
      if (barRef.current) barRef.current.style.transform = `scaleX(${eased})`;
      if (numRef.current) numRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      if (k < 1) raf = requestAnimationFrame(step);
      else finish();
    };
    raf = requestAnimationFrame(step);

    const finish = () => {
      setClosing(true);
      document.documentElement.style.overflow = "";
      onDone?.();
      window.setTimeout(() => setGone(true), 1300);
    };

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className={`${s.loader} ${closing ? s.closing : ""}`} aria-hidden="true">
      <div className={s.top}>
        <span>حدائق أكتوبر، الجيزة</span>
        <span className="mono" dir="ltr">
          30.0°N · 31.0°E
        </span>
      </div>

      <div className={s.mid}>
        <div className={s.mask}>
          <div className={s.word}>الرواد</div>
        </div>
        <div className={s.mask}>
          <div className={s.subline}>للتطوير العقاري · نعرف كل متر في حدائق أكتوبر</div>
        </div>
      </div>

      <div className={s.bottom}>
        <div className={s.barRow}>
          <span>بنجهّز الجولة</span>
          <span ref={numRef} className="mono" dir="ltr">
            000
          </span>
        </div>
        <div className={s.track}>
          <div ref={barRef} className={s.fill} />
        </div>
      </div>
    </div>
  );
}
