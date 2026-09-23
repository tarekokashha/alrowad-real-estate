import Link from "next/link";
import { COMPANY, FOOTER_LINKS } from "@/lib/content";
import { PHONE_E164, PhoneNumber, whatsappHref } from "@/lib/format";
import s from "./Footer.module.css";

/**
 * Site Footer.dc.html — the night band on every page. The registry line is
 * the point of it: commercial registry, tax card, and the brokerage
 * registration number under Ministerial Decision 578/2025, stated plainly
 * in mono. Publishing verifiable credentials is the cheapest trust signal
 * available in a market whose buyers' first question is whether you are real.
 */
export default function Footer({ locale }: { locale: string }) {
  const hrefFor = (h: string) => h.replace("/ar/", `/${locale}/`);

  return (
    <footer className={s.footer}>
      <div className={s.grid}>
        <div className={s.brand}>
          <span className={s.wordmark}>{COMPANY.shortAr}</span>
          <p className={s.tagline}>
            مكتب واحد في حدائق أكتوبر منذ ٢٠١١، ولا نعمل في غيرها.
          </p>
          <div className={s.ctas}>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener"
              className={s.wa}
            >
              واتساب
            </a>
            <a href={`tel:${PHONE_E164}`} className={s.callPhone}>
              <PhoneNumber link={false} className="mono" />
            </a>
          </div>
        </div>

        <nav className={s.col} aria-label="الصفحات">
          <span className={s.colTitle}>الصفحات</span>
          {FOOTER_LINKS.map((l) => (
            <Link key={l.href} href={hrefFor(l.href)} className={s.colLink}>
              {l.labelAr}
            </Link>
          ))}
        </nav>

        <div className={s.col}>
          <span className={s.colTitle}>المكتب</span>
          <span className={s.colText}>{COMPANY.addressAr}</span>
          <span className={s.colMuted}>{COMPANY.officeHoursAr}</span>
          <span className={s.colMuted}>واتساب ٢٤/٧</span>
        </div>

        <div className={s.col}>
          <span className={s.colTitle}>البيانات الرسمية</span>
          <div className={s.reg}>
            <span className={s.regLabel}>السجل التجاري</span>
            <bdi className="mono">{COMPANY.commercialRegistry}</bdi>
          </div>
          <div className={s.reg}>
            <span className={s.regLabel}>البطاقة الضريبية</span>
            <bdi className="mono">{COMPANY.taxCard}</bdi>
          </div>
          <div className={`${s.reg} ${s.regLast}`}>
            <span className={s.regLabel}>تسجيل الوساطة</span>
            <bdi className="mono">{COMPANY.brokerageRegistration}</bdi>
          </div>
        </div>
      </div>

      <div className={s.bottom}>
        <span>© ٢٠٢٦ {COMPANY.nameAr}</span>
        <span>مسجلون بموجب {COMPANY.brokerageDecreeAr}</span>
      </div>
    </footer>
  );
}
