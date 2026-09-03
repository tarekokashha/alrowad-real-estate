import type { ReactNode } from "react";

/**
 * Bidi + number primitives.
 *
 * Three rules drive everything in this file:
 *
 * 1. Digits and `+` are bidi-NEUTRAL. Inside an Arabic (RTL) paragraph the
 *    Unicode bidi algorithm will visibly reorder them — the `+` jumps ends,
 *    a currency symbol lands on the wrong side, hyphenated ranges reverse.
 *    The fix is `<bdi>`, which is semantic, rather than a CSS `unicode-bidi`
 *    hack that browsers are free to ignore.
 *
 * 2. `Intl.NumberFormat("ar-EG")` defaults to the `arab` numbering system and
 *    will happily render ١٬٩٥٠٬٠٠٠. Egyptian retail, banking and every
 *    property portal use Western digits on a price. Force them with the
 *    `-u-nu-latn` locale extension.
 *
 * 3. Eastern Arabic digits are correct for exactly one thing: trust
 *    statistics inside a sentence (٥٠٠+ وحدة). They must never reach a
 *    schema.org price, a URL slug, a `tel:` href, a sitemap or a form value —
 *    Google will not parse them and the rich result fails silently.
 */

const EGP = new Intl.NumberFormat("ar-EG-u-nu-latn", {
  maximumFractionDigits: 0,
});

const EASTERN = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/** Western-digit group separator formatting. Safe for prices and areas. */
export function formatNumber(value: number): string {
  return EGP.format(value);
}

/** Decorative only — trust statistics inside prose. Never machine-readable output. */
export function toEasternDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => EASTERN[Number(d)]);
}

/**
 * A price. Always isolated, always Western digits.
 * `unit` defaults to the Egyptian pound abbreviation used on listings.
 */
export function Price({
  value,
  unit = "ج.م",
  className,
}: {
  value: number;
  unit?: string | null;
  className?: string;
}) {
  return (
    <bdi className={className}>
      {formatNumber(value)}
      {unit ? ` ${unit}` : ""}
    </bdi>
  );
}

/** Price per square metre — the field competitors omit. */
export function PricePerMetre({
  price,
  area,
  className,
}: {
  price: number;
  area: number;
  className?: string;
}) {
  return (
    <bdi className={className}>{formatNumber(Math.round(price / area))} ج.م/م²</bdi>
  );
}

/** An area in square metres. */
export function Area({ value, className }: { value: number; className?: string }) {
  return <bdi className={className}>{formatNumber(value)} م²</bdi>;
}

export const PHONE_LOCAL = "010 9809 8026";
export const PHONE_INTL = "+20 10 9809 8026";
export const PHONE_E164 = "+201098098026";
export const WHATSAPP_NUMBER = "201098098026";

/**
 * The phone number. Forced LTR and isolated, because a partially-reordered
 * phone number is both wrong and unbelievable on a page selling trust.
 */
export function PhoneNumber({
  intl = false,
  link = true,
  className,
}: {
  intl?: boolean;
  link?: boolean;
  className?: string;
}) {
  const label = intl ? PHONE_INTL : PHONE_LOCAL;
  const body = (
    <bdi dir="ltr" className={className}>
      {label}
    </bdi>
  );
  return link ? <a href={`tel:${PHONE_E164}`}>{body}</a> : body;
}

/**
 * A WhatsApp deep link carrying context.
 *
 * The prefilled message is the whole point. Without the unit code the sales
 * conversation restarts from zero and the lead cannot be attributed to a
 * page. It costs nothing to add and everything to omit.
 */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function unitEnquiry(code: string, title: string, area: number): string {
  return `مهتم بالوحدة كود ${code} — ${title} ${formatNumber(area)} م² — من صفحة الوحدة`;
}

/**
 * A measurement: tabular digits in the mono face, the unit in the reading
 * face. Monospacing a unit like م² gives the superscript a full cell and
 * visually detaches it from its number — units are words, not data.
 */
export function Measure({
  value,
  unit,
  className,
}: {
  value: number | string;
  unit: string;
  className?: string;
}) {
  return (
    <bdi className={className}>
      <span className="mono">
        {typeof value === "number" ? formatNumber(value) : value}
      </span>
      <span className="measure-unit"> {unit}</span>
    </bdi>
  );
}

/** A Latin token (brand name, code, URL) sitting inside Arabic prose. */
export function Latin({ children }: { children: ReactNode }) {
  return <bdi dir="ltr">{children}</bdi>;
}
