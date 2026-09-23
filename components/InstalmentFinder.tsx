"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import RangeSlider from "./RangeSlider";
import { planFor, unitsLabel, yearsLabel, type Unit, type Plan } from "@/lib/units";
import { formatNumber } from "@/lib/format";
import s from "./InstalmentFinder.module.css";

/**
 * Scene 08 — «اعرف قسطك». The reverse instalment search: state the deposit
 * you hold and the monthly payment you can carry, get back only the units
 * that genuinely work, each with a written plan. See lib/units.planFor for
 * the affordability rule (owner/developer plans here are interest-free).
 */
export default function InstalmentFinder({
  units,
  locale,
}: {
  units: Unit[];
  locale: string;
}) {
  const [dep, setDep] = useState(600_000);
  const [mon, setMon] = useState(22_000);

  const matches = useMemo(() => {
    const out: { unit: Unit; plan: Plan }[] = [];
    for (const unit of units) {
      const plan = planFor(unit, dep, mon);
      if (plan) out.push({ unit, plan });
    }
    return out;
  }, [units, dep, mon]);

  return (
    <section id="calc" className={s.section}>
      <div className={s.grid}>
        <div className={s.left}>
          <div>
            <span className="eyebrow">٠٨ — اعرف قسطك</span>
            <h2 className={s.h2} data-anim="rise">
              قولنا معاك كام، نقولك تسكن فين.
            </h2>
            <p className={s.lede}>
              حدد المقدم اللي معاك والقسط الشهري اللي تقدر عليه، ونطلعلك الوحدات اللي
              تنفع فعلًا. خطط الملاك والمطورين هنا من غير فوايد.
            </p>
          </div>

          <div className={s.panel}>
            <RangeSlider
              label="المقدم المتاح"
              value={dep}
              min={150_000}
              max={2_000_000}
              dragStep={10_000}
              keyStep={50_000}
              format={formatNumber}
              unit="ج.م"
              onChange={setDep}
            />
            <hr className={s.hr} />
            <RangeSlider
              label="القسط الشهري"
              value={mon}
              min={5_000}
              max={60_000}
              dragStep={500}
              keyStep={1_000}
              format={formatNumber}
              unit="ج.م"
              onChange={setMon}
            />
          </div>

          <div className={s.resultLine}>
            <span className={s.count}>{matches.length}</span>
            <span className={s.countLabel}>
              {unitsLabel(matches.length)} تنفع معاك من {String(units.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className={s.list}>
          {matches.length === 0 ? (
            <div className={s.empty}>
              مفيش وحدة بالمقدم والقسط دول دلوقتي. زوّد المقدم أو القسط، أو ابعتلنا
              ونبلغك أول ما تنزل وحدة مناسبة.
            </div>
          ) : (
            matches.map(({ unit, plan }) => (
              <Link
                key={unit.code}
                href={`/${locale}/properties/${unit.code}`}
                data-hover=""
                className={s.card}
              >
                <div className={s.thumb}>
                  <img
                    src={unit.image}
                    alt=""
                    className="kenBurns"
                    style={{ "--kb-dur": "15s" } as CSSProperties}
                  />
                </div>
                <div className={s.info}>
                  <div className={s.top}>
                    <span className={s.title}>
                      {unit.titleAr} · {unit.areaAr}
                    </span>
                    <bdi className={`mono ${s.code}`}>{unit.code}</bdi>
                  </div>
                  <div className={s.figures}>
                    <span>
                      السعر <bdi className={s.figVal}>{formatNumber(unit.price)}</bdi>
                    </span>
                    <span>
                      مقدم <bdi className={s.figBronze}>{formatNumber(plan.minDown)}</bdi>
                    </span>
                    <span>
                      شهري <bdi className={s.figBronze}>{formatNumber(plan.monthly)}</bdi> ×{" "}
                      {unit.maxYears} {yearsLabel(unit.maxYears)}
                    </span>
                  </div>
                  <div className={s.legal}>{unit.legalStatus}</div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
