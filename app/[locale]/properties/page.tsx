import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import Catalogue from "@/components/Catalogue";
import { TOTAL_LISTED } from "@/lib/content";
import { CATALOGUE_REVIEWED_AR } from "@/lib/units";
import { toEasternDigits } from "@/lib/format";
import { getUnits } from "@/lib/cms";

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
      <Header locale={locale} variant="interior" active="units" />

      <main id="main">
        <PageHeader
          eyebrow="المعروض الآن"
          title={
            <>
              وحدات معروضة في حدائق <span style={{ color: "var(--bronze)" }}>أكتوبر</span>
            </>
          }
          lede="كل وحدة هنا شفناها بأنفسنا وقرأنا أوراقها. الحالة القانونية مكتوبة على الكارت نفسه، مش جوه الصفحة."
          meta={[
            { label: "آخر مراجعة للقائمة", value: CATALOGUE_REVIEWED_AR },
            {
              label: "المعروض على الموقع",
              value: `${toEasternDigits(units.length)} من ${toEasternDigits(TOTAL_LISTED)} وحدة`,
            },
          ]}
          image="/img/area-aerial.webp"
          imageAlt="منظر جوي لحدائق أكتوبر"
          imageHeight="clamp(260px, 48vh, 540px)"
        />

        <Catalogue locale={locale} units={units} />
      </main>

      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
