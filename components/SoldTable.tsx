"use client";

import { useMemo, useState } from "react";
import { soldFacetsFor, type SoldRecord } from "@/lib/sold";
import { formatNumber } from "@/lib/format";
import s from "./SoldTable.module.css";

type SortKey = "size" | "price" | "pm" | "days" | "date";
const SORT_COLS: { key: SortKey; labelAr: string }[] = [
  { key: "size", labelAr: "المساحة" },
  { key: "price", labelAr: "سعر البيع" },
  { key: "pm", labelAr: "سعر المتر" },
  { key: "days", labelAr: "مدة العرض" },
  { key: "date", labelAr: "التاريخ" },
];

/** Sold.dc.html: a year segmented control, area chips, a live one-line
 *  summary of the filtered set, and a sortable table — the CONTRACTED price
 *  the buyer actually paid, never the asking price before negotiation. */
export default function SoldTable({ records }: { records: SoldRecord[] }) {
  const { years, areas } = useMemo(() => soldFacetsFor(records), [records]);

  const [year, setYear] = useState<number | "all">("all");
  const [area, setArea] = useState<string | "all">("all");
  const [sort, setSort] = useState<SortKey>("date");
  const [dir, setDir] = useState(-1);

  const sortBy = (k: SortKey) => {
    setDir((d) => (sort === k ? -d : -1));
    setSort(k);
  };

  const rows = useMemo(() => {
    const withOrder = records.map((r, i) => ({ ...r, _order: i }));
    const filtered = withOrder.filter(
      (r) => (year === "all" || r.year === year) && (area === "all" || r.areaAr === area),
    );
    const keyFn: Record<SortKey, (r: (typeof filtered)[number]) => number> = {
      size: (r) => r.size,
      price: (r) => r.price,
      pm: (r) => r.price / r.size,
      days: (r) => r.days,
      date: (r) => -r._order,
    };
    const k = keyFn[sort];
    return [...filtered].sort((a, b) => (k(a) - k(b)) * dir);
  }, [records, year, area, sort, dir]);

  const medianPm = useMemo(() => {
    if (rows.length === 0) return null;
    const pms = rows.map((r) => r.price / r.size).sort((a, b) => a - b);
    const mid = Math.floor(pms.length / 2);
    return pms.length % 2 ? pms[mid] : (pms[mid - 1] + pms[mid]) / 2;
  }, [rows]);

  const arrow = (k: SortKey) => (sort === k ? (dir < 0 ? " ↓" : " ↑") : "");

  return (
    <>
      <div className={s.controls}>
        <div className={s.yearTrack}>
          <button
            onClick={() => setYear("all")}
            className={`${s.yearChip} ${year === "all" ? s.yearChipOn : ""}`}
          >
            كل السنوات
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`${s.yearChip} ${year === y ? s.yearChipOn : ""}`}
            >
              <span className="mono">{y}</span>
            </button>
          ))}
        </div>
        <div className={s.summary}>
          <bdi className={s.summaryCount}>{rows.length}</bdi> عملية · وسيط سعر المتر{" "}
          <bdi className={s.summaryPm}>{medianPm ? formatNumber(Math.round(medianPm)) : "—"}</bdi>{" "}
          ج.م
        </div>
      </div>

      <div className={s.areaChips}>
        <button
          onClick={() => setArea("all")}
          className={`${s.areaChip} ${area === "all" ? s.areaChipOn : ""}`}
        >
          كل المناطق
        </button>
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setArea(a)}
            className={`${s.areaChip} ${area === a ? s.areaChipOn : ""}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className={s.tableWrap}>
        <div className={s.tableMin}>
          <div className={`${s.row} ${s.head}`}>
            <span>الكود</span>
            <span>الوحدة</span>
            <span>المنطقة</span>
            <button onClick={() => sortBy("size")} className={s.sortBtn}>
              المساحة{arrow("size")}
            </button>
            <button onClick={() => sortBy("price")} className={s.sortBtn}>
              سعر البيع{arrow("price")}
            </button>
            <button onClick={() => sortBy("pm")} className={s.sortBtn}>
              سعر المتر{arrow("pm")}
            </button>
            <span>الحالة القانونية وقت البيع</span>
            <button onClick={() => sortBy("days")} className={s.sortBtn}>
              مدة العرض{arrow("days")}
            </button>
            <button onClick={() => sortBy("date")} className={s.sortBtn}>
              التاريخ{arrow("date")}
            </button>
          </div>

          {rows.map((r) => (
            <div key={r.code} className={s.row}>
              <bdi className={`mono ${s.code}`}>{r.code}</bdi>
              <span className={s.title}>{r.titleAr}</span>
              <span className={s.area}>{r.areaAr}</span>
              <span className="mono">
                <bdi>{r.size}</bdi> م²
              </span>
              <bdi className={`mono ${s.price}`}>{formatNumber(r.price)}</bdi>
              <bdi className="mono">{formatNumber(Math.round(r.price / r.size))}</bdi>
              <span className={s.legal}>{r.legalStatus}</span>
              <span className="mono">
                <bdi>{r.days}</bdi> يوم
              </span>
              <bdi className={s.date}>{r.dateAr}</bdi>
            </div>
          ))}

          {rows.length === 0 ? <div className={s.empty}>مفيش تعاقدات مطابقة. امسح الفلاتر أو اختر سنة تانية.</div> : null}
        </div>
      </div>
    </>
  );
}
