import { useState, useEffect } from 'react';
import { Bitcoin, Coin, Danger, DollarCircle, Refresh, SearchNormal1, TrendUp } from 'iconsax-react';
import { Header } from '../components/Header';
import { CurrencyCard } from '../components/CurrencyCard';
import { StatCard } from '../components/StatCard';
import { Input } from '../components/ui/input';
import { currencies, categories } from '../data/currencies';
import { ApiResponse, CurrencyData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { language } = useLanguage();
  const isFa = language === 'fa';
  const [data, setData] = useState<CurrencyData | null>(null);
  const [previousData, setPreviousData] = useState<CurrencyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async (showRefreshingAnimation = false) => {
    try {
      if (showRefreshingAnimation) {
        setIsRefreshing(true);
      }
      
      // Website-connected API (served via nginx proxy: /api -> backend)
      const response = await fetch('/api/prices');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      if (result.status === 'Success' && result.data) {
        setPreviousData(data);
        setData(result.data);
        setLastUpdated(result.last_updated);
        setError(null);
      } else {
        console.error('Invalid response format:', result);
        setError(isFa ? 'خطا در دریافت اطلاعات - فرمت نامعتبر' : 'Invalid response format.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(isFa ? `خطا در اتصال به سرور: ${message}` : `Server connection failed: ${message}`);
    } finally {
      setLoading(false);
      if (showRefreshingAnimation) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      fetchData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchData(true);
  };

  const filteredCurrencies = currencies.filter((currency) => {
    const name = isFa ? currency.nameFa : currency.nameEn;
    const matchesSearch =
      name.includes(searchTerm) ||
      currency.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || currency.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading && !data) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">{isFa ? 'در حال بارگذاری...' : 'Loading...'}</p>
          </div>
        </div>
      </>
    );
  }

  if (error && !data) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 text-destructive">
              <Danger size={32} variant="Bold" color="currentColor" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">{isFa ? 'خطا در بارگذاری' : 'Failed to load'}</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchData();
              }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {isFa ? 'تلاش مجدد' : 'Try again'}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Header lastUpdated={lastUpdated} />

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {/* Stats Section */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarCircle}
              label={isFa ? 'دلار آمریکا' : 'US Dollar'}
              value={`${parseFloat(data.usd.replace(/,/g, '')).toLocaleString(isFa ? 'fa-IR' : 'en-US')} ${
                isFa ? 'تومان' : 'Toman'
              }`}
              color="bg-blue-50 text-blue-600"
            />
            <StatCard
              icon={TrendUp}
              label={isFa ? 'یورو' : 'Euro'}
              value={`${parseFloat(data.eur.replace(/,/g, '')).toLocaleString(isFa ? 'fa-IR' : 'en-US')} ${
                isFa ? 'تومان' : 'Toman'
              }`}
              color="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              icon={Coin}
              label={isFa ? 'سکه تمام' : 'Azadi Coin'}
              value={`${parseFloat(data.coin_azadi.replace(/,/g, '')).toLocaleString(isFa ? 'fa-IR' : 'en-US')} ${
                isFa ? 'تومان' : 'Toman'
              }`}
              color="bg-orange-50 text-orange-600"
            />
            <StatCard
              icon={Bitcoin}
              label={isFa ? 'بیت کوین' : 'Bitcoin'}
              value={`$${data.bitcoin}`}
              color="bg-purple-50 text-purple-600"
            />
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-[#e9e9e7] p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <span
                className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
                  isFa ? 'right-3' : 'left-3'
                }`}
              >
                <SearchNormal1 size={16} variant="Outline" color="currentColor" />
              </span>
              <Input
                type="text"
                placeholder={isFa ? 'جستجو در ارزها...' : 'Search currencies...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`h-9 ${isFa ? 'pr-10 pl-3' : 'pl-10 pr-3'} border-[#e9e9e7] rounded-md text-sm`}
              />
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex h-9 items-center gap-1.5 bg-[#191919] text-white px-4 rounded-md hover:bg-[#2f2f2f] transition-all disabled:opacity-50 text-sm font-medium"
            >
              <span className={isRefreshing ? 'animate-spin' : ''}>
                <Refresh size={16} variant="Bold" color="currentColor" />
              </span>
              <span>{isFa ? 'به‌روزرسانی' : 'Refresh'}</span>
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1.5 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-[#191919] text-white'
                    : 'bg-[#f7f6f3] text-[#37352f] hover:bg-[#e9e9e7]'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span>{isFa ? category.nameFa : category.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Grid */}
        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredCurrencies.map((currency) => (
                <CurrencyCard
                  key={currency.key}
                  currency={currency}
                  price={data[currency.key]}
                  previousPrice={previousData?.[currency.key]}
                />
              ))}
            </div>

            {filteredCurrencies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">
                  {isFa ? 'نتیجه‌ای یافت نشد' : 'No results found.'}
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-8 bg-white rounded-lg border border-[#e9e9e7] p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-medium mb-1.5 text-sm">
                {isFa ? '🔄 به‌روزرسانی خودکار' : '🔄 Auto refresh'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isFa
                  ? 'قیمت‌ها هر ۳۰ ثانیه به‌طور خودکار به‌روز می‌شوند'
                  : 'Rates refresh automatically every 30 seconds.'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1.5 text-sm">
                {isFa ? '📊 داده‌های دقیق' : '📊 Accurate data'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isFa
                  ? 'اطلاعات از منابع معتبر بازار ارز و طلا'
                  : 'Aggregated from trusted FX and gold sources.'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1.5 text-sm">
                {isFa ? '⚡ سرعت بالا' : '⚡ Fast performance'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isFa
                  ? 'نمایش سریع و بهینه قیمت‌ها در لحظه'
                  : 'Optimized to deliver prices instantly.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
