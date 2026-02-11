# 📘 راهنمای راه‌اندازی کامل

این راهنما گام به گام شما را در راه‌اندازی و اتصال به backend یاری می‌کند.

## 📋 پیش‌نیازها

- Node.js نسخه 18 یا بالاتر
- یک backend API (یا می‌توانید از demo استفاده کنید)
- دانش پایه React و TypeScript

---

## 🚀 مرحله 1: نصب

### نصب وابستگی‌ها

```bash
npm install
```

یا

```bash
yarn install
```

---

## ⚙️ مرحله 2: تنظیم API

### A. ویرایش `config/api.ts`

```typescript
export const API_CONFIG = {
  // آدرس backend خودتان را اینجا قرار دهید
  BASE_URL: 'https://your-backend-url.com/api',
  
  ENDPOINTS: {
    PRICES: '/prices',           // دریافت همه قیمت‌ها
    CURRENCIES: '/currencies',   // فقط ارزها
    GOLD: '/gold',              // فقط طلا
    COINS: '/coins',            // فقط سکه
    CRYPTO: '/crypto',          // فقط ارز دیجیتال
  },
  
  REFRESH_INTERVAL: 30000, // 30 ثانیه
};
```

### B. فرمت پاسخ API

API شما باید به این فرمت پاسخ دهد:

```json
{
  "status": "Success",
  "last_updated": "2024-01-15T10:30:00Z",
  "data": {
    "usd": "52500",
    "eur": "57200",
    "gbp": "67800",
    "try": "1850",
    "aed": "14300",
    "coin_azadi": "32500000",
    "coin_emami": "17800000",
    "coin_gerami": "4200000",
    "gold_18k": "2850000",
    "bitcoin": "67500",
    "ethereum": "3200"
  }
}
```

---

## 🔐 مرحله 3: اتصال Authentication

### A. ویرایش `contexts/AuthContext.tsx`

پیدا کردن TODO های زیر و جایگزینی با کد واقعی:

#### 1. Login Function

```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('YOUR_BACKEND_URL/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  
  setUser(data.user);
  setAccessToken(data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('accessToken', data.accessToken);
  
  return { user: data.user };
};
```

#### 2. Signup Function

```typescript
const signup = async (name: string, email: string, password: string) => {
  const response = await fetch('YOUR_BACKEND_URL/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Signup failed');
  }
  
  const data = await response.json();
  
  await login(email, password);
  
  return { user: data.user };
};
```

---

## 💳 مرحله 4: اتصال Subscription API

### A. ویرایش `pages/Dashboard.tsx`

```typescript
const loadSubscriptions = async () => {
  try {
    const response = await fetch('YOUR_BACKEND_URL/subscriptions', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
      }
    });
    
    const data = await response.json();
    setSubscriptions(data.subscriptions);
  } catch (err) {
    console.error('Load subscriptions error:', err);
  } finally {
    setLoading(false);
  }
};
```

### B. ویرایش `pages/Checkout.tsx`

```typescript
const handlePurchase = async () => {
  try {
    const response = await fetch('YOUR_BACKEND_URL/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ 
        productId: product.id,
        // سایر اطلاعات...
      }),
    });
    
    const data = await response.json();
    
    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  } catch (err) {
    setError(err.message);
  }
};
```

---

## 🎨 مرحله 5: سفارشی‌سازی طراحی

### تغییر رنگ‌ها

ویرایش `styles/globals.css`:

```css
@theme {
  --color-primary: #YOUR_COLOR;
  --color-background: #YOUR_COLOR;
  /* ... */
}
```

### تغییر فونت

```css
@font-face {
  font-family: 'YourFont';
  src: url('YOUR_FONT_URL') format('woff2');
}
```

---

## 🔧 مرحله 6: Backend Endpoints مورد نیاز

Backend شما باید این endpoint ها را داشته باشد:

### Authentication
- `POST /auth/signup` - ثبت نام
- `POST /auth/login` - ورود
- `POST /auth/logout` - خروج
- `GET /auth/me` - دریافت اطلاعات کاربر

### Prices
- `GET /api/prices` - دریافت همه قیمت‌ها
- `GET /api/currencies` - فقط ارزها
- `GET /api/gold` - فقط طلا
- `GET /api/coins` - فقط سکه
- `GET /api/crypto` - فقط ارز دیجیتال

### Subscriptions
- `GET /subscriptions` - لیست subscription های کاربر
- `POST /purchase` - خرید subscription جدید
- `POST /subscriptions/:id/usage` - ثبت استفاده از API

---

## 🗄️ مرحله 7: Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  api_type VARCHAR(50) NOT NULL,
  secret_key VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  request_url TEXT NOT NULL,
  monthly_limit INTEGER NOT NULL,
  used_requests INTEGER DEFAULT 0,
  reset_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🧪 مرحله 8: تست

### 1. تست API Connection

```bash
curl https://your-backend-url.com/api/prices
```

### 2. تست Authentication

```bash
curl -X POST https://your-backend-url.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 3. تست در مرورگر

1. ثبت نام کاربر جدید
2. خرید یک API plan
3. بررسی dashboard
4. تست فراخوانی API

---

## 🚀 مرحله 9: Deploy

### Frontend (Vercel/Netlify)

```bash
npm run build
```

سپس فایل‌های `dist/` را deploy کنید.

### Environment Variables

در پنل deploy خود، این متغیرها را تنظیم کنید:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

---

## ❓ مشکلات رایج

### CORS Error

در backend خود CORS را فعال کنید:

```javascript
app.use(cors({
  origin: 'https://your-frontend-url.com',
  credentials: true,
}));
```

### 401 Unauthorized

مطمئن شوید که:
1. Token به درستی ارسال می‌شود
2. Header `Authorization: Bearer TOKEN` صحیح است
3. Token منقضی نشده است

### قیمت‌ها نمایش داده نمی‌شوند

1. فرمت JSON API را بررسی کنید
2. Console.log را چک کنید
3. Network tab را بررسی کنید

---

## 📚 منابع بیشتر

- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Iconsax React](https://iconsax-react.pages.dev)

---

## 🆘 نیاز به کمک؟

اگر به مشکل خوردید:

1. TODO comments در کد را بخوانید
2. Console errors را بررسی کنید
3. Network requests را چک کنید
4. فایل README.md را مطالعه کنید

---

**موفق باشید! 🎉**
