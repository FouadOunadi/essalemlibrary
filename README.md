# متجر المدرسة (School Shop)

موقع التجارة الإلكترونية لمنتجات المدرسة باستخدام Next.js وTailwind CSS وSupabase.

## الإعداد

1. قم بتثبيت التبعيات:

```bash
npm install
```

2. قم بإعداد Supabase:

   - قم بإنشاء حساب على [Supabase](https://supabase.com/) إذا لم يكن لديك حساب بالفعل
   - قم بإنشاء مشروع جديد
   - انسخ عنوان URL للمشروع ومفتاح API العام (anon key)
   - قم بتعديل ملف `.env.local` وأضف المعلومات الخاصة بك:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. قم بإنشاء جدول في Supabase للاختبار (اختياري):

   - انتقل إلى قسم Table Editor في لوحة تحكم Supabase
   - قم بإنشاء جدول جديد باسم `products` مثلاً
   - أضف بعض الأعمدة والبيانات
   - قم بتعديل ملف `src/components/SupabaseExample.jsx` لاستخدام اسم الجدول الذي أنشأته

## تشغيل المشروع

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في متصفحك لمشاهدة الموقع.

## الميزات

- واجهة مستخدم عربية بتنسيق RTL
- تكامل مع Supabase لإدارة البيانات
- تصميم متجاوب باستخدام Tailwind CSS
- بنية Next.js الحديثة
