"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./TimelineRail.module.css";

gsap.registerPlugin(ScrollTrigger);

/** Gulf.dc.html's six-stage timeline: a vertical rail with a bronze fill
 *  that scrubs in as the reader passes each stage. */
export default function TimelineRail({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: wrap, start: "top 60%", end: "bottom 60%", scrub: 0.3 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapRef} className={s.wrap}>
      <div className={s.rail}>
        <div ref={fillRef} className={s.fill} />
      </div>
      <div className={s.list}>{children}</div>
    </div>
  );
}
