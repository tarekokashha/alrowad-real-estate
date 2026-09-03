"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/format";
import { yearsLabel } from "@/lib/units";
import s from "./InstalmentCalculator.module.css";

/**
 * Interest-free, because that is how owner and developer plans in this market
 * actually work: monthly = (price − deposit) / months. Nothing is hidden in a
 * rate, so nothing needs to be disclosed in small print.
 */
export default function InstalmentCalculator({
  price,
  maxYears,
  defaultPct = 30,
}: {
  price: number;
  maxYears: number;
  defaultPct?: number;
}) {
  const [pct, setPct] = useState(defaultPct);
  const [years, setYears] = useState(Math.min(maxYears, 5));

  const down = Math.round((price * pct) / 100);
  const months = years * 12;
  const remaining = price - down;
  const monthly = Math.round(remaining / months);

  return (
    <div className={s.calc}>
      <h3 className={s.title}>اعرف قسطك</h3>

      <div className={s.control}>
        <label htmlFor="down-pct" className={s.label}>
          المقدم
          <span className="mono">
            <bdi>{formatNumber(down)}</bdi> ج.م · <bdi dir="ltr">{pct}%</bdi>
          </span>
        </label>
        <input
          id="down-pct"
          type="range"
          min={10}
          max={60}
          step={5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          className={s.range}
        />
      </div>

      <div className={s.control}>
        <label htmlFor="years" className={s.label}>
          سنين التقسيط
          <span className="mono">
            <bdi>{years}</bdi> {yearsLabel(years)}
          </span>
        </label>
        <input
          id="years"
          type="range"
          min={1}
          max={maxYears}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className={s.range}
        />
      </div>

      <div className={s.result}>
        <span className={s.resultLabel}>القسط الشهري</span>
        <p className={s.monthly}>
          <bdi className="mono">{formatNumber(monthly)}</bdi> ج.م
        </p>
        <p className={`mono ${s.remaining}`}>
          المتبقي <bdi>{formatNumber(remaining)}</bdi> ج.م على{" "}
          <bdi>{months}</bdi> شهرًا
        </p>
      </div>

      <p className={s.note}>بدون فوائد — كما هو متفق مع المالك</p>
    </div>
  );
}
