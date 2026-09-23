"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COMPANY, NAV } from "@/lib/content";
import { PHONE_E164, PhoneNumber, whatsappHref } from "@/lib/format";
import s from "./Header.module.css";

type NavKey = (typeof NAV)[number]["key"];

/** The landing page's own header swaps «الرئيسية» for an in-page anchor and
 *  drops the WhatsApp pill for a quieter «كلّمنا» outline button — see
 *  Alrowad Landing.dc.html. Interior pages use NAV as-is (Site Nav.dc.html). */
const LANDING_NAV: { key: NavKey | "calc"; labelAr: string; href: string }[] = [
  { key: "units", labelAr: "الوحدات", href: "/ar/properties" },
  { key: "calc", labelAr: "اعرف قسطك", href: "#calc" },
  { key: "sold", labelAr: "سجل البيع", href: "/ar/sold" },
  { key: "gulf", labelAr: "الشراء من الخليج", href: "/ar/gulf" },
  { key: "about", labelAr: "من نحن", href: "/ar/about" },
];

export default function Header({
  locale,
  variant = "interior",
  active,
}: {
  locale: string;
  /** "landing" = the homepage's transparent-to-blur header with «كلّمنا».
   *  "interior" = the sticky Site Nav used on every other page. */
  variant?: "landing" | "interior";
  active?: NavKey;
}) {
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = navOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [navOpen]);

  const hrefFor = (h: string) => {
    if (h.startsWith("#")) return h;
    return h === "/ar" ? `/${locale}` : h.replace("/ar/", `/${locale}/`);
  };

  const items = variant === "landing" ? LANDING_NAV : NAV;
  const waMessage = "السلام عليكم، حابب أستفسر عن الوحدات المتاحة في حدائق أكتوبر";

  return (
    <>
      <header data-hdr data-variant={variant} className={s.header}>
        <Link href={`/${locale}`} className={s.brand}>
          <span className={s.wordmark}>{COMPANY.shortAr}</span>
          <span className={s.sub}>للتطوير العقاري</span>
        </Link>

        <nav className={s.nav} aria-label="التنقل الرئيسي">
          {items.map((item) =>
            item.href.startsWith("#") ? (
              <a key={item.key} href={item.href} className={s.link}>
                {item.labelAr}
              </a>
            ) : (
              <Link key={item.key} href={hrefFor(item.href)} className={s.link}>
                {item.labelAr}
                {active === item.key && <span className={s.dot} aria-hidden="true" />}
              </Link>
            ),
          )}
        </nav>

        {variant === "landing" ? (
          <a href="#contact" data-anim="magnet" className={`${s.cta} ${s.call}`}>
            كلّمنا<span className={s.callDot} aria-hidden="true" />
          </a>
        ) : (
          <a
            href={whatsappHref(waMessage)}
            className={`${s.cta} ${s.whatsapp}`}
            target="_blank"
            rel="noopener"
          >
            واتساب<span className={s.waDot} aria-hidden="true" />
          </a>
        )}

        <button
          onClick={() => setNavOpen(true)}
          aria-label="افتح القائمة"
          className={s.burger}
        >
          <span />
          <span />
        </button>
      </header>

      {navOpen && (
        <div dir="rtl" className={s.sheet}>
          <div className={s.sheetHead}>
            <span className={s.sheetWordmark}>{COMPANY.shortAr}</span>
            <button
              onClick={() => setNavOpen(false)}
              aria-label="إغلاق القائمة"
              className={s.close}
            >
              ×
            </button>
          </div>

          <nav className={s.sheetNav}>
            {(variant === "landing" ? LANDING_NAV : NAV).map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className={s.sheetLink}
                >
                  {item.labelAr}
                  <span aria-hidden="true">←</span>
                </a>
              ) : (
                <Link
                  key={item.key}
                  href={hrefFor(item.href)}
                  onClick={() => setNavOpen(false)}
                  className={s.sheetLink}
                >
                  {item.labelAr}
                  <span aria-hidden="true">←</span>
                </Link>
              ),
            )}
          </nav>

          <div className={s.sheetFoot}>
            <a
              href={whatsappHref(waMessage)}
              target="_blank"
              rel="noopener"
              className={s.sheetWa}
            >
              واتساب
            </a>
            <a href={`tel:${PHONE_E164}`} className={s.sheetPhone}>
              <PhoneNumber link={false} className="mono" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}
