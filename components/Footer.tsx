import Link from "next/link";
import { COMPANY, FOOTER_LINKS } from "@/lib/content";
import { PHONE_E164, PhoneNumber, whatsappHref } from "@/lib/format";
import s from "./Footer.module.css";

/** Site Footer.dc.html — the night band on every page. */
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
      </div>

      <div className={s.bottom}>
        <span>© ٢٠٢٦ {COMPANY.nameAr}</span>
        <span>مسجلون بموجب {COMPANY.brokerageDecreeAr}</span>
      </div>
    </footer>
  );
}
