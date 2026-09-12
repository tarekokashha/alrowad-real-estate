import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UnitRow from "@/components/UnitRow";
import Process, { type Step } from "@/components/Process";
import Footer from "@/components/Footer";
import {
  COMPANY,
  PRICE_INDEX,
  LEGAL_STATUSES,
  COMPOUNDS,
  DISTRICTS,
  TESTIMONIALS,
  TOTAL_LISTED,
} from "@/lib/content";
import { PhoneNumber, whatsappHref, toEasternDigits } from "@/lib/format";
import { getUnits } from "@/lib/cms";
import s from "./page.module.css";

/**
 * The unit pages are statically generated. A Payload hook revalidates them
 * the moment the client saves, which is the fast path; this is the slow one,
 * covering anything written straight to the database or a hook that failed.
 * Five minutes is short enough that nothing looks broken and long enough
 * that the database is not queried on every request.
 */
export const revalidate = 300;

/**
 * WHAT THIS PAGE IS NOW, AND WHAT MOVED.
 *
 * The units come first, directly under the hero, because they are what
 * anyone arriving is here to see. Everything that was long-form argument —
 * the price-index table with its six rows and its revision history, the
 * compound and district registers, the legal-status disclosure essay — left
 * for pages that already exist for it:
 *
 *   · the price index, its revisions, the compound and district lists
 *       → /areas/hadayek-october
 *   · the legal-status breakdown and the disclosure argument
 *       → /about#credentials
 *   · the sold archive
 *       → /sold, where it already lived
 *
 * Nothing was deleted, and every one of them is linked from here. A homepage
 * that opens with a five-column table is a homepage nobody scrolls past.
 */

/**
 * The counters.
 *
 * There is an argument in this codebase's history against animated counters:
 * they are the most template-coded element in real-estate design, and one
 * that lands on "500+ units sold" is an unverifiable claim wearing the
 * costume of data. That reasoning holds. What changes is the conclusion —
 * counters are fine on numbers a reader can go and check, which is why every
 * value here is READ from its export rather than typed, and why each one
 * carries the name of the place it can be checked against.
 */
const counters = [
  { value: TOTAL_LISTED, labelAr: "وحدة مدرجة", sourceAr: "القائمة الكاملة" },
  {
    value: LEGAL_STATUSES[0].count,
    labelAr: "مسجلة بالشهر العقاري",
    sourceAr: "إفصاح الحالة القانونية",
  },
  {
    value: PRICE_INDEX.rows.reduce((n, r) => n + r.sample, 0),
    labelAr: "عرضًا في عيّنة المؤشر",
    sourceAr: `آخر تحديث ${PRICE_INDEX.updatedAr}`,
  },
  {
    value: PRICE_INDEX.rows.length,
    labelAr: "مناطق في المؤشر",
    sourceAr: "جدول سعر المتر",
  },
];

/** What a brokerage actually does. Not Architecture / Interior / Landscape —
 *  see the design note about which beats of the reference are copied. */
const services = ["بيع", "شراء", "تقسيط", "توثيق قانوني", "مصريون في الخليج"];

/** Every name in the scope, for the band that runs across the page. The two
 *  registers with their counts live on the area guide now; this is the same
 *  fact at headline speed. */
const scopeNames = [...COMPOUNDS, ...DISTRICTS].map((x) => x.nameAr);

const processSteps: Step[] = [
  {
    numAr: "٠١",
    titleAr: "المعاينة",
    bodyAr:
      "نروح معك الوحدة بنفسنا — مش نبعتلك لوكيشن على الخريطة. تشوف المبنى والدور والتشطيب والجيران، وتسأل اللي راح شافها قبلك. لو الوحدة مش زي ما في الصور، نقول لك قبل ما تتحرك من بيتك.",
  },
  {
    numAr: "٠٢",
    titleAr: "الحجز",
    bodyAr:
      "قبل أي مقدَّم، بنوريك الحالة القانونية للوحدة مكتوبة: مسجلة بالشهر العقاري، أو حكم صحة ونفاذ، أو عقد ابتدائي موثق، أو عرفي. الفرق بينهم في السعر وفي المخاطرة، ومن حقك تعرفه وأنت لسه بتفكر.",
  },
  {
    numAr: "٠٣",
    titleAr: "التعاقد",
    bodyAr:
      "العقد بيتقرا بند بند قبل التوقيع، ومعاه بيان المساحة وصورة أوراق الملكية. لو بتشتري من برّه مصر، بنبعتلك الصور دي كلها قبل أي تحويل — مش بعده.",
  },
  {
    numAr: "٠٤",
    titleAr: "التسجيل في الشهر العقاري",
    bodyAr:
      "دي الخطوة اللي معظم الناس بتقف قبلها، وهي الوحيدة اللي بتخلي الوحدة ملكك قانونًا. بنمشي فيها معاك للآخر ونقول لك تكلفتها ومدتها من البداية، حتى لو الوحدة اللي اخترتها لسه عقدها عرفي.",
  },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const units = await getUnits();

  return (
    <>
      <Header locale={locale} />

      {/* The hero content is server-rendered inside the hero, not behind it.
          With JavaScript disabled this H1, the description and the facts all
          still render — which is the condition for being indexed and for
          being quotable by an answer engine. */}
      <Hero locale={locale}>
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
      </Hero>

      <main id="main">
        {/* ---- The units. First thing under the hero, one per row, the
                sides alternating. ---- */}
        <section className={s.units}>
          <div className="shell">
            <div className={s.unitsHead}>
              <span className="eyebrow">٠١ / معروض الآن</span>
              <h2 className={s.h2} data-anim="words">
                وحدات مختارة داخل النطاق
              </h2>
            </div>

            <div className={s.unitRows}>
              {units.slice(0, 6).map((unit, i) => (
                <UnitRow
                  key={unit.code}
                  unit={unit}
                  locale={locale}
                  index={i + 1}
                  priority={i === 0}
                />
              ))}
            </div>

            <p className={s.unitsFoot}>
              <Link
                href={`/${locale}/properties`}
                className={s.bigLink}
                data-anim="magnet"
              >
                كل الوحدات المعروضة ({toEasternDigits(TOTAL_LISTED)})
                <span aria-hidden="true"> ←</span>
              </Link>
              <Link
                href={`/${locale}/properties#affordability`}
                className={s.inlineLink}
              >
                أو ابدأ من القسط اللي تقدر عليه ←
              </Link>
            </p>
          </div>
        </section>

        {/* ---- The scope, as a band that keeps moving. The two registers
                with their counts are on the area guide; this is the same
                fact at headline speed. ---- */}
        <section className={s.scopeBand}>
          <div
            className={s.marquee}
            data-anim="marquee"
            data-speed="55"
            aria-hidden="true"
          >
            <div className={s.marqueeTrack} data-marquee-track>
              {[0, 1].map((run) => (
                <span key={run} className={s.marqueeRun}>
                  {scopeNames.map((name) => (
                    <span key={name} className={s.marqueeItem}>
                      {name}
                      <i className={s.marqueeDot} />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
          {/* The band above is decorative and duplicated; this is the line
              that carries the fact. */}
          <p className={s.scopeLine}>
            {toEasternDigits(COMPOUNDS.length + DISTRICTS.length)} كمبوند ومنطقة
            داخل حدائق أكتوبر و٦ أكتوبر والشيخ زايد.{" "}
            <Link
              href={`/${locale}/areas/hadayek-october`}
              className={s.inlineLink}
            >
              دليل المنطقة ومؤشر سعر المتر ←
            </Link>
          </p>
        </section>

        {/* ---- Statement and counters ---- */}
        <section className={s.statement}>
          <div className="shell grid12">
            <div className={s.statementText}>
              <span className="eyebrow">٠٢ / الأرقام</span>
              <h2 className={s.h2} data-anim="words">
                أرقام تقدر تراجعها، مش أرقام تصدّقها
              </h2>
              <p className={s.lede} data-anim="rise" data-delay="1">
                كل رقم تحت ده مكتوب جنبه مصدره في نفس الموقع. افتح الصفحة
                وعُدّها بنفسك — ده الفرق بين بيان وادّعاء.
              </p>
            </div>

            <dl
              className={s.counters}
              data-anim="rise"
              data-stagger
              data-delay="1"
            >
              {counters.map((c) => (
                <div key={c.labelAr} className={s.counter}>
                  <dt className={`mono ${s.counterValue}`}>
                    {/* The true value is server-rendered. Motion counts up to
                        the same number and lands on it exactly; with no
                        JavaScript it is simply already correct. */}
                    <span data-anim="counter" data-to={c.value}>
                      {toEasternDigits(c.value)}
                    </span>
                  </dt>
                  <dd className={s.counterLabel}>{c.labelAr}</dd>
                  <dd className={`mono ${s.counterSource}`}>{c.sourceAr}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- The word. Beat 6 — one word at the size of the viewport.
                Theirs is "Expertise", which is a claim about themselves.
                This one names the thing the site is actually about, and the
                line under it says where to go and check. ---- */}
        <section className={s.wordSection}>
          <div className="shell">
            <p className={s.word} data-anim="grow" data-from="0.82" data-to="1">
              مُوثّق
            </p>
            <p className={s.wordNote}>
              {toEasternDigits(LEGAL_STATUSES[0].count)} وحدة مسجلة بالشهر
              العقاري من أصل {toEasternDigits(TOTAL_LISTED)} معروضة. الباقي
              منشور بحالته القانونية كما هي.{" "}
              <Link href={`/${locale}/about#credentials`} className={s.wordLink}>
                الإفصاح القانوني بالكامل ←
              </Link>
            </p>
          </div>
        </section>

        {/* ---- The services list. Beat 7, the signature effect: outlined
                type that fills as you pass it. ---- */}
        <section className={s.services}>
          <div className="shell">
            <span className="eyebrow">٠٣ / اللي بنعمله</span>
            <ul className={s.serviceList} data-anim="fill">
              {services.map((name) => (
                <li key={name} className={s.serviceItem}>
                  {name}
                </li>
              ))}
            </ul>
            <p className={s.servicesNote}>
              وساطة عقارية فقط. إحنا مش مطوّر ومش بنبني — بنبيع وحدات موجودة
              فعلًا، شفناها بنفسنا، وبننشر أوراقها.
            </p>
          </div>
        </section>

        {/* ---- The area band. Beat 8 is a black-and-white video still with a
                play control. There is no film, so there is no play button: a
                control that does nothing is worse than no control. The
                picture desaturates back to colour as you pass it instead. ---- */}
        <section className={s.areaBand} data-anim="parallax" data-depth="0.12">
          <Image
            src="/img/area-aerial.webp"
            alt="لقطة جوية لحدائق أكتوبر"
            fill
            sizes="100vw"
            quality={85}
            className={s.areaImg}
          />
          <div className={s.areaOverlay}>
            <p className={s.areaName} data-anim="words">
              حدائق أكتوبر
            </p>
            <p className={s.areaMeta}>الجيزة · {COMPANY.surveyRef}</p>
          </div>
        </section>

        {/* ---- The process ---- */}
        <section className={s.section}>
          <div className="shell grid12">
            <div className={s.processIntro}>
              <span className="eyebrow">٠٤ / الخطوات</span>
              <h2 className={s.h2} data-anim="words">
                إزاي بنشتغل، خطوة بخطوة
              </h2>
              <p className={s.lede} data-anim="rise" data-delay="1">
                أربع خطوات، والرابعة هي اللي بتخلي الوحدة ملكك قانونًا. بنقول لك
                تكلفتها ومدتها من أول مكالمة.
              </p>
            </div>
            <div className={s.processList} data-anim="rise" data-delay="1">
              <Process steps={processSteps} />
            </div>
          </div>
        </section>

        {/* ---- Testimonials. Named, dated, with the unit type.
                No stars, no slider, and no aggregate rating: the
                reference's "4.9 / 5.0" has nothing behind it here, and
                inventing one is the exact failure this site is built
                against. If there are none published, the section does not
                render at all. ---- */}
        {TESTIMONIALS.length > 0 && (
          <section className={s.section}>
            <div className="shell">
              <span className="eyebrow">٠٥ / قالوا</span>
              <div
                className={`grid12 ${s.quotes}`}
                data-anim="rise"
                data-stagger
              >
                {TESTIMONIALS.map((t) => (
                  <figure key={t.nameAr} className={s.quote}>
                    <blockquote>
                      <p className={s.quoteText}>«{t.quoteAr}»</p>
                    </blockquote>
                    <figcaption>
                      <span className={s.quoteName}>{t.nameAr}</span>
                      <span className={`mono ${s.quoteDetail}`}>
                        {t.detailAr}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---- Who we are. Beat 10 of the reference is a six-person team
                grid. This is a brokerage with no such team, and putting
                invented staff on a live commercial site is not a design
                decision. The layout keeps the beat; the content is the
                registry. ---- */}
        <section className={s.who}>
          <div className="shell grid12">
            <div className={s.whoText}>
              <span className="eyebrow">٠٦ / مين إحنا</span>
              <h2 className={s.h2} data-anim="words">
                مكتب واحد في حدائق أكتوبر، ولا نعمل في غيرها
              </h2>
              <p className={s.lede} data-anim="rise" data-delay="1">
                بنشتغل في النطاق ده وبس، وده السبب اللي بيخلينا نعرف الفرق بين
                عمارة وعمارة في نفس الشارع. تعالى المكتب من غير موعد.
              </p>
              <Link href={`/${locale}/about`} className={s.inlineLink}>
                من نحن ←
              </Link>
            </div>

            <dl className={s.whoRegistry} data-anim="rise" data-delay="1">
              <div>
                <dt>السجل التجاري</dt>
                <dd className="mono">{COMPANY.commercialRegistry}</dd>
              </div>
              <div>
                <dt>البطاقة الضريبية</dt>
                <dd className="mono">{COMPANY.taxCard}</dd>
              </div>
              <div>
                <dt>قيد الوساطة العقارية</dt>
                <dd className="mono">{COMPANY.brokerageRegistration}</dd>
              </div>
              <div>
                <dt>سند القيد</dt>
                <dd>{COMPANY.brokerageDecreeAr}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---- Contact. No form: a form you fill and nobody answers is
                exactly the experience this brand exists to contradict. ---- */}
        <section className={s.contact}>
          <div className="shell grid12">
            <div className={s.contactIntro}>
              <span className="eyebrow">٠٧ / التواصل</span>
              <h2 className={s.h2} data-anim="words">
                كلّمنا في أي وقت — على واتساب أو في المكتب
              </h2>
              <p className={s.lede} data-anim="rise" data-delay="1">
                مفيش فورم تسيب فيه رقمك ومحدش يرد. تكلّم على واتساب مع اللي شاف
                الوحدة بنفسه، وهو اللي هيروح معاك المعاينة. إحنا موجودون ٢٤/٧.
              </p>
            </div>

            <div className={s.contactWhatsapp} data-anim="rise" data-delay="1">
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

            <div className={s.contactOffice} data-anim="rise" data-delay="2">
              <h3 className={s.contactTitle}>في المكتب</h3>
              <p className={s.contactMeta}>حدائق أكتوبر — تعالى بدون موعد</p>
              <p className={s.contactMeta}>{COMPANY.officeHoursAr}</p>
              <PhoneNumber className={`mono ${s.contactNumber}`} />
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
