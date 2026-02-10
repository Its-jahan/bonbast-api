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

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // تغییر مهم: استفاده از متد get به جای fetch
        const response = await axios.get('/api/prices');
        
        // چک کردن اینکه دیتا وجود داشته باشد
        if (response.data && response.data.data) {
            setPrices(response.data.data);
            setLastUpdated(response.data.last_updated);
            setError(null); // پاک کردن ارور در صورت موفقیت
        }
      } catch (err) {
        console.error("Error details:", err);
        setError('خطا در دریافت اطلاعات. لطفا از اجرای بک‌اند مطمئن شوید.');
      } finally {
        setLoading(false);
      }
    };

    // بار اول اجرا شود
    fetchPrices();

    // هر ۶۰ ثانیه یکبار آپدیت شود
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    // اضافه کردن dir="rtl" برای راست‌چین شدن صحیح
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-teal-400 mb-2">قیمت‌های لحظه‌ای بازار</h1>
          {lastUpdated && <p className="text-gray-400 text-sm dir-ltr">Last Update: {lastUpdated}</p>}
        </header>

        {loading && <p className="text-center text-lg animate-pulse">در حال دریافت نرخ‌ها...</p>}
        
        {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-4 rounded-lg text-center mb-6">
                {error}
            </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(persianNames).map((key) => {
              const price = prices[key];
              // فقط اگر قیمت وجود داشت و N/A نبود نمایش بده
              if (!price || price === "N/A") return null;

              return (
                <div key={key} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center shadow-lg hover:bg-gray-700 hover:border-teal-500/30 transition-all duration-300">
                  <span className="text-gray-300 font-medium">{persianNames[key]}</span>
                  <span className="text-xl font-mono font-bold text-teal-300 tracking-wider">
                    {price.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;