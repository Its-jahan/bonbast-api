# Price API Platform - Frontend

یک پلتفرم مدرن و حرفه‌ای با طراحی Notion-style برای نمایش و فروش API قیمت ارز، طلا و ارز دیجیتال.

## ✨ ویژگی‌ها

- 🌙 **Dark Mode** - طراحی تیره و مدرن
- 🎨 **Notion-Style Design** - رابط کاربری شبیه Notion
- 📱 **Responsive** - سازگار با تمام دستگاه‌ها
- ⚡ **Real-time Updates** - به‌روزرسانی خودکار هر 30 ثانیه
- 🔐 **Authentication** - سیستم احراز هویت
- 💳 **E-commerce** - فروشگاه و سیستم خرید API
- 📊 **Dashboard** - داشبورد مدیریت API Keys
- 📈 **Request Counter** - نوار پیشرفت مصرف API
- 🔍 **Search & Filter** - جستجو و فیلتر پیشرفته
- 🎯 **RTL Support** - پشتیبانی کامل از فارسی

## 🛠 تکنولوژی‌ها

- **React** - فریمورک اصلی
- **TypeScript** - برای Type Safety
- **Tailwind CSS v4** - استایل‌دهی
- **React Router** - مسیریابی
- **Iconsax React** - آیکون‌ها
- **Context API** - مدیریت State

## 📁 ساختار پروژه

```
front-end-new/
├── App.tsx                 # کامپوننت اصلی
├── routes.ts              # تنظیمات مسیریابی
├── config/
│   └── api.ts             # تنظیمات API و helper functions
├── contexts/
│   └── AuthContext.tsx    # Context مدیریت احراز هویت
├── types/
│   └── index.ts           # تایپ‌های TypeScript
├── data/
│   ├── currencies.ts      # داده‌های ارزها
│   └── products.ts        # داده‌های محصولات
├── components/
│   ├── Header.tsx         # هدر سایت
│   ├── CurrencyCard.tsx   # کارت نمایش ارز
│   ├── StatCard.tsx       # کارت آمار
│   └── RequestCounter.tsx # نوار شمارش درخواست‌ها
├── pages/
│   ├── Home.tsx           # صفحه اصلی
│   ├── Login.tsx          # صفحه ورود
│   ├── Signup.tsx         # صفحه ثبت نام
│   ├── Shop.tsx           # فروشگاه
│   ├── Checkout.tsx       # تکمیل خرید
│   └── Dashboard.tsx      # داشبورد
└── styles/
    └── globals.css        # استایل‌های سراسری
```

## 🚀 راه‌اندازی

### 1. نصب وابستگی‌ها

```bash
npm install react react-router iconsax-react
```

### 2. اتصال به Backend

فایل `config/api.ts` را ویرایش کنید:

```typescript
export const API_CONFIG = {
  BASE_URL: 'YOUR_BACKEND_URL',  // آدرس backend خودتان
  ENDPOINTS: {
    PRICES: '/prices',
    CURRENCIES: '/currencies',
    // ...
  },
};
```

### 3. پیاده‌سازی Authentication

در فایل `contexts/AuthContext.tsx`، قسمت‌های TODO را با API خودتان جایگزین کنید:

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('YOUR_BACKEND_URL/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  // ...
};
```

### 4. پیاده‌سازی Subscription API

در `pages/Dashboard.tsx` و `pages/Checkout.tsx`، قسمت‌های TODO را با backend خودتان متصل کنید.

## 🎨 سفارشی‌سازی طراحی

### تغییر رنگ‌ها

فایل `styles/globals.css` را ویرایش کنید:

```css
@theme {
  --color-primary: #2eaadc;        /* رنگ اصلی */
  --color-background: #191919;     /* پس‌زمینه */
  --color-foreground: #e3e3e3;     /* متن */
  /* ... */
}
```

### اضافه کردن فونت

```css
@font-face {
  font-family: 'YourFont';
  src: url('YOUR_FONT_URL') format('woff2');
  font-weight: 400;
}
```

## 📊 استفاده از Request Counter

```tsx
import { RequestCounter } from '../components/RequestCounter';

<RequestCounter 
  used={500}
  total={1000}
  label="درخواست‌های ماهیانه"
/>
```

## 🔐 احراز هویت

### استفاده از Auth Context

```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, signup } = useAuth();
  
  // ...
}
```

## 📡 ارتباط با API

### استفاده از API Client

```tsx
import { apiClient, API_CONFIG } from '../config/api';

// GET request
const data = await apiClient.get(API_CONFIG.ENDPOINTS.PRICES);

// POST request
const result = await apiClient.post('/endpoint', { key: 'value' });
```

## 🎯 صفحات اصلی

### Home
- نمایش قیمت لحظه‌ای ارزها
- جستجو و فیلتر
- به‌روزرسانی خودکار

### Shop
- نمایش پلن‌های API
- قیمت‌گذاری
- امکانات هر پلن

### Dashboard
- مدیریت API Keys
- نمایش Request Counter
- آمار مصرف
- تست API

### Checkout
- تکمیل خرید
- خلاصه سفارش
- پرداخت (دمو)

## 💡 نکات مهم

### localStorage vs Backend

فعلاً داده‌ها در `localStorage` ذخیره می‌شوند (برای دمو). برای Production:

1. تمام `localStorage.getItem/setItem` را حذف کنید
2. با API backend خودتان جایگزین کنید
3. Token ها را امن نگه دارید

### امنیت

- هرگز API keys را در کد سمت کلاینت hard-code نکنید
- از HTTPS استفاده کنید
- Token ها را در httpOnly cookies ذخیره کنید (در backend)

## 🎨 طراحی Notion-Style

ویژگی‌های طراحی:
- ✅ Dark mode با رنگ‌های ملایم
- ✅ Border های نازک و گوشه‌های گرد
- ✅ Shadow های ظریف
- ✅ Hover effects نرم
- ✅ Gradient های زیبا
- ✅ Typography واضح

## 📦 آماده برای Production

1. ✅ Code تمیز و مستند
2. ✅ TypeScript برای Type Safety
3. ✅ Component-based architecture
4. ✅ Responsive design
5. ✅ Error handling
6. ✅ Loading states
7. ✅ TODO comments برای اتصال به backend

## 🚀 مراحل بعدی

1. Backend خودتان را بسازید
2. TODO های موجود در کد را پیاده‌سازی کنید
3. درگاه پرداخت واقعی متصل کنید
4. تست‌های واحد بنویسید
5. Deploy کنید

## 📞 پشتیبانی

برای سوالات و مشکلات، TODO comments در کد را بررسی کنید.

---

**ساخته شده با ❤️ برای یک تجربه کاربری عالی**
