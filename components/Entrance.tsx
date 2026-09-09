"use client";

import { useEffect, useRef, useState } from "react";
import {
  ENTRANCE_FRAMES,
  ENTRANCE_CUES,
  MOBILE_FRAME_STEP,
  framePath,
} from "@/lib/motion";
import { COMPANY } from "@/lib/content";
import s from "./Entrance.module.css";

type Props = { children: React.ReactNode; locale: string };

/** Progress through [a,b], clamped to 0…1. */
const span = (p: number, [a, b]: readonly [number, number]) =>
  Math.min(1, Math.max(0, (p - a) / (b - a)));

/**
 * THE ONE ARCHITECTURAL RULE: the entrance is additive, never gating.
 *
 * `children` — the H1, the description, the facts — is server-rendered and
 * present at t=0. The canvas sits behind it. Nothing here blocks content, so
 * Googlebot, GPTBot, ClaudeBot and PerplexityBot all receive the complete
 * page with no user-agent sniffing, which would be cloaking.
 *
 * The camera is driven by SCROLL, not by a clock. The reader opens the gate
 * themselves and can stop half way through it, which is the whole point: a
 * timed intro is something done to you, and this is something you do.
 *
 * Whether it runs at all is decided in <EntranceGate> before first paint and
 * expressed as `data-entrance` on <html>. When it is "skip" this renders a
 * single still and an ordinary 92vh hero — no canvas, no frame downloads.
 */
export default function Entrance({ children, locale }: Props) {
  const heroRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlaying(
      document.documentElement.getAttribute("data-entrance") === "play",
    );
  }, []);

  useEffect(() => {
    if (!playing) return;
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!hero || !canvas || !stage) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Halve the payload where it is most expensive: small screens, an
    // explicit Save-Data request, or a link the browser rates below 4g.
    // effectiveType is too unreliable to refuse the entrance over — see
    // EntranceGate — but it is a reasonable signal for spending half as much.
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const thrifty =
      window.innerWidth < 900 ||
      conn?.saveData === true ||
      (conn?.effectiveType !== undefined && conn.effectiveType !== "4g");
    const step = thrifty ? MOBILE_FRAME_STEP : 1;

    const indices: number[] = [];
    for (let i = 1; i <= ENTRANCE_FRAMES; i += step) indices.push(i);
    // Always land on the final frame — the arrival is the one image that must
    // not be approximated, because it is where the reader stops.
    if (indices[indices.length - 1] !== ENTRANCE_FRAMES) {
      indices.push(ENTRANCE_FRAMES);
    }

    const images: (HTMLImageElement | null)[] = new Array(indices.length).fill(
      null,
    );
    let loaded = 0;
    let cancelled = false;
    let lastDrawn = -1;

    /** Cover-fit: fill the stage, crop the overflow, never distort. */
    const draw = (slot: number) => {
      const img = images[slot];
      if (!img) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      } else if (canvas.height !== Math.round(h * dpr)) {
        canvas.height = Math.round(h * dpr);
      }
      const scale = Math.max(
        canvas.width / img.naturalWidth,
        canvas.height / img.naturalHeight,
      );
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
      lastDrawn = slot;
    };

    // Frame 1 first and on its own, so something real is on screen before the
    // rest of the sequence is even requested.
    const first = new Image();
    first.decoding = "async";
    first.src = framePath(indices[0]);
    first.onload = () => {
      if (cancelled) return;
      images[0] = first;
      loaded += 1;
      setReady(true);
      draw(0);
      // Now the remainder, in order, so the early frames — the ones reached
      // first — are always the ones already decoded.
      indices.slice(1).forEach((n, k) => {
        const img = new Image();
        img.decoding = "async";
        img.src = framePath(n);
        img.onload = () => {
          if (cancelled) return;
          images[k + 1] = img;
          loaded += 1;
        };
      });
    };

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = hero.getBoundingClientRect();
      const travel = hero.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;

      // Nearest loaded frame at or before the target, so a slow connection
      // degrades into a lower frame rate rather than a blank canvas.
      const target = Math.round(p * (images.length - 1));
      let slot = target;
      while (slot > 0 && !images[slot]) slot -= 1;
      if (images[slot] && slot !== lastDrawn) draw(slot);

      stage.style.setProperty("--p", p.toFixed(4));
      stage.style.setProperty(
        "--wordmark",
        String(1 - span(p, ENTRANCE_CUES.wordmarkOut)),
      );
      stage.style.setProperty(
        "--content",
        String(span(p, ENTRANCE_CUES.contentIn)),
      );
      stage.style.setProperty("--cue", String(1 - span(p, ENTRANCE_CUES.cueOut)));
    };

    // Coalesce to one draw per frame. The id — rather than a boolean — is what
    // makes this recoverable: a hidden tab throttles rAF, and a flag that is
    // only cleared inside the callback would latch on forever, leaving the
    // scrubber permanently dead once the reader came back to the tab.
    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      update();
    };

    const onResize = () => {
      lastDrawn = -1;
      schedule();
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [playing]);

  return (
    <section
      ref={heroRef}
      className={s.hero}
      aria-label={locale === "ar" ? "الواجهة" : "Hero"}
    >
      <div ref={stageRef} className={s.stage}>
        {/* The still is a CSS background on the stage, not an <img>, and which
            still it is comes from `data-entrance` — see the stylesheet.
            It has to be CSS: as an <img> the server would have to guess, and
            it guessed the arrival. A playing visitor then hydrated, React
            swapped the src back to the closed gate, and on a slow connection
            they watched the ending appear and then jump backwards. CSS reads
            the attribute that was already stamped before first paint, so the
            right frame is the only frame ever painted — and the browser only
            fetches the one whose rule actually matches. */}
        <canvas
          ref={canvasRef}
          className={`${s.canvas} ${ready ? s.canvasReady : ""}`}
          aria-hidden="true"
        />

        <div className={s.scrim} aria-hidden="true" />

        <div className={s.wordmark} aria-hidden="true">
          {COMPANY.shortAr}
        </div>

        <div className={s.content}>
          <div className={`shell grid12 ${s.contentInner}`}>{children}</div>
        </div>

        {playing && (
          <div className={s.cue} aria-hidden="true">
            <span className={s.cueLine} />
            {locale === "ar" ? "انزل" : "Scroll"}
          </div>
        )}
      </div>
    </section>
  );
}
