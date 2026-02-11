# Bonbast API + Frontend

این پروژه دو سرویس دارد:
- `api` (Flask + Selenium) برای اسکرپ نرخ‌ها
- `frontend` (React/Vite + Nginx) برای وب‌سایت و نمایش نرخ‌ها (از فولدر `Front-end new`)

## اجرا با Docker

```bash
docker-compose up -d --build
```

- فرانت روی `http://localhost/`
- بک‌اند از طریق فرانت پراکسی می‌شود: مسیرهای `http://localhost/api/...`

## مسیرهای API (از طریق Nginx)

- عمومی (بدون کلید): `GET /api/prices`
- پولی/متری (با کلید، فیلتر بر اساس scope): `GET /api/v1/prices` با هدر `x-api-key`
- لینک اختصاصی هر کلید: `GET /api/v1/key/<api_key>/prices`
- لیست پلن‌ها: `GET /api/plans` (شامل scope: all, currency, crypto, gold)
- صدور کلید (legacy): `POST /api/purchase` با بدنه `{"email":"...","plan_slug":"..."}`

**با احراز هویت Supabase (هدر `Authorization: Bearer <jwt>`):**
- خرید پلن: `POST /api/me/purchase` با بدنه `{"plan_slug":"all-starter"}`
- لیست کلیدهای من: `GET /api/me/keys`
- خرید ریکوئست اضافه: `POST /api/me/keys/<id>/add-requests`

- نمایش مصرف: `GET /api/self/usage` با هدر `x-api-key`
- تعویض کلید: `POST /api/self/rotate` با هدر `x-api-key`

## تنظیمات API Manager

در `docker-compose.yml`:
- `API_DB_PATH=/data/api_manager.db`
- `API_KEY_PEPPER_PATH=/data/api_key_pepper`
- `SUPABASE_JWT_SECRET`: از Supabase Dashboard > Project Settings > API > JWT Secret کپی کنید (برای اندپوینت‌های `/me/*`)
- (اختیاری) همگام‌سازی با Supabase:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `PUBLIC_API_BASE_URL` (مثل `https://example.com/api`)

ساخت جدول‌های Supabase (در SQL Editor) از این فایل:
- `supabase/schema.sql`

برای ساخت خودکار رکورد در `customers` هنگام ثبت‌نام در Supabase Auth،
همان `supabase/schema.sql` شامل trigger لازم است.

برای اندپوینت ادمین:
- `ADMIN_TOKEN` را ست کنید و سپس `GET /api/admin/keys` را با هدر `x-admin-token` صدا بزنید.

## فونت Inter

فرانت از فونت `Inter` (Google Fonts) استفاده می‌کند.
