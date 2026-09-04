"use client";

import { useMemo, useState } from "react";
import { soldFacetsFor, type SoldRecord } from "@/lib/sold";
import { formatNumber } from "@/lib/format";
import s from "./SoldTable.module.css";

/** `records` come from the server so the archive reflects the CMS. */
export default function SoldTable({ records }: { records: SoldRecord[] }) {
  const { years: SOLD_YEARS, areas: SOLD_AREAS } = useMemo(
    () => soldFacetsFor(records),
    [records],
  );

  const [year, setYear] = useState<number | null>(null);
  const [area, setArea] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      records.filter(
        (r) => (year === null || r.year === year) && (area === null || r.areaAr === area),
      ),
    [records, year, area],
  );

  const active = year !== null || area !== null;

  return (
    <>
      <div className={s.bar}>
        <div className={s.group}>
          <span className={s.legend}>السنة</span>
          <div className={s.chips}>
            {SOLD_YEARS.map((y) => (
              <button
                key={y}
                type="button"
                className={`${s.chip} ${year === y ? s.on : ""}`}
                aria-pressed={year === y}
                onClick={() => setYear(year === y ? null : y)}
              >
                <span className="mono">{y}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={s.group}>
          <span className={s.legend}>المنطقة</span>
          <div className={s.chips}>
            {SOLD_AREAS.map((a) => (
              <button
                key={a}
                type="button"
                className={`${s.chip} ${area === a ? s.on : ""}`}
                aria-pressed={area === a}
                onClick={() => setArea(area === a ? null : a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className={s.barEnd}>
          <span className={`mono ${s.count}`}>
            <bdi>{rows.length}</bdi> تعاقد
          </span>
          {active ? (
            <button
              type="button"
              className={s.clear}
              onClick={() => {
                setYear(null);
                setArea(null);
              }}
            >
              مسح
            </button>
          ) : null}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className={s.empty}>
          <h3>مفيش تعاقدات مطابقة</h3>
          <p>امسح الفلاتر أو اختر سنة تانية.</p>
        </div>
      ) : (
        <div className={s.wrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">كود الوحدة</th>
                <th scope="col">الوحدة</th>
                <th scope="col">المنطقة</th>
                <th scope="col">المساحة</th>
                <th scope="col">سعر البيع</th>
                <th scope="col">سعر المتر</th>
                <th scope="col">الحالة القانونية وقت البيع</th>
                <th scope="col">مدة العرض</th>
                <th scope="col">تاريخ التعاقد</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.code}>
                  <th scope="row" className="mono">
                    {r.code}
                  </th>
                  <td>{r.titleAr}</td>
                  <td>{r.areaAr}</td>
                  <td className="mono">
                    <bdi>{r.size}</bdi>
                    <span className="measure-unit"> م²</span>
                  </td>
                  <td className="mono">
                    <bdi>{formatNumber(r.price)}</bdi>
                  </td>
                  <td className="mono">
                    <bdi>{formatNumber(Math.round(r.price / r.size))}</bdi>
                  </td>
                  <td className={s.legal}>{r.legalStatus}</td>
                  <td className="mono">
                    <bdi>{r.days}</bdi>
                    <span className="measure-unit"> يوم</span>
                  </td>
                  <td className="mono">
                    <bdi>{r.dateAr}</bdi>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
