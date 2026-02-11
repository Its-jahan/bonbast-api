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

برای اندپوینت ادمین:
- `ADMIN_TOKEN` را ست کنید و سپس `GET /api/admin/keys` را با هدر `x-admin-token` صدا بزنید.

## فونت IranyekanX

فرانت از فونت `IRANYekanX` استفاده می‌کند (به‌صورت پیش‌فرض از CDN).
اگر می‌خواهید self-host کنید، فایل‌ها را در این مسیرها قرار دهید:
- `frontend/public/fonts/IranYekanX-Regular.woff2`
- `frontend/public/fonts/IranYekanX-Bold.woff2`
