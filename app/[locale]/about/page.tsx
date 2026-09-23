import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { COMPANY, LEGAL_STATUSES, TOTAL_LISTED } from "@/lib/content";
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
  { labelAr: "وحدات زرناها ووثّقناها", value: 177, bronze: false },
  { labelAr: "وحدات رفضنا عرضها", value: 42, bronze: true },
  { labelAr: "معروض حاليًا", value: 135, bronze: false },
  { labelAr: "تعاقدات هذا العام", value: 31, bronze: false },
] as const;

const CREDENTIALS = [
  { labelAr: "الاسم القانوني الكامل", valueAr: COMPANY.nameAr, mono: false },
  { labelAr: "الشكل القانوني", valueAr: "شركة ذات مسؤولية محدودة", mono: false },
  { labelAr: "رقم السجل التجاري", valueAr: COMPANY.commercialRegistry, mono: true },
  { labelAr: "جهة القيد", valueAr: "سجل تجاري ٦ أكتوبر — الجيزة", mono: false },
  { labelAr: "البطاقة الضريبية", valueAr: COMPANY.taxCard, mono: true },
  { labelAr: "رقم تسجيل الوساطة العقارية", valueAr: COMPANY.brokerageRegistration, mono: true },
  { labelAr: "سند التسجيل", valueAr: COMPANY.brokerageDecreeAr, mono: false },
  { labelAr: "تاريخ التسجيل", valueAr: "١٤ فبراير ٢٠٢٦", mono: false },
  { labelAr: "عنوان المكتب المسجَّل", valueAr: COMPANY.addressAr, mono: false },
  { labelAr: "المسؤول عن الإفصاح", valueAr: "مدير الشركة", mono: false },
] as const;

const LEGAL_COLOURS = ["#6B4423", "var(--bronze)", "var(--bronze-fill)", "#C7A57E"];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Header locale={locale} variant="interior" active="about" />

      <main id="main">
        <PageHeader
          eyebrow="الشركة · تأسست ٢٠١١"
          title={
            <>
              مكتب واحد في حدائق أكتوبر،{" "}
              <span style={{ color: "var(--bronze)" }}>ولا نعمل في غيرها</span>
            </>
          }
          lede={
            <div className={s.ledeStack}>
              <p>
                اسم الشركة معناه الذين يسبقون ويمسحون الأرض. بدأنا سنة ٢٠١١ حين
                كانت المنطقة أرضًا مقسَّمة بعلامات مساحية وعدد قليل من
                العمارات، وبقينا فيها. لا فروع لنا في التجمع ولا في الساحل،
                لأن معرفة متر واحد جيدًا تحتاج سنوات لا مكتبًا إضافيًا.
              </p>
              <p className={s.claimNote}>
                كل رقم هنا قابل للمراجعة في{" "}
                <Link href={`/${locale}/sold`}>سجل البيع</Link> وحدة وحدة، بتاريخها.
              </p>
            </div>
          }
          stats={
            <div className={s.claims}>
              <div data-anim="rise" data-delay="1" className={s.claim}>
                <span data-anim="counter" data-to={15} className={s.claimNum}>
                  0
                </span>
                <span className={s.claimLabel}>عامًا في هذا النطاق</span>
              </div>
              <div data-anim="rise" data-delay="2" className={s.claim}>
                <span
                  data-anim="counter"
                  data-to={SOLD_TOTAL_SINCE_2011}
                  className={`${s.claimNum} ${s.bronze}`}
                >
                  0
                </span>
                <span className={s.claimLabel}>وحدة مبيعة ومسجَّلة في سجلنا العام</span>
              </div>
              <div data-anim="rise" data-delay="3" className={s.claim}>
                <span className={s.claimNum}>+1000</span>
                <span className={s.claimLabel}>عميل</span>
              </div>
              <div data-anim="rise" data-delay="4" className={s.claim}>
                <span data-anim="counter" data-to={30} className={s.claimNum}>
                  0
                </span>
                <span className={s.claimLabel}>مشروعًا تعاملنا في وحداته</span>
              </div>
            </div>
          }
          image="/img/office-interior.webp"
          imageAlt="داخل مكتب الرواد بحدائق أكتوبر: مكاتب خشبية وحائط من الحجر الجيري وضوء نهاري"
          imageHeight="clamp(300px, 64vh, 700px)"
          imageCaption={
            <>
              <span>المكتب · {COMPANY.addressAr}</span>
              <span>صور بتاريخ أغسطس ٢٠٢٦</span>
            </>
          }
        />

        {/* ---- How we work ---- */}
        <section className={s.section}>
          <div className={s.workGrid}>
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
              {OPERATIONS.map((o) => (
                <div key={o.labelAr} className={s.opsRow}>
                  <span>{o.labelAr}</span>
                  <span
                    data-anim="counter"
                    data-to={o.value}
                    className={o.bronze ? s.opsBronze : undefined}
                  >
                    0
                  </span>
                </div>
              ))}
              <div className={s.opsRow}>
                <span>متوسط زمن الرد على واتساب</span>
                <span>
                  <bdi>14</bdi> دقيقة
                </span>
              </div>
              <p className={s.opsNote}>حتى ٢ سبتمبر ٢٠٢٦.</p>
            </aside>
          </div>
        </section>

        {/* ---- Desks ---- */}
        <section className={s.sectionAlt}>
          <h2 className={s.h2}>من ستتكلم معه فعلًا</h2>
          <p className={s.sectionLede}>
            أربعة ملفات عمل، لكل ملف مسؤول واحد ورقم مباشر. اللي بيرد عليك هو
            نفسه اللي بيزور الوحدة معاك وبيقرأ أوراقها.
          </p>
          <div className={s.team}>
            {TEAM.map((t, i) => (
              <article key={t.roleAr} data-anim="rise" data-delay={i + 1} className={s.desk}>
                <span className={s.deskRole}>{t.roleAr}</span>
                <h3 className={s.deskTitle}>{t.titleAr}</h3>
                <p className={s.deskNote}>{t.noteAr}</p>
                <PhoneNumber className={`mono ${s.deskPhone}`} />
              </article>
            ))}
          </div>
        </section>

        {/* ---- Credentials. The whole reason this page exists. ---- */}
        <section id="credentials" className={s.credentials}>
          <div className={s.credGrid}>
            <div className={s.credIntro}>
              <span className={s.credEyebrow}>الشرعية القانونية</span>
              <h2 className={s.h2Night}>أرقامنا الرسمية منشورة، وليست عند الطلب</h2>
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

            <div className={s.credList}>
              {CREDENTIALS.map((c) => (
                <div key={c.labelAr} className={s.credRow}>
                  <span className={s.credLabel}>{c.labelAr}</span>
                  <span className={c.mono ? `mono ${s.credGold}` : s.credVal}>
                    <bdi dir={c.mono ? "ltr" : undefined}>{c.valueAr}</bdi>
                  </span>
                </div>
              ))}
              <p className={s.credNote}>
                تُراجع هذه البيانات مع كل تجديد سنوي، وآخر مراجعة لها في أغسطس
                ٢٠٢٦.
              </p>
            </div>
          </div>
        </section>

        {/* ---- The legal-status disclosure ---- */}
        <section className={s.section}>
          <div className={s.discGrid}>
            <div className={s.prose}>
              <span className="eyebrow">الإفصاح</span>
              <h2 className={s.h2}>حالة الوحدة القانونية مكتوبة قبل أن تسأل عنها</h2>
              <p>
                في كل صفحة وحدة سطر اسمه «الحالة القانونية»، وفيه القيمة كما
                هي: مسجل بالشهر العقاري، أو حكم صحة ونفاذ، أو عقد ابتدائي موثق،
                أو عقد ابتدائي عرفي. لا نضع علامة صحيحة خضراء مكان الورقة —
                العلامة ادّعاء، والسطر إفصاح.
              </p>
              <p>
                ننشر العرفي كما ننشر المسجل. الفارق في السعر وفي المخاطرة، ومن
                حقك تعرفهما قبل الحجز.
              </p>
            </div>

            <div className={s.legalCards}>
              {LEGAL_STATUSES.map((l, i) => (
                <div key={l.status} data-anim="rise" data-delay={i + 1} className={s.legalCard}>
                  <span className={s.legalStatus}>{l.status}</span>
                  <span className="mono">
                    <bdi>{l.count}</bdi> وحدة معروضة
                  </span>
                  <div className={s.legalTrack}>
                    <div
                      className={s.legalFill}
                      style={{
                        width: `${(l.count / TOTAL_LISTED) * 100}%`,
                        background: LEGAL_COLOURS[i],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---- Visit ---- */}
        <section className={s.visitSection}>
          <div className={s.visit}>
            <div className={s.visitText}>
              <h2 className={s.h2}>المكتب مفتوح، وتقدر تيجي بدون موعد</h2>
              <p className={s.sectionLede}>
                لو حبيت تقعد وتتكلم قبل أي حاجة، تعالى المكتب. مفيش عرض تقديمي
                ولا صالة استقبال — طاولة وأرشيف وحد يقرأ معاك الورق.
              </p>
              <a
                className={s.visitWa}
                href={whatsappHref("السلام عليكم، حابب أعدي على المكتب في حدائق أكتوبر")}
                target="_blank"
                rel="noopener"
              >
                واتساب · <bdi className="mono">010 9809 8026</bdi>
              </a>
            </div>
            <div className={s.visitInfo}>
              <div>
                <span>العنوان</span>
                <span>{COMPANY.addressAr}</span>
              </div>
              <div>
                <span>المواعيد</span>
                <bdi>{COMPANY.officeHoursAr}</bdi>
              </div>
              <div>
                <span>واتساب</span>
                <span>٢٤/٧</span>
              </div>
              <div>
                <span>لغات العمل</span>
                <span>العربية والإنجليزية</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </>
  );
}
