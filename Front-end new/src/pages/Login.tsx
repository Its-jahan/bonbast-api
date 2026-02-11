import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const { language, setLanguage } = useLanguage();
  const isFa = language === 'fa';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : isFa ? 'خطا در ورود' : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f5] p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-1 rounded-lg border border-[#e5e5e5] bg-white p-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-md ${
                language === 'en' ? 'bg-black text-white' : 'text-muted-foreground'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fa')}
              className={`px-2 py-1 text-xs font-semibold rounded-md ${
                language === 'fa' ? 'bg-black text-white' : 'text-muted-foreground'
              }`}
            >
              FA
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-center mb-6">{isFa ? 'ورود' : 'Sign in'}</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">{isFa ? 'ایمیل' : 'Email'}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="you@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <Label htmlFor="password">{isFa ? 'رمز عبور' : 'Password'}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (isFa ? 'در حال ورود...' : 'Signing in...') : isFa ? 'ورود' : 'Sign in'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isFa ? 'حساب ندارید؟' : "Don't have an account?"}{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              {isFa ? 'ثبت‌نام' : 'Sign up'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
