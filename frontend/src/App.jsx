import { useState, useEffect } from 'react';
import axios from 'axios';

// دیکشنری نام‌ها
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

// آیکون‌ها
const IconSun = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4.93 4.93 6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.66 17.66l1.41 1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M2 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 12h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4.93 19.07l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const IconMoon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M21 13.2A7.8 7.8 0 0 1 10.8 3a6.6 6.6 0 1 0 10.2 10.2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

function App() {
  // --- State: Prices ---
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State: Plans ---
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  // --- State: Purchase ---
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [issuedKey, setIssuedKey] = useState(null);

  // --- State: Self Service ---
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selfLoading, setSelfLoading] = useState(false);
  const [selfError, setSelfError] = useState(null);
  const [selfUsage, setSelfUsage] = useState(null);

  // --- State: UI ---
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });
  const [activeTab, setActiveTab] = useState('rates');

  // --- Theme Effect ---
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Helper: Format Price (Fixes NaN issue) ---
  const formatPrice = (price) => {
    if (!price) return "---";
    // حذف کاماها قبل از تبدیل به عدد
    const cleanNumber = price.toString().replace(/,/g, '');
    const num = Number(cleanNumber);
    return isNaN(num) ? price : num.toLocaleString();
  };

  // --- Fetch Prices ---
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // اصلاح آدرس به /api/prices
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

  // --- Fetch Plans ---
  useEffect(() => {
    if (activeTab !== 'api') return;

    const fetchPlans = async () => {
      setPlansLoading(true);
      setPlansError(null);
      try {
        const res = await axios.get('/api/plans');
        setPlans(res.data?.plans ?? []);
      } catch (err) {
        console.error('Plans error:', err);
        setPlansError('خطا در دریافت پلن‌ها.');
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, [activeTab]);

  // --- Handlers ---
  const purchasePlan = async (planSlug) => {
    setIssuedKey(null);
    setPurchaseError(null);
    
    if (!purchaseEmail || !purchaseEmail.includes('@')) {
      setPurchaseError('ایمیل معتبر وارد کنید.');
      return;
    }
    setPurchaseLoading(true);
    try {
      const res = await axios.post('/api/purchase', { email: purchaseEmail, plan_slug: planSlug });
      setIssuedKey(res.data);
      setApiKeyInput(res.data?.api_key ?? '');
    } catch (err) {
      console.error('Purchase error:', err);
      setPurchaseError('خطا در صدور کلید.');
    } finally {
      setPurchaseLoading(false);
    }
  };

  const fetchSelfUsage = async () => {
    setSelfLoading(true);
    setSelfError(null);
    setSelfUsage(null);
    try {
      const res = await axios.get('/api/self/usage', { headers: { 'x-api-key': apiKeyInput } });
      setSelfUsage(res.data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) setSelfError('کلید API نامعتبر است.');
      else if (status === 429) setSelfError('سقف مصرف پلن شما پر شده است.');
      else setSelfError('خطا در دریافت اطلاعات مصرف.');
    } finally {
      setSelfLoading(false);
    }
  };

  const rotateSelfKey = async () => {
    setSelfLoading(true);
    setSelfError(null);
    try {
      const res = await axios.post('/api/self/rotate', {}, { headers: { 'x-api-key': apiKeyInput } });
      setIssuedKey(res.data);
      setApiKeyInput(res.data?.api_key ?? '');
      setSelfUsage(null);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) setSelfError('کلید API نامعتبر است.');
      else setSelfError('تعویض کلید انجام نشد.');
    } finally {
      setSelfLoading(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50" dir="rtl">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-slate-200/70 bg-white/70 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-950/50">
            
            {/* Header */}
            <header className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 border-b border-slate-200/70 dark:border-slate-800">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">پنل Bonbast API</h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  نرخ‌های لحظه‌ای + مدیریت پلن‌ها و کلید API
                </p>
                {lastUpdated && (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>بروزرسانی:</span>
                    <span className="font-mono" dir="ltr">{lastUpdated}</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
              >
                {isDark ? <IconSun className="h-4 w-4 text-amber-400" /> : <IconMoon className="h-4 w-4 text-slate-700" />}
                <span>{isDark ? 'تم روشن' : 'تم تیره'}</span>
              </button>
            </header>

            <div className="p-6 sm:p-8">
              {/* Tabs */}
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setActiveTab('rates')}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === 'rates'
                      ? 'border-teal-500/50 bg-teal-500 text-white shadow-sm shadow-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30'
                  }`}
                >
                  نرخ‌های لحظه‌ای
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === 'api'
                      ? 'border-teal-500/50 bg-teal-500 text-white shadow-sm shadow-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30'
                  }`}
                >
                  فروش و مدیریت API
                </button>
              </div>

              {/* Tab Content: Rates */}
              {activeTab === 'rates' && (
                <div className="space-y-5">
                  {loading && <p className="text-center animate-pulse">در حال دریافت نرخ‌ها...</p>}
                  {error && (
                    <div className="rounded-2xl border border-red-500/50 bg-red-50 p-4 text-red-700 dark:bg-red-950/30 dark:text-red-200 text-center">
                      {error}
                    </div>
                  )}

                  {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.keys(persianNames).map((key) => {
                        const price = prices[key];
                        if (!price || price === "N/A") return null;

                        return (
                          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900/30 flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{persianNames[key]}</span>
                            <span className="text-lg font-mono font-bold text-teal-500">
                                {formatPrice(price)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content: API */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  {/* Purchase Section */}
                  <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                        <h3 className="font-semibold mb-4">خرید اشتراک (Demo)</h3>
                        <div className="mb-4">
                            <label className="text-xs text-slate-500">ایمیل خود را وارد کنید:</label>
                            <input
                                value={purchaseEmail}
                                onChange={(e) => setPurchaseEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950/40"
                                dir="ltr"
                            />
                            {purchaseError && <p className="text-xs text-red-500 mt-1">{purchaseError}</p>}
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                            {plansLoading && <p className="text-xs">لودینگ...</p>}
                            {!plansLoading && plans.map((plan) => (
                                <div key={plan.slug} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700 flex flex-col justify-between">
                                    <div>
                                        <p className="font-bold">{plan.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">سقف: {Number(plan.monthly_quota).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => purchasePlan(plan.slug)}
                                        disabled={purchaseLoading}
                                        className="mt-3 w-full rounded-lg bg-teal-500 py-2 text-xs font-bold text-white hover:bg-teal-600 disabled:opacity-50"
                                    >
                                        انتخاب
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Self Serve Section */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                        <h3 className="font-semibold mb-4">مدیریت کلید</h3>
                        <input
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            placeholder="API Key..."
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:border-teal-500 dark:border-slate-800 dark:bg-slate-950/40"
                            dir="ltr"
                        />
                        <div className="flex gap-2 mt-3">
                            <button onClick={fetchSelfUsage} disabled={selfLoading} className="flex-1 rounded-lg bg-slate-800 py-2 text-xs text-white">مشاهده مصرف</button>
                            <button onClick={rotateSelfKey} disabled={selfLoading} className="flex-1 rounded-lg bg-teal-600 py-2 text-xs text-white">تعویض کلید</button>
                        </div>
                        {selfError && <p className="text-xs text-red-500 mt-2">{selfError}</p>}
                        
                        {selfUsage && (
                            <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                                <p>پلن: {selfUsage.plan?.name}</p>
                                <p>مصرف: {selfUsage.request_count} / {selfUsage.monthly_quota}</p>
                            </div>
                        )}
                        
                        {issuedKey && (
                            <div className="mt-3 p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-500/20 text-xs">
                                <p className="font-bold text-green-700 dark:text-green-400">کلید جدید شما:</p>
                                <p className="font-mono mt-1 break-all select-all">{issuedKey.api_key}</p>
                            </div>
                        )}
                    </section>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;