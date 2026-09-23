"use client";

import { useMemo, useState } from "react";
import RangeSlider from "./RangeSlider";
import { formatNumber } from "@/lib/format";
import { yearsLabel } from "@/lib/units";
import s from "./InstalmentCalculator.module.css";

/**
 * Unit.dc.html's own sidebar calculator — one specific unit, no interest:
 * down = price × pct/100, monthly = (price − down) / (years × 12).
 */
export default function InstalmentCalculator({
  price,
  maxYears,
}: {
  price: number;
  maxYears: number;
}) {
  const [pct, setPct] = useState(30);
  const [years, setYears] = useState(maxYears);

  const { down, monthly, months } = useMemo(() => {
    const down = Math.round(price * (pct / 100));
    const months = years * 12;
    const monthly = Math.round((price - down) / months);
    return { down, monthly, months };
  }, [price, pct, years]);

  return (
    <div className={s.card}>
      <h3 className={s.title}>احسب قسطك على الوحدة دي</h3>

      <RangeSlider
        label="المقدم"
        value={pct}
        min={20}
        max={70}
        dragStep={5}
        keyStep={5}
        format={(v) => String(v)}
        unit="%"
        onChange={setPct}
      />
      <RangeSlider
        label="مدة التقسيط"
        value={years}
        min={1}
        max={Math.max(1, maxYears)}
        dragStep={1}
        keyStep={1}
        format={(v) => `${v} ${yearsLabel(v)}`}
        onChange={setYears}
      />

      <div className={s.result}>
        <div className={s.row}>
          <span>المقدم</span>
          <bdi className="mono">{formatNumber(down)} ج.م</bdi>
        </div>
        <div className={s.row}>
          <span>عدد الأقساط</span>
          <bdi className="mono">{formatNumber(months)}</bdi>
        </div>
        <div className={s.monthlyRow}>
          <span>القسط الشهري</span>
          <bdi className={s.monthly}>{formatNumber(monthly)} ج.م</bdi>
        </div>
      </div>

      <p className={s.disclaimer}>
        تقدير بدون فوائد بناءً على خطة المالك أو المطور. الأرقام النهائية في العقد.
      </p>
    </div>
  );
}
