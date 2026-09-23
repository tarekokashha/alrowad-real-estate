import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/landing/Hero";
import UnitsStage, { type StageUnit } from "@/components/landing/UnitsStage";
import Manifesto from "@/components/landing/Manifesto";
import AreaReveal from "@/components/landing/AreaReveal";
import CompoundsRing from "@/components/landing/CompoundsRing";
import TestimonialsSwap from "@/components/landing/TestimonialsSwap";
import ContactWordmark from "@/components/landing/ContactWordmark";
import InstalmentFinder from "@/components/InstalmentFinder";
import {
  COMPANY,
  LEGAL_STATUSES,
  TOTAL_LISTED,
  PRICE_INDEX,
  RECENT_SALES,
  COMPOUNDS,
} from "@/lib/content";
import { formatNumber, toEasternDigits, whatsappHref } from "@/lib/format";
import { getUnits } from "@/lib/cms";
import s from "./page.module.css";

export const revalidate = 300;

/** In production this becomes a "featured" flag on the Payload unit
 *  collection; for now it mirrors the design handoff's own six picks. */
const FEATURED_CODES = [
  "HO-OW-0688",
  "HO-800-0917",
  "HO-HOM-0277",
  "HO-ASH-1442",
  "HO-BET-0421",
  "HO-SKM-0308",
];

const LEGAL_COLOURS = [
  "var(--bronze-deep)",
  "var(--bronze)",
  "rgba(154,107,63,.55)",
  "rgba(154,107,63,.28)",
];

const bare = (img: string) => img.replace("/img/", "").replace(".webp", "");
const priceScalePct = (v: number) => Math.min(100, Math.max(0, ((v - 10_000) / 25_000) * 100));

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const units = await getUnits();

  const featured = FEATURED_CODES.map((c) => units.find((u) => u.code === c)).filter(
    (u): u is NonNullable<typeof u> => Boolean(u),
  );
  const stageSource = featured.length >= 3 ? featured : units.slice(0, Math.min(6, units.length));
  const stageUnits: StageUnit[] = stageSource.map((u, i) => ({
    code: u.code,
    legalAr: u.legalStatus,
    titleLine: `${u.titleAr} — ${u.areaAr}`,
    price: u.price,
    size: u.size,
    perM: Math.round(u.price / u.size),
    finishing: u.finishing,
    handover: u.handoverAr,
    checkedAr: u.priceCheckedAr,
    href: `/${locale}/properties/${u.code}`,
    img: bare(u.image),
    img2: bare(units[(i * 2 + 2) % units.length]?.image ?? u.image),
    img3: bare(units[(i * 2 + 5) % units.length]?.image ?? u.image),
  }));

  return (
    <>
      <Header locale={locale} variant="landing" />

      <Hero />

      <div className={s.marqueeBand} data-anim="marquee" data-speed="60" data-skew aria-hidden="true">
        <div data-marquee-track className={s.marqueeTrack}>
          {[0, 1].map((run) => (
            <span key={run} className={s.marqueeRun}>
              {COMPOUNDS.map((c) => (
                <span key={c.nameAr} className={s.marqueeItem}>
                  {c.nameAr}
                  <span aria-hidden="true">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <UnitsStage
        units={stageUnits}
        totalLabel={String(units.length)}
        allHref={`/${locale}/properties`}
      />

      <Manifesto />

      <section className={s.legalSection}>
        <div className={s.legalHead}>
          <div className={s.legalHeadMax}>
            <span className="eyebrow" data-anim="fade">
              ٠٤ — الحالة القانونية
            </span>
            <h2 className={s.legalH2} data-anim="rise" data-delay="1">
              كل وحدة بورقها، <span className={s.bronze}>معلنة.</span>
            </h2>
          </div>
          <p className={s.legalLede} data-anim="fade" data-delay="2">
            من إجمالي {formatNumber(TOTAL_LISTED)} وحدة معروضة. الرقم هنا قيمة معلنة، مش
            علامة صح.
          </p>
        </div>

        <div className={s.legalBar}>
          {LEGAL_STATUSES.map((l, i) => (
            <div
              key={l.status}
              data-anim="wipe"
              data-delay={i + 1}
              className={s.legalSeg}
              style={{ width: `${(l.count / TOTAL_LISTED) * 100}%`, background: LEGAL_COLOURS[i] }}
            />
          ))}
        </div>

        <div className={s.legend}>
          {LEGAL_STATUSES.map((l, i) => (
            <div key={l.status} data-anim="rise" data-delay={i + 1} className={s.legendItem}>
              <span className={s.legendDot} style={{ background: LEGAL_COLOURS[i] }} />
              <div>
                <div className={s.legendNum} data-anim="counter" data-to={l.count}>
                  0
                </div>
                <div className={s.legendLabel}>
                  {l.status} · {toEasternDigits(Math.round((l.count / TOTAL_LISTED) * 100))}٪
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AreaReveal />

      <CompoundsRing />

      <section id="index" className={s.priceSection}>
        <div className={s.priceHead}>
          <div>
            <span className="eyebrow" data-anim="fade">
              ٠٧ — مؤشر سعر المتر
            </span>
            <h2 className={s.priceH2} data-anim="rise" data-delay="1">
              أرقامنا، بتاريخها.
            </h2>
          </div>
          <div className={s.priceMeta} data-anim="fade" data-delay="2">
            <div>
              آخر تحديث: <strong>{PRICE_INDEX.updatedAr}</strong>
            </div>
            <div>العيّنة: {PRICE_INDEX.sampleAr}</div>
            <div>{PRICE_INDEX.cycleAr}</div>
          </div>
        </div>

        <div className={s.priceCols}>
          <span>المنطقة</span>
          <span>متوسط ج.م/م² — المدى من 10,000 إلى 35,000</span>
          <span>العيّنة · التغيّر الربع سنوي</span>
        </div>

        <div>
          {PRICE_INDEX.rows.map((row, i) => (
            <div key={row.areaAr} data-anim="rise" data-delay={i + 1} className={s.priceRow}>
              <div className={s.priceArea}>{row.areaAr}</div>
              <div className={s.priceAvg}>
                <bdi>{formatNumber(row.avg)}</bdi>
              </div>
              <div className={s.priceTrack}>
                <div
                  className={s.priceFill}
                  style={{
                    right: `${priceScalePct(row.low)}%`,
                    width: `${priceScalePct(row.high) - priceScalePct(row.low)}%`,
                  }}
                />
                <div className={s.priceMarker} style={{ right: `${priceScalePct(row.avg)}%` }} />
              </div>
              <div className={s.priceSample}>
                <span>{row.sample} عرض</span>
                <bdi className={s.priceQoq}>{row.qoq}</bdi>
              </div>
            </div>
          ))}
        </div>

        <p className={s.priceFootnote}>{PRICE_INDEX.footnoteAr}</p>
      </section>

      <InstalmentFinder units={units} locale={locale} />

      <section id="sold" className={s.soldSection}>
        <div className={s.soldHead}>
          <div>
            <span className="eyebrow">٠٩ — آخر عمليات البيع</span>
            <h2 className={s.soldH2} data-anim="rise">
              كل وحدة بعناها، بتاريخها وسعرها.
            </h2>
          </div>
          <a href={`/${locale}/sold`} className={s.soldLink}>
            سجل البيع كامل ←
          </a>
        </div>

        <div>
          {RECENT_SALES.map((sale, i) => (
            <div key={sale.code} data-anim="rise" data-delay={i + 1} className={s.soldRow}>
              <bdi className={`mono ${s.soldCode}`}>{sale.code}</bdi>
              <span className={s.soldDesc}>{sale.descAr}</span>
              <span className={s.soldDate}>
                <bdi>{sale.dateAr}</bdi>
              </span>
              <span className={s.soldPrice}>
                <bdi>{formatNumber(sale.price)}</bdi> <span className={s.soldCurrency}>ج.م</span>
              </span>
              <span
                className={s.soldStamp}
                style={{ transform: `rotate(${[-6, 4, -3, 5][i % 4]}deg)` }}
              >
                تم البيع
              </span>
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSwap />

      <section className={s.credSection}>
        <div className={s.credHead}>
          <span className="eyebrow">١١ — الشرعية القانونية</span>
          <h2 className={s.credH2} data-anim="rise">
            ورقنا إحنا كمان.
          </h2>
        </div>
        <div className={s.credGrid}>
          <div data-anim="rise" data-delay="1" className={s.credCell}>
            <span>السجل التجاري</span>
            <span className={`mono ${s.credVal}`}>{COMPANY.commercialRegistry}</span>
          </div>
          <div data-anim="rise" data-delay="2" className={s.credCell}>
            <span>البطاقة الضريبية</span>
            <span className={`mono ${s.credVal}`}>{COMPANY.taxCard}</span>
          </div>
          <div data-anim="rise" data-delay="3" className={s.credCell}>
            <span>رقم تسجيل الوساطة</span>
            <span className={`mono ${s.credVal}`}>{COMPANY.brokerageRegistration}</span>
          </div>
          <div data-anim="rise" data-delay="4" className={s.credCell}>
            <span>سند الوساطة</span>
            <span className={s.credValDisplay}>{COMPANY.brokerageDecreeAr}</span>
          </div>
        </div>
      </section>

      <footer id="contact" className={s.contact}>
        <div className={s.contactGrid}>
          <div>
            <span className="eyebrow">١٢ — كلّمنا</span>
            <h2 className={s.contactH2} data-anim="rise">
              ابعت كود الوحدة، ونبعتلك ورقها.
            </h2>
            <div className={s.contactCtas}>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener"
                data-anim="magnet"
                className={s.contactWa}
              >
                واتساب<span className={s.contactWaDot} aria-hidden="true" />
              </a>
              <a href="tel:+201098098026" data-anim="magnet" className={s.contactCall}>
                <bdi className="mono">010 9809 8026</bdi>
              </a>
            </div>
          </div>
          <div className={s.contactInfo}>
            <div>
              <span>العنوان</span>
              <span>{COMPANY.addressAr}</span>
            </div>
            <div>
              <span>الرد</span>
              <span>{COMPANY.hoursAr}</span>
            </div>
            <div>
              <span>المكتب</span>
              <span>{COMPANY.officeHoursAr}</span>
            </div>
            <div>
              <span>متوسط الرد</span>
              <span>{COMPANY.replyTimeAr}</span>
            </div>
          </div>
        </div>

        <ContactWordmark />

        <div className={s.contactBottom}>
          <span>© ٢٠٢٦ {COMPANY.nameAr}</span>
          <div className={s.contactBottomLinks}>
            <a href={`/${locale}/properties`}>الوحدات</a>
            <a href={`/${locale}/sold`}>سجل البيع</a>
            <a href={`/${locale}/gulf`}>الشراء من الخليج</a>
            <a href={`/${locale}/about`}>من نحن</a>
            <a href="#top">لفوق ↑</a>
          </div>
        </div>
      </footer>

      <Footer locale={locale} />
    </>
  );
}
