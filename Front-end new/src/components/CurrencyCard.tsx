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
    <div className={`rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-sm transition-all hover:shadow-md ${getCategoryColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {currency.flag && <span className="text-2xl">{currency.flag}</span>}
          <div>
            <h3 className="font-semibold text-base">{isFa ? currency.nameFa : currency.nameEn}</h3>
            <span className="text-xs text-muted-foreground" dir="ltr">
              {currency.symbol}
            </span>
          </div>
        </div>
        {priceChange !== null && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              isIncreasing ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isIncreasing ? (
              <TrendUp size={14} variant="Bold" color="currentColor" />
            ) : (
              <TrendDown size={14} variant="Bold" color="currentColor" />
            )}
            <span>{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-xl font-semibold text-gray-900">
          {formatPrice(price)}
          <span className={`text-xs text-muted-foreground ${isFa ? 'mr-2' : 'ml-2'}`}>
            {unitLabel}
          </span>
        </div>
      </div>

      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor()}`}>
        {categoryLabel}
      </div>
    </div>
  );
}
