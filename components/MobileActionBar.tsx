import { PHONE_E164, whatsappHref } from "@/lib/format";
import s from "./MobileActionBar.module.css";

/**
 * شريط التواصل الثابت — the persistent contact bar on mobile.
 *
 * Most of this site's traffic arrives on a phone, and the pages are long: the
 * homepage runs to about 11,500px. With contact details only in the header
 * and the footer, a reader half way down has to scroll to one end or the
 * other to act — which, in practice, means not acting.
 *
 * WhatsApp leads, not the telephone. It is how property enquiries actually
 * happen in Egypt: it leaves the buyer a written record of what was agreed,
 * it costs nothing from abroad, and Gulf buyers are several hours ahead and
 * would rather write at midnight than ring an office. Hence 2fr against 1fr —
 * both are present, but the ratio states which one we expect.
 *
 * `enquiry` seeds the WhatsApp message. Passing the unit code means the
 * conversation opens with context; without it the sales team cannot tell
 * which page produced the lead.
 */
export default function MobileActionBar({
  enquiry,
  waLabel = "واتساب",
}: {
  enquiry?: string;
  waLabel?: string;
}) {
  return (
    <div className={s.bar}>
      <a className={s.wa} href={whatsappHref(enquiry)} rel="noopener">
        {waLabel}
      </a>
      <a className={s.call} href={`tel:${PHONE_E164}`}>
        اتصال
      </a>
    </div>
  );
}
