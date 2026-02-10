import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// دیکشنری نام‌ها را بیرون کامپوننت تعریف کردیم تا کد تمیزتر باشد
const persianNames = {
  "usd": "دلار آمریکا",
  "eur": "یورو",
  "gbp": "پوند انگلیس",
  "chf": "فرانک سوئیس",
  "cad": "دلار کانادا",
  "aud": "دلار استرالیا",
  "sek": "کرون سوئد",
  "nok": "کرون نروژ",
  "rub": "روبل روسیه",
  "thb": "بات تایلند",
  "sgd": "دلار سنگاپور",
  "hkd": "دلار هنگ کنگ",
  "azn": "منات آذربایجان",
  "amd": "درام ارمنستان",
  "dkk": "کرون دانمارک",
  "aed": "درهم امارات",
  "jpy": "ین ژاپن",
  "try": "لیر ترکیه",
  "cny": "یوان چین",
  "sar": "ریال عربستان",
  "inr": "روپیه هند",
  "myr": "رینگیت مالزی",
  "afn": "افغانی افغانستان",
  "kwd": "دینار کویت",
  "iqd": "دینار عراق",
  "bhd": "دینار بحرین",
  "omr": "ریال عمان",
  "qar": "ریال قطر",
  "gold_ounce": "انس طلا",
  "gold_gram_18k": "گرم طلا ۱۸ عیار",
  "gold_mithqal": "مثقال طلا",
  "coin_emami": "سکه امامی",
  "coin_azadi": "سکه بهار آزادی",
  "coin_half": "نیم سکه",
  "coin_quarter": "ربع سکه",
  "coin_gram": "سکه گرمی",
  "bitcoin": "بیت‌کوین"
};

function App() {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [activeTab, setActiveTab] = useState('rates'); // 'rates' | 'api'

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('/api/prices');
        
        if (response.data && response.data.data) {
            setPrices(response.data.data);
            setLastUpdated(response.data.last_updated);
            setError(null);
        }
      } catch (err) {
        console.error("Error details:", err);
        setError('خطا در دریافت اطلاعات. لطفا از اجرای بک‌اند مطمئن شوید.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 lg:px-8 py-6 font-sans transition-colors duration-300 ${
        isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'
      }`}
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              پنل API بون‌بست
            </h1>
            <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              مشاهده نرخ‌های لحظه‌ای و مدیریت دسترسی API برای فروش آنلاین.
            </p>
            {lastUpdated && (
              <p className={`mt-1 text-xs sm:text-sm dir-ltr ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Last Update: {lastUpdated}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors ${
                isDark
                  ? 'border-slate-700 bg-slate-800 hover:bg-slate-700'
                  : 'border-slate-200 bg-white hover:bg-slate-100'
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white dark:bg-yellow-400 dark:text-slate-900">
                {isDark ? '🌙' : '☀️'}
              </span>
              <span>{isDark ? 'تم تیره' : 'تم روشن'}</span>
            </button>
          </div>
        </header>

        <div
          className={`mb-8 inline-flex rounded-full border p-1 text-sm ${
            isDark ? 'border-slate-700 bg-slate-900/60' : 'border-slate-200 bg-white'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('rates')}
            className={`flex-1 rounded-full px-4 py-2 transition-colors ${
              activeTab === 'rates'
                ? isDark
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-teal-600 text-white'
                : isDark
                  ? 'text-slate-300'
                  : 'text-slate-600'
            }`}
          >
            نرخ‌های لحظه‌ای
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`flex-1 rounded-full px-4 py-2 transition-colors ${
              activeTab === 'api'
                ? isDark
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-teal-600 text-white'
                : isDark
                  ? 'text-slate-300'
                  : 'text-slate-600'
            }`}
          >
            مدیریت API و پلن‌ها
          </button>
        </div>

        {activeTab === 'rates' && (
          <>
            {loading && (
              <p className="text-center text-lg animate-pulse">
                در حال دریافت نرخ‌ها...
              </p>
            )}
            
            {error && (
              <div className="bg-red-900/10 border border-red-500/60 text-red-700 dark:text-red-100 dark:bg-red-900/40 dark:border-red-500 p-4 rounded-2xl text-center mb-6">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(persianNames).map((key) => {
                  const price = prices[key];
                  if (!price || price === "N/A") return null;

                  return (
                    <div
                      key={key}
                      className={`rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                        isDark
                          ? 'bg-slate-900/80 border-slate-800 hover:border-teal-500/40'
                          : 'bg-white border-slate-200 hover:border-teal-500/40'
                      } p-4 flex justify-between items-center`}
                    >
                      <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>
                        {persianNames[key]}
                      </span>
                      <span className="text-lg sm:text-xl font-mono font-bold text-teal-500 tracking-wider">
                        {Number(price).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <section
              className={`rounded-2xl border p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center ${
                isDark
                  ? 'bg-gradient-to-l from-slate-900 to-slate-950 border-slate-800'
                  : 'bg-gradient-to-l from-teal-50 to-white border-teal-100'
              }`}
            >
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  فروش آنلاین دسترسی به API
                </h2>
                <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  پلن‌های مختلف برای استارتاپ‌ها، فین‌تک‌ها و کسب‌وکارهایی که به نرخ‌های
                  دقیق و به‌روز نیاز دارند. پرداخت آنلاین، صدور کلید API و مانیتورینگ مصرف.
                </p>
              </div>
              <div className="flex flex-col items-stretch gap-2 min-w-[200px]">
                <button
                  type="button"
                  className="rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold px-4 py-2.5 shadow-md transition-colors"
                >
                  شروع فروش API
                </button>
                <span className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>
                  این دکمه فعلاً نمایشی است؛ به بک‌اند پرداخت و صدور کلید متصل کنید.
                </span>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div
                className={`rounded-2xl border p-5 ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="font-semibold mb-1">پلن استارتر</h3>
                <p className={isDark ? 'text-slate-300 text-sm' : 'text-slate-600 text-sm'}>
                  مناسب پروژه‌های کوچک و تست.
                </p>
                <p className="mt-4 text-2xl font-bold text-teal-500">۳۰۰K</p>
                <p className={isDark ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
                  درخواست رایگان در ماه
                </p>
              </div>
              <div
                className={`rounded-2xl border p-5 relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-b from-emerald-500/10 via-slate-900 to-slate-950 border-emerald-500/60'
                    : 'bg-gradient-to-b from-emerald-50 via-white to-white border-emerald-400/60'
                }`}
              >
                <span className="absolute left-4 top-4 rounded-full bg-amber-400/90 px-3 py-1 text-[10px] font-bold text-slate-900">
                  محبوب‌ترین
                </span>
                <h3 className="mt-6 font-semibold mb-1">پلن تجاری</h3>
                <p className={isDark ? 'text-slate-200 text-sm' : 'text-slate-700 text-sm'}>
                  برای محصولات در حال رشد و فین‌تک‌ها.
                </p>
                <p className="mt-4 text-2xl font-bold text-teal-500">+۱M</p>
                <p className={isDark ? 'text-slate-300 text-xs' : 'text-slate-600 text-xs'}>
                  درخواست در ماه (با هزینه اضافه برای مازاد)
                </p>
              </div>
              <div
                className={`rounded-2xl border p-5 ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="font-semibold mb-1">پلن سازمانی</h3>
                <p className={isDark ? 'text-slate-300 text-sm' : 'text-slate-600 text-sm'}>
                  SLA اختصاصی، پشتیبانی ویژه و حجم بالا.
                </p>
                <p className="mt-4 text-base font-semibold text-teal-500">تماس برای قیمت</p>
                <p className={isDark ? 'text-slate-400 text-xs' : 'text-slate-500 text-xs'}>
                  قرارداد اختصاصی، سرور جداگانه و امکانات سفارشی.
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
              <div
                className={`rounded-2xl border p-5 ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="font-semibold mb-3">نمونه استفاده از API</h3>
                <p className={isDark ? 'text-slate-300 text-sm mb-3' : 'text-slate-700 text-sm mb-3'}>
                  بعد از خرید پلن و صدور کلید، درخواست‌ها را به‌صورت زیر ارسال کنید:
                </p>
                <pre
                  className={`rounded-xl text-xs sm:text-[13px] leading-relaxed overflow-x-auto p-4 ${
                    isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
                  }`}
                >
{`GET https://your-domain.com/api/prices
x-api-key: YOUR_API_KEY

// response:
{
  "data": {
    "usd": 123450,
    "eur": 134000,
    "gold_ounce": 2500000
  },
  "last_updated": "2026-02-10T09:30:00Z"
}`}
                </pre>
              </div>

              <div
                className={`rounded-2xl border p-5 space-y-3 ${
                  isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="font-semibold">مدیریت کلیدهای API</h3>
                <p className={isDark ? 'text-slate-300 text-sm' : 'text-slate-700 text-sm'}>
                  این بخش صرفاً طراحی رابط است. آن را به سرویس مدیریت کلید، صدور و ابطال متصل کنید.
                </p>
                <div
                  className={`rounded-xl border px-3 py-2 text-xs flex items-center justify-between gap-2 ${
                    isDark ? 'border-slate-700 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    API Key فعلی: <span className="font-mono">••••-••••-••••</span>
                  </span>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-800 text-xs text-slate-100 px-2 py-1 hover:bg-slate-700"
                  >
                    تولید کلید جدید
                  </button>
                </div>
                <ul className={`text-xs leading-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <li>• اتصال این UI به بک‌اند صدور/ابطال کلید</li>
                  <li>• نمایش لاگ مصرف و محدودیت هر پلن</li>
                  <li>• پیاده‌سازی پرداخت آنلاین برای خرید پلن</li>
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;