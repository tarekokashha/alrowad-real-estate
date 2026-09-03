import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANY } from "@/lib/content";
import { PHONE_E164 } from "@/lib/format";
import EntranceGate from "@/components/EntranceGate";

export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";

  const title = ar
    ? `${COMPANY.shortAr} للتطوير العقاري — ${COMPANY.taglineAr}`
    : `Al Rowad Real Estate — ${COMPANY.taglineEn}`;

  const description = ar
    ? "وساطة عقارية مسجَّلة مقرّها حدائق أكتوبر. ننشر الحالة القانونية لكل وحدة، ومؤشر سعر المتر بتاريخه، وسجل بيع مفتوح للقراءة."
    : "A registered brokerage based in Hadayek October, Giza. We publish every unit's legal status, a dated price-per-metre index, and an open archive of completed sales.";

  return {
    metadataBase: new URL("https://alrowadrealestate.com"),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { "ar-EG": "/ar", en: "/en", "x-default": "/ar" },
    },
    openGraph: {
      type: "website",
      locale: ar ? "ar_EG" : "en_US",
      siteName: ar ? COMPANY.nameAr : COMPANY.nameEn,
      title,
      description,
      url: `/${locale}`,
      images: [{ url: "/img/aerial-sunset.webp", width: 1672, height: 941, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

/**
 * The machine-readable layer. This is what Google's rich results AND the
 * LLM answer engines read first — the previous site had none of it at all.
 *
 * The disambiguating fields are not decoration: «شركة الرواد» already
 * resolves to a Saudi firm and a Jeddah agency that outrank a new Egyptian
 * site, and this client's buyers are largely Saudi. Without an explicit
 * @id, areaServed and disambiguatingDescription, a Riyadh user asking an
 * assistant about الرواد gets the wrong company.
 */
function organizationJsonLd(locale: string) {
  const ar = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://alrowadrealestate.com/#organization",
    name: ar ? COMPANY.nameAr : COMPANY.nameEn,
    alternateName: ar ? COMPANY.nameEn : COMPANY.nameAr,
    disambiguatingDescription: ar
      ? "شركة وساطة وتطوير عقاري مقرّها حدائق أكتوبر، الجيزة، مصر — وليست شركة الرواد السعودية أو أي كيان آخر يحمل الاسم نفسه."
      : "A real-estate brokerage based in Hadayek October, Giza, Egypt — not the Saudi company of the same name.",
    url: `https://alrowadrealestate.com/${locale}`,
    telephone: PHONE_E164,
    address: {
      "@type": "PostalAddress",
      addressLocality: ar ? "حدائق أكتوبر" : "Hadayek October",
      addressRegion: ar ? "الجيزة" : "Giza",
      addressCountry: "EG",
    },
    areaServed: [
      { "@type": "Place", name: ar ? "حدائق أكتوبر" : "Hadayek October" },
      { "@type": "Place", name: ar ? "٦ أكتوبر" : "6th of October City" },
      { "@type": "Place", name: ar ? "الشيخ زايد" : "Sheikh Zayed City" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    identifier: [
      { "@type": "PropertyValue", name: "Commercial Registry", value: COMPANY.commercialRegistry },
      { "@type": "PropertyValue", name: "Tax Card", value: COMPANY.taxCard },
      {
        "@type": "PropertyValue",
        name: "Real Estate Brokerage Registration (Ministerial Decision 578/2025)",
        value: COMPANY.brokerageRegistration,
      },
    ],
    knowsLanguage: ["ar", "en"],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();

  const ar = locale === "ar";

  return (
    // EntranceGate stamps data-entrance on <html> before React hydrates,
    // which is the whole point of it. Tell React that attribute is expected
    // to differ rather than letting it log a mismatch on every load.
    <html lang={locale} dir={ar ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap"
        />
        <EntranceGate />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd(locale)),
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {ar ? "تخطَّ إلى المحتوى" : "Skip to content"}
        </a>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
