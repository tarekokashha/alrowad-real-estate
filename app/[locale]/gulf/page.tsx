import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import TimelineRail from "@/components/gulf/TimelineRail";
import {
  GULF_SUMMARY,
  GULF_STEPS,
  GULF_DOCS,
  GULF_YIELDS,
  GULF_HOURS,
} from "@/lib/gulf";
import { whatsappHref, PHONE_INTL, PHONE_E164 } from "@/lib/format";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "التملك في حدائق أكتوبر من خارج مصر — دليل المستثمر الخليجي | الرواد",
  description:
    "إجراءات شراء وحدة في حدائق أكتوبر من الرياض أو جدة أو الدمام: المستندات المطلوبة، التوكيل، المعاينة المرئية المباشرة، حدود التملك للأجانب، الرسوم والضرائب بأرقامها، والعائد المرصود.",
  alternates: { canonical: "/ar/gulf" },
};

export default async function GulfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const summary = [
    ...GULF_SUMMARY.map((r) => ({
      label: r.labelAr,
      value: <bdi>{r.valueAr}</bdi>,
      bronze: r.labelAr === "الحضور الشخصي",
    })),
    { label: "صافي عائد الإيجار المرصود", value: <bdi>7.4% – 9.1% سنويًا</bdi>, bronze: false },
  ];

  return (
    <>
      <Header locale={locale} variant="interior" active="gulf" />

      <main id="main">
        <PageHeader
          eyebrow="الشراء من خارج مصر"
          title={
            <>
              تملّك في حدائق أكتوبر من{" "}
              <span style={{ color: "var(--bronze)" }}>الرياض أو جدة أو الدمام</span>
            </>
          }
          lede="ثمانية من كل عشرين عميل تعاملنا معهم خلال العامين الماضيين يقيمون في السعودية أو الخليج. هذه الصفحة تشرح الإجراء كما يجري فعلًا: المستندات المطلوبة، ما يمكن إنجازه بالتوكيل وما يستلزم الحضور، الرسوم والضرائب بأرقامها، وحدود التملك للأجانب في القانون المصري."
          stats={
            <div className={s.statGrid}>
              {summary.map((it, i) => (
                <div key={it.label} data-anim="rise" data-delay={i + 1} className={s.statCell}>
                  <span className={s.statLabel}>{it.label}</span>
                  <span className={`${s.statValue} ${it.bronze ? s.bronze : ""}`}>{it.value}</span>
                </div>
              ))}
            </div>
          }
          image="/img/area-landscape.webp"
          imageAlt="ممشى داخلي في حدائق أكتوبر بين مبانٍ من الحجر الجيري وأشجار زيتون"
          imageHeight="clamp(280px, 56vh, 620px)"
        />

        {/* ---- Six documented stages ---- */}
        <section className={s.section}>
          <h2 className={s.h2}>مراحل الشراء عن بُعد</h2>
          <p className={s.sectionLede}>
            ست مراحل، لكل منها مخرَج موثَّق ترسله إليك نسخة منه في نفس اليوم.
            لا ننتقل من مرحلة إلى التي بعدها قبل أن تصلك أوراق التي قبلها.
            المسؤول عن هذا الملف شخص واحد من البداية إلى التسجيل، ويعمل بتوقيت
            الخليج عند الحاجة.
          </p>
          <TimelineRail>
            {GULF_STEPS.map((st, i) => (
              <div key={st.nAr} data-anim="rise" data-delay={i + 1} className={s.step}>
                <span className={`${s.dot} ${i === GULF_STEPS.length - 1 ? s.dotFilled : ""}`} />
                <div className={s.stepBody}>
                  <span className={`mono ${s.stepNum}`}>{st.nAr}</span>
                  <h3 className={s.stepTitle}>{st.titleAr}</h3>
                  <p>{st.bodyAr}</p>
                </div>
                <div className={s.stepMeta}>
                  <span className={s.stepOutLabel}>المخرَج الموثَّق</span>
                  <span className={s.stepOut}>{st.outputAr}</span>
                  <span className={`mono ${s.stepDays}`}>{st.daysAr}</span>
                </div>
              </div>
            ))}
          </TimelineRail>
        </section>

        {/* ---- Documents + ownership limits ---- */}
        <section className={s.sectionAlt}>
          <div className={s.docsGrid}>
            <div className={s.docsCol}>
              <h2 className={s.h2}>المستندات المطلوبة منك</h2>
              <p className={s.sectionLede}>
                كل ما يلزم لإتمام الشراء والتسجيل دون حضورك. التوكيل هو المستند
                الوحيد الذي يحتاج توثيقًا في الخارج.
              </p>
              <div className={s.docs}>
                {GULF_DOCS.map((d, i) => (
                  <div key={d.titleAr} className={`${s.doc} ${i === 1 ? s.docHighlight : ""}`}>
                    <span className={s.docTitle}>{d.titleAr}</span>
                    <span className={s.docNote}>{d.noteAr}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.lawCol}>
              <h3 className={s.h3}>حدود التملك في القانون المصري</h3>
              <p className={s.lawP}>
                للأجانب غير المصريين: تملك ما لا يجاوز وحدتين للسكن الخاص، ولا
                تزيد مساحة الوحدة على <bdi className="mono">4,000</bdi> م²، وألا
                تكون من الآثار أو في المناطق المحظورة. المصريون المقيمون بالخارج
                لا يخضعون لهذه القيود.
              </p>
              <p className={s.lawP}>
                التصرف في الوحدة بالبيع قبل مضي خمس سنوات على تاريخ الشراء
                يستلزم موافقة مسبقة من رئاسة مجلس الوزراء في بعض الحالات. نراجع
                هذا البند مع محاميك قبل التعاقد، ونكتب لك رأيه.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Remote viewing ---- */}
        <section className={s.section}>
          <div className={s.viewingGridOuter}>
            <div className={s.viewingText}>
              <h2 className={s.h2}>المعاينة عن بُعد كما نجريها</h2>
              <p className={s.sectionLede}>
                اتصال مرئي مباشر من داخل الوحدة، مدته من ثلاثين إلى خمسين دقيقة،
                في التوقيت الذي يناسبك. لا نرسل تسجيلًا معدًّا مسبقًا: أنت من
                يوجّه الكاميرا.
              </p>
              <p className={s.sectionLede}>
                نقيس أمامك المساحات بالشريط، نفتح الحنفيات ولوحة الكهرباء،
                نصوّر عدادات المياه والكهرباء بأرقامها، ونخرج إلى السلم والمدخل
                والجراج والشارع. بعد المعاينة يصلك تقرير مكتوب بالصور وبتاريخها.
              </p>
              <p className={s.viewingRule}>
                إن كان في الوحدة عيب، سيظهر في التقرير. التقرير أداة قرار لا أداة
                بيع.
              </p>
            </div>
            <div className={s.viewingGrid}>
              {[
                { src: "/img/unit-01-living.webp", alt: "معاينة ريسبشن الوحدة بالضوء الطبيعي" },
                { src: "/img/unit-01-kitchen.webp", alt: "معاينة المطبخ وعدادات المياه" },
                { src: "/img/unit-03-stair.webp", alt: "معاينة السلم والمدخل" },
                { src: "/img/unit-04-exterior.webp", alt: "معاينة واجهة العمارة والشارع" },
              ].map((g, i) => (
                <div key={g.src} className={`${s.viewingShot} ${i % 2 === 1 ? s.viewingShotDown : ""}`}>
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width:900px) 50vw, 25vw" quality={80} className="kenBurns" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Observed yields ---- */}
        <section className={s.sectionAlt}>
          <h2 className={s.h2}>العائد المرصود، لا العائد الموعود</h2>
          <p className={s.sectionLede}>
            أرقام مأخوذة من وحدات نديرها أو نتابع إيجارها فعلًا داخل النطاق.
            صافي العائد محسوب بعد خصم الصيانة والفترات الفارغة وأجر الإدارة،
            لا قبلها.
          </p>
          <div className={s.tableWrap}>
            <div className={s.tableMin}>
              <div className={`${s.row} ${s.head}`}>
                <span>نوع الوحدة والمنطقة</span>
                <span>ثمن الشراء</span>
                <span>الإيجار الشهري</span>
                <span>إجمالي العائد</span>
                <span>صافي العائد</span>
                <span>أشهر فارغة سنويًا</span>
              </div>
              {GULF_YIELDS.map((y) => (
                <div key={y.nameAr} className={s.row}>
                  <span className={s.yName}>{y.nameAr}</span>
                  <bdi className="mono">{y.priceAr}</bdi>
                  <bdi className="mono">{y.rentAr}</bdi>
                  <bdi className="mono">{y.grossAr}</bdi>
                  <bdi className={`mono ${s.net}`}>{y.netAr}</bdi>
                  <bdi className="mono">{y.vacancyAr}</bdi>
                </div>
              ))}
            </div>
          </div>
          <p className={s.footnote}>
            العائد بالجنيه المصري. لا نُدرج في هذه الأرقام أي توقع لارتفاع سعر
            الوحدة نفسها، لأنه توقع لا رصد.
          </p>
        </section>

        {/* ---- Contact (night band) ---- */}
        <section className={s.contact}>
          <div className={s.contactGrid}>
            <div className={s.contactText}>
              <span className={s.contactEyebrow}>جهة الاتصال</span>
              <h2 className={s.h2Night}>مسؤول واحد لملفك من أول رسالة إلى التسجيل</h2>
              <p className={s.contactLede}>
                لا مركز اتصال ولا نموذج بيانات. اكتب لنا المنطقة والميزانية
                والغرض — سكن أم استثمار — ويصلك في اليوم نفسه ملف مبدئي بثلاث
                وحدات مطابقة وأوراقها.
              </p>
              <div className={s.contactCtas}>
                <a
                  className={s.contactWa}
                  href={whatsappHref(
                    "السلام عليكم، أرغب في الاستفسار عن التملك في حدائق أكتوبر من خارج مصر. المنطقة والميزانية والغرض:",
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  واتساب · <bdi className="mono">{PHONE_INTL}</bdi>
                </a>
                <a className={s.contactCall} href={`tel:${PHONE_E164}`}>
                  اتصال مباشر
                </a>
              </div>
            </div>

            <div className={s.hours}>
              <h3 className={s.hoursTitle}>مواعيد العمل بتوقيتك</h3>
              {GULF_HOURS.map((h) => (
                <div key={h.cityAr} className={s.hoursRow}>
                  <span>{h.cityAr}</span>
                  <bdi className="mono" dir="ltr">
                    {h.hoursAr}
                  </bdi>
                </div>
              ))}
              <p className={s.hoursNote}>
                خارج هذه المواعيد يصلك رد على واتساب في أول ساعة من الصباح.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
