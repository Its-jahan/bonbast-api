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
    <div className="rounded-lg border border-[#e9e9e7] bg-white p-4 hover:border-[#d3d3d1] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {currency.flag && <span className="text-xl">{currency.flag}</span>}
          <div>
            <h3 className="font-medium text-sm text-[#37352f]">{isFa ? currency.nameFa : currency.nameEn}</h3>
            <span className="text-xs text-muted-foreground" dir="ltr">
              {currency.symbol}
            </span>
          </div>
        </div>
        {priceChange !== null && (
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${
              isIncreasing ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isIncreasing ? (
              <TrendUp size={12} variant="Bold" color="currentColor" />
            ) : (
              <TrendDown size={12} variant="Bold" color="currentColor" />
            )}
            <span>{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="mb-2.5">
        <div className="text-lg font-semibold text-[#37352f]">
          {formatPrice(price)}
          <span className={`text-xs text-muted-foreground font-normal ${isFa ? 'mr-1.5' : 'ml-1.5'}`}>
            {unitLabel}
          </span>
        </div>
      </div>

      <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getCategoryBadgeColor()}`}>
        {categoryLabel}
      </div>
    </div>
  );
}
