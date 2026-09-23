import type { ReactNode } from "react";
import s from "./StatStrip.module.css";

/**
 * The hairline stat grid under a sub-page header (Sold, About, Gulf): white
 * cells over a 1px line colour, one figure each. Reused as-is rather than
 * redefined per page, so it never drifts out of step between them.
 */
export default function StatStrip({
  items,
}: {
  items: { label: string; value: ReactNode; big?: boolean }[];
}) {
  return (
    <div className={s.grid}>
      {items.map((it, i) => (
        <div key={it.label} data-anim="rise" data-delay={i + 1} className={s.cell}>
          <span className={s.label}>{it.label}</span>
          <span className={`${s.value} ${it.big ? s.big : ""}`}>{it.value}</span>
        </div>
      ))}
    </div>
  );
}
