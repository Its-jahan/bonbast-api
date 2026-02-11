import { TrendDown, TrendUp } from 'iconsax-react';
import { CurrencyItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface CurrencyCardProps {
  currency: CurrencyItem;
  price: string;
  previousPrice?: string;
}

export function CurrencyCard({ currency, price, previousPrice }: CurrencyCardProps) {
  const { language } = useLanguage();
  const isFa = language === 'fa';
  const numericPrice = parseFloat(price.replace(/,/g, ''));
  const numericPreviousPrice = previousPrice ? parseFloat(previousPrice.replace(/,/g, '')) : null;
  
  let priceChange: number | null = null;
  let isIncreasing = false;
  
  if (numericPreviousPrice && numericPreviousPrice !== numericPrice) {
    priceChange = ((numericPrice - numericPreviousPrice) / numericPreviousPrice) * 100;
    isIncreasing = priceChange > 0;
  }

  const formatPrice = (value: string) => {
    const num = parseFloat(value.replace(/,/g, ''));
    return num.toLocaleString(isFa ? 'fa-IR' : 'en-US');
  };

  const getCategoryColor = () => {
    switch (currency.category) {
      case 'currency':
        return 'border-blue-200';
      case 'gold':
        return 'border-yellow-200';
      case 'coin':
        return 'border-orange-200';
      case 'crypto':
        return 'border-purple-200';
      default:
        return 'border-gray-200';
    }
  };

  const getCategoryBadgeColor = () => {
    switch (currency.category) {
      case 'currency':
        return 'bg-blue-100 text-blue-700';
      case 'gold':
        return 'bg-yellow-100 text-yellow-700';
      case 'coin':
        return 'bg-orange-100 text-orange-700';
      case 'crypto':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const categoryLabel = (() => {
    if (currency.category === 'currency') return isFa ? 'ارز' : 'Currency';
    if (currency.category === 'gold') return isFa ? 'طلا' : 'Gold';
    if (currency.category === 'coin') return isFa ? 'سکه' : 'Coin';
    return isFa ? 'ارز دیجیتال' : 'Crypto';
  })();

  const unitLabel = isFa ? 'تومان' : 'Toman';

  return (
    <div className="rounded-3xl bg-[#1a1a1a] p-8 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {currency.flag && <span className="text-4xl">{currency.flag}</span>}
          <div>
            <h3 className="font-semibold text-lg text-white mb-1">{isFa ? currency.nameFa : currency.nameEn}</h3>
            <span className="text-sm text-gray-400" dir="ltr">
              {currency.symbol}
            </span>
          </div>
        </div>
        {priceChange !== null && (
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${
              isIncreasing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isIncreasing ? (
              <TrendUp size={16} variant="Bold" color="currentColor" />
            ) : (
              <TrendDown size={16} variant="Bold" color="currentColor" />
            )}
            <span>{Math.abs(priceChange).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="text-3xl font-bold text-white mb-2">
          {formatPrice(price)}
        </div>
        <span className="text-sm text-gray-400">
          {unitLabel}
        </span>
      </div>

      <div className="h-2 w-full bg-[#0a0a0a] rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all ${isIncreasing ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-blue-500 to-blue-400'}`} 
          style={{ width: '65%' }}
        ></div>
      </div>
    </div>
  );
}
