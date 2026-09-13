import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import SoldTable from "@/components/SoldTable";
import { SOLD_TOTAL_SINCE_2011, SOLD_SUMMARY_2026, SOLD_USES } from "@/lib/sold";
import { getSoldRecords } from "@/lib/cms";
import { formatNumber } from "@/lib/format";
import s from "./page.module.css";

/**
 * The unit pages are statically generated. A Payload hook revalidates them
 * the moment the client saves, which is the fast path; this is the slow one,
 * covering anything written straight to the database or a hook that failed.
 * Five minutes is short enough that nothing looks broken and long enough
 * that the database is not queried on every request.
 */
export const revalidate = 300;

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
  const sold = await getSoldRecords();

  const summary = [
    { label: `وحدات مبيعة (${S.yearAr})`, value: String(S.units) },
    { label: "وسيط سعر البيع", value: `${formatNumber(S.medianPrice)} ج.م` },
    { label: "وسيط سعر المتر", value: `${formatNumber(S.medianPerMetre)} ج.م` },
    { label: "وسيط مدة البيع", value: `${S.medianDays} يومًا` },
    { label: "نسبة التفاوض عن السعر المعلن", value: S.negotiationAr },
  ];

  return (
    <>
      <Header locale={locale} variant="light" />

      <main id="main">
        <PageHeader
          eyebrow="سجل عام · يُحدَّث بعد كل تعاقد"
          title="كل وحدة بعناها، بتاريخها وسعرها"
          lede={
            <>
              من ٢٠١١ إلى اليوم سجّلنا{" "}
              <bdi className="mono">{SOLD_TOTAL_SINCE_2011}</bdi> وحدة. هذه
              الصفحة هي ذلك الرقم مفتوحًا: كود الوحدة، منطقتها، مساحتها، سعر
              بيعها الفعلي، وتاريخ إتمام التعاقد. تقدر تقارن بها أي سعر معروض
              عليك اليوم.
            </>
          }
          meta={summary}
          image="/img/area-landscape.webp"
          imageAlt="منظر عام لحدائق أكتوبر"
        />

        <section className={s.tableSection}>
          <div className="shell-wide">
            <SoldTable records={sold} />
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
          <div className="shell grid12" data-anim="rise">
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
            size: `${sold.length} سجلًا منشورًا`,
          }),
        }}
      />
    </>
  );
}
