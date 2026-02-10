# Bonbast API + Frontend

این پروژه دو سرویس دارد:
- `api` (Flask + Selenium) برای اسکرپ نرخ‌ها
- `frontend` (React/Vite + Nginx) برای نمایش نرخ‌ها و مدیریت API Key

## اجرا با Docker

```bash
docker-compose up -d --build
```

- فرانت روی `http://localhost/`
- بک‌اند از طریق فرانت پراکسی می‌شود: مسیرهای `http://localhost/api/...`

## مسیرهای API (از طریق Nginx)

- عمومی (بدون کلید): `GET /api/prices`
- پولی/متری (با کلید): `GET /api/v1/prices` با هدر `x-api-key`
- لیست پلن‌ها: `GET /api/plans`
- صدور کلید (Demo، بدون پرداخت): `POST /api/purchase` با بدنه:
  - `{"email":"you@example.com","plan_slug":"starter"}`
- نمایش مصرف (بدون شمارش در سهمیه): `GET /api/self/usage` با هدر `x-api-key`
- تعویض کلید (revoke قبلی + صدور جدید): `POST /api/self/rotate` با هدر `x-api-key`

## تنظیمات API Manager

در `docker-compose.yml` مسیر دیتابیس و pepper در ولوم `./data` ذخیره می‌شود:
- `API_DB_PATH=/data/api_manager.db`
- `API_KEY_PEPPER_PATH=/data/api_key_pepper`

برای اندپوینت ادمین:
- `ADMIN_TOKEN` را ست کنید و سپس `GET /api/admin/keys` را با هدر `x-admin-token` صدا بزنید.

## فونت IranyekanX

فرانت از فونت `IRANYekanX` استفاده می‌کند (به‌صورت پیش‌فرض از CDN).
اگر می‌خواهید self-host کنید، فایل‌ها را در این مسیرها قرار دهید:
- `frontend/public/fonts/IranYekanX-Regular.woff2`
- `frontend/public/fonts/IranYekanX-Bold.woff2`

