import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import PropertyCard from "@/components/PropertyCard";
import InstalmentCalculator from "@/components/InstalmentCalculator";
import CopyCode from "@/components/CopyCode";
import { UNITS, findUnit, yearsLabel } from "@/lib/units";
import {
  detailFor,
  comparablesFor,
  DRIVE_TIMES,
  DRIVE_CONDITIONS_AR,
} from "@/lib/unit-detail";
import { COMPANY } from "@/lib/content";
import {
  Price,
  PricePerMetre,
  Measure,
  formatNumber,
  whatsappHref,
  unitEnquiry,
  PHONE_LOCAL,
  PHONE_E164,
} from "@/lib/format";
import s from "./page.module.css";

export function generateStaticParams() {
  return UNITS.map((u) => ({ code: u.code.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const u = findUnit(code);
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
  const u = findUnit(code);
  if (!u) notFound();

  const d = detailFor(u);
  const comps = comparablesFor(u);
  const perMetre = Math.round(u.price / u.size);
  const enquiry = unitEnquiry(u.code, `${u.titleAr} — ${u.areaAr}`, u.size);

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
      <Header locale={locale} variant="light" />

      <main id="main">
        {/* ---- Breadcrumb ---- */}
        <nav className={s.crumb} aria-label="مسار التنقل">
          <div className="shell">
            <Link href={`/${locale}`}>الرئيسية</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${locale}/properties`}>الوحدات</Link>
            <span aria-hidden="true"> / </span>
            <span>{u.areaAr}</span>
            <span aria-hidden="true"> / </span>
            <span className="mono">{u.code}</span>
          </div>
        </nav>

        {/* ---- Title block ---- */}
        <section className={s.titleBlock}>
          <div className="shell grid12">
            <div className={s.titleText}>
              <h1 className={s.h1}>
                {u.titleAr}
                {u.gardenSize ? " بحديقة" : ""} — {u.areaAr}
              </h1>
              <p className={s.summary}>
                {d.floorOfAr !== "—" ? `${u.floorAr} · ` : ""}
                {u.finishing} · {u.handoverAr} · {u.saleTypeAr} من المالك
              </p>
            </div>
            <div className={s.titlePrice}>
              <p className={s.price}>
                <Price value={u.price} />
              </p>
              <p className={`mono ${s.perMetre}`}>
                <PricePerMetre price={u.price} area={u.size} /> · آخر تحديث للسعر{" "}
                {u.priceCheckedAr}
              </p>
              <CopyCode code={u.code} />
            </div>
          </div>
        </section>

        {/* ---- Gallery. Fixed ratios, and a caption stating when the
                photographs were taken and that they are ungraded. ---- */}
        <section className={s.gallery}>
          <div className="shell">
            <div className={s.galleryGrid}>
              {d.gallery.map((g, i) => (
                <figure
                  key={g.src + i}
                  className={`${s.shot} ${i === 0 ? s.shotLead : ""}`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes={i === 0 ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 50vw, 33vw"}
                    quality={80}
                    /* The lead shot spans two rows with two more stacked
                       beside it, so the first three are all above the fold
                       on desktop and none of them may be lazy. */
                    priority={i < 3}
                  />
                </figure>
              ))}
            </div>
            <p className={`mono ${s.galleryCaption}`}>
              {d.photoCountAr} · التُقطت {d.photoDateAr} · بدون معالجة لونية
            </p>
          </div>
        </section>

        {/* ---- Spec + sidebar ---- */}
        <section className={s.specSection}>
          <div className="shell grid12">
            <div className={s.specCol}>
              <h2 className={s.h2}>بيانات الوحدة</h2>

              {/* The legal disclosure, above the table rather than buried in
                  it. This block is the whole strategy in one component. */}
              <div className={s.legalBlock}>
                <span className={`mono ${s.legalLabel}`}>الحالة القانونية</span>
                <p className={s.legalValue}>{u.legalStatus}</p>
                <p className={s.legalNote}>{d.legalNote}</p>
              </div>

              <table className={s.spec}>
                <tbody>
                  {spec.map(([k, v]) => (
                    <tr key={k}>
                      <th scope="row">{k}</th>
                      <td>{typeof v === "string" ? <bdi>{v}</bdi> : v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ---- Rooms ---- */}
              <h2 className={`${s.h2} ${s.h2Spaced}`}>الرسم والمساحات</h2>
              <p className={s.lede}>
                المساحات مأخوذة من رسم المالك ومطابَقة بالشريط على الأرض يوم
                المعاينة. الفرق بين المساحة المباعة والمساحة الصافية مكتوب أسفل
                الجدول.
              </p>
              <table className={s.rooms}>
                <caption className="sr-only">مساحة كل غرفة على حدة</caption>
                <tbody>
                  {d.roomAreas.map((r) => (
                    <tr key={r.nameAr}>
                      <th scope="row">{r.nameAr}</th>
                      <td>
                        <Measure value={r.area} unit="م²" />
                      </td>
                    </tr>
                  ))}
                  <tr className={s.roomsTotal}>
                    <th scope="row">الصافي داخل الوحدة</th>
                    <td>
                      <Measure value={d.netArea} unit="م²" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className={s.footnote}>
                المساحة المباعة <Measure value={u.size} unit="م²" />{" "}
                وتشمل نصيب الوحدة من الحوائط والمناور والسلم. الفرق{" "}
                <Measure value={(u.size - d.netArea).toFixed(1)} unit="م²" />.
              </p>
            </div>

            {/* ---- Sticky sidebar ---- */}
            <aside className={s.side}>
              <InstalmentCalculator price={u.price} maxYears={u.maxYears} />

              <div className={s.agent}>
                <h3 className={s.agentTitle}>مسؤول الوحدة</h3>
                <p className={s.agentNote}>
                  زار الوحدة فريقنا في {u.visitedAr}، واللي شافها بنفسه هو اللي
                  هيرد عليك وهيروح معاك المعاينة.
                </p>
                <a
                  className={s.waBtn}
                  href={whatsappHref(enquiry)}
                  rel="noopener"
                >
                  واتساب مباشر — <bdi dir="ltr">{PHONE_LOCAL}</bdi>
                </a>
                <a className={s.callLink} href={`tel:${PHONE_E164}`}>
                  اتصال
                </a>
                <p className={`mono ${s.agentMeta}`}>
                  الرد ٢٤/٧ — بالعربية والإنجليزية
                </p>
              </div>

              <div className={s.drive}>
                <h3 className={s.driveTitle}>أزمنة الوصول</h3>
                <table className={s.driveTable}>
                  <tbody>
                    {DRIVE_TIMES.map((t) => (
                      <tr key={t.toAr}>
                        <th scope="row">{t.toAr}</th>
                        <td>
                          <Measure value={t.minutes} unit="د" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className={s.driveNote}>{DRIVE_CONDITIONS_AR}</p>
              </div>
            </aside>
          </div>
        </section>

        {/* ---- Comparables ---- */}
        <section className={s.comps}>
          <div className="shell">
            <div className={s.compsHead}>
              <h2 className={s.h2}>وحدات في نفس السعر والنطاق</h2>
              <Link href={`/${locale}/properties`} className={s.allLink}>
                كل الوحدات ←
              </Link>
            </div>
            <div className={s.compsGrid}>
              {comps.map((c) => (
                <PropertyCard key={c.code} unit={c} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* The unit code travels in the WhatsApp message so the conversation
          starts with context — without it the sales team cannot tell which
          unit produced the lead. */}
      <MobileActionBar enquiry={enquiry} waLabel={`واتساب — ${u.code}`} />

      <Footer locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
