"use client";

import { useId, useRef, useState } from "react";
import s from "./Process.module.css";

export type Step = {
  numAr: string;
  titleAr: string;
  bodyAr: string;
};

/**
 * The buying process, as a numbered disclosure list.
 *
 * Beat 11 of the reference is a numbered accordion, and it is the one beat
 * that maps onto this business with no translation at all: buying a unit in
 * Egypt really is four steps, and the fourth — registration at the Shahr
 * Aqari — is the step this entire site argues about.
 *
 * It is a disclosure widget, not a stack of styled divs. Each header is a
 * button that owns its panel by id and reports its own state, the arrow keys
 * move between headers the way a native list does, and the open panel is in
 * the tab order. The first step is open on arrival, so the section is never a
 * column of closed bars with every answer behind a click.
 */
export default function Process({ steps }: { steps: Step[] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();
  const headers = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = steps.length - 1;
    const to =
      e.key === "ArrowDown" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowUp" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : -1;
    if (to < 0) return;
    e.preventDefault();
    headers.current[to]?.focus();
  };

  return (
    <div className={s.list}>
      {steps.map((step, i) => {
        const isOpen = i === open;
        return (
          <div key={step.numAr} className={`${s.row} ${isOpen ? s.rowOpen : ""}`}>
            <h3 className={s.heading}>
              <button
                type="button"
                ref={(el) => {
                  headers.current[i] = el;
                }}
                id={`${uid}-h${i}`}
                className={s.header}
                aria-expanded={isOpen}
                aria-controls={`${uid}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                onKeyDown={(e) => onKey(e, i)}
              >
                <span className={`mono ${s.num}`}>{step.numAr}</span>
                <span className={s.title}>{step.titleAr}</span>
                <span className={s.mark} aria-hidden="true" />
              </button>
            </h3>

            {/* Rendered whether open or not, and hidden with the `hidden`
                attribute rather than a class. The copy is in the served HTML
                either way, which is what keeps it indexable and quotable —
                and `hidden` is what keeps a closed panel out of the tab
                order and out of a screen reader's path. */}
            <div
              id={`${uid}-p${i}`}
              role="region"
              aria-labelledby={`${uid}-h${i}`}
              className={s.panel}
              hidden={!isOpen}
            >
              <p className={s.body}>{step.bodyAr}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
