import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/lib/units";
import { Price, PricePerMetre, Measure, toEasternDigits } from "@/lib/format";
import s from "./UnitRow.module.css";

/**
 * One unit, one row: the photograph on one side and everything known about
 * the unit on the other, with the sides swapping on every row.
 *
 * This replaces a three-across card grid, and the difference is not
 * decorative. A card gives a photograph about 300px and forces the metadata
 * into 13px type; a row gives the photograph half the viewport and lets the
 * price, the area, the legal status and the handover date each have a line
 * of their own. For a page whose entire argument is "look at the actual
 * unit and the actual paperwork", that is the right trade — six units read
 * properly beat twelve skimmed.
 *
 * The alternation is what keeps it from becoming a list. Reading right to
 * left, an odd row puts the picture on the right where the eye already
 * starts; an even row puts it on the left so the eye has to travel. That
 * alternating travel is the rhythm.
 */
export default function UnitRow({
  unit,
  locale,
  index,
  priority = false,
}: {
  unit: Unit;
  locale: string;
  /** 1-based. Sets both the ghost numeral and which side the picture takes. */
  index: number;
  priority?: boolean;
}) {
  const href = `/${locale}/properties/${unit.code.toLowerCase()}`;
  const flipped = index % 2 === 0;

  return (
    <article className={`${s.row} ${flipped ? s.flipped : ""}`}>
      <Link
        href={href}
        className={s.media}
        tabIndex={-1}
        aria-hidden="true"
        data-anim="img"
      >
        {/* Three layers again: the frame clips, the tilt leans toward the
            pointer, the picture travels against the scroll. Each is a
            separate element because each needs its own transform, and
            stacking three on one node means the last one written wins. */}
        <span className={s.tilt} data-anim="tilt" data-tilt="4">
          <span
            className={s.parallax}
            data-anim="parallax"
            data-depth={flipped ? 0.16 : 0.11}
          >
            <Image
              src={unit.image}
              alt={unit.imageAlt}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              quality={85}
              priority={priority}
              className={s.img}
            />
          </span>
        </span>
      </Link>

      <div className={s.detail}>
        {/* Decorative, and marked as such: a screen reader announcing "zero
            one" before every unit adds nothing a heading does not. */}
        <span className={`mono ${s.ghost}`} aria-hidden="true">
          {toEasternDigits(index).padStart(2, "٠")}
        </span>

        <div className={s.detailInner}>
          <p className={s.meta}>
            <span className={`mono ${s.code}`}>{unit.code}</span>
            <span className={s.legal}>{unit.legalStatus}</span>
          </p>

          <h3 className={s.title} data-anim="words">
            {unit.titleAr} — {unit.areaAr}
          </h3>

          <p className={s.price} data-anim="rise" data-delay="1">
            <Price value={unit.price} />
          </p>

          <dl className={s.specs} data-anim="rise" data-stagger data-delay="1">
            <div>
              <dt>المساحة</dt>
              <dd className="mono">
                <Measure value={unit.size} unit="م²" />
                {unit.gardenSize ? (
                  <>
                    {" + "}
                    <Measure value={unit.gardenSize} unit="م² حديقة" />
                  </>
                ) : null}
              </dd>
            </div>
            <div>
              <dt>سعر المتر</dt>
              <dd className="mono">
                <PricePerMetre price={unit.price} area={unit.size} />
              </dd>
            </div>
            <div>
              <dt>التشطيب</dt>
              <dd>{unit.finishing}</dd>
            </div>
            <div>
              <dt>الاستلام</dt>
              <dd>{unit.handoverAr}</dd>
            </div>
          </dl>

          <p className={`mono ${s.checked}`}>
            آخر تحديث للسعر: {unit.priceCheckedAr}
          </p>

          <Link href={href} className={s.cta} data-anim="magnet">
            شوف الوحدة كاملة
            <span aria-hidden="true"> ←</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
