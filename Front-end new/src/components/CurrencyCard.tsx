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
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {currency.flag && <span className="text-3xl">{currency.flag}</span>}
          <div>
            <h3 className="font-medium text-base text-[#37352f]">{isFa ? currency.nameFa : currency.nameEn}</h3>
            <span className="text-xs text-[#787774]" dir="ltr">
              {currency.symbol}
            </span>
          </div>
        </div>
        {priceChange !== null && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              isIncreasing ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isIncreasing ? (
              <TrendUp size={14} variant="Bold" color="currentColor" />
            ) : (
              <TrendDown size={14} variant="Bold" color="currentColor" />
            )}
            <span>{Math.abs(priceChange).toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-2xl font-semibold text-[#37352f]">
          {formatPrice(price)}
        </div>
        <span className="text-xs text-[#787774]">
          {unitLabel}
        </span>
      </div>

      <div className="h-1 w-full bg-[#f7f6f3] rounded-full overflow-hidden">
        <div className={`h-full ${isIncreasing ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: '60%' }}></div>
      </div>
    </div>
  );
}
