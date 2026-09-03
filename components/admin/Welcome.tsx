import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import type { Unit } from "@/payload-types";

const STALE_DAYS = 30;

/**
 * The dashboard the client lands on.
 *
 * It does not greet him. It shows him the four things that decide whether the
 * site keeps its promises: prices that have gone stale, units published
 * without a real photograph, leads nobody has answered, and whether the price
 * index has been updated this month. A dashboard that says "welcome back"
 * teaches nothing; this one is a to-do list derived from the data.
 */
export async function Welcome() {
  const payload = await getPayload({ config });

  const [units, leads, index] = await Promise.all([
    payload.find({ collection: "units", limit: 500, depth: 0 }),
    payload.find({
      collection: "leads",
      limit: 200,
      depth: 0,
      where: { state: { equals: "new" } },
    }),
    payload.find({ collection: "price-index", limit: 1, sort: "-publishedAt", depth: 0 }),
  ]);

  const all: Unit[] = units.docs;
  const published = all.filter((u) => u.status === "published");

  const stale = published.filter((u) => {
    if (!u.priceCheckedAt) return true;
    const days =
      (Date.now() - new Date(u.priceCheckedAt).getTime()) / 86_400_000;
    return days > STALE_DAYS;
  });

  const drafts = all.filter((u) => u.status === "draft");

  const latestIndex = index.docs[0] as { publishedAt?: string } | undefined;
  const indexAgeDays = latestIndex?.publishedAt
    ? Math.floor(
        (Date.now() - new Date(latestIndex.publishedAt).getTime()) / 86_400_000,
      )
    : null;
  const indexOverdue = indexAgeDays === null || indexAgeDays > 35;

  const tasks = [
    {
      count: leads.totalDocs,
      labelAr: "طلب جديد مستني رد",
      href: "/admin/collections/leads?where[state][equals]=new",
      urgent: leads.totalDocs > 0,
      noteAr: "الموقع مكتوب عليه إن متوسط الرد ١٤ دقيقة.",
    },
    {
      count: stale.length,
      labelAr: `وحدة سعرها مامتراجعش من أكتر من ${STALE_DAYS} يوم`,
      href: "/admin/collections/units?where[status][equals]=published",
      urgent: stale.length > 0,
      noteAr:
        "الوحدة اللي سعرها قديم بتحوّل الموقع من صادق لمضلِّل من غير ما حد يقصد.",
    },
    {
      count: drafts.length,
      labelAr: "وحدة لسه مسودة",
      href: "/admin/collections/units?where[status][equals]=draft",
      urgent: false,
      noteAr: "الوحدة مش هتتنشر غير لما يكون فيها صورة حقيقية وحالة قانونية.",
    },
    {
      count: published.length,
      labelAr: "وحدة منشورة على الموقع",
      href: "/admin/collections/units?where[status][equals]=published",
      urgent: false,
      noteAr: "",
    },
  ];

  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ marginBottom: ".35rem", fontSize: "1.35rem" }}>
        لوحة تحكم الرواد
      </h2>
      <p style={{ marginTop: 0, marginBottom: "1.6rem", opacity: 0.72, maxWidth: "62ch" }}>
        الموقع بيوعد المشتري بتلات حاجات: الأوراق واضحة، الأرقام محدّثة، والبيع
        مسجّل. الجدول ده بيوريك لو في حاجة منهم محتاجة شغل النهاردة.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1px",
          background: "var(--theme-elevation-100)",
          border: "1px solid var(--theme-elevation-100)",
          marginBottom: "1.4rem",
        }}
      >
        {tasks.map((t) => (
          <Link
            key={t.labelAr}
            href={t.href}
            style={{
              background: "var(--theme-elevation-0)",
              padding: "1.1rem 1.15rem",
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <div
              style={{
                fontSize: "2rem",
                lineHeight: 1.1,
                fontVariantNumeric: "tabular-nums",
                color: t.urgent && t.count > 0 ? "#9a6b3f" : "inherit",
              }}
            >
              {t.count}
            </div>
            <div style={{ marginTop: ".4rem", fontSize: ".92rem" }}>{t.labelAr}</div>
            {t.noteAr ? (
              <div style={{ marginTop: ".45rem", fontSize: ".78rem", opacity: 0.62, lineHeight: 1.65 }}>
                {t.noteAr}
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      {indexOverdue ? (
        <div
          style={{
            borderInlineStart: "2px solid #9a6b3f",
            background: "var(--theme-elevation-50)",
            padding: "1rem 1.15rem",
            marginBottom: "1.4rem",
          }}
        >
          <strong style={{ display: "block", marginBottom: ".35rem" }}>
            مؤشر سعر المتر محتاج نسخة جديدة
          </strong>
          <span style={{ fontSize: ".88rem", opacity: 0.78, lineHeight: 1.7 }}>
            {indexAgeDays === null
              ? "مفيش أي نسخة منشورة لحد دلوقتي."
              : `آخر نسخة بقالها ${indexAgeDays} يوم.`}{" "}
            الموقع مكتوب فيه إن المؤشر بيتحدّث أول كل شهر — والصفحة اللي بتجيب
            أعلى ترتيب في جوجل هي دي.{" "}
            <Link href="/admin/collections/price-index/create">اعمل نسخة جديدة</Link>
          </span>
        </div>
      ) : null}

      <details style={{ fontSize: ".88rem", lineHeight: 1.85, opacity: 0.86 }}>
        <summary style={{ cursor: "pointer", marginBottom: ".6rem" }}>
          قواعد الكتابة بالعربي — اقراها مرة واحدة
        </summary>
        <ul style={{ margin: 0, paddingInlineStart: "1.2rem" }}>
          <li>اكتب الأسعار بأرقام إنجليزية عادية بدون فواصل: 1950000. الموقع هو اللي بينسّقها.</li>
          <li>استخدم الفاصلة العربية ، مش الإنجليزية , — وعلامة الاستفهام ؟ مش ?</li>
          <li>متزوّدش مسافات بين الحروف عشان تمدّد الكلمة، ومتستخدمش التطويل (ــــ). ده بيكسر البحث وقارئ الشاشة.</li>
          <li>لو بتنسخ من ورد أو جوجل دوكس، الصق كنص عادي (Ctrl+Shift+V) — النسخ العادي بيجيب تنسيقات بتخرّب الخط.</li>
          <li>العامية المصرية للصفحات المحلية، والفصحى لصفحة المستثمرين من الخليج. متخلطش.</li>
          <li>أي رقم تنشره، اكتب جنبه تاريخه. رقم بلا تاريخ مش رقم.</li>
        </ul>
      </details>
    </div>
  );
}
