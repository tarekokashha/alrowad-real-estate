import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import { COMPANY } from "@/lib/content";
import { SOLD_TOTAL_SINCE_2011 } from "@/lib/sold";
import { whatsappHref, PhoneNumber } from "@/lib/format";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: "من نحن والشرعية القانونية — الرواد للتطوير العقاري، حدائق أكتوبر",
  description:
    "مكتب واحد في حدائق أكتوبر منذ ٢٠١١. أرقامنا الرسمية منشورة: السجل التجاري، البطاقة الضريبية، ورقم تسجيل الوساطة العقارية بموجب القرار الوزاري ٥٧٨ لسنة ٢٠٢٥.",
  alternates: { canonical: "/ar/about" },
};

/** Four working desks, not four biographies. No personal names or faces —
 *  the client asked for that, and the site is stronger for it: what a buyer
 *  needs is to know who reads the papers, not who smiles in a headshot. */
const TEAM = [
  {
    roleAr: "ملف حدائق أكتوبر",
    titleAr: "وحدات حدائق أكتوبر والـ٨٠٠ فدان",
    noteAr: "في المنطقة منذ ٢٠١١، ويقرأ أوراق كل وحدة قبل عرضها.",
  },
  {
    roleAr: "ملف الخليج",
    titleAr: "الشراء عن بُعد والتوكيلات",
    noteAr: "يتابع التسجيل للمشترين المقيمين خارج مصر، ويدير المعاينات المرئية.",
  },
  {
    roleAr: "ملف الكمبوندات",
    titleAr: "إعادة البيع داخل الكمبوندات",
    noteAr:
      "يتابع أو ويست وأشجار سيتي وبيتا، ويقارن عروض إعادة البيع بأسعار المطوّر الحالية.",
  },
  {
    roleAr: "مراجعة المستندات",
    titleAr: "سلسلة الملكية وحالة العقود",
    noteAr: "تُراجع كل وحدة قبل نشرها، وتُكتب مذكرة الحالة القانونية.",
  },
] as const;

const OPERATIONS = [
  { labelAr: "وحدات زرناها ووثّقناها", valueAr: "177" },
  { labelAr: "وحدات رفضنا عرضها", valueAr: "42" },
  { labelAr: "معروض حاليًا", valueAr: "135" },
  { labelAr: "تعاقدات هذا العام", valueAr: "31" },
  { labelAr: "متوسط زمن الرد على واتساب", valueAr: "14 دقيقة" },
] as const;

const CREDENTIALS = [
  { labelAr: "الاسم القانوني الكامل", valueAr: COMPANY.nameAr, mono: false },
  { labelAr: "الشكل القانوني", valueAr: "شركة ذات مسؤولية محدودة", mono: false },
  { labelAr: "رقم السجل التجاري", valueAr: COMPANY.commercialRegistry, mono: true },
  { labelAr: "جهة القيد", valueAr: "سجل تجاري ٦ أكتوبر — الجيزة", mono: false },
  { labelAr: "البطاقة الضريبية", valueAr: COMPANY.taxCard, mono: true },
  { labelAr: "رقم تسجيل الوساطة العقارية", valueAr: COMPANY.brokerageRegistration, mono: true },
  { labelAr: "سند التسجيل", valueAr: "القرار الوزاري ٥٧٨ لسنة ٢٠٢٥", mono: false },
  { labelAr: "تاريخ التسجيل", valueAr: "١٤ فبراير ٢٠٢٦", mono: false },
  { labelAr: "عنوان المكتب المسجَّل", valueAr: COMPANY.addressAr, mono: false },
  { labelAr: "المسؤول عن الإفصاح", valueAr: "مدير الشركة", mono: false },
] as const;

export default async function AboutPage({
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
              <span className="eyebrow">الشركة · تأسست ٢٠١١</span>
              <h1 className={s.h1}>
                مكتب واحد في حدائق أكتوبر،
                <br />
                ولا نعمل في غيرها
              </h1>
              <p className={s.lede}>
                اسم الشركة معناه الذين يسبقون ويمسحون الأرض. بدأنا سنة ٢٠١١ حين
                كانت المنطقة أرضًا مقسَّمة بعلامات مساحية وعدد قليل من العمارات،
                وبقينا فيها. لا فروع لنا في التجمع ولا في الساحل، لأن معرفة متر
                واحد جيدًا تحتاج سنوات لا مكتبًا إضافيًا.
              </p>
            </div>
            <ul className={s.claims}>
              <li>خمسة عشر عامًا في هذا النطاق</li>
              <li>
                <bdi className="mono">{SOLD_TOTAL_SINCE_2011}</bdi> وحدة مبيعة
                ومسجَّلة في سجلنا العام
              </li>
              <li>أكثر من ١٠٠٠ عميل</li>
              <li>٣٠ مشروعًا تعاملنا في وحداته</li>
              <li className={s.claimNote}>
                كل رقم منها قابل للمراجعة في{" "}
                <Link href={`/${locale}/sold`}>سجل البيع</Link> وحدة وحدة،
                بتاريخها.
              </li>
            </ul>
          </div>
        </section>

        {/* ---- Office photography ---- */}
        <section className={s.office}>
          <div className="shell">
            <div className={s.officeGrid}>
              <figure className={s.officeLead}>
                <Image
                  src="/img/office-interior.webp"
                  alt="داخل مكتب الرواد بحدائق أكتوبر: مكاتب خشبية وحائط من الحجر الجيري وضوء نهاري"
                  fill
                  sizes="(max-width: 900px) 100vw, 58vw"
                  priority
                  quality={80}
                />
              </figure>
              <figure className={s.officeSide}>
                <Image
                  src="/img/office-meeting.webp"
                  alt="غرفة اجتماعات بالمكتب وعليها رسم هندسي لوحدة"
                  fill
                  sizes="(max-width: 900px) 100vw, 38vw"
                  quality={80}
                />
              </figure>
            </div>
            <p className={`mono ${s.officeCaption}`}>
              <span>المكتب · {COMPANY.addressAr}</span>
              <span>صور بتاريخ أغسطس ٢٠٢٦</span>
              <span>{COMPANY.surveyRef}</span>
            </p>
          </div>
        </section>

        {/* ---- How we work ---- */}
        <section className={s.section}>
          <div className="shell grid12">
            <div className={s.prose}>
              <h2 className={s.h2}>كيف نعمل، وما لا نفعله</h2>
              <p>
                لا نعرض وحدة لم نرها. لكل وحدة في هذا الموقع زيارة بتاريخ، وصور
                التُقطت في تلك الزيارة، وقراءة لأوراقها. حين تكون الأوراق ناقصة
                نكتب أنها ناقصة ونترك القرار لك — وقد رفضنا عرض{" "}
                <bdi className="mono">42</bdi> وحدة هذا العام لأننا لم نستطع
                التحقق من سلسلة ملكيتها.
              </p>
              <p>
                لا نأخذ مقدَّمًا في حسابنا. الحجز يُدفع في حساب باسم المالك أو
                المطوّر، والعمولة تُستحق عند التعاقد وحده. ولا نعمل بنظام
                «الحصرية» الذي يُخفي عنك وحدات أفضل خارج ملفنا؛ إن كانت الوحدة
                الأنسب لك عند غيرنا نقول لك ذلك.
              </p>
              <p className={s.ruleP}>
                وحين ننشر رقمًا — سعر متر، مدة بيع، عائد إيجار — ننشر معه تاريخه
                وحجم عيّنته. الرقم بلا تاريخ لا يعني شيئًا، والرقم بلا عيّنة رأي
                لا قياس.
              </p>
            </div>

            <aside className={s.ops}>
              <h3 className={s.opsTitle}>أرقام التشغيل ٢٠٢٦</h3>
              <dl className={s.opsList}>
                {OPERATIONS.map((o) => (
                  <div key={o.labelAr}>
                    <dt>{o.labelAr}</dt>
                    <dd className="mono">
                      <bdi>{o.valueAr}</bdi>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className={s.opsNote}>حتى ٢ سبتمبر ٢٠٢٦.</p>
            </aside>
          </div>
        </section>

        {/* ---- Desks ---- */}
        <section className={s.sectionAlt}>
          <div className="shell">
            <h2 className={s.h2}>من ستتكلم معه فعلًا</h2>
            <p className={s.sectionLede}>
              أربعة ملفات عمل، لكل ملف مسؤول واحد ورقم مباشر. اللي بيرد عليك هو
              نفسه اللي بيزور الوحدة معاك وبيقرأ أوراقها.
            </p>
            <div className={s.team}>
              {TEAM.map((t) => (
                <article key={t.roleAr} className={s.desk}>
                  <span className={`mono ${s.deskRole}`}>{t.roleAr}</span>
                  <h3 className={s.deskTitle}>{t.titleAr}</h3>
                  <p className={s.deskNote}>{t.noteAr}</p>
                  <PhoneNumber className={`mono ${s.deskPhone}`} />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Credentials. The whole reason this page exists. ---- */}
        <section id="credentials" className={s.credentials}>
          <div className="shell grid12">
            <div className={s.credIntro}>
              <span className="eyebrow">الشرعية القانونية</span>
              <h2 className={s.h2Night}>
                أرقامنا الرسمية منشورة، وليست عند الطلب
              </h2>
              <p className={s.credLede}>
                القرار الوزاري ٥٧٨ لسنة ٢٠٢٥ أوجب على العاملين في الوساطة
                العقارية التسجيل في سجل رسمي والالتزام بقواعد إفصاح محددة. نحن
                مسجَّلون، ورقم تسجيلنا مكتوب في أسفل كل صفحة من هذا الموقع.
              </p>
              <p className={s.credLede}>
                إن أردت التحقق من أي رقم منها، اطلب منا صورة المستند وسنرسلها في
                نفس اليوم — ولا نطلب في المقابل بيانات منك.
              </p>
            </div>

            <table className={s.credTable}>
              <tbody>
                {CREDENTIALS.map((c) => (
                  <tr key={c.labelAr}>
                    <th scope="row">{c.labelAr}</th>
                    <td className={c.mono ? "mono" : undefined}>
                      <bdi dir={c.mono ? "ltr" : undefined}>{c.valueAr}</bdi>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className={s.credNote}>
              تُراجع هذه البيانات مع كل تجديد سنوي، وآخر مراجعة لها في أغسطس
              ٢٠٢٦.
            </p>
          </div>
        </section>

        {/* ---- Visit ---- */}
        <section className={s.visit}>
          <div className="shell grid12">
            <div className={s.visitText}>
              <h2 className={s.h2}>المكتب مفتوح، وتقدر تيجي بدون موعد</h2>
              <p className={s.sectionLede}>
                لو حبيت تقعد وتتكلم قبل أي حاجة، تعالى المكتب. مفيش عرض تقديمي
                ولا صالة استقبال — طاولة وأرشيف وحد يقرأ معاك الورق.
              </p>
              <a
                className={s.visitWa}
                href={whatsappHref(
                  "السلام عليكم، حابب أعدي على المكتب في حدائق أكتوبر",
                )}
                rel="noopener"
              >
                واتساب · 010 9809 8026
              </a>
            </div>
            <dl className={s.visitInfo}>
              <div>
                <dt>العنوان</dt>
                <dd>{COMPANY.addressAr}</dd>
              </div>
              <div>
                <dt>المواعيد</dt>
                <dd className="mono">
                  <bdi>{COMPANY.officeHoursAr}</bdi>
                </dd>
              </div>
              <div>
                <dt>واتساب</dt>
                <dd>٢٤/٧</dd>
              </div>
              <div>
                <dt>لغات العمل</dt>
                <dd>العربية والإنجليزية</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>

      <MobileActionBar enquiry="حابب أتواصل مع الرواد" />
      <Footer locale={locale} />
    </>
  );
}
