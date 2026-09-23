"use client";

import { useCallback, useId, useRef } from "react";
import s from "./RangeSlider.module.css";

/**
 * The custom RTL drag slider used on the landing calculator, the units
 * catalogue's affordability filter, and the unit page's payment plan.
 *
 * Built by hand rather than a styled native `<input type=range>` — a native
 * range caused scroll-jank on touch on this exact layout, which is why the
 * design calls for drag, not +/- buttons, and for a track a native control
 * cannot give us: min on the right (RTL), a 44px hit area over a 4px rail,
 * and a thumb driven from `pointerdown` on the whole track, not just the
 * thumb itself.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function snap(v: number, min: number, max: number, step: number) {
  return clamp(min + Math.round((v - min) / step) * step, min, max);
}

export default function RangeSlider({
  label,
  value,
  min,
  max,
  dragStep,
  keyStep,
  format,
  unit,
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  dragStep: number;
  keyStep: number;
  format: (v: number) => string;
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const pct = clamp(((value - min) / (max - min)) * 100, 0, 100);

  const calc = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return value;
      const r = track.getBoundingClientRect();
      // RTL: the minimum sits on the right edge, so the fraction filled
      // grows from the right as the pointer moves toward the left.
      const k = clamp((r.right - clientX) / r.width, 0, 1);
      return snap(min + k * (max - min), min, max, dragStep);
    },
    [min, max, dragStep, value],
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const track = e.currentTarget;
    track.querySelector<HTMLElement>("[role=slider]")?.focus({ preventScroll: true });
    onChange(calc(e.clientX));

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      onChange(calc(ev.clientX));
    };
    const up = () => {
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      removeEventListener("pointercancel", up);
      document.documentElement.style.userSelect = "";
    };
    document.documentElement.style.userSelect = "none";
    addEventListener("pointermove", move, { passive: false });
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    let v: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") v = value + keyStep;
    else if (e.key === "ArrowRight" || e.key === "ArrowDown") v = value - keyStep;
    else if (e.key === "PageUp") v = value + keyStep * 5;
    else if (e.key === "PageDown") v = value - keyStep * 5;
    else if (e.key === "Home") v = min;
    else if (e.key === "End") v = max;
    if (v === null) return;
    e.preventDefault();
    onChange(snap(v, min, max, keyStep));
  };

  return (
    <div className={s.field}>
      <div className={s.head}>
        <span className={s.label}>{label}</span>
        <span className={s.value}>
          <bdi>{format(value)}</bdi>
          {unit ? <span className={s.unit}> {unit}</span> : null}
        </span>
      </div>

      <div ref={trackRef} className={s.track} onPointerDown={onPointerDown}>
        <div className={s.rail} />
        <div className={s.fill} style={{ width: `${pct}%` }} />
        <div
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={format(value)}
          id={id}
          className={s.thumb}
          style={{ right: `${pct}%`, marginRight: "-14px" }}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className={s.limits}>
        <span className="mono">{minLabel ?? format(min)}</span>
        <span className="mono">{maxLabel ?? format(max)}</span>
      </div>
    </div>
  );
}
