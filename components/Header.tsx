import Link from "next/link";
import { COMPANY, NAV } from "@/lib/content";
import { PhoneNumber, whatsappHref } from "@/lib/format";
import s from "./Header.module.css";

/**
 * Absolute over the hero. The logo slot is reserved at its final size from
 * first paint — the wordmark flies into it at t=3.2s, and if the slot were
 * sized on arrival the whole header would jump. That jump is a CLS penalty
 * measured against the ranking goal, not just an aesthetic problem.
 *
 * There is deliberately NO call-to-action button here. A filled pill
 * demanding a phone number above the fold reads as lead-mill and undercuts
 * the entire positioning. The quiet affordances — the number itself and a
 * WhatsApp text link — are the design.
 */
export default function Header({
  locale,
  variant = "hero",
}: {
  locale: string;
  /** "hero" = absolute over the dark entrance. "light" = sticky bar on interior pages. */
  variant?: "hero" | "light";
}) {
  const ar = locale === "ar";
  const other = ar ? "en" : "ar";

  return (
    <header className={`${s.header} ${variant === "light" ? s.light : ""}`}>
      <Link href={`/${locale}`} className={s.brand} aria-label={COMPANY.nameAr}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          {/* The survey benchmark: corner brackets, a reticle, and one
              horizontal datum line. Monoline, single weight, no gradient. */}
          <path d="M4 4h5M4 4v5M28 4h-5M28 4v5M4 28h5M4 28v-5M28 28h-5M28 28v-5" />
          <circle cx="16" cy="16" r="6.2" />
          <path d="M16 6.6v18.8M6.6 16h18.8" />
          <path d="M2 21.6h28" strokeWidth="1.6" />
        </svg>
        <span className={s.wordmark}>{COMPANY.shortAr}</span>
      </Link>

      <nav className={s.nav} aria-label={ar ? "التنقل الرئيسي" : "Main"}>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href.replace("/ar/", `/${locale}/`)}
            className={s.link}
          >
            {item.labelAr}
          </Link>
        ))}

        <span className={s.divider} aria-hidden="true" />

        <PhoneNumber className={s.phone} />

        <a
          href={whatsappHref(
            ar
              ? "السلام عليكم، حابب أستفسر عن الوحدات المتاحة في حدائق أكتوبر"
              : "Hello, I would like to ask about available units in Hadayek October",
          )}
          className={s.whatsapp}
          rel="noopener"
        >
          {ar ? "واتساب" : "WhatsApp"}
        </a>

        <Link href={`/${other}`} className={s.lang} hrefLang={other}>
          {ar ? "EN" : "ع"}
        </Link>
      </nav>
    </header>
  );
}
