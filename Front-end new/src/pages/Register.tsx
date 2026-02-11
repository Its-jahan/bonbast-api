import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeSlash, Sms, UserAdd, ArrowRight } from 'iconsax-react';

export default function Register() {
  const { language } = useLanguage();
  const { signUp } = useAuth();
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
      await signUp(email, password);
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
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowRight size={20} />
          <span>{isFa ? 'بازگشت به صفحه اصلی' : 'Back to home'}</span>
        </button>

        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <UserAdd size={32} className="text-white" variant="Bold" />
            </div>
            <h1 className="text-2xl font-semibold text-[#37352f]">{isFa ? 'ثبت‌نام' : 'Create account'}</h1>
            <p className="text-sm text-gray-600">
              {isFa ? 'برای شروع یک حساب بسازید' : 'Start using your API dashboard'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium text-[#37352f]">
                {isFa ? 'ایمیل' : 'Email'}
              </label>
              <div className="relative">
                <span className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isFa ? 'right-3' : 'left-3'}`}>
                  <Sms size={16} variant="Outline" color="currentColor" />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full ${isFa ? 'pr-10 pl-3' : 'pl-10 pr-3'} h-10 border border-[#e9e9e7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="you@example.com"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium text-[#37352f]">
                {isFa ? 'رمز عبور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-10 border border-[#e9e9e7] rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={isFa ? 'حداقل ۶ کاراکتر' : 'At least 6 characters'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isFa ? 'left-3' : 'right-3'}`}
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
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:opacity-50 font-medium shadow-lg shadow-blue-500/20"
            >
              {loading ? (isFa ? 'در حال ثبت‌نام...' : 'Creating account...') : isFa ? 'ثبت‌نام' : 'Sign up'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600">
            {isFa ? 'قبلاً ثبت‌نام کرده‌اید؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-blue-500 font-medium hover:underline">
              {isFa ? 'ورود' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
