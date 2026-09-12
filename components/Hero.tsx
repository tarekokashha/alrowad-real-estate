import Image from "next/image";
import Link from "next/link";
import { PhoneNumber } from "@/lib/format";
import s from "./Hero.module.css";

type Props = { children: React.ReactNode; locale: string };

/**
 * The hero.
 *
 * This replaces a scroll-scrubbed canvas playing a 121-frame sequence. That
 * version was technically sound and the client's verdict on it was the only
 * one that counts: the picture quality was not good enough. A video frame
 * carries whatever the encoder left of it, and no amount of AVIF recovers
 * detail that was never in the source. One properly made still at full
 * quality beats a hundred and twenty-one mediocre ones — and it costs 296 KB
 * against 7.5 MB.
 *
 * THE RULE IT KEEPS: additive, never gating. `children` — the H1, the
 * description, the facts — is server-rendered and present at t=0, sitting in
 * front of the image rather than behind a curtain. With JavaScript blocked
 * this is an ordinary hero: a photograph, a headline, two links. Nothing
 * here decides whether content exists, only how it moves.
 *
 * The scroll choreography lives in <Motion />, keyed off data-anim="hero"
 * and the three child hooks below.
 */
export default function Hero({ children, locale }: Props) {
  const ar = locale === "ar";

  return (
    <>
      {/* Beat 2: the amber flood.
          It belongs to the hero's timeline rather than to a section of its
          own — built as a standalone track it cost a screen and a half of
          empty scrolling and its sticky panel painted over the first thing
          anyone was meant to read, whereas the reference floods the viewport
          *while the hero leaves* and clears immediately.

          A sibling of the hero, not a child: the hero isolates its own
          stacking context, and a z-index inside that context cannot paint
          over the sections below — which is the entire job here.

          Fixed, so it costs no height; pointer-events: none, so it is never
          in anyone's way; opacity 0 in the stylesheet, so a page without the
          bundle has no amber sheet over it. The tween runs 0 → 1 → 0 inside
          the hero's own scroll range, so it is 0 at both ends and cannot
          strand itself visible. */}
      <div className={s.wash} data-hero-wash aria-hidden="true" />

      <section
        className={s.hero}
        data-anim="hero"
        aria-label={ar ? "الواجهة" : "Hero"}
      >
        <div className={s.media} data-hero-img>
          <Image
            src="/img/gate-night.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={88}
            className={s.img}
          />
        </div>

        {/* Two separate layers doing two separate jobs. The gradient is fixed
          and exists so the copy is legible over a photograph; the veil is
          what the scroll drives. Animating one element for both would mean
          the text losing its backing at exactly the moment it is brightest. */}
        <div className={s.grad} aria-hidden="true" />
        <div className={s.veil} data-hero-veil aria-hidden="true" />

        <div className={s.copy} data-hero-copy>
          <div className={`shell ${s.copyInner}`}>
            {children}

            <div className={s.actions}>
              <Link href={`/${locale}/properties`} className={s.cta}>
                {ar ? "شوف الوحدات المتاحة" : "See available units"}
              </Link>
              <p className={s.call}>
                <span className={s.callLabel}>{ar ? "كلّمنا" : "Call us"}</span>
                <PhoneNumber className={s.callNumber} />
              </p>
            </div>
          </div>
        </div>

        {/* Said once. A hero that fills the screen with no cue is a hero that
          looks like the whole page to anyone who does not immediately
          scroll. */}
        <div className={s.cue} aria-hidden="true">
          <span className={s.cueLine} />
          {ar ? "انزل" : "Scroll"}
        </div>
      </section>
    </>
  );
}
