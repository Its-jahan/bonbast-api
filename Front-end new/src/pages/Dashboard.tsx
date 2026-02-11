import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Copy, TickCircle, Key, Link2, Calendar, Activity, ArrowRight, Refresh } from 'iconsax-react';
import { Header } from '../components/Header';
import { RequestCounter } from '../components/RequestCounter';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../config/api';
import type { UserSubscription } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleLogout = () => {
    // Logout handled by Header component
    navigate('/');
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      loadSubscriptions();
    }
  }, [user, authLoading, navigate]);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      
      // TODO: Connect to your backend API
      // const response = await fetch('YOUR_BACKEND_URL/subscriptions', {
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      // const data = await response.json();
      // setSubscriptions(data.subscriptions);
      
      // Demo: Load from localStorage
      const allSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const userSubs = allSubscriptions.filter((sub: UserSubscription) => sub.userId === user?.id);
      setSubscriptions(userSubs);
    } catch (err) {
      console.error('Load subscriptions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const simulateApiCall = async (subscriptionId: string) => {
    try {
      // TODO: Connect to your backend API
      // await fetch(`YOUR_BACKEND_URL/subscriptions/${subscriptionId}/usage`, {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${accessToken}` }
      // });
      
      // Demo: Update usage locally
      const allSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      const updatedSubs = allSubscriptions.map((sub: UserSubscription) => {
        if (sub.id === subscriptionId) {
          return {
            ...sub,
            usedRequests: Math.min(sub.usedRequests + 1, sub.monthlyLimit),
          };
        }
        return sub;
      });
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubs));
      
      await loadSubscriptions();
    } catch (err) {
      console.error('Update usage error:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header user={user} onLogout={handleLogout} />
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">در حال بارگذاری...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-accent rounded-lg transition-all"
              >
                <ArrowRight size={20} />
              </button>
              <div>
                <h1 className="text-4xl font-bold gradient-text">داشبورد</h1>
                <p className="text-muted-foreground mt-1">مدیریت API Keys و آمار مصرف</p>
              </div>
            </div>
            <button
              onClick={loadSubscriptions}
              className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg hover:bg-accent transition-all"
            >
              <Refresh size={18} />
              <span>به‌روزرسانی</span>
            </button>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Key size={48} className="text-muted-foreground" variant="Bold" />
            </div>
            <h2 className="text-2xl font-bold mb-3">هنوز API نخریده‌اید</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              برای شروع، یکی از پلن‌های API را از فروشگاه خریداری کنید
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              مشاهده فروشگاه
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-xl"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/20 to-notion-purple/20 p-6 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{subscription.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {subscription.price.toLocaleString('fa-IR')} تومان / ماهانه
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-success/20 text-success rounded-xl text-sm font-bold">
                      <TickCircle size={18} variant="Bold" />
                      <span>فعال</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - API Details */}
                    <div className="space-y-6">
                      {/* Secret Key */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <Key size={16} />
                          Secret Key
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 font-mono text-sm break-all">
                            {subscription.secretKey}
                          </div>
                          <button
                            onClick={() => handleCopy(subscription.secretKey, `key-${subscription.id}`)}
                            className="px-4 bg-secondary hover:bg-accent border border-border rounded-xl transition-all"
                          >
                            {copiedKey === `key-${subscription.id}` ? (
                              <TickCircle size={20} className="text-success" variant="Bold" />
                            ) : (
                              <Copy size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Request URL */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <Link2 size={16} />
                          Request URL
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 font-mono text-sm break-all">
                            {subscription.requestUrl}
                          </div>
                          <button
                            onClick={() => handleCopy(subscription.requestUrl, `url-${subscription.id}`)}
                            className="px-4 bg-secondary hover:bg-accent border border-border rounded-xl transition-all"
                          >
                            {copiedKey === `url-${subscription.id}` ? (
                              <TickCircle size={20} className="text-success" variant="Bold" />
                            ) : (
                              <Copy size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Reset Date */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                          <Calendar size={16} />
                          تاریخ ریست
                        </label>
                        <div className="bg-secondary border border-border rounded-xl px-4 py-3 text-sm">
                          {new Date(subscription.resetDate).toLocaleDateString('fa-IR')}
                        </div>
                      </div>

                      {/* Test Button */}
                      <button
                        onClick={() => simulateApiCall(subscription.id)}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium"
                      >
                        تست فراخوانی API
                      </button>
                    </div>

                    {/* Right Column - Usage Stats */}
                    <div className="space-y-6">
                      {/* Request Counter */}
                      <div className="bg-secondary/50 border border-border rounded-xl p-6">
                        <RequestCounter
                          used={subscription.usedRequests}
                          total={subscription.monthlyLimit}
                        />
                      </div>

                      {/* Additional Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-notion-blue/10 border border-notion-blue/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity size={18} className="text-notion-blue" />
                            <p className="text-xs text-muted-foreground">استفاده امروز</p>
                          </div>
                          <p className="text-2xl font-bold text-notion-blue">
                            {Math.floor(Math.random() * 50)}
                          </p>
                        </div>

                        <div className="bg-notion-green/10 border border-notion-green/30 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity size={18} className="text-notion-green" />
                            <p className="text-xs text-muted-foreground">میانگین روزانه</p>
                          </div>
                          <p className="text-2xl font-bold text-notion-green">
                            {Math.floor(subscription.usedRequests / 30)}
                          </p>
                        </div>
                      </div>

                      {/* API Type Badge */}
                      <div className="bg-gradient-to-br from-primary/20 to-notion-purple/20 border border-primary/30 rounded-xl p-6 text-center">
                        <p className="text-sm text-muted-foreground mb-2">نوع API</p>
                        <p className="text-2xl font-bold">
                          {subscription.apiType === 'all' ? 'همه داده‌ها' : 
                           subscription.apiType === 'currencies' ? 'ارزها' :
                           subscription.apiType === 'gold' ? 'طلا و سکه' :
                           subscription.apiType === 'crypto' ? 'ارز دیجیتال' : 
                           subscription.apiType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
