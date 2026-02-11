import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { TickCircle, ShoppingCart, ArrowRight, CardPos } from 'iconsax-react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { products } from '../data/products';
import { Product } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const productId = searchParams.get('product');
    if (!productId) {
      navigate('/shop');
      return;
    }

    const foundProduct = products.find((p) => p.id === productId);
    if (!foundProduct) {
      navigate('/shop');
      return;
    }

    setProduct(foundProduct);
  }, [user, searchParams, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePurchase = async () => {
    if (!product || !user) return;

    setLoading(true);
    setError('');

    try {
      // TODO: Connect to your backend API for payment processing
      // const response = await fetch('YOUR_BACKEND_URL/purchase', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken}`,
      //   },
      //   body: JSON.stringify({ productId: product.id }),
      // });
      // const data = await response.json();

      // Simulate payment processing (Demo)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate API key locally for demo
      const secretKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const subscriptionId = Date.now().toString();
      
      const subscription = {
        id: subscriptionId,
        userId: user.id,
        productId: product.id,
        apiType: product.apiType,
        secretKey,
        name: product.name,
        price: product.price,
        requestUrl: `http://31.59.105.156/api/${product.apiType === 'all' ? 'prices' : product.apiType}`,
        monthlyLimit: product.monthlyRequests,
        usedRequests: 0,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      // Store subscription locally (Demo)
      const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
      subscriptions.push(subscription);
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'خطا در خرید');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
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

  if (success) {
    return (
      <>
        <Header user={user} onLogout={handleLogout} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-24 h-24 bg-success/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <TickCircle size={56} className="text-success" variant="Bold" />
            </div>
            <h2 className="text-3xl font-bold mb-3">خرید موفقیت‌آمیز!</h2>
            <p className="text-muted-foreground mb-6">
              پلن شما فعال شد. در حال انتقال به داشبورد...
            </p>
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
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/shop')}
              className="p-2 hover:bg-accent rounded-lg transition-all"
            >
              <ArrowRight size={20} />
            </button>
            <div>
              <h1 className="text-4xl font-bold gradient-text">تکمیل خرید</h1>
              <p className="text-muted-foreground mt-1">بررسی و پرداخت</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Order Summary - Right Side */}
            <div className="lg:col-span-3 space-y-6">
              {/* Product Details */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingCart size={24} className="text-primary" />
                  جزئیات سفارش
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-muted-foreground">پلن انتخابی:</span>
                    <span className="font-bold text-lg">{product.name}</span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-muted-foreground">درخواست ماهیانه:</span>
                    <span className="font-bold">{product.monthlyRequests.toLocaleString('fa-IR')}</span>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="text-muted-foreground">نوع API:</span>
                    <span className="font-bold">
                      {product.apiType === 'all' ? 'همه داده‌ها' : 
                       product.apiType === 'currencies' ? 'ارزها' :
                       product.apiType === 'gold' ? 'طلا و سکه' :
                       product.apiType === 'crypto' ? 'ارز دیجیتال' : 
                       product.apiType}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="pt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-3">امکانات:</p>
                    <div className="space-y-2">
                      {product.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TickCircle size={18} className="text-success flex-shrink-0 mt-0.5" variant="Bold" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-br from-notion-blue/10 to-notion-purple/10 border border-notion-blue/30 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <CardPos size={24} className="text-notion-blue flex-shrink-0 mt-1" variant="Bold" />
                  <div>
                    <p className="font-medium mb-2">💳 درگاه پرداخت</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      ✅ پس از پرداخت، API Key و اطلاعات دسترسی در داشبورد شما نمایش داده می‌شود
                    </p>
                    <p className="text-xs text-notion-blue mt-2">
                      💡 درگاه پرداخت فعلاً در حالت دمو است
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-bold mb-6">خلاصه مبلغ</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>قیمت پلن:</span>
                    <span>{product.price.toLocaleString('fa-IR')} تومان</span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>مالیات (9%):</span>
                    <span>{Math.floor(product.price * 0.09).toLocaleString('fa-IR')} تومان</span>
                  </div>

                  <div className="h-px bg-border"></div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">جمع کل:</span>
                    <span className="font-bold text-2xl gradient-text">
                      {Math.floor(product.price * 1.09).toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-4 mb-4 text-sm">
                    {error}
                  </div>
                )}

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 font-bold text-lg shadow-lg shadow-primary/30"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>در حال پردازش...</span>
                    </div>
                  ) : (
                    'پرداخت و خرید (دمو)'
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  با خرید، شما با{' '}
                  <span className="text-primary">قوانین و مقررات</span>{' '}
                  ما موافقت می‌کنید
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
