import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { SearchNormal1, DollarCircle, Chart, Coin1, Bitcoin, RefreshCircle, Warning2 } from 'iconsax-react';
import { Header } from '../components/Header';
import { CurrencyCard } from '../components/CurrencyCard';
import { StatCard } from '../components/StatCard';
import { currencies, categories } from '../data/currencies';
import { ApiResponse, CurrencyData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG, apiClient } from '../config/api';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [data, setData] = useState<CurrencyData | null>(null);
  const [previousData, setPreviousData] = useState<CurrencyData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchData = async (showRefreshingAnimation = false) => {
    try {
      if (showRefreshingAnimation) {
        setIsRefreshing(true);
      }
      
      const result: ApiResponse = await apiClient.get(API_CONFIG.ENDPOINTS.PRICES);
      
      if (result.status === 'Success' && result.data) {
        setPreviousData(data);
        setData(result.data);
        setLastUpdated(result.last_updated);
        setError(null);
      } else {
        setError('خطا در دریافت اطلاعات - فرمت نامعتبر');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(`خطا در اتصال به سرور: ${err.message}`);
    } finally {
      setLoading(false);
      if (showRefreshingAnimation) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), API_CONFIG.REFRESH_INTERVAL);
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
        <Header user={user} onLogout={handleLogout} />
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
        <Header user={user} onLogout={handleLogout} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Warning2 size={40} className="text-destructive" variant="Bold" />
            </div>
            <h2 className="text-2xl font-bold mb-3">خطا در بارگذاری</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchData();
              }}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header lastUpdated={lastUpdated} user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            قیمت لحظه‌ای ارز، طلا و ارز دیجیتال
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            دسترسی آسان و سریع به قیمت‌های به‌روز بازار با API قدرتمند
          </p>
        </div>

        {/* Stats Section */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={DollarCircle}
              label="دلار آمریکا"
              value={`${parseFloat(data.usd.replace(/,/g, '')).toLocaleString('fa-IR')} تومان`}
              color="bg-notion-blue/20 text-notion-blue"
            />
            <StatCard
              icon={Chart}
              label="یورو"
              value={`${parseFloat(data.eur.replace(/,/g, '')).toLocaleString('fa-IR')} تومان`}
              color="bg-notion-green/20 text-notion-green"
            />
            <StatCard
              icon={Coin1}
              label="سکه تمام"
              value={`${parseFloat(data.coin_azadi.replace(/,/g, '')).toLocaleString('fa-IR')} تومان`}
              color="bg-notion-orange/20 text-notion-orange"
            />
            <StatCard
              icon={Bitcoin}
              label="بیت کوین"
              value={`$${data.bitcoin}`}
              color="bg-notion-purple/20 text-notion-purple"
            />
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <SearchNormal1 className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="جستجو در ارزها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/30"
            >
              <RefreshCircle className={`${isRefreshing ? 'animate-spin' : ''}`} size={20} />
              <span>به‌روزرسانی</span>
            </button>
          </div>

          <div className="flex gap-3 flex-wrap mt-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-medium ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                    : 'bg-secondary hover:bg-accent text-foreground'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
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
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <SearchNormal1 size={40} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg">
                  نتیجه‌ای یافت نشد
                </p>
              </div>
            )}
          </>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all">
            <div className="w-16 h-16 bg-notion-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RefreshCircle size={32} className="text-notion-blue" variant="Bold" />
            </div>
            <h4 className="font-bold text-lg mb-2">به‌روزرسانی خودکار</h4>
            <p className="text-sm text-muted-foreground">
              قیمت‌ها هر ۳۰ ثانیه به‌طور خودکار به‌روز می‌شوند
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all">
            <div className="w-16 h-16 bg-notion-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Chart size={32} className="text-notion-green" variant="Bold" />
            </div>
            <h4 className="font-bold text-lg mb-2">داده‌های دقیق</h4>
            <p className="text-sm text-muted-foreground">
              اطلاعات از منابع معتبر بازار ارز و طلا
            </p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-all">
            <div className="w-16 h-16 bg-notion-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bitcoin size={32} className="text-notion-purple" variant="Bold" />
            </div>
            <h4 className="font-bold text-lg mb-2">سرعت بالا</h4>
            <p className="text-sm text-muted-foreground">
              نمایش سریع و بهینه قیمت‌ها در لحظه
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
