import { TrendingUp, TrendingDown } from 'lucide-react';
import { CurrencyItem } from '../types';

interface CurrencyCardProps {
  currency: CurrencyItem;
  price: string;
  previousPrice?: string;
}

export function CurrencyCard({ currency, price, previousPrice }: CurrencyCardProps) {
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
    return num.toLocaleString('fa-IR');
  };

  const getCategoryColor = () => {
    switch (currency.category) {
      case 'currency':
        return 'border-blue-200 bg-blue-50/50';
      case 'gold':
        return 'border-yellow-200 bg-yellow-50/50';
      case 'coin':
        return 'border-orange-200 bg-orange-50/50';
      case 'crypto':
        return 'border-purple-200 bg-purple-50/50';
      default:
        return 'border-gray-200 bg-gray-50/50';
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

  return (
    <div className={`rounded-xl border-2 p-5 hover:shadow-lg transition-all ${getCategoryColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {currency.flag && <span className="text-2xl">{currency.flag}</span>}
          <div>
            <h3 className="font-bold text-lg">{currency.name}</h3>
            <span className="text-sm text-muted-foreground">{currency.symbol}</span>
          </div>
        </div>
        {priceChange !== null && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
            isIncreasing ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {isIncreasing ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-2xl font-bold text-primary">
          {formatPrice(price)}
          <span className="text-sm text-muted-foreground mr-2">تومان</span>
        </div>
      </div>

      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor()}`}>
        {currency.category === 'currency' && 'ارز'}
        {currency.category === 'gold' && 'طلا'}
        {currency.category === 'coin' && 'سکه'}
        {currency.category === 'crypto' && 'ارز دیجیتال'}
      </div>
    </div>
  );
}
