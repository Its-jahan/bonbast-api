import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://localhost:5001/prices');
        setPrices(response.data.data);
        setLastUpdated(response.data.last_updated);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات. لطفا از اجرای بک‌اند مطمئن شوید و صفحه را رفرش کنید.');
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400">قیمت‌های لحظه‌ای بن‌بست</h1>
          {lastUpdated && <p className="text-gray-400 mt-2">آخرین بروزرسانی: {lastUpdated}</p>}
        </header>

        {loading && <p className="text-center text-lg">در حال بارگذاری...</p>}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(persianNames).map((key) => (
              prices[key] && prices[key] !== "N/A" && (
                <div key={key} className="bg-gray-800 rounded-lg p-4 flex justify-between items-center shadow-md hover:bg-gray-700 transition-colors">
                  <span className="text-lg text-gray-300">{persianNames[key]}</span>
                  <span className="text-xl font-mono font-bold text-teal-300">{prices[key]}</span>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
