"use client";

import { useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import RangeSlider from "./RangeSlider";
import {
  planFor,
  unitsLabel,
  yearsLabel,
  type Unit,
} from "@/lib/units";
import { formatNumber, parseArabicDate } from "@/lib/format";
import s from "./Catalogue.module.css";

type SortKey = "new" | "low" | "high" | "size";
const SORTS: { key: SortKey; labelAr: string }[] = [
  { key: "new", labelAr: "الأحدث مراجعة" },
  { key: "low", labelAr: "الأقل سعرًا" },
  { key: "high", labelAr: "الأعلى سعرًا" },
  { key: "size", labelAr: "الأكبر مساحة" },
];

function count<T>(list: T[], pick: (x: T) => boolean) {
  return list.filter(pick).length;
}

/**
 * Units.dc.html: chip filters over the region, type and legal status; a
 * sort segmented control; an affordability toggle that reveals the two
 * drag sliders and tints every matching card with its plan line; and the
 * result grid, client-side over the server-rendered inventory.
 */
export default function Catalogue({ locale, units }: { locale: string; units: Unit[] }) {
  const [area, setArea] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [legal, setLegal] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("new");
  const [afford, setAfford] = useState(false);
  const [dep, setDep] = useState(600_000);
  const [mon, setMon] = useState(22_000);

  const areaChips = useMemo(() => {
    const areas = [...new Set(units.map((u) => u.areaKey))];
    return [
      { key: "all", labelAr: "كل المناطق" },
      ...areas.map((a) => ({ key: a, labelAr: `${a} · ${count(units, (u) => u.areaKey === a)}` })),
    ];
  }, [units]);

  const typeChips = useMemo(() => {
    const types = [...new Set(units.map((u) => u.type))];
    return [
      { key: "all", labelAr: "كل الأنواع" },
      ...types.map((t) => ({ key: t, labelAr: `${t} · ${count(units, (u) => u.type === t)}` })),
    ];
  }, [units]);

  const legalChips = useMemo(() => {
    const legals = [...new Set(units.map((u) => u.legalStatus))];
    return [
      { key: "all", labelAr: "الكل" },
      ...legals.map((l) => ({ key: l, labelAr: `${l} · ${count(units, (u) => u.legalStatus === l)}` })),
    ];
  }, [units]);

  const results = useMemo(() => {
    let list = units
      .filter((u) => area === "all" || u.areaKey === area)
      .filter((u) => type === "all" || u.type === type)
      .filter((u) => legal === "all" || u.legalStatus === legal)
      .map((u) => ({ unit: u, plan: afford ? planFor(u, dep, mon) : null }));

    if (afford) list = list.filter((x) => x.plan !== null);

    const sorters: Record<SortKey, (a: (typeof list)[number], b: (typeof list)[number]) => number> = {
      new: (a, b) => parseArabicDate(b.unit.priceCheckedAr) - parseArabicDate(a.unit.priceCheckedAr),
      low: (a, b) => a.unit.price - b.unit.price,
      high: (a, b) => b.unit.price - a.unit.price,
      size: (a, b) => b.unit.size - a.unit.size,
    };
    return [...list].sort(sorters[sort]);
  }, [units, area, type, legal, sort, afford, dep, mon]);

  const showReset = area !== "all" || type !== "all" || legal !== "all" || afford;

  return (
    <section className={s.section}>
      <div className={s.panel}>
        <div className={s.filterGrid}>
          <span className={s.filterLabel}>المنطقة</span>
          <div className={s.chips}>
            {areaChips.map((c) => (
              <button
                key={c.key}
                onClick={() => setArea(c.key)}
                className={`${s.chip} ${area === c.key ? s.chipOn : ""}`}
              >
                {c.labelAr}
              </button>
            ))}
          </div>

          <span className={s.filterLabel}>النوع</span>
          <div className={s.chips}>
            {typeChips.map((c) => (
              <button
                key={c.key}
                onClick={() => setType(c.key)}
                className={`${s.chip} ${type === c.key ? s.chipOn : ""}`}
              >
                {c.labelAr}
              </button>
            ))}
          </div>

          <span className={s.filterLabel}>الحالة القانونية</span>
          <div className={s.chips}>
            {legalChips.map((c) => (
              <button
                key={c.key}
                onClick={() => setLegal(c.key)}
                className={`${s.chip} ${legal === c.key ? s.chipOn : ""}`}
              >
                {c.labelAr}
              </button>
            ))}
          </div>
        </div>

        <hr className={s.hr} />

        <div className={s.sortRow}>
          <div className={s.sortTrack}>
            {SORTS.map((so) => (
              <button
                key={so.key}
                onClick={() => setSort(so.key)}
                className={`${s.sortChip} ${sort === so.key ? s.sortChipOn : ""}`}
              >
                {so.labelAr}
              </button>
            ))}
          </div>
          <button onClick={() => setAfford((v) => !v)} className={s.affordToggle}>
            <span>ابحث بالمقدم والقسط</span>
            <span className={`${s.switch} ${afford ? s.switchOn : ""}`}>
              <span className={s.switchDot} />
            </span>
          </button>
        </div>

        {afford ? (
          <div className={s.affordPanel}>
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
        ) : null}
      </div>

      <div className={s.resultLine}>
        <div className={s.resultCount}>
          <span className={s.count}>{results.length}</span>
          <span className={s.countLabel}>
            {unitsLabel(results.length)} من {units.length}
          </span>
        </div>
        {showReset ? (
          <button
            onClick={() => {
              setArea("all");
              setType("all");
              setLegal("all");
              setAfford(false);
            }}
            className={s.reset}
          >
            مسح الفلاتر
          </button>
        ) : null}
      </div>

      <div className={s.grid}>
        {results.map(({ unit, plan }, i) => (
          <PropertyCard
            key={unit.code}
            unit={unit}
            href={`/${locale}/properties/${unit.code}`}
            priority={i < 3}
            delaySec={(i % 6) * 2.3}
            planLine={
              plan
                ? `مقدم ${formatNumber(plan.minDown)} · شهري ${formatNumber(plan.monthly)} × ${unit.maxYears} ${yearsLabel(unit.maxYears)}`
                : null
            }
          />
        ))}
      </div>

      {results.length === 0 ? (
        <div className={s.empty}>
          مفيش وحدة مطابقة دلوقتي. غيّر الفلاتر، أو ابعتلنا على واتساب ونبلغك أول ما تنزل
          وحدة مناسبة.
        </div>
      ) : null}
    </section>
  );
}
