import { User } from '../types';
import { useNavigate } from 'react-router';

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  lastUpdated?: string;
}

export function Header({ user, onLogout, lastUpdated }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-notion-purple rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all">
              <span className="text-2xl">💎</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">پرایس API</h1>
              <p className="text-xs text-muted-foreground">قیمت لحظه‌ای ارز و طلا</p>
            </div>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>آخرین به‌روزرسانی: {new Date(lastUpdated).toLocaleTimeString('fa-IR')}</span>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-all"
                >
                  داشبورد
                </button>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-all"
                >
                  فروشگاه
                </button>
                <div className="flex items-center gap-3 mr-2 pr-2 border-r border-border">
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg transition-all"
                  >
                    خروج
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/shop')}
                  className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-all"
                >
                  فروشگاه
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-lg transition-all"
                >
                  ورود
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all shadow-lg shadow-primary/20"
                >
                  ثبت نام
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
