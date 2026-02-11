import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Copy, TickCircle, Key, Link2, Calendar, Activity, ArrowRight, Refresh } from 'iconsax-react';
import { Header } from '../components/Header';
import { RequestCounter } from '../components/RequestCounter';
import { useAuth } from '../contexts/AuthContext';
import { apiCall, API_CONFIG } from '../config/api';
import type { ApiKey } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && session) {
      loadApiKeys();
    }
  }, [user, session, authLoading, navigate]);

  const loadApiKeys = async () => {
    if (!session?.access_token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(
        API_CONFIG.ENDPOINTS.MY_KEYS,
        {},
        session.access_token
      );

      if (!response.ok) {
        throw new Error('Failed to load API keys');
      }

      const data = await response.json();
      setApiKeys(data.keys || []);
    } catch (err) {
      console.error('Load API keys error:', err);
      setError(err instanceof Error ? err.message : 'خطا در بارگذاری کلیدها');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddRequests = async (apiKeyId: number) => {
    if (!session?.access_token) return;
    
    try {
      const response = await apiCall(
        `${API_CONFIG.ENDPOINTS.ADD_REQUESTS}/${apiKeyId}/add-requests`,
        { method: 'POST' },
        session.access_token
      );

      if (!response.ok) {
        throw new Error('Failed to add requests');
      }

      // Reload API keys to show updated quota
      await loadApiKeys();
    } catch (err) {
      console.error('Add requests error:', err);
      alert('خطا در افزودن درخواست‌ها');
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">در حال بارگذاری...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadApiKeys}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowRight size={20} />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#37352f]">داشبورد</h1>
                <p className="text-gray-600 mt-1">مدیریت API Keys و آمار مصرف</p>
              </div>
            </div>
            <button
              onClick={loadApiKeys}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              <Refresh size={18} />
              <span>به‌روزرسانی</span>
            </button>
          </div>
        </div>

        {apiKeys.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-white border border-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Key size={48} className="text-gray-400" variant="Bold" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-[#37352f]">هنوز API نخریده‌اید</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              برای شروع، یکی از پلن‌های API را خریداری کنید
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-blue-500 text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
            >
              مشاهده پلن‌ها
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.api_key_id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-all shadow-sm"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-1 text-[#37352f]">{apiKey.plan.name}</h3>
                      <p className="text-sm text-gray-600">
                        {apiKey.plan.scope === 'all' ? 'همه داده‌ها' : 
                         apiKey.plan.scope === 'currency' ? 'ارزها' :
                         apiKey.plan.scope === 'gold' ? 'طلا و سکه' :
                         apiKey.plan.scope === 'crypto' ? 'ارز دیجیتال' : 
                         apiKey.plan.scope}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-bold">
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
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                          <Key size={16} />
                          API Key
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm break-all">
                            {apiKey.api_key}
                          </div>
                          <button
                            onClick={() => handleCopy(apiKey.api_key, `key-${apiKey.api_key_id}`)}
                            className="px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
                          >
                            {copiedKey === `key-${apiKey.api_key_id}` ? (
                              <TickCircle size={20} className="text-green-600" variant="Bold" />
                            ) : (
                              <Copy size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Request URL */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                          <Link2 size={16} />
                          Request URL
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm break-all">
                            {apiKey.api_url}
                          </div>
                          <button
                            onClick={() => handleCopy(apiKey.api_url, `url-${apiKey.api_key_id}`)}
                            className="px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
                          >
                            {copiedKey === `url-${apiKey.api_key_id}` ? (
                              <TickCircle size={20} className="text-green-600" variant="Bold" />
                            ) : (
                              <Copy size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Created Date */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                          <Calendar size={16} />
                          تاریخ ایجاد
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm">
                          {new Date(apiKey.created_at).toLocaleDateString('fa-IR')}
                        </div>
                      </div>

                      {/* Add Requests Button */}
                      <button
                        onClick={() => handleAddRequests(apiKey.api_key_id)}
                        className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 font-medium"
                      >
                        افزودن 5,000 درخواست (دمو)
                      </button>
                    </div>

                    {/* Right Column - Usage Stats */}
                    <div className="space-y-6">
                      {/* Request Counter */}
                      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
                        <RequestCounter
                          used={apiKey.usage.request_count}
                          total={apiKey.usage.monthly_quota}
                        />
                      </div>

                      {/* Additional Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity size={18} className="text-blue-600" />
                            <p className="text-xs text-gray-600">باقیمانده</p>
                          </div>
                          <p className="text-2xl font-bold text-blue-600">
                            {apiKey.usage.remaining.toLocaleString('fa-IR')}
                          </p>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Activity size={18} className="text-green-600" />
                            <p className="text-xs text-gray-600">کل سهمیه</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">
                            {apiKey.usage.monthly_quota.toLocaleString('fa-IR')}
                          </p>
                        </div>
                      </div>

                      {/* Month Info */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 text-center">
                        <p className="text-sm text-gray-600 mb-2">دوره فعلی</p>
                        <p className="text-2xl font-bold text-[#37352f]">
                          {apiKey.usage.month}
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
