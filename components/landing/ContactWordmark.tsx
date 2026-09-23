"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./ContactWordmark.module.css";

gsap.registerPlugin(ScrollTrigger);

/** The giant outlined «الرواد» at the foot of the landing page's own contact
 *  band — fills solid bronze from the right as it scrolls into view. */
export default function ContactWordmark() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: wrap,
        start: "top 92%",
        end: "bottom 55%",
        scrub: 0.3,
        onUpdate: (self) => {
          fill.style.clipPath = `inset(0 0 0 ${100 - self.progress * 100}%)`;
        },
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapRef} className={s.wrap} aria-hidden="true">
      <div className={s.outline}>الرواد</div>
      <div ref={fillRef} className={s.fill}>
        الرواد
      </div>
    </div>
  );
}
