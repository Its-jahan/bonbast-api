import { Link } from 'react-router';
import { Category, Chart2, Clock, Login, UserAdd } from 'iconsax-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isFa = language === 'fa';
  const displayLastUpdated = (() => {
    if (!lastUpdated) return null;
    const d = new Date(lastUpdated);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleTimeString(isFa ? 'fa-IR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    const parts = lastUpdated.split(' ');
    return parts.length >= 2 ? parts[1] : lastUpdated;
  })();

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <Chart2 size={20} variant="Bold" color="currentColor" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">
              {isFa ? 'قیمت لحظه‌ای ارز' : 'Live Currency Rates'}
            </h1>
            <p className="text-[11px] text-white/70">
              {isFa ? 'به‌روزرسانی هر ۳۰ ثانیه' : 'Updates every 30 seconds'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-xs text-white/80">
              <Clock size={16} variant="Bold" color="currentColor" />
              <span>
                {isFa ? 'آخرین بروزرسانی' : 'Last update'}: {displayLastUpdated}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                language === 'en' ? 'bg-white text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fa')}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                language === 'fa' ? 'bg-white text-black' : 'text-white/70 hover:text-white'
              }`}
            >
              FA
            </button>
          </div>
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white/90 hover:text-white transition"
            >
              <Category size={16} variant="Bold" color="currentColor" />
              <span>{isFa ? 'داشبورد' : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white/90 hover:text-white transition"
              >
                <Login size={16} variant="Bold" color="currentColor" />
                <span>{isFa ? 'ورود' : 'Sign in'}</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-lg bg-white text-black px-3 py-2 text-xs font-semibold hover:bg-white/90 transition"
              >
                <UserAdd size={16} variant="Bold" color="currentColor" />
                <span>{isFa ? 'ثبت‌نام' : 'Sign up'}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
