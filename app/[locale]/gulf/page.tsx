import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  GULF_SUMMARY,
  GULF_STEPS,
  GULF_DOCS,
  GULF_COSTS,
  GULF_COST_TOTAL_AR,
  GULF_YIELDS,
  GULF_HOURS,
} from "@/lib/gulf";
import { COMPANY } from "@/lib/content";
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

  return (
    <>
      <Header locale={locale} variant="light" />

      <main id="main">
        <section className={s.masthead}>
          <div className="shell grid12">
            <div className={s.mastheadText}>
              <span className="eyebrow">الشراء من خارج مصر</span>
              <h1 className={s.h1}>
                تملّك في حدائق أكتوبر
                <br />
                من الرياض أو جدة أو الدمام
              </h1>
              <p className={s.lede}>
                ثمانية من كل عشرين عميل تعاملنا معهم خلال العامين الماضيين
                يقيمون في السعودية أو الخليج. هذه الصفحة تشرح الإجراء كما يجري
                فعلًا: المستندات المطلوبة، ما يمكن إنجازه بالتوكيل وما يستلزم
                الحضور، الرسوم والضرائب بأرقامها، وحدود التملك للأجانب في القانون
                المصري.
              </p>
            </div>
            <div className={s.summary}>
              <h2 className={s.summaryTitle}>الخلاصة قبل التفاصيل</h2>
              <dl className={s.summaryList}>
                {GULF_SUMMARY.map((r) => (
                  <div key={r.labelAr}>
                    <dt>{r.labelAr}</dt>
                    <dd className="mono">
                      <bdi>{r.valueAr}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <figure className={s.hero}>
          <Image
            src="/img/area-street.webp"
            alt="شارع سكني داخلي في حدائق أكتوبر: أرصفة واسعة وأشجار نخيل ومبانٍ منخفضة من الحجر الجيري"
            fill
            sizes="100vw"
            priority
            quality={82}
          />
          <figcaption className={`mono ${s.heroCaption}`}>
            <span>شارع داخلي في حدائق أكتوبر</span>
            <span>صافي عائد الإيجار المرصود 7.4% – 9.1% سنويًا</span>
            <span>SURVEY REF {COMPANY.surveyRef}</span>
          </figcaption>
        </figure>

        {/* ---- Six documented stages ---- */}
        <section className={s.section}>
          <div className="shell">
            <h2 className={s.h2}>مراحل الشراء عن بُعد</h2>
            <p className={s.sectionLede}>
              ست مراحل، لكل منها مخرَج موثَّق ترسله إليك نسخة منه في نفس اليوم.
              لا ننتقل من مرحلة إلى التي بعدها قبل أن تصلك أوراق التي قبلها.
              المسؤول عن هذا الملف شخص واحد من البداية إلى التسجيل، ويعمل بتوقيت
              الخليج عند الحاجة.
            </p>
            <ol className={s.steps}>
              {GULF_STEPS.map((st) => (
                <li key={st.nAr} className={s.step}>
                  <span className={`mono ${s.stepNum}`}>{st.nAr}</span>
                  <div className={s.stepBody}>
                    <h3 className={s.stepTitle}>{st.titleAr}</h3>
                    <p>{st.bodyAr}</p>
                  </div>
                  <div className={s.stepMeta}>
                    <span className={`mono ${s.stepOutLabel}`}>المخرَج الموثَّق</span>
                    <span className={s.stepOut}>{st.outputAr}</span>
                    <span className={`mono ${s.stepDays}`}>{st.daysAr}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- Documents + ownership limits ---- */}
        <section className={s.sectionAlt}>
          <div className="shell grid12">
            <div className={s.docsCol}>
              <h2 className={s.h2}>المستندات المطلوبة منك</h2>
              <p className={s.sectionLede}>
                كل ما يلزم لإتمام الشراء والتسجيل دون حضورك. التوكيل هو المستند
                الوحيد الذي يحتاج توثيقًا في الخارج.
              </p>
              <dl className={s.docs}>
                {GULF_DOCS.map((d) => (
                  <div key={d.titleAr}>
                    <dt>{d.titleAr}</dt>
                    <dd>{d.noteAr}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={s.lawCol}>
              <h2 className={s.h3}>حدود التملك في القانون المصري</h2>
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
              <p className={s.lawNote}>
                هذه الصفحة استرشادية ومحدَّثة في سبتمبر ٢٠٢٦. أحكام تملك
                الأجانب تُعدَّل من وقت لآخر — استشر محاميك قبل أي التزام.
              </p>

              <h2 className={`${s.h3} ${s.h3Spaced}`}>
                التكلفة الكاملة على وحدة بـ <bdi className="mono">2,000,000</bdi> ج.م
              </h2>
              <table className={s.costs}>
                <tbody>
                  {GULF_COSTS.map((c) => (
                    <tr key={c.labelAr}>
                      <th scope="row">{c.labelAr}</th>
                      <td className="mono">
                        <bdi>{c.valueAr}</bdi>
                      </td>
                    </tr>
                  ))}
                  <tr className={s.costTotal}>
                    <th scope="row">الإجمالي التقديري</th>
                    <td className="mono">
                      <bdi>{GULF_COST_TOTAL_AR}</bdi>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className={s.footnote}>
                لا توجد رسوم خفية ولا «مصاريف إدارية» عندنا. العمولة تُدفع عند
                التعاقد فقط.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Remote viewing ---- */}
        <section className={s.section}>
          <div className="shell grid12">
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
              ].map((g) => (
                <div key={g.src} className={s.viewingShot}>
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width:900px) 50vw, 25vw" quality={80} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Observed yields ---- */}
        <section className={s.sectionAlt}>
          <div className="shell">
            <h2 className={s.h2}>العائد المرصود، لا العائد الموعود</h2>
            <p className={s.sectionLede}>
              أرقام مأخوذة من وحدات نديرها أو نتابع إيجارها فعلًا داخل النطاق.
              صافي العائد محسوب بعد خصم الصيانة والفترات الفارغة وأجر الإدارة،
              لا قبلها.
            </p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th scope="col">نوع الوحدة والمنطقة</th>
                    <th scope="col">ثمن الشراء</th>
                    <th scope="col">الإيجار الشهري</th>
                    <th scope="col">إجمالي العائد</th>
                    <th scope="col">صافي العائد</th>
                    <th scope="col">أشهر فارغة سنويًا</th>
                  </tr>
                </thead>
                <tbody>
                  {GULF_YIELDS.map((y) => (
                    <tr key={y.nameAr}>
                      <th scope="row">{y.nameAr}</th>
                      <td className="mono"><bdi>{y.priceAr}</bdi></td>
                      <td className="mono"><bdi>{y.rentAr}</bdi></td>
                      <td className="mono"><bdi>{y.grossAr}</bdi></td>
                      <td className={`mono ${s.net}`}><bdi>{y.netAr}</bdi></td>
                      <td className="mono"><bdi>{y.vacancyAr}</bdi></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.footnote}>
              العائد بالجنيه المصري. لا نُدرج في هذه الأرقام أي توقع لارتفاع سعر
              الوحدة نفسها، لأنه توقع لا رصد.
            </p>
          </div>
        </section>

        {/* ---- Contact (night band) ---- */}
        <section className={s.contact}>
          <div className="shell grid12">
            <div className={s.contactText}>
              <span className="eyebrow">جهة الاتصال</span>
              <h2 className={s.h2Night}>
                مسؤول واحد لملفك من أول رسالة إلى التسجيل
              </h2>
              <p className={s.contactLede}>
                لا مركز اتصال ولا نموذج بيانات. اكتب لنا المنطقة والميزانية
                والغرض — سكن أم استثمار — ويصلك في اليوم نفسه ملف مبدئي بثلاث
                وحدات مطابقة وأوراقها.
              </p>
              <a
                className={s.contactWa}
                href={whatsappHref(
                  "السلام عليكم، أرغب في الاستفسار عن التملك في حدائق أكتوبر من خارج مصر. المنطقة والميزانية والغرض:",
                )}
                rel="noopener"
              >
                واتساب · <bdi dir="ltr">{PHONE_INTL}</bdi>
              </a>
              <a className={s.contactCall} href={`tel:${PHONE_E164}`}>
                اتصال مباشر
              </a>
            </div>

            <div className={s.hours}>
              <h3 className={s.hoursTitle}>مواعيد العمل بتوقيتك</h3>
              <dl className={s.hoursList}>
                {GULF_HOURS.map((h) => (
                  <div key={h.cityAr}>
                    <dt>{h.cityAr}</dt>
                    <dd className="mono">
                      <bdi dir="ltr">{h.hoursAr}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
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
