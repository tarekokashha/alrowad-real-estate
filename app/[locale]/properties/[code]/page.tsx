import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import Gallery from "@/components/Gallery";
import InstalmentCalculator from "@/components/InstalmentCalculator";
import CopyCode from "@/components/CopyCode";
import { getUnits, getUnit } from "@/lib/cms";
import {
  detailFor,
  comparablesFor,
  DRIVE_TIMES,
  DRIVE_CONDITIONS_AR,
} from "@/lib/unit-detail";
import {
  Measure,
  formatNumber,
  whatsappHref,
  unitEnquiry,
  PHONE_LOCAL,
  PHONE_E164,
} from "@/lib/format";
import s from "./page.module.css";

export const revalidate = 300;

export async function generateStaticParams() {
  return (await getUnits()).map((u) => ({ code: u.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const u = await getUnit(code);
  if (!u) return {};

  const title = `${u.titleAr} ${formatNumber(u.size)} م² — ${u.areaAr} | ${u.code}`;
  const description = `${u.titleAr} بمساحة ${formatNumber(u.size)} م² في ${u.areaAr}، حدائق أكتوبر. ${u.finishing} · ${u.handoverAr}. الحالة القانونية: ${u.legalStatus}. السعر ${formatNumber(u.price)} ج.م، آخر تحديث ${u.priceCheckedAr}.`;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}/properties/${code}` },
    openGraph: {
      title,
      description,
      images: [{ url: u.image, width: 1672, height: 941, alt: u.imageAlt }],
    },
  };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const u = await getUnit(code);
  if (!u) notFound();

  const d = detailFor(u);
  const comps = comparablesFor(u, await getUnits());
  const perMetre = Math.round(u.price / u.size);
  const enquiry = unitEnquiry(u.code, `${u.titleAr} — ${u.areaAr}`, u.size);
  const heading = `${u.titleAr}${u.gardenSize && !u.titleAr.includes("حديقة") ? " بحديقة" : ""} — ${u.areaAr}`;
  const maxRoom = Math.max(...d.roomAreas.map((r) => r.area));

  /* The 22 Egyptian spec fields, in the order a buyer reads them.
     `الحالة القانونية` and `تاريخ آخر تحديث للسعر` are the two no
     competitor publishes, and they are the reason this page exists. */
  const spec: [string, React.ReactNode][] = [
    ["كود الوحدة", <span key="c" className="mono">{u.code}</span>],
    ["النوع", u.type],
    ["المساحة", <Measure key="a" value={u.size} unit="م²" />],
    ["عدد الغرف", String(d.rooms)],
    ["عدد الحمامات", String(d.baths)],
    ["الدور", d.floorOfAr],
    ["التشطيب", u.finishing],
    ["الاستلام", u.handoverAr],
    ["أولى أم إعادة بيع", u.saleTypeAr],
    ["كمبوند أم خارج كمبوند", d.compoundAr],
    ["الفيو", d.viewAr],
    ["الحديقة", d.gardenAr],
    ["الرووف", d.roofAr],
    ["أسانسير", d.elevatorAr],
    ["جراج", d.garageAr],
    ["العدادات", d.metersAr],
    ["السعر", <Measure key="p" value={u.price} unit="ج.م" />],
    ["سعر المتر", <Measure key="pm" value={perMetre} unit="ج.م/م²" />],
    ["نظام السداد", d.paymentAr],
    ["المقدم", <Measure key="d" value={Math.round((u.price * d.downPct) / 100)} unit={`ج.م (${d.downPct}%)`} />],
    ["الحالة القانونية", u.legalStatus],
    ["تاريخ آخر تحديث للسعر", u.priceCheckedAr],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: `${u.titleAr} — ${u.areaAr}`,
    description: `${u.titleAr} بمساحة ${formatNumber(u.size)} م² في ${u.areaAr}، حدائق أكتوبر.`,
    identifier: u.code,
    numberOfRooms: d.rooms,
    numberOfBathroomsTotal: d.baths,
    floorSize: { "@type": "QuantitativeValue", value: u.size, unitCode: "MTK" },
    image: `https://alrowadrealestate.com${u.image}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: u.areaAr,
      addressRegion: "الجيزة",
      addressCountry: "EG",
    },
    offers: {
      "@type": "Offer",
      price: u.price,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      seller: { "@id": "https://alrowadrealestate.com/#organization" },
    },
  };

  return (
    <>
      <Header locale={locale} variant="interior" active="units" />

      <main id="main">
        <nav className={s.crumb} aria-label="مسار التنقل">
          <Link href={`/${locale}`}>الرئيسية</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${locale}/properties`}>الوحدات</Link>
          <span aria-hidden="true">/</span>
          <span>{u.areaAr}</span>
          <span aria-hidden="true">/</span>
          <bdi className="mono">{u.code}</bdi>
        </nav>

        <section className={s.titleBlock}>
          <div className={s.titleText}>
            <div className={s.legalPill} data-anim="rise">
              {u.legalStatus}
            </div>
            <h1 className={s.h1} data-anim="rise" data-delay="1">
              {heading}
            </h1>
            <p className={s.summary} data-anim="rise" data-delay="2">
              {[u.floorAr, u.finishing, u.handoverAr, `${u.saleTypeAr} من المالك`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className={s.titlePrice} data-anim="rise" data-delay="2">
            <div className={s.price}>
              <bdi>{formatNumber(u.price)}</bdi> <span>ج.م</span>
            </div>
            <div className={`mono ${s.perMetre}`}>
              <bdi dir="ltr">{formatNumber(perMetre)}</bdi> ج.م/م² · آخر تحديث للسعر{" "}
              {u.priceCheckedAr}
            </div>
            <CopyCode code={u.code} />
          </div>
        </section>

        <div className="shell">
          <Gallery images={d.gallery.map((g) => ({ src: g.src, alt: g.alt }))} heading={heading} photoDateAr={d.photoDateAr} />
        </div>

        <section className={s.specSection}>
          <div className="shell grid12">
            <div className={s.specCol}>
              <h2 className={s.h2}>بيانات الوحدة</h2>

              <div className={s.legalBlock} data-anim="rise">
                <span className={s.legalLabel}>الحالة القانونية</span>
                <p className={s.legalValue}>{u.legalStatus}</p>
                <p className={s.legalNote}>{d.legalNote}</p>
              </div>

              <div className={s.spec}>
                {spec.map(([k, v]) => (
                  <div key={k} className={s.specRow}>
                    <span className={s.specKey}>{k}</span>
                    <bdi className={s.specVal}>{v}</bdi>
                  </div>
                ))}
              </div>

              <h2 className={`${s.h2} ${s.h2Spaced}`}>الرسم والمساحات</h2>
              <p className={s.lede}>
                المساحات مأخوذة من رسم المالك ومطابَقة بالشريط على الأرض يوم
                المعاينة. الفرق بين المساحة المباعة والمساحة الصافية مكتوب أسفل
                الجدول.
              </p>
              <div className={s.rooms}>
                {d.roomAreas.map((r) => (
                  <div key={r.nameAr} className={s.roomRow}>
                    <span className={s.roomName}>{r.nameAr}</span>
                    <div className={s.roomTrack}>
                      <div
                        data-anim="wipe"
                        className={s.roomBar}
                        style={{ width: `${(r.area / maxRoom) * 100}%` }}
                      />
                    </div>
                    <span className={`mono ${s.roomArea}`}>
                      <bdi>{r.area}</bdi> م²
                    </span>
                  </div>
                ))}
                <div className={s.roomsTotal}>
                  <span>الصافي داخل الوحدة</span>
                  <span className="mono">
                    <bdi>{d.netArea}</bdi> م²
                  </span>
                </div>
              </div>
              <p className={s.footnote}>
                المساحة المباعة <Measure value={u.size} unit="م²" /> وتشمل نصيب
                الوحدة من الحوائط والمناور والسلم. الفرق{" "}
                <Measure value={Number((u.size - d.netArea).toFixed(1))} unit="م²" />.
              </p>
            </div>

            <aside className={s.side}>
              <InstalmentCalculator price={u.price} maxYears={u.maxYears} />

              <div className={s.agent}>
                <h3 className={s.agentTitle}>مسؤول الوحدة</h3>
                <p className={s.agentNote}>
                  زار الوحدة فريقنا في {u.visitedAr}، واللي شافها بنفسه هو اللي
                  هيرد عليك وهيروح معاك المعاينة.
                </p>
                <a className={s.waBtn} href={whatsappHref(enquiry)} target="_blank" rel="noopener">
                  واتساب مباشر — <bdi dir="ltr">{PHONE_LOCAL}</bdi>
                </a>
                <a className={s.callLink} href={`tel:${PHONE_E164}`}>
                  اتصال
                </a>
                <p className={s.agentMeta}>الرد ٢٤/٧ — بالعربية والإنجليزية</p>
              </div>

              <div className={s.drive}>
                <h3 className={s.driveTitle}>أزمنة الوصول</h3>
                <div className={s.driveList}>
                  {DRIVE_TIMES.map((t) => (
                    <div key={t.toAr} className={s.driveRow}>
                      <span>{t.toAr}</span>
                      <span className="mono">
                        <bdi>{t.minutes}</bdi> د
                      </span>
                    </div>
                  ))}
                </div>
                <p className={s.driveNote}>{DRIVE_CONDITIONS_AR}</p>
              </div>
            </aside>
          </div>
        </section>

        <section className={s.comps}>
          <div className="shell">
            <div className={s.compsHead}>
              <h2 className={s.h2}>وحدات في نفس السعر والنطاق</h2>
              <Link href={`/${locale}/properties`} className={s.allLink}>
                كل الوحدات ←
              </Link>
            </div>
            <div className={s.compsGrid}>
              {comps.map((c, i) => (
                <PropertyCard
                  key={c.code}
                  unit={c}
                  href={`/${locale}/properties/${c.code}`}
                  delaySec={i * 4}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
