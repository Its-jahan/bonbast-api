# 📡 API Documentation

این مستندات، فرمت و endpoint های مورد نیاز backend را شرح می‌دهد.

---

## 🔗 Base URL

```
http://31.59.105.156/api
```

یا URL backend شما:
```
https://your-backend-url.com/api
```

---

## 📊 Prices API

### GET /prices

دریافت تمام قیمت‌ها (ارز، طلا، سکه، کریپتو)

#### Request
```http
GET /api/prices
Accept: application/json
```

#### Response (Success)
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

#### Response (Error)
```json
{
  "status": "Error",
  "message": "Failed to fetch prices",
  "error": "Database connection failed"
}
```

---

### GET /currencies

فقط ارزهای خارجی

#### Response
```json
{
  "status": "Success",
  "last_updated": "2024-01-15T10:30:00Z",
  "data": {
    "usd": "52500",
    "eur": "57200",
    "gbp": "67800",
    "try": "1850",
    "aed": "14300"
  }
}
```

---

### GET /gold

فقط طلا

#### Response
```json
{
  "status": "Success",
  "last_updated": "2024-01-15T10:30:00Z",
  "data": {
    "gold_18k": "2850000"
  }
}
```

---

### GET /coins

فقط سکه‌ها

#### Response
```json
{
  "status": "Success",
  "last_updated": "2024-01-15T10:30:00Z",
  "data": {
    "coin_azadi": "32500000",
    "coin_emami": "17800000",
    "coin_gerami": "4200000"
  }
}
```

---

### GET /crypto

فقط ارزهای دیجیتال

#### Response
```json
{
  "status": "Success",
  "last_updated": "2024-01-15T10:30:00Z",
  "data": {
    "bitcoin": "67500",
    "ethereum": "3200"
  }
}
```

---

## 🔐 Authentication API

### POST /auth/signup

ثبت نام کاربر جدید

#### Request
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "علی احمدی",
  "email": "ali@example.com",
  "password": "securePassword123"
}
```

#### Response (Success)
```json
{
  "status": "Success",
  "user": {
    "id": "user_123",
    "name": "علی احمدی",
    "email": "ali@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Response (Error)
```json
{
  "status": "Error",
  "message": "Email already exists"
}
```

---

### POST /auth/login

ورود کاربر

#### Request
```http
POST /auth/login
Content-Type: application/json

{
  "email": "ali@example.com",
  "password": "securePassword123"
}
```

#### Response (Success)
```json
{
  "status": "Success",
  "user": {
    "id": "user_123",
    "name": "علی احمدی",
    "email": "ali@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Response (Error)
```json
{
  "status": "Error",
  "message": "Invalid credentials"
}
```

---

### POST /auth/logout

خروج کاربر

#### Request
```http
POST /auth/logout
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response
```json
{
  "status": "Success",
  "message": "Logged out successfully"
}
```

---

### GET /auth/me

دریافت اطلاعات کاربر فعلی

#### Request
```http
GET /auth/me
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response
```json
{
  "status": "Success",
  "user": {
    "id": "user_123",
    "name": "علی احمدی",
    "email": "ali@example.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 💳 Subscription API

### GET /subscriptions

دریافت لیست subscription های کاربر

#### Request
```http
GET /subscriptions
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response
```json
{
  "status": "Success",
  "subscriptions": [
    {
      "id": "sub_123",
      "userId": "user_123",
      "productId": "pro",
      "apiType": "all",
      "secretKey": "sk_abcdef123456",
      "name": "پلن حرفه‌ای",
      "price": 299000,
      "requestUrl": "http://31.59.105.156/api/prices",
      "monthlyLimit": 10000,
      "usedRequests": 1250,
      "resetDate": "2024-02-15T00:00:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST /purchase

خرید subscription جدید

#### Request
```http
POST /purchase
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "productId": "pro",
  "apiType": "all",
  "name": "پلن حرفه‌ای",
  "price": 299000,
  "monthlyRequests": 10000
}
```

#### Response (Success)
```json
{
  "status": "Success",
  "subscription": {
    "id": "sub_123",
    "userId": "user_123",
    "productId": "pro",
    "apiType": "all",
    "secretKey": "sk_abcdef123456",
    "name": "پلن حرفه‌ای",
    "price": 299000,
    "requestUrl": "http://31.59.105.156/api/prices",
    "monthlyLimit": 10000,
    "usedRequests": 0,
    "resetDate": "2024-02-15T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Response (Error)
```json
{
  "status": "Error",
  "message": "Payment failed"
}
```

---

### POST /subscriptions/:id/usage

ثبت استفاده از API (increment counter)

#### Request
```http
POST /subscriptions/sub_123/usage
Authorization: Bearer YOUR_ACCESS_TOKEN
```

#### Response
```json
{
  "status": "Success",
  "subscription": {
    "id": "sub_123",
    "usedRequests": 1251,
    "remainingRequests": 8749
  }
}
```

---

## 🔑 Secret Key Usage

وقتی کاربر API خریده، می‌تونه با Secret Key خودش درخواست بزنه:

### Example Request

```http
GET /api/prices
Authorization: Bearer sk_abcdef123456
```

Backend باید:
1. Secret Key را validate کنه
2. بررسی کنه که limit تمام نشده
3. Counter رو increment کنه
4. داده رو برگردونه

---

## 📝 Data Types

### User
```typescript
{
  id: string;
  name: string;
  email: string;
  createdAt: string; // ISO 8601
}
```

### Subscription
```typescript
{
  id: string;
  userId: string;
  productId: string;
  apiType: 'all' | 'currencies' | 'gold' | 'coins' | 'crypto';
  secretKey: string;
  name: string;
  price: number;
  requestUrl: string;
  monthlyLimit: number;
  usedRequests: number;
  resetDate: string; // ISO 8601
  createdAt: string; // ISO 8601
}
```

### Price Data
```typescript
{
  usd?: string;
  eur?: string;
  gbp?: string;
  try?: string;
  aed?: string;
  coin_azadi?: string;
  coin_emami?: string;
  coin_gerami?: string;
  gold_18k?: string;
  bitcoin?: string;
  ethereum?: string;
}
```

---

## ❌ Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | درخواست نامعتبر |
| 401 | Unauthorized | نیاز به احراز هویت |
| 403 | Forbidden | دسترسی غیرمجاز |
| 404 | Not Found | یافت نشد |
| 429 | Too Many Requests | تعداد درخواست بیش از حد |
| 500 | Internal Server Error | خطای سرور |

---

## 🔒 Security

### Authentication
- از JWT برای access token استفاده کنید
- Token expiry: 24 ساعت
- Refresh token: 30 روز

### API Keys
- فرمت: `sk_` + 32 کاراکتر رندوم
- Hash کردن قبل از ذخیره در database
- Rate limiting per key

### CORS
```javascript
{
  origin: 'https://your-frontend-url.com',
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type']
}
```

---

## 📊 Rate Limiting

Per API Key:
- Basic: 1,000 requests/month
- Pro: 10,000 requests/month
- Enterprise: 100,000 requests/month

Per IP (without API key):
- 100 requests/hour

---

## 🧪 Testing

### cURL Examples

#### Get Prices
```bash
curl -X GET http://31.59.105.156/api/prices \
  -H "Accept: application/json"
```

#### Login
```bash
curl -X POST http://your-backend-url.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

#### Get Subscriptions
```bash
curl -X GET http://your-backend-url.com/subscriptions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📚 Response Examples

### Success Response Format
```json
{
  "status": "Success",
  "data": { /* your data */ },
  "message": "Optional success message"
}
```

### Error Response Format
```json
{
  "status": "Error",
  "message": "Human readable error message",
  "error": "Technical error details",
  "code": 400
}
```

---

**این API Documentation را برای backend خود استفاده کنید! 🚀**
