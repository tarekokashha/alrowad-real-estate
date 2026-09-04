import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Entrance from "@/components/Entrance";
import PropertyCard from "@/components/PropertyCard";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import {
  COMPANY,
  PRICE_INDEX,
  INDEX_REVISIONS,
  LEGAL_STATUSES,
  RECENT_SALES,
  COMPOUNDS,
  DISTRICTS,
  TESTIMONIALS,
  TOTAL_LISTED,
} from "@/lib/content";
import {
  Price,
  PhoneNumber,
  whatsappHref,
  formatNumber,
  toEasternDigits,
} from "@/lib/format";
import { UNITS } from "@/lib/units";
import s from "./page.module.css";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale} />

      {/* The hero content is server-rendered inside the entrance, not behind
          it. With JavaScript disabled this H1, the description and the facts
          all still render — which is the condition for being indexed and for
          being quotable by an answer engine. */}
      <Entrance locale={locale}>
        <h1 className={s.heroH1}>
          نعرف كل متر
          <br />
          في حدائق أكتوبر
        </h1>
        <div className={s.heroAside}>
          <p>
            {COMPANY.nameAr} — وساطة عقارية مسجَّلة، مقرّها حدائق أكتوبر. نبيع ما
            رأيناه بأنفسنا، وننشر أوراقه.
          </p>
          <div className={s.heroFacts}>
            <span>حدائق أكتوبر · الجيزة</span>
            <span>٦ أكتوبر · الشيخ زايد</span>
            <span>{COMPANY.surveyRef}</span>
          </div>
        </div>
      </Entrance>

      <main id="main">
        {/* ---- Trust line. Static type inside a sentence, with Eastern
                digits because this is prose, not data. Never an animated
                counter: that is both the most template-coded element in
                real estate and an unverifiable claim. ---- */}
        <section className={s.trust}>
          <div className="shell">
            <p className={s.trustText}>
              خمسة عشر عامًا في هذا النطاق، و{toEasternDigits(500)}+ وحدة مبيعة،
              و{toEasternDigits(30)}+ مشروعًا — وكلها مؤرَّخة، وحدة وحدة، في سجل
              البيع.{" "}
              <Link href={`/${locale}/sold`} className={s.trustLink}>
                افتح السجل
              </Link>
            </p>
          </div>
        </section>

        {/* ---- Price index ---- */}
        <section id="index" className={s.section}>
          <div className="shell grid12">
            <div className={s.indexIntro}>
              <span className="eyebrow">٠٢ / الأرقام محدّثة</span>
              <h2 className={s.h2}>
                مؤشر سعر المتر
                <br />
                في حدائق أكتوبر
              </h2>
              <p className={s.lede}>
                نحسبه بأنفسنا من العروض المعروضة فعلًا ومن عمليات البيع التي
                أتممناها داخل النطاق. مع كل رقم تاريخه وحجم عيّنته، حتى تعرف على
                أي أساس تقارن.
              </p>
              <dl className={`mono ${s.indexMeta}`}>
                <div>
                  <dt>آخر تحديث</dt>
                  <dd>{PRICE_INDEX.updatedAr}</dd>
                </div>
                <div>
                  <dt>العيّنة</dt>
                  <dd>{PRICE_INDEX.sampleAr}</dd>
                </div>
                <div>
                  <dt>الدورة</dt>
                  <dd>{PRICE_INDEX.cycleAr}</dd>
                </div>
              </dl>
            </div>

            <div className={s.indexTable}>
              <div className={s.bracket}>
                {/* The five columns will not fit a phone. Rather than let
                    them crush — "ربع/ربع" was breaking across two lines and
                    a price range across three — the table keeps its width
                    and the wrapper scrolls. */}
                <div className={s.tableScroll}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th scope="col">المنطقة / الكمبوند</th>
                      <th scope="col">متوسط سعر المتر</th>
                      <th scope="col">المدى</th>
                      <th scope="col">العيّنة</th>
                      <th scope="col">ربع/ربع</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICE_INDEX.rows.map((r) => (
                      <tr key={r.areaAr}>
                        <th scope="row">{r.areaAr}</th>
                        <td className="mono">{formatNumber(r.avg)}</td>
                        <td className="mono">
                          <bdi>
                            {formatNumber(r.low)} – {formatNumber(r.high)}
                          </bdi>
                        </td>
                        <td className="mono">{r.sample}</td>
                        <td className={`mono ${s.qoq}`}>
                          <bdi>{r.qoq}</bdi>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
              <p className={s.footnote}>{PRICE_INDEX.footnoteAr}</p>
            </div>
          </div>
        </section>

        {/* ---- The three proof pillars, as editorial blocks with real
                artifacts. Never icon boxes, never a "لماذا تختارنا" heading. ---- */}
        <section className={s.pillars}>
          <div className="shell">
            {/* Pillar 1 — the legal status disclosure */}
            <article className={`grid12 ${s.pillar}`}>
              <div className={s.pillarText}>
                <span className="eyebrow">٠١ / الأوراق واضحة</span>
                <h2 className={s.h3}>
                  حالة الوحدة القانونية مكتوبة قبل أن تسأل عنها
                </h2>
                <p className={s.lede}>
                  في كل صفحة وحدة سطر اسمه «الحالة القانونية»، وفيه القيمة كما
                  هي: مسجل بالشهر العقاري، أو حكم صحة ونفاذ، أو عقد ابتدائي
                  موثق، أو عقد ابتدائي عرفي. لا نضع علامة صحيحة خضراء مكان
                  الورقة — العلامة ادّعاء، والسطر إفصاح.
                </p>
              </div>
              <div className={s.pillarArtifact}>
                <table className={s.miniTable}>
                  <tbody>
                    {LEGAL_STATUSES.map((l) => (
                      <tr key={l.status}>
                        <th scope="row">{l.status}</th>
                        <td className="mono">{l.count} وحدة معروضة</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={s.footnote}>
                  ننشر العرفي كما ننشر المسجل. الفارق في السعر وفي المخاطرة، ومن
                  حقك تعرفهما قبل الحجز.
                </p>
              </div>
            </article>

            {/* Pillar 2 — the dated revision list */}
            <article className={`grid12 ${s.pillar} ${s.pillarFlip}`}>
              <div className={s.pillarText}>
                <span className="eyebrow">٠٢ / الأرقام محدّثة</span>
                <h2 className={s.h3}>سعر بلا تاريخ ليس سعرًا</h2>
                <p className={s.lede}>
                  السوق في أكتوبر يتحرك كل شهر، ومعظم ما تقرأه على الإنترنت
                  متروك من سنة. كل رقم عندنا مكتوب بجانبه يوم رصده وعدد الوحدات
                  التي حُسب منها، والنسخ القديمة تبقى في مكانها للمقارنة.
                </p>
              </div>
              <div className={s.pillarArtifact}>
                <table className={s.miniTable}>
                  <tbody>
                    {INDEX_REVISIONS.map((r) => (
                      <tr key={r.dateAr}>
                        <th scope="row" className="mono">
                          {r.dateAr}
                        </th>
                        <td>{r.noteAr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={s.footnote}>
                  كل نسخة سابقة من المؤشر تبقى منشورة بتاريخها. لا نعيد كتابة
                  الأرقام القديمة.
                </p>
              </div>
            </article>

            {/* Pillar 3 — the sold archive */}
            <article className={`grid12 ${s.pillar}`}>
              <div className={s.pillarText}>
                <span className="eyebrow">٠٣ / البيع مسجّل</span>
                <h2 className={s.h3}>سجل البيع مفتوح للقراءة</h2>
                <p className={s.lede}>
                  بدل عدّاد يزيد أمام عينك، عندنا صفحة فيها كل وحدة بِعناها:
                  كودها، منطقتها، مساحتها، سعرها يوم البيع، وتاريخ إتمام
                  التعاقد. تقدر تقرأها كلها، وتقدر تقارن بها سعر اليوم.
                </p>
                <Link href={`/${locale}/sold`} className={s.inlineLink}>
                  افتح سجل البيع ←
                </Link>
              </div>
              <div className={s.pillarArtifact}>
                <table className={s.miniTable}>
                  <tbody>
                    {RECENT_SALES.map((sale) => (
                      <tr key={sale.code}>
                        <th scope="row" className="mono">
                          {sale.code}
                        </th>
                        <td className={s.wrap}>{sale.descAr}</td>
                        <td className="mono">
                          <Price value={sale.price} unit={null} />
                        </td>
                        <td className={`mono ${s.dim}`}>{sale.dateAr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </section>

        {/* ---- Featured units ---- */}
        <section className={s.section}>
          <div className="shell">
            <div className={s.sectionHead}>
              <div>
                <span className="eyebrow">٠٤ / معروض الآن</span>
                <h2 className={s.h2}>وحدات مختارة داخل النطاق</h2>
              </div>
              <div className={s.sectionAside}>
                <p>
                  تشتري بالقسط؟ ابدأ من المقدَّم الذي معك والقسط الذي تقدر عليه،
                  واعرف الوحدات التي تناسبهما فعلًا.
                </p>
                <Link
                  href={`/${locale}/properties#affordability`}
                  className={s.inlineLink}
                >
                  اعرف قسطك ←
                </Link>
              </div>
            </div>

            <div className={s.cardGrid}>
              {UNITS.slice(0, 3).map((unit, i) => (
                <PropertyCard
                  key={unit.code}
                  unit={unit}
                  locale={locale}
                  priority={i === 0}
                />
              ))}
            </div>

            <p className={s.gridFoot}>
              <Link href={`/${locale}/properties`} className={s.inlineLink}>
                كل الوحدات المعروضة ({TOTAL_LISTED}) ←
              </Link>
            </p>
          </div>
        </section>

        {/* ---- Scope. A typeset index, not cards. ---- */}
        <section className={s.scope}>
          <div className="shell grid12">
            <div className={s.scopeIntro}>
              <span className="eyebrow">٠٥ / النطاق</span>
              <h2 className={s.h2}>المناطق التي نعمل فيها، ولا نعمل خارجها</h2>
              <p className={s.ledeOnNight}>
                حدائق أكتوبر و٦ أكتوبر والشيخ زايد. لكل منطقة دليل مكتوب فيه
                الكمبوندات باسمها، وأزمنة الوصول الحقيقية، والمدارس، ومؤشر سعر
                المتر بتاريخه.
              </p>
              <Link
                href={`/${locale}/areas/hadayek-october`}
                className={s.inlineLinkNight}
              >
                دليل حدائق أكتوبر ←
              </Link>
            </div>

            <div className={s.scopeCompounds}>
              <h3 className={s.scopeTitle}>كمبوندات</h3>
              <ul className={s.index}>
                {COMPOUNDS.map((c) => (
                  <li key={c.nameAr}>
                    <span>{c.nameAr}</span>
                    <span className="mono">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={s.scopeDistricts}>
              <h3 className={s.scopeTitle}>مناطق ومشروعات إسكان</h3>
              <ul className={s.index}>
                {DISTRICTS.map((d) => (
                  <li key={d.nameAr}>
                    <span>{d.nameAr}</span>
                    <span className="mono">{d.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---- Testimonials. Two, named, dated, with the unit type.
                No stars, no slider. ---- */}
        <section className={s.section}>
          <div className="shell grid12">
            {TESTIMONIALS.map((t) => (
              <figure key={t.nameAr} className={s.quote}>
                <blockquote>
                  <p className={s.quoteText}>«{t.quoteAr}»</p>
                </blockquote>
                <figcaption>
                  <span className={s.quoteName}>{t.nameAr}</span>
                  <span className={`mono ${s.quoteDetail}`}>{t.detailAr}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ---- Contact. No form: a form you fill and nobody answers is
                exactly the experience this brand exists to contradict. ---- */}
        <section className={s.contact}>
          <div className="shell grid12">
            <div className={s.contactIntro}>
              <span className="eyebrow">٠٦ / التواصل</span>
              <h2 className={s.h2}>
                كلّمنا في أي وقت — على واتساب أو في المكتب
              </h2>
              <p className={s.lede}>
                مفيش فورم تسيب فيه رقمك ومحدش يرد. تكلّم على واتساب مع اللي شاف
                الوحدة بنفسه، وهو اللي هيروح معاك المعاينة. إحنا موجودون ٢٤/٧.
              </p>
            </div>

            <div className={s.contactWhatsapp}>
              <h3 className={s.contactTitle}>على واتساب</h3>
              <p className={s.contactMeta}>{COMPANY.replyTimeAr}</p>
              <p className={s.contactMeta}>بالعربية والإنجليزية</p>
              <a
                href={whatsappHref(
                  "السلام عليكم، حابب أستفسر عن الوحدات المتاحة في حدائق أكتوبر",
                )}
                className={`mono ${s.contactNumber}`}
                rel="noopener"
              >
                <bdi dir="ltr">010 9809 8026</bdi>
              </a>
            </div>

            <div className={s.contactOffice}>
              <h3 className={s.contactTitle}>في المكتب</h3>
              <p className={s.contactMeta}>حدائق أكتوبر — تعالى بدون موعد</p>
              <p className={s.contactMeta}>{COMPANY.officeHoursAr}</p>
              <PhoneNumber className={`mono ${s.contactNumber}`} />
            </div>
          </div>
        </section>
      </main>

      <MobileActionBar />
      <Footer locale={locale} />
    </>
  );
}
