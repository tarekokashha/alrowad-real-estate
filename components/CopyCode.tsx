"use client";

import { useState } from "react";
import s from "./CopyCode.module.css";

/**
 * The unit code, copyable. Egyptian buyers paste the code into WhatsApp to
 * ask about a specific unit, so making it one tap is a real convenience
 * rather than a flourish.
 */
export default function CopyCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return; // Clipboard blocked — the code is still selectable as text.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button type="button" className={s.btn} onClick={copy}>
      <span className="mono">{code}</span>
      <span className={s.hint}>{copied ? "تم النسخ" : "نسخ الكود"}</span>
    </button>
  );
}
