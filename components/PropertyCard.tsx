import Link from "next/link";
import type { CSSProperties } from "react";
import type { Unit } from "@/lib/units";
import { formatNumber } from "@/lib/format";
import s from "./PropertyCard.module.css";

/** A unit card — Units.dc.html's grid item, and the six featured rows on
 *  the homepage before it: 4:3 photo with a bottom gradient and the legal
 *  status, code and handover overlaid on it; price, size and an optional
 *  tinted instalment-plan line underneath. */
export default function PropertyCard({
  unit,
  href,
  planLine,
  delaySec = 0,
  priority = false,
}: {
  unit: Unit;
  href: string;
  planLine?: string | null;
  delaySec?: number;
  priority?: boolean;
}) {
  const sizeLabel = unit.gardenSize
    ? `${unit.size} م² + حديقة ${unit.gardenSize} م²`
    : `${unit.size} م²`;
  const meta = [unit.floorAr, unit.finishing].filter(Boolean).join(" · ");

  return (
    <Link href={href} data-anim="rise" data-hover="" className={s.card}>
      <div className={s.media}>
        {/* Plain img: the grid can hold anywhere from a handful of units to
            the full catalogue, and next/image's per-page priority budget
            does not fit an unbounded list. */}
        <img
          src={unit.image}
          alt={unit.imageAlt}
          loading={priority ? "eager" : "lazy"}
          className={`${s.img} kenBurns`}
          style={{ "--kb-dur": "18s", "--kb-delay": `${-delaySec}s` } as CSSProperties}
        />
        <div className={s.gradient} aria-hidden="true" />
        <span className={s.legalPill}>{unit.legalStatus}</span>
        <bdi className={`mono ${s.codeTag}`}>{unit.code}</bdi>
        <span className={s.handoverTag}>{unit.handoverAr}</span>
      </div>

      <div className={s.body}>
        <div className={s.titleRow}>
          <span className={s.title}>{unit.titleAr}</span>
          <span className={s.size}>{sizeLabel}</span>
        </div>
        <span className={s.area}>{unit.areaAr}</span>
        <div className={s.priceRow}>
          <span>
            <bdi className={s.price}>{formatNumber(unit.price)}</bdi>{" "}
            <span className={s.currency}>ج.م</span>
          </span>
          <span className={`mono ${s.perM}`}>
            <bdi>{formatNumber(Math.round(unit.price / unit.size))}</bdi> ج.م/م²
          </span>
        </div>
        {planLine ? <div className={s.plan}>{planLine}</div> : null}
        <div className={s.meta}>{meta}</div>
        <div className={s.checked}>السعر اتراجع {unit.priceCheckedAr}</div>
      </div>
    </Link>
  );
}
