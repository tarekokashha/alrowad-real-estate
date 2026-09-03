import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/lib/units";
import { Price, PricePerMetre, Measure } from "@/lib/format";
import s from "./PropertyCard.module.css";

/**
 * The card is: one image at a fixed ratio, then a typeset stack below it.
 *
 * It is NOT bordered, shadowed, rounded past 4px, badged over the photo,
 * carrying a heart icon, or carrying a `🛏️ 3 · 🚿 2 · 📐 150m²` icon row.
 * The metadata is typeset, not iconified — that one decision is most of the
 * distance between this and every template in the market.
 *
 * The legal status sits above the name, before the price, because it is the
 * thing the buyer is actually afraid of. Never a green tick: a tick is a
 * claim, a labelled value is a disclosure.
 *
 * Every card in a grid uses the SAME aspect ratio. Mixing ratios within one
 * grid is the fastest way to make AI-generated photography look fake.
 */
export default function PropertyCard({
  unit,
  locale,
  priority = false,
}: {
  unit: Unit;
  locale: string;
  priority?: boolean;
}) {
  const href = `/${locale}/properties/${unit.code.toLowerCase()}`;

  return (
    <article className={s.card}>
      <Link href={href} className={s.media} tabIndex={-1} aria-hidden="true">
        <Image
          src={unit.image}
          alt={unit.imageAlt}
          fill
          sizes="(max-width: 900px) 100vw, (max-width: 1100px) 50vw, 33vw"
          quality={80}
          priority={priority}
          className={s.img}
        />
      </Link>

      <div className={s.body}>
        <span className={`mono ${s.code}`}>{unit.code}</span>
        <span className={s.legal}>{unit.legalStatus}</span>

        <h3 className={s.title}>
          <Link href={href}>
            {unit.titleAr}
            <br />
            {unit.areaAr}
          </Link>
        </h3>

        <p className={s.price}>
          <Price value={unit.price} />
        </p>

        <p className={`mono ${s.metrics}`}>
          <PricePerMetre price={unit.price} area={unit.size} />
          {" · "}
          <Measure value={unit.size} unit="م²" />
          {unit.gardenSize ? (
            <>
              {" + "}
              <Measure value={unit.gardenSize} unit="م² حديقة" />
            </>
          ) : unit.floorAr ? (
            <> · {unit.floorAr}</>
          ) : null}
        </p>

        <p className={s.spec}>
          {unit.finishing} · {unit.handoverAr} · {unit.saleTypeAr}
        </p>

        <p className={`mono ${s.checked}`}>
          آخر تحديث للسعر: {unit.priceCheckedAr}
        </p>
      </div>
    </article>
  );
}
