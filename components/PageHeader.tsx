import type { ReactNode } from "react";
import Image from "next/image";
import s from "./PageHeader.module.css";

/**
 * The masthead every interior page wears.
 *
 * One component rather than six near-identical blocks in six stylesheets.
 * That is not only less code — it is the only way six pages stay in step
 * when the treatment changes, which on this rebuild it did twice.
 *
 * It is the hero's treatment at a third of the height: the same dark ground,
 * the same veil, the same heading face at the same weight. What it does not
 * have is the hero's scrub. A reader who clicked through to a specific page
 * came for what is on it, and making them scroll past an animation first is
 * a toll, not a welcome.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  image,
  imageAlt = "",
  children,
}: {
  eyebrow?: string;
  title: string;
  /** Usually a plain sentence; a ReactNode when a figure inside it needs its
   *  own markup — a <bdi> around a number so RTL punctuation cannot reorder
   *  around it, for one. */
  lede?: ReactNode;
  /** Small dated facts — the sample size, the last revision, the count. */
  meta?: { label: string; value: string }[];
  image: string;
  imageAlt?: string;
  /** The escape hatch. One page needed a bulleted claims list with an inline
   *  link inside it, which is a different shape from a dt/dd fact — rather
   *  than grow `meta` to cover a case only one page has, that page renders
   *  its own list here, styled with its own page-scoped CSS for a dark
   *  ground (the light-background tokens the list used before this
   *  component existed would be invisible against the photo). */
  children?: ReactNode;
}) {
  return (
    <section className={s.header}>
      <div className={s.media}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={82}
          className={s.img}
        />
      </div>
      <div className={s.veil} aria-hidden="true" />

      <div className={`shell ${s.inner}`}>
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className={s.h1} data-anim="words">
          {title}
        </h1>
        {lede ? (
          <p className={s.lede} data-anim="rise" data-delay="1">
            {lede}
          </p>
        ) : null}

        {meta?.length ? (
          <dl className={s.meta} data-anim="rise" data-stagger data-delay="1">
            {meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd className="mono">{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {children}
      </div>
    </section>
  );
}
