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
    <header className="bg-[#191919] border-b border-[#2f2f2f] sticky top-0 z-50">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
            <Chart2 size={18} variant="Bold" color="#191919" />
          </div>
          <div>
            <h1 className="text-sm font-medium text-white">
              {isFa ? 'قیمت لحظه‌ای ارز' : 'Live Currency Rates'}
            </h1>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-xs text-white/80">
              <Clock size={14} variant="Outline" color="currentColor" />
              <span>
                {isFa ? 'آخرین بروزرسانی' : 'Last update'}: {displayLastUpdated}
              </span>
            </div>
          )}
          <div className="flex items-center gap-0.5 rounded-md bg-white/10 p-0.5">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition ${
                language === 'en' ? 'bg-white text-[#191919]' : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fa')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition ${
                language === 'fa' ? 'bg-white text-[#191919]' : 'text-white/70 hover:text-white'
              }`}
            >
              FA
            </button>
          </div>
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#191919] hover:bg-white/90 transition"
            >
              <Category size={14} variant="Bold" color="currentColor" />
              <span className="hidden sm:inline">{isFa ? 'داشبورد' : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#191919] hover:bg-white/90 transition"
              >
                <Login size={14} variant="Bold" color="currentColor" />
                <span className="hidden sm:inline">{isFa ? 'ورود' : 'Sign in'}</span>
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#191919] hover:bg-white/90 transition"
              >
                <UserAdd size={14} variant="Bold" color="currentColor" />
                <span>{isFa ? 'ثبت‌نام' : 'Sign up'}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
