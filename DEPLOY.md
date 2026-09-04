# النشر — خطوة بخطوة

الريبو: **https://github.com/tarekokashha/alrowad-real-estate**

الكود جاهز. الناقص بس ٣ حسابات مجانية وربطهم. **مفيش أي حاجة مدفوعة.**

---

## ⛔ الحالة دلوقتي — النشر على Production متوقف

البناء بينجح. الحاجة الوحيدة الواقفة إن **Vercel رافض يبدأ أي نشر على
production** للمشروع ده.

| الدليل | القيمة |
|---|---|
| آخر نشر production | `BLOCKED` — ومدة البناء **٠ ثانية**، يعني ما بدأش أصلًا |
| حالة المشروع | `live: false` |
| نشر preview في نفس التوقيت | `READY` — بنى في دقيقة واحدة ✅ |
| محاولة `unpause` بالـAPI | `403 Forbidden` |

يعني **الكود سليم** — الـpreview اتبنى من نفس الـcommit بالظبط. المشكلة في
إعداد الحساب مش في المشروع.

ودي بالظبط الحالة اللي بيوصفها توثيق Vercel لمشروع **متوقّف (paused)**:
> "the project disables auto-assigning custom production domains and
> **blocks the active Production Deployment**"

### اللي محتاج تعمله إنت (أنا مش قادر — الـAPI بيرد 403)

1. افتح **https://vercel.com/tareks-projects-2103af5a/alrowad-real-estate**
2. لو فيه بانر **Resume / Unpause** فوق ← اضغطه
3. لو مفيش، بصّ في **Settings ← General** تحت خالص، وفي
   **Account ← Billing** لو فيه أي تنبيه أو حد استهلاك
4. بعد ما يترفع الإيقاف، قوللي وأنا أنشر تاني على طول

> ملاحظة: عملت ١٦ نشر النهار ده وإحنا بنظبط، فلو الإيقاف مؤقت بسبب كتر
> النشر، غالبًا هيفك لوحده خلال ساعات.

---

## ١) Supabase — قاعدة بيانات + تخزين صور، حساب واحد

1. **supabase.com** ← New project
2. **Region: `eu-central-1` (Frankfurt)** — أقرب حاجة لمصر.
   واشنطن (الافتراضي) بتضيف ~١٥٠ مللي ثانية على كل طلب.
3. اكتب كلمة مرور لقاعدة البيانات واحتفظ بيها.

### رابط قاعدة البيانات

`Settings ← Database ← Connection string ← Transaction pooler`

> ⚠️ خد اللي فيه **`pooler`** — من غيره السيرفرلس بيفتح اتصالات كتير وبتقع.

شكله كده:
```
postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### تخزين الصور

1. `Storage ← New bucket` ← الاسم **`media`** ← علّم **Public**
2. `Settings ← Storage ← S3 connection ← New access key`
3. هتاخد منها: الـendpoint و access key id و secret

---

## ٢) المتغيرات اللي هتحطها في Vercel

`Settings ← Environment Variables` — انسخهم واحد واحد:

| الاسم | القيمة |
|---|---|
| `DATABASE_URI` | رابط الـpooler من Supabase |
| `PAYLOAD_SECRET` | ولّده — تحت |
| `S3_BUCKET` | `media` |
| `S3_ENDPOINT` | `https://xxxxx.supabase.co/storage/v1/s3` |
| `S3_REGION` | `eu-central-1` |
| `S3_ACCESS_KEY_ID` | من Supabase |
| `S3_SECRET_ACCESS_KEY` | من Supabase |
| `NEXT_PUBLIC_SITE_URL` | `https://alrowadrealestate.com` |

**ولّد الـsecret:**
```bash
openssl rand -base64 32
```

> **متحطش `ADMIN_EMAIL` ولا `ADMIN_PASSWORD` في Vercel.** الحساب بيتعمل مرة
> واحدة من على جهازك (خطوة ٤)، وبيتخزن في قاعدة البيانات. مالهوش لازمة على السيرفر.

---

## ٣) اربط Vercel

1. **vercel.com** ← Add New ← Project
2. اختار ريبو **`alrowad-real-estate`**
3. Framework: Next.js (هيتعرف لوحده) — **متغيّرش أي إعداد بناء**
4. حط المتغيرات فوق ← Deploy

`preferredRegion = 'fra1'` متحطوط أصلاً في الكود.

---

## ٤) املأ قاعدة البيانات (مرة واحدة، من على جهازك)

بعد ما أول نشر ينجح، Payload بيكون عمل الجداول. دلوقتي املأها:

```bash
# في alrowad/.env حط نفس DATABASE_URI بتاع Supabase
npm run seed      # الوحدات والصور والشهادات والمؤشر
npm run admin     # هيسألك على البريد وكلمة المرور في الترمنال
```

`npm run admin` **بيسألك في الترمنال** — كلمة المرور مش بتتكتب في أي ملف ولا
بتتحفظ في أي مكان غير قاعدة البيانات مشفّرة.

نفس الأمر ده هو كمان **«نسيت كلمة المرور»** — شغّله تاني وهيغيّرها.

---

## ٥) الدومين

في Vercel: `Settings ← Domains` ← ضيف `alrowadrealestate.com`

في Namecheap: `Advanced DNS`
1. **امسح** سجّلات `parkingpage` الافتراضية
2. ضيف **A** و **CNAME** بالقيم اللي Vercel هيوريهالك
3. سيب الـnameservers على Namecheap BasicDNS — عشان تحتفظ بتحويل الإيميل المجاني
4. **متشتريش شهادة SSL** — Vercel بيعملها ببلاش وبيجددها لوحدها

---

## ملاحظة على خطة Vercel المجانية

شروط خطة **Hobby** بتقول إنها للاستخدام الشخصي غير التجاري، وموقع شركة عقارات
استخدام تجاري. عمليًا ناس كتير بتستخدمها، بس لو عايز تكون مظبوط:

- **Netlify** — خطتها المجانية بتسمح بالتجاري صراحةً
- أو **Vercel Pro** — $20/شهر

قرار تجاري مش تقني، والكود شغال على الاتنين.

---

## ⚠️ قبل ما تقول للعميل إنه نزل

الأرقام دي كلها لسه **من التصميم**:

- [ ] السجل التجاري والبطاقة الضريبية و**رقم تسجيل الوساطة**
- [ ] أسعار الوحدات وأكوادها
- [ ] سجل البيع
- [ ] أرقام العائد في صفحة الخليج
- [ ] الشهادات — بأسماء حقيقية أو تتشال

**رقم تسجيل الوساطة تحديدًا:** لازم أحمد يكون مسجّل فعلاً في GOEIC تحت القرار
الوزاري ٥٧٨/٢٠٢٥. نشر رقم مش عنده بيفتح باب لشكوى من منافس مسجّل — والقطاع
اتنظّم من يناير ٢٠٢٦.
