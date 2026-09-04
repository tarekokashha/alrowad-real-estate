"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ENTRANCE_SHOTS, ENTRANCE_MS } from "@/lib/motion";
import { COMPANY } from "@/lib/content";
import s from "./Entrance.module.css";

type Props = { children: React.ReactNode; locale: string };

/**
 * THE ONE ARCHITECTURAL RULE: the entrance is additive, never gating.
 *
 * `children` — the H1, the description, the phone number — is server-rendered
 * and painted at t=0. The four image layers sit behind it. Nothing here
 * blocks content, so Googlebot, GPTBot, ClaudeBot and PerplexityBot all
 * receive the complete page with no user-agent sniffing (which would be
 * cloaking, and would put the ranking goal at risk).
 *
 * Whether the sequence plays is decided in <EntranceGate> before first paint
 * and expressed as `data-entrance` on <html>; the CSS reads it. This
 * component only owns the skip affordance and the end-of-sequence cleanup.
 */
export default function Entrance({ children, locale }: Props) {
  const [skipped, setSkipped] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(
      document.documentElement.getAttribute("data-entrance") === "play",
    );
  }, []);

  const skip = useCallback(() => {
    // Flipping the attribute is what actually stops it — CSS owns the state.
    document.documentElement.setAttribute("data-entrance", "skip");
    setSkipped(true);
  }, []);

  // Any keypress dismisses, and it jumps straight to the settled state
  // rather than leaving the hero half-animated.
  useEffect(() => {
    if (!playing || skipped) return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    const done = window.setTimeout(() => setSkipped(true), ENTRANCE_MS);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(done);
    };
  }, [playing, skipped, skip]);

  const showSkip = playing && !skipped;

  return (
    <section
      className={s.hero}
      aria-label={locale === "ar" ? "الواجهة" : "Hero"}
    >
      <div className={s.layers} aria-hidden="true">
        {ENTRANCE_SHOTS.map((shot, i) => (
          <div key={shot.key} className={`${s.layer} ${s[`layer${i + 1}`]}`}>
            <Image
              src={shot.src}
              alt=""
              fill
              /* Two frames are guaranteed-visible and therefore both are
                 LCP candidates: shot 1 when the sequence plays, shot 4 in
                 every skip case — which is most real traffic and every
                 crawler. `priority` makes Next emit the correct preload for
                 the OPTIMISED url; a hand-written <link rel="preload"> to the
                 raw file never matches and is simply wasted bytes. */
              priority={i === 0 || i === ENTRANCE_SHOTS.length - 1}
              sizes="100vw"
              quality={82}
            />
          </div>
        ))}
      </div>

      {/* The hero image is decorative — the page's meaning is in the H1 and
          the copy beside it, which is where a screen reader should land. */}
      <div className={s.scrim} aria-hidden="true" />

      <div className={s.wordmark} aria-hidden="true">
        {COMPANY.shortAr}
      </div>

      {showSkip && (
        <button type="button" className={s.skip} onClick={skip}>
          {locale === "ar" ? "تخطّي" : "Skip"}
        </button>
      )}

      <div className={s.content}>
        <div className={`shell grid12 ${s.contentInner}`}>{children}</div>
      </div>
    </section>
  );
}
