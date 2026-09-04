# النشر — خطوة بخطوة

الريبو: **https://github.com/tarekokashha/alrowad-real-estate**

الكود جاهز. الناقص بس ٣ حسابات مجانية وربطهم. **مفيش أي حاجة مدفوعة.**

---

## ✅ سبب توقّف النشر — واتحل

كان كل نشر بيرجع `BLOCKED`. الرسالة من Vercel:

> The deployment was blocked because the **commit author did not have
> contributing access** to the project. The Hobby Plan does not support
> collaboration for private repositories.

مكانش حد استهلاك ولا منع استخدام تجاري — كان **إيميل كاتب الكوميت**.

| | |
|---|---|
| الحساب اللي بيملك الريبو ومربوط بـVercel | `tarekokashha` — `tarekokasha53@gmail.com` |
| الإيميل اللي الكوميتات كانت متكتبة بيه | `tarekokasha253@gmail.com` |

الفرق حرفين، بس GitHub بيربط الإيميل التاني بحساب مختلف تمامًا. فVercel كان
بيشوف كل push كأنه من مساهم من بره المشروع — وده ممنوع في خطة Hobby مع ريبو
**private**.

### الحل (مجاني، من غير أي ترقية)

```bash
git config user.email "tarekokasha53@gmail.com"
```

مظبوط في الريبو ده خلاص. أي كوميت جديد بيتنسب لصاحب المشروع، والنشر بيعدّي.

> **مهم:** ده إعداد محلي في `.git/config`، مش بينتقل مع الريبو. لو شغّلت
> المشروع من جهاز تاني أو من clone جديد، اظبطه تاني — وإلا الأعطال ترجع.

### لو حصلت تاني

اتأكد الأول من كاتب آخر كوميت:

```bash
git log -1 --format='%an <%ae>'
```

لازم يكون `tarekokasha53@gmail.com`. لو لأ، اظبط الإعداد واعمل كوميت جديد —
النشر بيتنسب لكاتب **آخر** كوميت، فمش محتاج تعيد كتابة التاريخ.

### بدائل لو احتجتها يومًا

- **خلي الريبو public** — المنع مخصوص بالريبو الـprivate. بس ده بينشر كود
  موقع العميل للناس كلها، فمش الاختيار الأول.
- **انشر من الـCLI** بـ`vercel --prod` — بيتنسب لحسابك على Vercel مباشرة.

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

### تخزين الصور — الحاجة الوحيدة اللي لازم إيدك

الـbucket اسمه `media` **اتعمل خلاص**، وكل إعدادات التخزين اتكتبت في `.env`
ما عدا مفتاحين. المفتاحين دول **مش بيتعملوا غير من اللوحة** — مفيش endpoint
في الـManagement API بيولّدهم، فمقدرتش أعملهم لك.

1. افتح **Settings ← Storage ← S3 connection ← New access key**
2. هيديك `Access key ID` و `Secret access key`
3. حطهم في `alrowad/.env` في السطرين الفاضيين:
   ```
   S3_ACCESS_KEY_ID=
   S3_SECRET_ACCESS_KEY=
   ```
4. شغّل: `npm run vercel:env` — هيرفعهم لـVercel لوحده

الباقي متكتب أصلاً:

| المتغير | القيمة |
|---|---|
| `S3_BUCKET` | `media` |
| `S3_REGION` | `eu-central-1` |
| `S3_ENDPOINT` | `https://vnwoivqnqvkdhcbhiwat.storage.supabase.co/storage/v1/s3` |

> لاحظ إن الـendpoint على `storage.supabase.co` مش على `supabase.co` العادي.
> ده اللي التوثيق بيقول إنه أسرع بكتير في رفع الملفات الكبيرة — وده بالظبط
> اللي أحمد هيعمله: فولدر صور وحدات.

> ومفاتيح S3 دي بتتخطى الـRLS وليها صلاحية كاملة على كل الـbuckets، فهي
> للسيرفر بس — عمرها ما تتحط في كود بيوصل للمتصفح.

---

## ٢) المتغيرات اللي هتحطها في Vercel

`Settings ← Environment Variables` — انسخهم واحد واحد:

| الاسم | القيمة |
|---|---|
| `DATABASE_URI` | رابط الـpooler من Supabase |
| `PAYLOAD_SECRET` | ولّده — تحت |
| `S3_BUCKET` | `media` |
| `S3_ENDPOINT` | `https://xxxxx.storage.supabase.co/storage/v1/s3` |
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
