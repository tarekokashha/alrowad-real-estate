import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import SoldTable from "@/components/SoldTable";
import { SOLD, SOLD_TOTAL_SINCE_2011, SOLD_SUMMARY_2026, SOLD_USES } from "@/lib/sold";
import { formatNumber } from "@/lib/format";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "سجل البيع — كل وحدة بعناها بتاريخها وسعرها | الرواد",
  description:
    "سجل عام لكل وحدة أتممنا التعاقد عليها: الكود، المنطقة، المساحة، سعر البيع الفعلي، سعر المتر، الحالة القانونية وقت البيع، ومدة العرض. تقدر تقارن به أي سعر معروض عليك اليوم.",
  alternates: { canonical: "/ar/sold" },
};

export default async function SoldPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const S = SOLD_SUMMARY_2026;

  const summary = [
    { labelAr: "وحدات مبيعة", value: String(S.units) },
    { labelAr: "وسيط سعر البيع", value: `${formatNumber(S.medianPrice)} ج.م` },
    { labelAr: "وسيط سعر المتر", value: `${formatNumber(S.medianPerMetre)} ج.م` },
    { labelAr: "وسيط مدة البيع", value: `${S.medianDays} يومًا` },
    { labelAr: "نسبة التفاوض عن السعر المعلن", value: S.negotiationAr },
  ];

  return (
    <>
      <Header locale={locale} variant="light" />

      <main id="main">
        <section className={s.masthead}>
          <div className="shell grid12">
            <div className={s.mastheadText}>
              <span className="eyebrow">سجل عام · يُحدَّث بعد كل تعاقد</span>
              <h1 className={s.h1}>
                كل وحدة بعناها،
                <br />
                بتاريخها وسعرها
              </h1>
              <p className={s.lede}>
                من ٢٠١١ إلى اليوم سجّلنا{" "}
                <bdi className="mono">{SOLD_TOTAL_SINCE_2011}</bdi> وحدة. هذه
                الصفحة هي ذلك الرقم مفتوحًا: كود الوحدة، منطقتها، مساحتها، سعر
                بيعها الفعلي، وتاريخ إتمام التعاقد. تقدر تقارن بها أي سعر معروض
                عليك اليوم.
              </p>
            </div>

            <div className={s.summary}>
              <h2 className={s.summaryTitle}>ملخص {S.yearAr} حتى الآن</h2>
              <dl className={s.summaryList}>
                {summary.map((r) => (
                  <div key={r.labelAr}>
                    <dt>{r.labelAr}</dt>
                    <dd className="mono">
                      <bdi>{r.value}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className={s.tableSection}>
          <div className="shell-wide">
            <SoldTable />
            <p className={s.disclosure}>
              الأسعار المنشورة هي القيمة المتعاقد عليها كما وردت في العقد، لا
              السعر المعلن قبل التفاوض. ننشر السجل بعد إتمام التعاقد فقط، ولا
              نحذف منه شيئًا لاحقًا. أسماء المشترين لا تُنشر — الوحدة والرقم
              والتاريخ فقط، وهي وحدها ما تحتاجه للمقارنة.
            </p>
          </div>
        </section>

        {/* The archive framed as a tool the buyer uses, including against us. */}
        <section className={s.uses}>
          <div className="shell grid12">
            <div className={s.usesIntro}>
              <span className="eyebrow">كيف تستخدم هذا السجل</span>
              <h2 className={s.h2}>ثلاث طرق يستخدمها به المشترون فعلًا</h2>
              <p className={s.usesLede}>
                هذا السجل ليس دعاية عن خبرتنا؛ هو أداة تفاوض في يدك، حتى لو كنت
                تفاوض علينا.
              </p>
            </div>
            <ol className={s.useList}>
              {SOLD_USES.map((u, i) => (
                <li key={u.titleAr}>
                  <span className={`mono ${s.useNum}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className={s.useTitle}>{u.titleAr}</h3>
                    <p>{u.bodyAr}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <MobileActionBar enquiry="شفت سجل البيع، عايز أعرف المتاح دلوقتي" />
      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "سجل مبيعات الرواد للتطوير العقاري — حدائق أكتوبر",
            description:
              "سجل عام للوحدات المتعاقد عليها في حدائق أكتوبر و٦ أكتوبر والشيخ زايد، بأسعار البيع الفعلية وتواريخ التعاقد والحالة القانونية وقت البيع.",
            creator: { "@id": "https://alrowadrealestate.com/#organization" },
            spatialCoverage: { "@type": "Place", name: "حدائق أكتوبر، الجيزة، مصر" },
            variableMeasured: [
              "سعر البيع",
              "سعر المتر",
              "المساحة",
              "الحالة القانونية وقت البيع",
              "مدة العرض",
            ],
            distribution: {
              "@type": "DataDownload",
              contentUrl: `https://alrowadrealestate.com/${locale}/sold`,
              encodingFormat: "text/html",
            },
            size: `${SOLD.length} سجلًا منشورًا`,
          }),
        }}
      />
    </>
  );
}
