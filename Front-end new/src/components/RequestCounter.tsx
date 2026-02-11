import { Activity } from 'iconsax-react';

interface RequestCounterProps {
  used: number;
  total: number;
  label?: string;
}

export function RequestCounter({ used, total, label = 'درخواست‌های ماهیانه' }: RequestCounterProps) {
  const percentage = (used / total) * 100;
  
  const getColor = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-400">{label}</span>
        </div>
        <span className={`text-sm font-bold ${getTextColor()}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-[#262626] rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 right-0 ${getColor()} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent"></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-white font-medium">
          {used.toLocaleString('fa-IR')} استفاده شده
        </span>
        <span className="text-gray-400">
          از {total.toLocaleString('fa-IR')}
        </span>
      </div>

      {/* Remaining */}
      <div className="text-center mt-2 p-3 bg-[#1a1a1a]/50 rounded-lg border border-[#2a2a2a]">
        <p className="text-xs text-gray-400 mb-1">باقیمانده</p>
        <p className={`text-2xl font-bold ${getTextColor()}`}>
          {(total - used).toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  );
}
