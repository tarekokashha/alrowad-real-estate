"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ENTRANCE_MS, ENTRANCE_VIDEO } from "@/lib/motion";
import { COMPANY } from "@/lib/content";
import s from "./Entrance.module.css";

type Props = { children: React.ReactNode; locale: string };

/**
 * THE ONE ARCHITECTURAL RULE: the entrance is additive, never gating.
 *
 * `children` — the H1, the description, the phone number — is server-rendered
 * and painted at t=0. The take runs behind it. Nothing here blocks content,
 * so Googlebot, GPTBot, ClaudeBot and PerplexityBot all receive the complete
 * page with no user-agent sniffing (which would be cloaking, and would put
 * the ranking goal at risk).
 *
 * Whether the take plays is decided in <EntranceGate> before first paint and
 * expressed as `data-entrance` on <html>; the CSS reads it. This component
 * only starts the clip, owns the skip affordance, and cleans up at the end.
 *
 * WHY THE <video> CARRIES NO `autoPlay` AND `preload="none"`: those two
 * attributes are the whole reason a skip is free. The markup is byte-for-byte
 * identical for everyone, but the clip is only ever fetched by the effect
 * below, which runs only on a play decision. A crawler, a reduced-motion
 * reader, a save-data visitor and anyone deep-linked to a unit page download
 * zero video bytes and see the settled frame instead.
 */
export default function Entrance({ children, locale }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    setPlaying(
      document.documentElement.getAttribute("data-entrance") === "play",
    );
  }, []);

  const skip = useCallback(() => {
    // Flipping the attribute is what actually stops it — CSS owns the state.
    document.documentElement.setAttribute("data-entrance", "skip");
    videoRef.current?.pause();
    setSkipped(true);
    setSettled(true);
  }, []);

  // Roll the take.
  useEffect(() => {
    if (!playing || skipped) return;
    const v = videoRef.current;
    if (!v) return;

    // React sets `muted` as a property, but not reliably as an attribute on
    // server-rendered markup, and the autoplay policy reads the property at
    // the moment play() is called. Assert it here rather than trusting the
    // round trip. (The file has no audio stream at all; this is the belt to
    // that braces.)
    v.muted = true;

    // play() on a preload="none" element is what starts the fetch. Calling
    // load() first would be redundant AND harmful: a second load() rejects
    // any play() still pending from a previous run of this effect, which
    // StrictMode guarantees in development.
    let cancelled = false;
    v.play().catch((err: DOMException) => {
      // AbortError means something interrupted the request — a re-run of
      // this effect, or a pause. That is not a refusal, and treating it as
      // one would mean the entrance never plays in development.
      if (cancelled || err?.name === "AbortError") return;
      // A genuine refusal (NotAllowedError, or a decode failure). Cut to the
      // settled frame: a frozen poster where a camera move should be reads
      // as a broken page, which is worse than never promising the move.
      skip();
    });

    return () => {
      cancelled = true;
    };
  }, [playing, skipped, skip]);

  // Any keypress dismisses, and it jumps straight to the settled state
  // rather than leaving the hero mid-shot.
  useEffect(() => {
    if (!playing || skipped) return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    // Backstop for the `ended` event, which a browser that stalls on the
    // last frame can fail to fire.
    const done = window.setTimeout(() => {
      setSkipped(true);
      const v = videoRef.current;
      // If the take is sitting paused and unfinished by the time everything
      // else has settled around it, playback never got going — autoplay was
      // deferred, or the tab lost the foreground mid-clip. Cut to the final
      // frame: a frozen closed gate under a finished header reads as broken,
      // and it is not the hero anyone was promised.
      if (v && v.paused && !v.ended) {
        skip();
        return;
      }
      // Otherwise the video is holding its own final frame, which IS the
      // settled hero — reveal the still beneath it and leave it alone.
      setSettled(true);
    }, ENTRANCE_MS + 400);
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
        {/* The settled frame, and the only thing in the hero that is fetched
            unconditionally. It is cut from the clip's last frame, so once the
            take ends the two are the same pixels and it can be revealed
            underneath with nothing visibly happening. */}
        <Image
          src={ENTRANCE_VIDEO.still}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={82}
          className={`${s.still} ${settled ? s.stillSettled : ""}`}
        />

        <video
          ref={videoRef}
          className={s.video}
          poster={ENTRANCE_VIDEO.poster}
          width={ENTRANCE_VIDEO.width}
          height={ENTRANCE_VIDEO.height}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onEnded={() => {
            setSkipped(true);
            setSettled(true);
          }}
          onError={skip}
        >
          <source src={ENTRANCE_VIDEO.webm} type="video/webm" />
          <source src={ENTRANCE_VIDEO.mp4} type="video/mp4" />
        </video>
      </div>

      {/* The hero footage is decorative — the page's meaning is in the H1 and
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
