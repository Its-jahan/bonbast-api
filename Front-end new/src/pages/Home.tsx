import { useState, useEffect } from 'react';
import { Search, DollarSign, TrendingUp, Coins, Bitcoin, RefreshCw, AlertCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { CurrencyCard } from '../components/CurrencyCard';
import { StatCard } from '../components/StatCard';
import { currencies, categories } from '../data/currencies';
import { ApiResponse, CurrencyData } from '../types';

export default function Home() {
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
        setError('خطا در دریافت اطلاعات - فرمت نامعتبر');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`خطا در اتصال به سرور: ${message}`);
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
    const matchesSearch = currency.name.includes(searchTerm) || 
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
            <p className="text-muted-foreground">در حال بارگذاری...</p>
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
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchData();
              }}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header lastUpdated={lastUpdated} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarSign}
              label="دلار آمریکا"
              value={`${parseFloat(data.usd.replace(/,/g, '')).toLocaleString('fa-IR')} تومان`}
              color="bg-blue-100 text-blue-600"
            />
            <StatCard
              icon={TrendingUp}
              label="یورو"
              value={`${parseFloat(data.eur.replace(/,/g, '')).toLocaleString('fa-IR')} تومان`}
              color="bg-green-100 text-green-600"
            />
            <StatCard
              icon={Coins}
              label="سکه تمام"
              value={`${parseFloat(data.coin_azadi.replace(/,/g, '')).toLocaleString('fa-IR')} تومان`}
              color="bg-orange-100 text-orange-600"
            />
            <StatCard
              icon={Bitcoin}
              label="بیت کوین"
              value={`$${data.bitcoin}`}
              color="bg-purple-100 text-purple-600"
            />
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-border p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="جستجو در ارزها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>به‌روزرسانی</span>
            </button>
          </div>

          <div className="flex gap-3 flex-wrap mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Grid */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                <p className="text-muted-foreground text-lg">
                  نتیجه‌ای یافت نشد
                </p>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-white rounded-xl border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-bold mb-2">🔄 به‌روزرسانی خودکار</h4>
              <p className="text-sm text-muted-foreground">
                قیمت‌ها هر ۳۰ ثانیه به‌طور خودکار به‌روز می‌شوند
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">📊 داده‌های دقیق</h4>
              <p className="text-sm text-muted-foreground">
                اطلاعات از منابع معتبر بازار ارز و طلا
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2">⚡ سرعت بالا</h4>
              <p className="text-sm text-muted-foreground">
                نمایش سریع و بهینه قیمت‌ها در لحظه
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
