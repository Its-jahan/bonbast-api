import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeSlash, Sms } from 'iconsax-react';

export default function Register() {
  const { language, setLanguage } = useLanguage();
  const isFa = language === 'fa';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : isFa ? 'خطا در ثبت‌نام' : 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex justify-end">
          <div className="flex items-center gap-0.5 rounded-xl bg-white shadow-sm p-1">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                language === 'en' ? 'bg-[#2383e2] text-white' : 'text-[#787774] hover:text-[#37352f]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fa')}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition ${
                language === 'fa' ? 'bg-[#2383e2] text-white' : 'text-[#787774] hover:text-[#37352f]'
              }`}
            >
              FA
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-[#37352f]">{isFa ? 'ثبت‌نام' : 'Create account'}</h1>
            <p className="text-sm text-muted-foreground">
              {isFa ? 'برای شروع یک حساب بسازید' : 'Start using your API dashboard'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-[#37352f]">
                {isFa ? 'ایمیل' : 'Email'}
              </Label>
              <div className="relative">
                <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isFa ? 'right-3' : 'left-3'}`}>
                  <Sms size={16} variant="Outline" color="currentColor" />
                </span>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${isFa ? 'pr-10 pl-3' : 'pl-10 pr-3'} h-10 border-[#e9e9e7] rounded-md`}
                  placeholder="you@example.com"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium text-[#37352f]">
                {isFa ? 'رمز عبور' : 'Password'}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10 border-[#e9e9e7] rounded-md pr-10"
                  placeholder={isFa ? 'حداقل ۶ کاراکتر' : 'At least 6 characters'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground ${isFa ? 'left-3' : 'right-3'}`}
                >
                  {showPassword ? (
                    <EyeSlash size={16} variant="Outline" color="currentColor" />
                  ) : (
                    <Eye size={16} variant="Outline" color="currentColor" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="h-11">
              {loading ? (isFa ? 'در حال ثبت‌نام...' : 'Creating account...') : isFa ? 'ثبت‌نام' : 'Sign up'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            {isFa ? 'قبلاً ثبت‌نام کرده‌اید؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              {isFa ? 'ورود' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
