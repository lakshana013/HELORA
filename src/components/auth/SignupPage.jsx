import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext.jsx';
import LanguageSelector from '../common/LanguageSelector.jsx';

export default function SignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { signup } = useAuth();

  const [role, setRole] = useState(searchParams.get('role') || 'patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', password: '',
    age: '', gender: '', emergency_contact: '', preferred_language: 'en',
    specialization: '', hospital_clinic: '', medical_registration_id: '',
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = { ...form, role };
      const user = await signup(data);
      navigate(user.role === 'doctor' ? '/doctor' : '/patient');
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-green-600 mb-2">HEALORA</h1>
          <p className="text-lg text-gray-600">{t('auth.signup')}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 py-3 rounded-lg text-lg font-semibold transition-all ${
                role === 'patient' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              {t('auth.patient')}
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 py-3 rounded-lg text-lg font-semibold transition-all ${
                role === 'doctor' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              {t('auth.doctor')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={form.name} onChange={update('name')} placeholder={t('auth.name')} className="input-field" required />
            <input type="tel" value={form.phone} onChange={update('phone')} placeholder={t('auth.phone')} className="input-field" required />
            <input type="email" value={form.email} onChange={update('email')} placeholder={t('auth.email')} className="input-field" required={role === 'doctor'} />
            <input type="password" value={form.password} onChange={update('password')} placeholder={t('auth.password')} className="input-field" required minLength={6} />

            {role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" value={form.age} onChange={update('age')} placeholder={t('auth.age')} className="input-field" min="1" max="120" />
                  <select value={form.gender} onChange={update('gender')} className="input-field">
                    <option value="">{t('auth.gender')}</option>
                    <option value="male">{t('auth.male')}</option>
                    <option value="female">{t('auth.female')}</option>
                    <option value="other">{t('auth.other')}</option>
                  </select>
                </div>
                <input type="tel" value={form.emergency_contact} onChange={update('emergency_contact')} placeholder={t('auth.emergency_contact')} className="input-field" />
                <select value={form.preferred_language} onChange={update('preferred_language')} className="input-field">
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </>
            )}

            {role === 'doctor' && (
              <>
                <input type="text" value={form.specialization} onChange={update('specialization')} placeholder={t('auth.specialization')} className="input-field" required />
                <input type="text" value={form.hospital_clinic} onChange={update('hospital_clinic')} placeholder={t('auth.hospital')} className="input-field" required />
                <input type="text" value={form.medical_registration_id} onChange={update('medical_registration_id')} placeholder={t('auth.registration_id')} className="input-field" required />
              </>
            )}

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center">{error}</div>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('common.loading') : (role === 'patient' ? t('auth.register_patient') : t('auth.register_doctor'))}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">{t('auth.login')}</Link>
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <LanguageSelector compact />
        </div>
      </div>
    </div>
  );
}
