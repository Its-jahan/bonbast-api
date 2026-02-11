import { useNavigate } from 'react-router';
import { TickCircle, Star1, ShoppingCart, ArrowRight } from 'iconsax-react';
import { Header } from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { products } from '../data/products';

export default function Shop() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBuy = (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/checkout?product=${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-accent rounded-lg transition-all"
            >
              <ArrowRight size={20} />
            </button>
            <div>
              <h1 className="text-5xl font-bold gradient-text">فروشگاه API</h1>
              <p className="text-lg text-muted-foreground mt-2">
                پلن مناسب خود را انتخاب کنید
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`relative bg-card border rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 ${
                product.popular
                  ? 'border-primary shadow-xl shadow-primary/20 scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-gradient-to-r from-primary to-notion-purple text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Star1 size={16} variant="Bold" />
                  محبوب‌ترین
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{product.description}</p>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold gradient-text mb-1">
                    {product.price.toLocaleString('fa-IR')}
                  </div>
                  <div className="text-sm text-muted-foreground">تومان / ماهانه</div>
                </div>

                {/* Requests */}
                <div className="bg-secondary/50 border border-border rounded-xl px-4 py-3">
                  <div className="text-2xl font-bold text-primary">
                    {product.monthlyRequests.toLocaleString('fa-IR')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    درخواست در ماه
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <TickCircle
                      size={20}
                      className="text-success flex-shrink-0 mt-0.5"
                      variant="Bold"
                    />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handleBuy(product.id)}
                className={`w-full py-3 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
                  product.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/30'
                    : 'bg-secondary hover:bg-accent text-foreground'
                }`}
              >
                <ShoppingCart size={20} />
                خرید پلن
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-card border border-border rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">چرا API ما؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-notion-blue/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h4 className="font-bold mb-2">سریع و پایدار</h4>
              <p className="text-sm text-muted-foreground">
                زیرساخت قدرتمند با uptime بالای 99.9%
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-notion-green/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="font-bold mb-2">داده‌های دقیق</h4>
              <p className="text-sm text-muted-foreground">
                اطلاعات لحظه‌ای از منابع معتبر بازار
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-notion-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h4 className="font-bold mb-2">امنیت بالا</h4>
              <p className="text-sm text-muted-foreground">
                رمزنگاری و احراز هویت پیشرفته
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
