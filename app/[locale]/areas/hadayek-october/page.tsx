import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import { COMPANY } from "@/lib/content";
import {
  GUIDE_UPDATED_AR,
  GUIDE_SAMPLE_AR,
  GUIDE_SUMMARY,
  GUIDE_CONTENTS,
  COMPOUND_TABLE,
  SUBAREAS,
  BY_TYPE,
  FINISH_PREMIUM,
  ACCESS,
  SERVICES,
  CAUTIONS,
  GUIDE_FAQ,
} from "@/lib/area-guide";
import { whatsappHref } from "@/lib/format";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "دليل حدائق أكتوبر: الكمبوندات وأسعار المتر وأزمنة الوصول ٢٠٢٦",
  description:
    "دليل مكتوب لمن يفكر في الشراء في حدائق أكتوبر: الكمبوندات ومطوّروها بالاسم، متوسط سعر المتر في كل منها وتاريخ رصده، أزمنة الوصول مقيسة بالسيارة، وأربع مشكلات شائعة في العقود.",
  alternates: { canonical: "/ar/areas/hadayek-october" },
};

export default async function AreaGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  /* Two schemas. FAQPage is the one that matters here: a question-shaped
     heading with the answer in its first sentence is the unit an answer
     engine actually retrieves, and this page is built out of them. */
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      name: "حدائق أكتوبر",
      alternateName: "Hadayek October",
      description:
        "امتداد غربي لمدينة السادس من أكتوبر، مخطَّط على هضبة صحراوية مستوية على مستوى +180 م.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "حدائق أكتوبر",
        addressRegion: "الجيزة",
        addressCountry: "EG",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: GUIDE_FAQ.map((f) => ({
        "@type": "Question",
        name: f.qAr,
        acceptedAnswer: { "@type": "Answer", text: f.aAr },
      })),
    },
  ];

  return (
    <>
      <Header locale={locale} variant="light" />

      <main id="main">
        {/* ---- Masthead ---- */}
        <section className={s.masthead}>
          <div className="shell grid12">
            <div className={s.mastheadText}>
              <span className="eyebrow">
                دليل المنطقة · تحديث {GUIDE_UPDATED_AR}
              </span>
              <h1 className={s.h1}>
                حدائق أكتوبر:
                <br />
                ما فيها بالاسم والرقم
              </h1>
              <p className={s.lede}>
                هذه الصفحة مكتوبة لمن يفكر فعلًا في الشراء هنا: الكمبوندات
                الموجودة على الأرض ومطوّروها، متوسط سعر المتر في كل واحد وتاريخ
                رصده، أزمنة الوصول مقيسة بالسيارة، والمشكلات التي نراها ولا
                يذكرها أحد. لا يوجد فيها كلام عن «الحياة الراقية».
              </p>
            </div>
            <nav className={s.contents} aria-label="في هذه الصفحة">
              <h2 className={s.contentsTitle}>في هذه الصفحة</h2>
              <ol>
                {GUIDE_CONTENTS.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`}>{c.labelAr}</a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        {/* ---- Full-bleed aerial with a survey caption ---- */}
        <figure className={s.hero}>
          <Image
            src="/img/area-aerial.webp"
            alt="منظر جوي لحدائق أكتوبر: مبانٍ منخفضة من الحجر الجيري وشوارع مشجّرة وهضبة الصحراء في الأفق"
            fill
            sizes="100vw"
            priority
            quality={82}
          />
          <figcaption className={`mono ${s.heroCaption}`}>
            <span>حدائق أكتوبر من الجهة الغربية</span>
            <span>الهضبة الصحراوية على مستوى +180 م</span>
            <span>SURVEY REF {COMPANY.surveyRef}</span>
          </figcaption>
        </figure>

        {/* ---- The market, in three plain paragraphs ---- */}
        <section className={s.section}>
          <div className="shell grid12">
            <div className={s.prose}>
              <p>
                حدائق أكتوبر امتداد غربي لمدينة السادس من أكتوبر، مخطَّط على
                هضبة صحراوية مستوية، وأرضه مقسَّمة على شكل شبكة واسعة ومحاور
                مستقيمة. هذا التخطيط هو سبب الفارق العملي الأهم بينها وبين
                أكتوبر القديمة: العمارات أحدث، الشوارع أعرض، ونسبة المساحات
                المفتوحة أكبر — والوصول للطرق الرئيسية يمر عبر محور واحد أو
                اثنين لا أكثر، فاختيار الموقع داخل المنطقة يغيّر زمن رحلتك
                اليومية أكثر مما يغيّره أي شيء آخر.
              </p>
              <p>
                السوق هنا ثلاث طبقات واضحة. الكمبوندات المسوَّرة بخدمات كاملة،
                وسعر المتر فيها اليوم بين{" "}
                <bdi className="mono">17,000</bdi> و
                <bdi className="mono">34,000</bdi> ج.م. مشروعات الإسكان المخططة
                مثل سكن مصر وربوة أكتوبر ومنطقة الـ٨٠٠ فدان، وسعر المتر فيها بين{" "}
                <bdi className="mono">11,000</bdi> و
                <bdi className="mono">18,000</bdi>. وأخيرًا الأبنية المتفرقة على
                أراضٍ فردية، وهي أرخص ومخاطرها الورقية أعلى — وأكثر ما نرفض عرضه
                يأتي من هذه الطبقة.
              </p>
              <p className={s.rule}>
                القاعدة العملية التي نعطيها لكل مشترٍ: في هذه المنطقة، الورق أهم
                من التشطيب. وحدة على المحارة بعقد مسجل أفضل استثمارًا من وحدة
                سوبر لوكس بعقد عرفي، لأن الفرق في التشطيب تدفعه مرة واحدة،
                والفرق في الورق تدفعه عند البيع وعند التوريث وعند كل قرض.
              </p>
            </div>

            <aside className={s.summary}>
              <h2 className={s.summaryTitle}>الملخص الرقمي</h2>
              <dl className={s.summaryList}>
                {GUIDE_SUMMARY.map((r) => (
                  <div key={r.labelAr}>
                    <dt>{r.labelAr}</dt>
                    <dd className="mono">
                      <bdi>{r.valueAr}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={s.summaryNote}>{GUIDE_SAMPLE_AR}</p>
            </aside>
          </div>
        </section>

        {/* ---- Compounds ---- */}
        <section id="compounds" className={s.section}>
          <div className="shell">
            <h2 className={s.h2}>الكمبوندات ومطوّروها</h2>
            <p className={s.sectionLede}>
              المشروعات القائمة أو الجاري تسليمها داخل حدائق أكتوبر والنطاق
              الملاصق لها. متوسط سعر المتر مأخوذ من عروض معروضة فعلًا في أغسطس
              ٢٠٢٦، لا من أسعار المطوّر المعلنة.
            </p>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th scope="col">الكمبوند</th>
                    <th scope="col">المطوّر</th>
                    <th scope="col">أنواع الوحدات</th>
                    <th scope="col">متوسط سعر المتر</th>
                    <th scope="col">التسليم</th>
                    <th scope="col">معروض عندنا</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPOUND_TABLE.map((c) => (
                    <tr key={c.nameAr}>
                      <th scope="row">{c.nameAr}</th>
                      <td>{c.devAr}</td>
                      <td>{c.typesAr}</td>
                      <td className="mono">
                        <bdi>{c.ppm}</bdi>
                      </td>
                      <td>{c.handoverAr}</td>
                      <td className="mono">{c.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={s.footnote}>
              صن كابيتال وبادية تقعان في السادس من أكتوبر لا في حدائق أكتوبر،
              وأدرجناهما لأن كثيرًا من المشترين يقارنون بهما. لا نعرض وحدات في
              زيد ويست (الشيخ زايد) ولا بلومفيلدز (مدينة المستقبل) — ليستا في
              هذا النطاق.
            </p>
          </div>
        </section>

        {/* ---- Housing districts ---- */}
        <section id="housing" className={s.sectionAlt}>
          <div className="shell grid12">
            <div className={s.housingIntro}>
              <h2 className={s.h2}>مناطق الإسكان والسكن الحكومي</h2>
              <p className={s.sectionLede}>
                هنا يشتري معظم من نتعامل معهم. الأسعار أقل من الكمبوندات بنحو
                الثلث، والخدمات أقل أيضًا، والورق يحتاج قراءة متأنية — خاصة في
                الوحدات التي انتقلت بين أكثر من مالك بعقود عرفية.
              </p>
              <p className={s.sectionLede}>
                أهم سؤال في هذه المناطق ليس السعر، بل: هل الوحدة داخل مشروع
                حكومي له نظام تخصيص واضح، أم على أرض فردية؟ الإجابة تحدد كل شيء
                بعد ذلك.
              </p>
            </div>
            <dl className={s.districts}>
              {SUBAREAS.map((a) => (
                <div key={a.nameAr} className={s.district}>
                  <dt>
                    <span className={s.districtName}>{a.nameAr}</span>
                    <span className={`mono ${s.districtPpm}`}>
                      <bdi>{a.ppm}</bdi> ج.م/م²
                    </span>
                  </dt>
                  <dd>{a.noteAr}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---- Price by unit type ---- */}
        <section id="prices" className={s.section}>
          <div className="shell grid12">
            <div className={s.priceIntro}>
              <h2 className={s.h2}>سعر المتر بحسب نوع الوحدة</h2>
              <p className={s.sectionLede}>
                متوسطات مأخوذة من نفس العيّنة، مقسّمة بنوع الوحدة لا بالكمبوند.
                الفرق بين الشقة والتاون هاوس في سعر المتر أقل مما يتوقعه معظم
                المشترين، والفرق بين التشطيب الكامل والمحارة أكبر مما يتوقعونه.
              </p>

              <h3 className={s.h3}>أثر التشطيب على سعر المتر</h3>
              <dl className={s.premium}>
                {FINISH_PREMIUM.map((f) => (
                  <div key={f.nameAr}>
                    <dt>{f.nameAr}</dt>
                    <dd className="mono">
                      <bdi>{f.deltaAr}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={s.footnote}>
                تكلفة تشطيب المتر بنفسك اليوم بين{" "}
                <bdi className="mono">4,500</bdi> و
                <bdi className="mono">7,000</bdi> ج.م حسب المستوى — أي أن شراء
                وحدة على المحارة وتشطيبها غالبًا أرخص من شراء وحدة مشطَّبة،
                ويأخذ من ٣ إلى ٥ أشهر.
              </p>
            </div>

            <div className={s.priceTable}>
              <div className={s.tableWrap}>
                <table className={s.table}>
                  <thead>
                    <tr>
                      <th scope="col">نوع الوحدة</th>
                      <th scope="col">متوسط سعر المتر</th>
                      <th scope="col">المدى</th>
                      <th scope="col">المساحة الشائعة</th>
                      <th scope="col">العيّنة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BY_TYPE.map((t) => (
                      <tr key={t.nameAr}>
                        <th scope="row">{t.nameAr}</th>
                        <td className="mono">
                          <bdi>{t.ppm}</bdi>
                        </td>
                        <td className="mono">
                          <bdi>{t.rangeAr}</bdi>
                        </td>
                        <td className="mono">
                          <bdi>{t.sizeAr} م²</bdi>
                        </td>
                        <td className="mono">{t.n}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Access ---- */}
        <section id="access" className={s.sectionAlt}>
          <div className="shell grid12">
            <div className={s.accessIntro}>
              <h2 className={s.h2}>الطرق وأزمنة الوصول</h2>
              <p className={s.sectionLede}>
                مقيسة بالسيارة من مركز حدائق أكتوبر، يوم عمل الساعة ٩ صباحًا في
                أغسطس ٢٠٢٦. الأزمنة تتضاعف تقريبًا في ذروة المساء على محور ٢٦
                يوليو باتجاه القاهرة.
              </p>
              <p className={s.sectionLede}>
                المخارج الأساسية ثلاثة: محور ٢٦ يوليو شمالًا نحو الشيخ زايد
                والمهندسين، الطريق الدائري الأوسطي شرقًا، وطريق الواحات جنوبًا.
                الوحدات في الأطراف الغربية أرخص بنحو{" "}
                <bdi className="mono">8%</bdi> لكل متر، ومقابل ذلك تضيف من ٦ إلى
                ٩ دقائق على كل رحلة.
              </p>
            </div>
            <div className={s.accessTable}>
              <table className={s.table}>
                <tbody>
                  {ACCESS.map((a) => (
                    <tr key={a.nameAr}>
                      <th scope="row">{a.nameAr}</th>
                      <td className="mono">
                        <bdi>{a.km} كم</bdi>
                      </td>
                      <td className="mono">
                        <bdi>{a.min} دقيقة</bdi>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ---- Services ---- */}
        <section id="services" className={s.section}>
          <div className="shell">
            <h2 className={s.h2}>الجامعات والمدارس والخدمات</h2>
            <div className={s.services}>
              {SERVICES.map((g) => (
                <div key={g.titleAr} className={s.serviceCol}>
                  <h3 className={s.serviceTitle}>{g.titleAr}</h3>
                  <ul>
                    {g.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                  <p className={s.footnote}>{g.noteAr}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Cautions. The section that earns the citations. ---- */}
        <section id="cautions" className={s.cautions}>
          <div className="shell grid12">
            <div className={s.cautionsIntro}>
              <span className="eyebrow">ما ننصح بالحذر منه</span>
              <h2 className={s.h2}>أربع مشكلات نراها كل شهر</h2>
              <p className={s.cautionsLede}>
                مكتوبة هنا لأن معرفتها قبل الحجز توفّر عليك مالًا فعلًا، ولأن
                أحدًا في السوق لا يكتبها.
              </p>
            </div>
            <ol className={s.cautionList}>
              {CAUTIONS.map((c, i) => (
                <li key={c.titleAr}>
                  <span className={`mono ${s.cautionNum}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={s.cautionTitle}>{c.titleAr}</h3>
                    <p>{c.bodyAr}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- FAQ. Question-shaped headings, answer-first paragraphs. ---- */}
        <section className={s.section}>
          <div className="shell grid12">
            <h2 className={`${s.h2} ${s.faqHead}`}>أسئلة يسألها المشترون هنا</h2>
            <div className={s.faq}>
              {GUIDE_FAQ.map((f) => (
                <article key={f.qAr} className={s.faqItem}>
                  <h3 className={s.faqQ}>{f.qAr}</h3>
                  <p>{f.aAr}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Close ---- */}
        <section className={s.close}>
          <div className="shell">
            <h2 className={s.closeTitle}>تحب نراجع وحدة معيّنة معاك؟</h2>
            <p className={s.closeLede}>
              ابعت لنا كود الوحدة أو لينكها، ونقولك رأينا في ورقها وسعرها قبل ما
              تروح تشوفها.
            </p>
            <div className={s.closeActions}>
              <a
                className={s.closeWa}
                href={whatsappHref(
                  "السلام عليكم، حابب تراجعوا معايا وحدة في حدائق أكتوبر — الكود:",
                )}
                rel="noopener"
              >
                ابعت لنا كود الوحدة
              </a>
              <Link href={`/${locale}/properties`} className={s.closeLink}>
                تصفّح الوحدات المعروضة ←
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MobileActionBar enquiry="قرأت دليل حدائق أكتوبر وحابب أستشيركم" />
      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
