import { useState, useEffect } from 'react';
import axios from 'axios';

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

const IconSun = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
      stroke="currentColor"
      strokeWidth="2"
    />
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
    <path
      d="M21 13.2A7.8 7.8 0 0 1 10.8 3a6.6 6.6 0 1 0 10.2 10.2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

function App() {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState(null);

  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [issuedKey, setIssuedKey] = useState(null);

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [selfLoading, setSelfLoading] = useState(false);
  const [selfError, setSelfError] = useState(null);
  const [selfUsage, setSelfUsage] = useState(null);

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
const response = await axios.get('/prices');
        
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
        setPlansError('خطا در دریافت پلن‌ها. لطفا بک‌اند را بررسی کنید.');
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, [activeTab]);

  const purchasePlan = async (planSlug) => {
    setIssuedKey(null);
    setPurchaseError(null);
    setSelfUsage(null);
    setSelfError(null);

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
      setPurchaseError('صدور کلید انجام نشد. لاگ‌های بک‌اند را بررسی کنید.');
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
      console.error('Self usage error:', err);
      const status = err?.response?.status;
      if (status === 401) setSelfError('کلید API نامعتبر است.');
      else if (status === 429) setSelfError('سقف مصرف پلن شما پر شده است.');
      else setSelfError('خطا در دریافت مصرف.');
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
      console.error('Rotate error:', err);
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
            <header className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 border-b border-slate-200/70 dark:border-slate-800">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  پنل Bonbast API
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  نرخ‌های لحظه‌ای + مدیریت پلن‌ها و کلید API (نسخه MVP).
                </p>
                {lastUpdated && (
                  <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>آخرین بروزرسانی:</span>
                    <span className="font-mono" dir="ltr">{lastUpdated}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900"
                >
                  {isDark ? (
                    <IconSun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <IconMoon className="h-4 w-4 text-slate-700" />
                  )}
                  <span>{isDark ? 'تم روشن' : 'تم تیره'}</span>
                </button>
              </div>
            </header>

            <div className="p-6 sm:p-8">
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('rates')}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === 'rates'
                      ? 'border-teal-500/50 bg-teal-500 text-white shadow-sm shadow-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/60'
                  }`}
                >
                  نرخ‌های لحظه‌ای
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('api')}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === 'api'
                      ? 'border-teal-500/50 bg-teal-500 text-white shadow-sm shadow-teal-500/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-900/60'
                  }`}
                >
                  فروش و مدیریت API
                </button>
              </div>

              {activeTab === 'rates' && (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                    <h2 className="text-lg font-bold">نرخ‌های لحظه‌ای</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      از مسیر <span className="font-mono" dir="ltr">/api/prices</span> دریافت می‌شود.
                    </p>
                  </div>

                  {loading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <p className="text-sm animate-pulse">در حال دریافت نرخ‌ها...</p>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-2xl border border-red-500/50 bg-red-50 p-4 text-red-700 dark:bg-red-950/30 dark:text-red-200">
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
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/30"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {persianNames[key]}
                              </span>
                              <span className="text-lg font-mono font-bold text-teal-500">
                                {Number(price).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                    <h2 className="text-lg font-bold">فروش و مدیریت API</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      صدور کلید (Demo) + نمایش مصرف + تعویض کلید. اندپوینت پولی:
                      <span className="mx-1 font-mono" dir="ltr">/api/v1/prices</span>
                    </p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h3 className="font-semibold">پلن‌ها</h3>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            ایمیل را وارد کنید و یکی از پلن‌ها را انتخاب کنید.
                          </p>
                        </div>
                        <div className="min-w-[240px]">
                          <label className="text-xs text-slate-600 dark:text-slate-300">ایمیل</label>
                          <input
                            value={purchaseEmail}
                            onChange={(e) => setPurchaseEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500/70 dark:border-slate-800 dark:bg-slate-950/40"
                            dir="ltr"
                          />
                          {purchaseError && <p className="mt-1 text-xs text-red-500">{purchaseError}</p>}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {plansLoading && (
                          <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/30">
                            <p className="animate-pulse">در حال دریافت پلن‌ها...</p>
                          </div>
                        )}
                        {plansError && (
                          <div className="md:col-span-3 rounded-2xl border border-red-500/50 bg-red-50 p-4 text-red-700 dark:bg-red-950/30 dark:text-red-200">
                            {plansError}
                          </div>
                        )}
                        {!plansLoading && !plansError && plans.map((plan) => (
                          <div
                            key={plan.slug}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/20"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold">{plan.name}</p>
                                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                                  سقف ماهانه: <span className="font-mono">{Number(plan.monthly_quota).toLocaleString()}</span>
                                </p>
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                                  RPM: <span className="font-mono">{Number(plan.rpm_limit).toLocaleString()}</span>
                                </p>
                              </div>
                              <span className="shrink-0 rounded-full bg-teal-500/15 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300">
                                {plan.slug}
                              </span>
                            </div>
                            <button
                              type="button"
                              disabled={purchaseLoading}
                              onClick={() => purchasePlan(plan.slug)}
                              className={`mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                purchaseLoading
                                  ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                                  : 'bg-teal-500 text-white hover:bg-teal-600'
                              }`}
                            >
                              {purchaseLoading ? 'در حال صدور...' : 'صدور کلید (Demo)'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                      <h3 className="font-semibold">مدیریت کلید (Self-serve)</h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        کلید را وارد کنید و مصرف را ببینید یا کلید را بچرخانید.
                      </p>

                      <label className="mt-4 block text-xs text-slate-600 dark:text-slate-300">API Key</label>
                      <input
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        placeholder="bb_..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-mono outline-none transition focus:border-teal-500/70 dark:border-slate-800 dark:bg-slate-950/40"
                        dir="ltr"
                      />

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={selfLoading || !apiKeyInput}
                          onClick={fetchSelfUsage}
                          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                            selfLoading || !apiKeyInput
                              ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700'
                          }`}
                        >
                          {selfLoading ? '...' : 'نمایش مصرف'}
                        </button>
                        <button
                          type="button"
                          disabled={selfLoading || !apiKeyInput}
                          onClick={rotateSelfKey}
                          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                            selfLoading || !apiKeyInput
                              ? 'cursor-not-allowed bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                              : 'bg-teal-500 text-white hover:bg-teal-600'
                          }`}
                        >
                          {selfLoading ? '...' : 'تعویض کلید'}
                        </button>
                      </div>

                      {selfError && <p className="mt-2 text-xs text-red-500">{selfError}</p>}

                      {selfUsage && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-950/30">
                          <p className="text-slate-700 dark:text-slate-200">
                            پلن: <span className="font-semibold">{selfUsage.plan?.name}</span>
                          </p>
                          <p className="mt-1 text-slate-600 dark:text-slate-300">
                            ماه: <span className="font-mono" dir="ltr">{selfUsage.month}</span>
                          </p>
                          <p className="mt-1 text-slate-600 dark:text-slate-300">
                            مصرف: <span className="font-mono">{Number(selfUsage.request_count).toLocaleString()}</span> /{' '}
                            <span className="font-mono">{Number(selfUsage.monthly_quota).toLocaleString()}</span>
                          </p>
                        </div>
                      )}

                      {issuedKey?.api_key && (
                        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/30">
                          <p className="text-sm font-semibold">کلید صادر شده</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono break-all dark:border-slate-800 dark:bg-slate-950/40" dir="ltr">
                              {issuedKey.api_key}
                            </span>
                            <button
                              type="button"
                              onClick={() => navigator.clipboard?.writeText(issuedKey.api_key)}
                              className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
                            >
                              کپی
                            </button>
                          </div>
                        </div>
                      )}
                    </section>
                  </div>

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/30">
                    <h3 className="font-semibold mb-2">نمونه درخواست</h3>
                    <pre className="rounded-2xl bg-slate-950 p-4 text-xs leading-relaxed text-slate-100 overflow-x-auto">
{`GET https://your-domain.com/api/v1/prices
x-api-key: YOUR_API_KEY`}
                    </pre>
                  </section>
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
