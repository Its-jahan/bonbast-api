import { TrendingUp, Clock } from 'lucide-react';

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const displayLastUpdated = (() => {
    if (!lastUpdated) return null;
    const d = new Date(lastUpdated);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString('fa-IR');
    }
    const parts = lastUpdated.split(' ');
    return parts.length >= 2 ? parts[1] : lastUpdated;
  })();

  return (
    <header className="bg-gradient-to-l from-primary to-accent text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">قیمت لحظه‌ای ارز</h1>
              <p className="text-xs text-white/80">به‌روزرسانی هر ۳۰ ثانیه</p>
            </div>
          </div>

          {lastUpdated && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                آخرین بروزرسانی: {displayLastUpdated}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
