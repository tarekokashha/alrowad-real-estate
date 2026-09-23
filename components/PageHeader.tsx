import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import s from "./PageHeader.module.css";

/**
 * The sub-page masthead every interior page wears (About.dc.html,
 * Units.dc.html, Gulf.dc.html, …): a plain two-column text header — right
 * column the eyebrow and H1, left column the lede and dated facts — over the
 * page's own limestone ground, no photo behind the type. A full-width photo
 * follows underneath, with parallax and the site's idle Ken Burns; pages
 * that lead with a data table instead (the sold archive) simply omit it.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  meta,
  image,
  imageAlt = "",
  imageHeight = "clamp(260px, 48vh, 540px)",
  imageCaption,
  stats,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: { label: string; value: string }[];
  image?: string;
  imageAlt?: string;
  imageHeight?: string;
  imageCaption?: ReactNode;
  /** A full-width block between the title grid and the photo — the sold
   *  archive's stat strip, which has no photo to sit above at all. */
  stats?: ReactNode;
  /** The escape hatch for a page whose left column needs something other
   *  than a plain fact list — the Gulf page's summary strip, for one. */
  children?: ReactNode;
}) {
  return (
    <section className={s.header}>
      <div className={`shell ${s.grid}`}>
        <div className={s.titleCol}>
          {eyebrow ? (
            <span className="eyebrow" data-anim="fade">
              {eyebrow}
            </span>
          ) : null}
          <h1 className={s.h1} data-anim="rise" data-delay="1">
            {title}
          </h1>
        </div>
        <div className={s.asideCol}>
          {lede ? (
            <div className={s.lede} data-anim="rise">
              {lede}
            </div>
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
      </div>

      {stats ? <div className="shell">{stats}</div> : null}

      {image ? (
        <div
          className={`shell ${s.mediaWrap}`}
          style={{ "--img-h": imageHeight } as CSSProperties}
        >
          <div className={s.media} data-anim="parallax" data-depth="0.12">
            <Image
              src={image}
              alt={imageAlt}
              fill
              priority
              sizes="100vw"
              quality={85}
              className={`${s.img} kenBurns`}
              style={{ "--kb-dur": "24s" } as CSSProperties}
            />
          </div>
          {imageCaption ? <p className={s.imgCaption}>{imageCaption}</p> : null}
        </div>
      ) : null}
    </section>
  );
}
