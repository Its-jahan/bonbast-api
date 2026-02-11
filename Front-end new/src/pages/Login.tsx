import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Login as LoginIcon, Sms, Lock, ArrowRight, Eye, EyeSlash } from 'iconsax-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const isFa = language === 'fa';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطا در ورود';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowRight size={20} />
          <span>{isFa ? 'بازگشت به صفحه اصلی' : 'Back to home'}</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <LoginIcon size={32} className="text-white" variant="Bold" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#37352f]">
              {isFa ? 'ورود به حساب' : 'Sign in'}
            </h1>
            <p className="text-gray-600">
              {isFa ? 'خوش آمدید! لطفاً وارد شوید' : 'Welcome back! Please sign in'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#37352f]">
                <Sms size={16} />
                {isFa ? 'ایمیل' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-white border border-[#e9e9e7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2 text-[#37352f]">
                <Lock size={16} />
                {isFa ? 'رمز عبور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white border border-[#e9e9e7] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlash size={16} variant="Outline" />
                  ) : (
                    <Eye size={16} variant="Outline" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-all disabled:opacity-50 font-medium shadow-lg shadow-blue-500/20"
            >
              {loading ? (isFa ? 'در حال ورود...' : 'Signing in...') : isFa ? 'ورود' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#e9e9e7]"></div>
            <span className="text-sm text-gray-500">{isFa ? 'یا' : 'or'}</span>
            <div className="flex-1 h-px bg-[#e9e9e7]"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isFa ? 'حساب کاربری ندارید؟' : "Don't have an account?"}{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:underline font-medium"
              >
                {isFa ? 'ثبت نام کنید' : 'Sign up'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
