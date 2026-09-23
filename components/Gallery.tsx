"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import s from "./Gallery.module.css";

export type GalleryImage = { src: string; alt: string };

/**
 * Unit.dc.html's gallery: a lead shot plus four thumbnails, the last one
 * carrying a "كل الصور (N)" overlay for the images beyond it. Any tile opens
 * the lightbox at its own index — Esc and the arrow keys navigate it, and in
 * RTL the left arrow moves forward and the right arrow moves back.
 */
export default function Gallery({
  images,
  heading,
  photoDateAr,
}: {
  images: GalleryImage[];
  heading: string;
  photoDateAr: string;
}) {
  const [open, setOpen] = useState(-1);
  const thumbs = images.slice(1, 5);
  const hiddenCount = images.length - 5;
  const dialogRef = useRef<HTMLDialogElement>(null);

  // A native <dialog> renders in the browser's top layer — always above the
  // rest of the page, with no z-index competition possible. That matters
  // here specifically: GSAP leaves a resting `transform: matrix(1,0,0,1,0,0)`
  // on every element it has animated, and per spec a transform (even an
  // identity one) promotes a plain element into its own stacking context —
  // which in Chromium was enough to paint the page's own animated title and
  // price through a `position: fixed; z-index: 200` overlay. The top layer
  // sidesteps the whole stacking-context tree instead of trying to out-rank it.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open >= 0 && !dialog.open) dialog.showModal();
    else if (open < 0 && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setOpen((i) => (i + 1) % images.length);
      else if (e.key === "ArrowRight") setOpen((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <section className={s.section}>
      <div className={s.row}>
        <button
          onClick={() => setOpen(0)}
          data-hover=""
          aria-label="افتح الصور"
          className={s.lead}
        >
          <span className={s.leadParallax} data-anim="parallax" data-depth="0.06">
            <Image
              src={images[0].src}
              alt={heading}
              fill
              sizes="(max-width: 900px) 100vw, 60vw"
              quality={85}
              priority
              className="kenBurns"
              style={{ objectFit: "cover" }}
            />
          </span>
        </button>

        <div className={s.thumbs}>
          {thumbs.map((g, i) => (
            <button
              key={g.src}
              onClick={() => setOpen(i + 1)}
              data-hover=""
              aria-label="افتح الصورة"
              className={s.thumb}
            >
              <Image src={g.src} alt="" fill sizes="25vw" quality={75} style={{ objectFit: "cover" }} />
              {i === thumbs.length - 1 && hiddenCount > 0 ? (
                <span className={s.more}>كل الصور ({images.length})</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>
      <p className={`mono ${s.caption}`}>
        {images.length} صور · التُقطت {photoDateAr} · بدون معالجة لونية
      </p>

      <dialog
        ref={dialogRef}
        className={s.lightbox}
        onClose={() => setOpen(-1)}
        onCancel={() => setOpen(-1)}
      >
        {open >= 0 ? (
          <>
            <div className={s.lbHead}>
              <bdi className="mono">
                {open + 1} / {images.length}
              </bdi>
              <button onClick={() => setOpen(-1)} aria-label="إغلاق" className={s.lbClose}>
                ×
              </button>
            </div>
            <div className={s.lbStage}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[open].src} alt={images[open].alt} className={s.lbImg} />
            </div>
            <div className={s.lbNav}>
              <button
                onClick={() => setOpen((i) => (i - 1 + images.length) % images.length)}
                aria-label="السابقة"
                className={s.lbBtn}
              >
                →
              </button>
              <button
                onClick={() => setOpen((i) => (i + 1) % images.length)}
                aria-label="التالية"
                className={s.lbBtn}
              >
                ←
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  );
}
