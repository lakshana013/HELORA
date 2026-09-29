import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiLock, FiPhone, FiMail, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LanguageSelector from '../common/LanguageSelector.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { login } = useAuth();

  const [role, setRole] = useState(searchParams.get('role') || 'patient');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = { password, role };
      if (role === 'patient') {
        credentials.phone = identifier;
      } else {
        credentials.email = identifier;
      }

      const user = await login(credentials);
      navigate(user.role === 'doctor' ? '/doctor' : '/patient');
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50 flex flex-col items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t('common.back')}</span>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">+</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Healora</h1>
          <p className="text-lg text-gray-500">{t('auth.welcome_back')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex bg-gray-50 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setRole('patient'); setIdentifier(''); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-base font-semibold transition-all ${
                role === 'patient' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.patient')}
            </button>
            <button
              onClick={() => { setRole('doctor'); setIdentifier(''); setError(''); }}
              className={`flex-1 py-3 rounded-lg text-base font-semibold transition-all ${
                role === 'doctor' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('auth.doctor')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {role === 'patient' ? t('auth.phone') : t('auth.email')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {role === 'patient' ? <FiPhone className="w-5 h-5" /> : <FiMail className="w-5 h-5" />}
                </span>
                <input
                  type={role === 'patient' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={role === 'patient' ? '9876543210' : 'doctor@healora.com'}
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('auth.password')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold text-lg py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.login')
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link to="/forgot-password" className="text-green-600 text-sm font-medium hover:underline block">
              {t('auth.forgot_password')}
            </Link>
            <div className="h-px bg-gray-100" />
            <p className="text-gray-500 text-sm">
              {t('auth.no_account')}{' '}
              <Link to={`/signup?role=${role}`} className="text-green-600 font-semibold hover:underline">
                {t('auth.signup')}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <LanguageSelector compact />
        </div>
      </div>
    </div>
  );
}
