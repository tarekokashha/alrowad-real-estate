import Link from "next/link";
import { COMPANY, FOOTER_LINKS } from "@/lib/content";
import { PhoneNumber } from "@/lib/format";
import s from "./Footer.module.css";

/**
 * The registry line is the point of this footer.
 *
 * Commercial registry, tax card, and the brokerage registration number under
 * Ministerial Decision 578/2025 — a regulation barely eight months old that
 * essentially no October competitor has put on their site. It appears on
 * every page, in mono, stated plainly. Publishing verifiable credentials is
 * the cheapest trust signal available in a market whose buyers' first
 * question is whether you are real.
 */
export default function Footer({ locale }: { locale: string }) {
  return (
    <footer className={s.footer}>
      <div className="shell grid12">
        <div className={s.brand}>
          <span className={s.wordmark}>{COMPANY.shortAr}</span>
          <p>{COMPANY.nameAr}</p>
          <p>{COMPANY.addressAr}</p>
          <p>{COMPANY.hoursAr}</p>
          <PhoneNumber intl className={`mono ${s.phone}`} />
        </div>

        {FOOTER_LINKS.map((col) => (
          <nav key={col.titleAr} className={s.col} aria-label={col.titleAr}>
            <h2 className={s.colTitle}>{col.titleAr}</h2>
            <ul>
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href.replace("/ar/", `/${locale}/`)}>
                    {l.labelAr}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="shell">
        <hr className={s.rule} />
        <div className={`mono ${s.registry}`}>
          <span>
            سجل تجاري <bdi dir="ltr">{COMPANY.commercialRegistry}</bdi>
          </span>
          <span>
            بطاقة ضريبية <bdi dir="ltr">{COMPANY.taxCard}</bdi>
          </span>
          <span>
            تسجيل الوساطة العقارية — {COMPANY.brokerageDecreeAr}:{" "}
            <bdi dir="ltr">{COMPANY.brokerageRegistration}</bdi>
          </span>
          <span className={s.copyright}>
            © ٢٠٢٦ {COMPANY.shortAr} للتطوير العقاري
          </span>
        </div>
      </div>
    </footer>
  );
}
