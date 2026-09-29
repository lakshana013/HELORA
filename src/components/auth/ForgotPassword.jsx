import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-green-600 mb-2">HEALORA</h1>
          <p className="text-xl text-gray-600">{t('auth.forgot_password')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-green-600 text-3xl" />
              </div>
              <p className="text-gray-700 text-lg mb-6">
                If this account exists, we sent reset instructions to your phone or email.
              </p>
              <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                <FiArrowLeft /> {t('auth.login')}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><FiMail /></span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={`${t('auth.phone')} / ${t('auth.email')}`}
                  className="input-field pl-12"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send Reset Link
              </button>
              <Link to="/login" className="flex items-center justify-center gap-2 text-green-600 font-medium hover:underline">
                <FiArrowLeft /> {t('common.back')}
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
