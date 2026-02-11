import { Currency } from '../types';
import { ArrowUp, ArrowDown } from 'iconsax-react';

interface CurrencyCardProps {
  currency: Currency;
  price: string;
  previousPrice?: string;
}

export function CurrencyCard({ currency, price, previousPrice }: CurrencyCardProps) {
  const currentPrice = parseFloat(price?.replace(/,/g, '') || '0');
  const prevPrice = parseFloat(previousPrice?.replace(/,/g, '') || '0');
  const change = prevPrice ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0;
  const isUp = change > 0;
  const isDown = change < 0;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'currency':
        return 'from-notion-blue/20 to-notion-blue/5 border-notion-blue/30';
      case 'gold':
        return 'from-notion-yellow/20 to-notion-yellow/5 border-notion-yellow/30';
      case 'coin':
        return 'from-notion-orange/20 to-notion-orange/5 border-notion-orange/30';
      case 'crypto':
        return 'from-notion-purple/20 to-notion-purple/5 border-notion-purple/30';
      default:
        return 'from-card to-card border-border';
    }
  };

  return (
    <div
      className={`group relative bg-gradient-to-br ${getCategoryColor(
        currency.category
      )} border rounded-xl p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
    >
      {/* Icon & Name */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{currency.icon}</div>
          <div>
            <h3 className="font-bold text-foreground">{currency.name}</h3>
            <p className="text-xs text-muted-foreground">{currency.symbol}</p>
          </div>
        </div>

        {/* Change Indicator */}
        {change !== 0 && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
              isUp
                ? 'bg-success/20 text-success'
                : isDown
                ? 'bg-destructive/20 text-destructive'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {isUp && <ArrowUp size={14} />}
            {isDown && <ArrowDown size={14} />}
            <span>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="text-2xl font-bold text-foreground">
          {currentPrice.toLocaleString('fa-IR')}
          <span className="text-sm text-muted-foreground mr-2">
            {currency.category === 'crypto' ? 'دلار' : 'تومان'}
          </span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 rounded-xl transition-all duration-300 pointer-events-none"></div>
    </div>
  );
}
