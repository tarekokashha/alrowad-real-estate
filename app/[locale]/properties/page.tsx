import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import Catalogue from "@/components/Catalogue";
import { COMPANY } from "@/lib/content";
import { CATALOGUE_REVIEWED_AR } from "@/lib/units";
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


export const metadata: Metadata = {
  title: "الوحدات المعروضة في حدائق أكتوبر — الرواد للتطوير العقاري",
  description:
    "وحدات معروضة في حدائق أكتوبر و٦ أكتوبر والشيخ زايد. الحالة القانونية وسعر المتر وتاريخ آخر مراجعة مكتوبة على كل وحدة. ابحث بالمقدَّم والقسط الذي تقدر عليه.",
  alternates: { canonical: "/ar/properties" },
};

/**
 * The catalogue. Server-rendered so every unit — code, price, area and legal
 * status — is in the initial HTML for crawlers and answer engines. The
 * filtering and the affordability search hydrate on top of it.
 */
export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const units = await getUnits();

  // ItemList makes the catalogue machine-readable as a set of offers rather
  // than an undifferentiated page of text.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "الوحدات المعروضة — حدائق أكتوبر",
    numberOfItems: units.length,
    itemListElement: units.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Residence",
        name: `${u.titleAr} — ${u.areaAr}`,
        identifier: u.code,
        url: `https://alrowadrealestate.com/${locale}/properties/${u.code.toLowerCase()}`,
        floorSize: { "@type": "QuantitativeValue", value: u.size, unitCode: "MTK" },
        offers: {
          "@type": "Offer",
          price: u.price,
          priceCurrency: "EGP",
          availability: "https://schema.org/InStock",
          seller: { "@id": "https://alrowadrealestate.com/#organization" },
        },
      },
    })),
  };

  return (
    <>
      <Header locale={locale} variant="light" />

      <main id="main">
        <section className={s.masthead}>
          <div className="shell grid12">
            <div className={s.mastheadText}>
              <span className="eyebrow">المعروض الآن</span>
              <h1 className={s.h1}>وحدات معروضة في حدائق أكتوبر</h1>
              <p className={s.lede}>
                كل وحدة هنا شفناها بأنفسنا وقرأنا أوراقها. الحالة القانونية
                مكتوبة على الكارت نفسه، مش جوه الصفحة.
              </p>
            </div>
            <dl className={`mono ${s.mastheadMeta}`}>
              <div>
                <dt>آخر مراجعة للقائمة</dt>
                <dd>{CATALOGUE_REVIEWED_AR}</dd>
              </div>
              <div>
                <dt>مرجع النطاق</dt>
                <dd>{COMPANY.surveyRef}</dd>
              </div>
            </dl>
          </div>
        </section>

        <Catalogue locale={locale} units={units} />
      </main>

      <MobileActionBar enquiry="مهتم بوحدة من المعروض في حدائق أكتوبر" />
      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
