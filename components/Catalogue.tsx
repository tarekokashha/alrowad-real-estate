"use client";

import { useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import {
  UNITS,
  AREAS,
  TYPES,
  LEGAL_VALUES,
  FINISHINGS,
  PRICE_MIN,
  PRICE_MAX,
  planFor,
  yearsLabel,
  unitsLabel,
  type Unit,
} from "@/lib/units";
import { formatNumber, whatsappHref } from "@/lib/format";
import s from "./Catalogue.module.css";

type Sort = "newest" | "priceAsc" | "priceDesc" | "perMetreAsc";

const SORTS: { key: Sort; labelAr: string }[] = [
  { key: "newest", labelAr: "الأحدث إضافة" },
  { key: "priceAsc", labelAr: "السعر من الأقل" },
  { key: "priceDesc", labelAr: "السعر من الأعلى" },
  { key: "perMetreAsc", labelAr: "سعر المتر من الأقل" },
];

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function Catalogue({ locale }: { locale: string }) {
  const [areas, setAreas] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [legals, setLegals] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState<Sort>("newest");

  // «اعرف قسطك» — the affordability search.
  const [deposit, setDeposit] = useState("");
  const [monthly, setMonthly] = useState("");
  const [affordOn, setAffordOn] = useState(false);

  const depositNum = Number(deposit.replace(/[^\d]/g, "")) || 0;
  const monthlyNum = Number(monthly.replace(/[^\d]/g, "")) || 0;
  const affordActive = affordOn && depositNum > 0 && monthlyNum > 0;

  const results = useMemo(() => {
    let out: (Unit & { plan?: ReturnType<typeof planFor> })[] = UNITS.filter((u) => {
      if (areas.length && !areas.includes(u.areaKey)) return false;
      if (types.length && !types.includes(u.type)) return false;
      if (legals.length && !legals.includes(u.legalStatus)) return false;
      if (finishes.length && !finishes.includes(u.finishing)) return false;
      if (u.price > maxPrice) return false;
      return true;
    });

    if (affordActive) {
      out = out
        .map((u) => ({ ...u, plan: planFor(u, depositNum, monthlyNum) }))
        .filter((u) => u.plan !== null);
    }

    const sorted = [...out];
    if (sort === "priceAsc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "perMetreAsc")
      sorted.sort((a, b) => a.price / a.size - b.price / b.size);
    return sorted;
  }, [areas, types, legals, finishes, maxPrice, sort, affordActive, depositNum, monthlyNum]);

  const clearAll = () => {
    setAreas([]);
    setTypes([]);
    setLegals([]);
    setFinishes([]);
    setMaxPrice(PRICE_MAX);
    setAffordOn(false);
  };

  const anyFilter =
    areas.length || types.length || legals.length || finishes.length ||
    maxPrice < PRICE_MAX || affordActive;

  return (
    <>
      {/* ---- «اعرف قسطك» --------------------------------------------------
          Egyptians buy by instalment capacity, not by sticker price. Starting
          from the buyer's own money rather than the unit's price is the one
          search no competitor in the October zone offers. */}
      <section id="affordability" className={s.afford}>
        <div className="shell grid12">
          <div className={s.affordIntro}>
            <span className="eyebrow">اعرف قسطك</span>
            <h2 className={s.affordH2}>ابدأ من فلوسك، لا من سعر الوحدة</h2>
            <p className={s.affordLede}>
              اكتب المقدَّم اللي معاك والقسط اللي تقدر عليه، وإحنا نطلّع لك
              الوحدات اللي تنفع فعلًا، بخطة سداد مكتوبة لكل وحدة.
            </p>
          </div>

          <div className={s.affordForm}>
            <div className={s.field}>
              <label htmlFor="deposit">المقدَّم المتاح (ج.م)</label>
              <input
                id="deposit"
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={deposit}
                placeholder="400,000"
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="monthly">القسط الشهري (ج.م)</label>
              <input
                id="monthly"
                type="text"
                inputMode="numeric"
                dir="ltr"
                value={monthly}
                placeholder="20,000"
                onChange={(e) => setMonthly(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={s.affordBtn}
              onClick={() => setAffordOn((v) => !v)}
              aria-pressed={affordOn}
              disabled={!depositNum || !monthlyNum}
            >
              {affordOn ? "إلغاء الحساب" : "اعرف الوحدات"}
            </button>
          </div>

          <p className={s.affordNote}>
            الحساب بأقصى مدة تقسيط متاحة لكل وحدة وبأقل مقدَّم يقبله المالك (لا
            يقل عن <bdi dir="ltr">20%</bdi>)، بدون فوائد. الأرقام تقديرية حتى
            نراجع خطة المالك معك.
          </p>
        </div>
      </section>

      {/* ---- Filters + grid ---- */}
      <section className={s.body}>
        <div className="shell grid12">
          <aside className={s.rail} aria-label="الفلاتر">
            <div className={s.railHead}>
              <h2 className={s.railTitle}>الفلاتر</h2>
              {anyFilter ? (
                <button type="button" className={s.clear} onClick={clearAll}>
                  مسح الكل
                </button>
              ) : null}
            </div>

            <ChipGroup
              legend="المنطقة"
              options={AREAS}
              selected={areas}
              onToggle={(v) => setAreas((a) => toggle(a, v))}
            />
            <ChipGroup
              legend="النوع"
              options={TYPES}
              selected={types}
              onToggle={(v) => setTypes((a) => toggle(a, v))}
            />
            <ChipGroup
              legend="الحالة القانونية"
              options={LEGAL_VALUES}
              selected={legals}
              onToggle={(v) => setLegals((a) => toggle(a, v))}
            />
            <ChipGroup
              legend="التشطيب"
              options={FINISHINGS}
              selected={finishes}
              onToggle={(v) => setFinishes((a) => toggle(a, v))}
            />

            <div className={s.rangeBlock}>
              <label htmlFor="maxprice" className={s.legend}>
                أقصى سعر: <bdi className="mono">{formatNumber(maxPrice)}</bdi> ج.م
              </label>
              <input
                id="maxprice"
                type="range"
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className={s.range}
              />
              <div className={`mono ${s.rangeEnds}`} dir="ltr">
                <span>{formatNumber(PRICE_MIN)}</span>
                <span>{formatNumber(PRICE_MAX)}</span>
              </div>
            </div>
          </aside>

          <div className={s.results}>
            <div className={s.resultsHead}>
              <p className={s.count}>
                <bdi className="mono">{results.length}</bdi>{" "}
                {unitsLabel(results.length)}
              </p>
              <label className={s.sortWrap}>
                <span className={s.sortLabel}>الترتيب</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className={s.sort}
                >
                  {SORTS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.labelAr}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {results.length === 0 ? (
              /* Written copy, not an illustration — and it offers a way out. */
              <div className={s.empty}>
                <h3 className={s.emptyTitle}>مفيش وحدة مطابقة للفلاتر دي</h3>
                <p>
                  وسّع أقصى سعر أو امسح الفلاتر — أو كلّمنا على واتساب وإحنا
                  ندوّر لك.
                </p>
                <a
                  className={s.emptyCta}
                  href={whatsappHref(
                    "السلام عليكم، بدور على وحدة في حدائق أكتوبر ومش لاقي المطلوب على الموقع",
                  )}
                  rel="noopener"
                >
                  كلّمنا على واتساب ←
                </a>
              </div>
            ) : (
              <div className={s.grid}>
                {results.map((u, i) => (
                  <div key={u.code} className={s.cell}>
                    <PropertyCard unit={u} locale={locale} priority={i < 3} />
                    {u.plan ? (
                      <p className={`mono ${s.plan}`}>
                        خطتك: مقدم{" "}
                        <bdi>{formatNumber(u.plan.minDown)}</bdi> وقسط{" "}
                        <bdi>{formatNumber(u.plan.monthly)}</bdi> على{" "}
                        <bdi>{u.plan.years}</bdi> {yearsLabel(u.plan.years)}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ChipGroup({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className={s.group}>
      <legend className={s.legend}>{legend}</legend>
      <div className={s.chips}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`${s.chip} ${selected.includes(o) ? s.chipOn : ""}`}
            aria-pressed={selected.includes(o)}
            onClick={() => onToggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
