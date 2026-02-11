import { Activity } from 'iconsax-react';

interface RequestCounterProps {
  used: number;
  total: number;
  label?: string;
}

export function RequestCounter({ used, total, label = 'درخواست‌های ماهیانه' }: RequestCounterProps) {
  const percentage = (used / total) * 100;
  
  const getColor = () => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-warning';
    return 'bg-success';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <span className={`text-sm font-bold ${getTextColor()}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 right-0 ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground font-medium">
          {used.toLocaleString('fa-IR')} استفاده شده
        </span>
        <span className="text-muted-foreground">
          از {total.toLocaleString('fa-IR')}
        </span>
      </div>

      {/* Remaining */}
      <div className="text-center mt-2 p-3 bg-card/50 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground mb-1">باقیمانده</p>
        <p className={`text-2xl font-bold ${getTextColor()}`}>
          {(total - used).toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  );
}
