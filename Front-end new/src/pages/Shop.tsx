import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { ArrowRight, TickCircle, Activity, Flash } from 'iconsax-react';
import { useAuth } from '../contexts/AuthContext';
import { apiCall, API_CONFIG } from '../config/api';
import type { Plan } from '../types';

export default function Shop() {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await apiCall(API_CONFIG.ENDPOINTS.PLANS);
      
      if (!response.ok) {
        throw new Error('Failed to load plans');
      }

      const data = await response.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error('Load plans error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (planSlug: string) => {
    if (!user || !session) {
      navigate('/login');
      return;
    }

    setPurchasing(planSlug);

    try {
      const response = await apiCall(
        API_CONFIG.ENDPOINTS.PURCHASE,
        {
          method: 'POST',
          body: JSON.stringify({ plan_slug: planSlug }),
        },
        session.access_token
      );

      if (!response.ok) {
        throw new Error('Purchase failed');
      }

      // Success! Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Purchase error:', err);
      alert('خطا در خرید. لطفاً دوباره تلاش کنید.');
    } finally {
      setPurchasing(null);
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'all': return 'همه داده‌ها';
      case 'currency': return 'ارزها';
      case 'crypto': return 'ارز دیجیتال';
      case 'gold': return 'طلا و سکه';
      default: return scope;
    }
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'all': return '🌐';
      case 'currency': return '💵';
      case 'crypto': return '₿';
      case 'gold': return '🥇';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری پلن‌ها...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white rounded-lg transition-all"
            >
              <ArrowRight size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#37352f]">پلن‌های API</h1>
              <p className="text-gray-600 mt-1">پلن مناسب خود را انتخاب کنید</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isPopular = plan.slug.includes('business');
            
            return (
              <div
                key={plan.slug}
                className={`bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition-all ${
                  isPopular ? 'border-blue-500 shadow-md' : 'border-gray-200'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-bold">
                    محبوب‌ترین
                  </div>
                )}

                <div className="p-6">
                  {/* Icon & Scope */}
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">{getScopeIcon(plan.scope)}</div>
                    <h3 className="text-xl font-bold text-[#37352f] mb-1">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{getScopeLabel(plan.scope)}</p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    {plan.price_irr === 0 ? (
                      <div>
                        <p className="text-4xl font-bold text-green-600">رایگان</p>
                        <p className="text-sm text-gray-600 mt-1">برای همیشه</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-4xl font-bold text-[#37352f]">
                          {plan.price_irr.toLocaleString('fa-IR')}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">تومان / ماهانه</p>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <TickCircle size={18} className="text-green-600" variant="Bold" />
                      <span>{plan.monthly_quota.toLocaleString('fa-IR')} درخواست/ماه</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Flash size={18} className="text-blue-600" variant="Bold" />
                      <span>{plan.rpm_limit} درخواست/دقیقه</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Activity size={18} className="text-purple-600" variant="Bold" />
                      <span>به‌روزرسانی لحظه‌ای</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={() => handlePurchase(plan.slug)}
                    disabled={purchasing === plan.slug}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      isPopular
                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {purchasing === plan.slug ? 'در حال خرید...' : plan.price_irr === 0 ? 'شروع رایگان' : 'خرید پلن'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-2xl p-10 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-semibold mb-3 text-lg text-[#37352f]">سرعت بالا</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                دریافت داده‌ها با کمترین تاخیر ممکن
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="font-semibold mb-3 text-lg text-[#37352f]">امنیت بالا</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                احراز هویت با API Key و رمزنگاری SSL
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h4 className="font-semibold mb-3 text-lg text-[#37352f]">داده دقیق</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                قیمت‌های به‌روز از منابع معتبر بازار
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
