import { Link } from 'react-router';
import { Category, Chart2, Login, UserAdd } from 'iconsax-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  lastUpdated?: string;
}

export function Header({ lastUpdated }: HeaderProps) {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const isFa = language === 'fa';

  return (
    <header className="bg-[#0a0a0a] border-b border-[#2a2a2a]">
      <div className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-10">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Chart2 size={24} variant="Bold" color="#ffffff" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isFa ? 'قیمت لحظه‌ای ارز' : 'CryptoTracker'}
            </h1>
            <p className="text-xs text-gray-400">
              {isFa ? 'به‌روزرسانی لحظه‌ای' : 'Real-time updates'}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-xl bg-[#1a1a1a] p-1 border border-[#2a2a2a]">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                language === 'en' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fa')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                language === 'fa' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:text-white'
              }`}
            >
              FA
            </button>
          </div>
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
            >
              <Category size={18} variant="Bold" color="currentColor" />
              <span>{isFa ? 'داشبورد' : 'Dashboard'}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#262626] transition-all"
              >
                <Login size={18} variant="Bold" color="currentColor" />
                <span>{isFa ? 'ورود' : 'Sign in'}</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30"
              >
                <UserAdd size={18} variant="Bold" color="currentColor" />
                <span>{isFa ? 'ثبت‌نام' : 'Sign up'}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
