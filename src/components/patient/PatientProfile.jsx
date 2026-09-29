import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiUser, FiPhone, FiSave, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { LANGUAGES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';
import api from '../../utils/api';

const PatientProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    email: '',
    emergencyContact: '',
    preferredLanguage: 'en',
    allergies: '',
    currentMedicines: '',
    knownConditions: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get('/api/patients/profile');
        const data = res.data || res;
        setForm({
          name: data.name || user?.name || '',
          age: data.age || user?.age || '',
          gender: data.gender || user?.gender || '',
          phone: data.phone || user?.phone || '',
          email: data.email || user?.email || '',
          emergencyContact: data.emergencyContact || user?.emergencyContact || '',
          preferredLanguage: data.preferredLanguage || user?.preferredLanguage || 'en',
          allergies: data.allergies || '',
          currentMedicines: data.currentMedicines || '',
          knownConditions: data.knownConditions || '',
        });
      } catch {
        if (user) {
          setForm((prev) => ({
            ...prev,
            name: user.name || '',
            age: user.age || '',
            gender: user.gender || '',
            phone: user.phone || '',
            email: user.email || '',
            emergencyContact: user.emergencyContact || '',
            preferredLanguage: user.preferredLanguage || 'en',
          }));
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.put('/api/patients/profile', form);
      setSuccessMsg(t('patient.profile.saveSuccess'));
    } catch {
      setErrorMsg(t('patient.profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={t('common.back')}
        >
          <FiArrowLeft className="text-2xl text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {t('patient.profile.title')}
        </h1>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
            aria-hidden="true"
          >
            <FiUser className="text-4xl text-green-600" />
          </div>
          <p className="text-xl font-bold text-gray-800">
            {form.name || t('patient.profile.unnamed')}
          </p>
        </div>

        {/* Success / Error Messages */}
        {successMsg && (
          <div
            className="bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 text-center text-lg"
            role="status"
          >
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div
            className="bg-red-50 border border-red-300 text-red-700 rounded-xl px-4 py-3 text-center text-lg"
            role="alert"
          >
            {errorMsg}
          </div>
        )}

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('patient.profile.personalInfo')}
          </h2>

          {/* Name */}
          <div>
            <label
              htmlFor="profile-name"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.name')}
            </label>
            <input
              id="profile-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
              aria-label={t('patient.profile.name')}
            />
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="profile-age"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.age')}
            </label>
            <input
              id="profile-age"
              type="number"
              name="age"
              min="0"
              max="150"
              value={form.age}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
              aria-label={t('patient.profile.age')}
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="profile-gender"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.gender')}
            </label>
            <select
              id="profile-gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 text-lg focus:border-green-500 focus:outline-none transition-colors bg-white"
              aria-label={t('patient.profile.gender')}
            >
              <option value="">{t('patient.profile.selectGender')}</option>
              <option value="male">{t('patient.profile.male')}</option>
              <option value="female">{t('patient.profile.female')}</option>
              <option value="other">{t('patient.profile.other')}</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="profile-phone"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.phone')}
            </label>
            <input
              id="profile-phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 text-lg bg-gray-50 text-gray-500 focus:border-green-500 focus:outline-none transition-colors"
              aria-label={t('patient.profile.phone')}
              readOnly
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="profile-email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.email')}
              <span className="text-gray-400 ml-1">
                ({t('common.optional')})
              </span>
            </label>
            <input
              id="profile-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full h-12 rounded-xl border-2 border-gray-200 px-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
              aria-label={t('patient.profile.email')}
            />
          </div>

          {/* Emergency Contact */}
          <div>
            <label
              htmlFor="profile-emergency"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.emergencyContact')}
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="profile-emergency"
                type="tel"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border-2 border-gray-200 pl-10 pr-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
                aria-label={t('patient.profile.emergencyContact')}
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t('patient.profile.preferredLanguage')}
            </label>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t('patient.profile.preferredLanguage')}>
              {LANGUAGES &&
                LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    role="radio"
                    aria-checked={form.preferredLanguage === lang.code}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        preferredLanguage: lang.code,
                      }))
                    }
                    className={`px-5 py-2 rounded-full text-base font-medium transition-colors ${
                      form.preferredLanguage === lang.code
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lang.label || lang.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Medical Information Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('patient.profile.medicalInfo')}
          </h2>

          {/* Allergies */}
          <div>
            <label
              htmlFor="profile-allergies"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.allergies')}
            </label>
            <textarea
              id="profile-allergies"
              name="allergies"
              value={form.allergies}
              onChange={handleChange}
              placeholder={t('patient.profile.allergiesPlaceholder')}
              className="w-full min-h-[80px] rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-green-500 focus:outline-none transition-colors resize-y"
              aria-label={t('patient.profile.allergies')}
            />
          </div>

          {/* Current Medicines */}
          <div>
            <label
              htmlFor="profile-medicines"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.currentMedicines')}
            </label>
            <textarea
              id="profile-medicines"
              name="currentMedicines"
              value={form.currentMedicines}
              onChange={handleChange}
              placeholder={t('patient.profile.medicinesPlaceholder')}
              className="w-full min-h-[80px] rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-green-500 focus:outline-none transition-colors resize-y"
              aria-label={t('patient.profile.currentMedicines')}
            />
          </div>

          {/* Known Conditions */}
          <div>
            <label
              htmlFor="profile-conditions"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              {t('patient.profile.knownConditions')}
            </label>
            <textarea
              id="profile-conditions"
              name="knownConditions"
              value={form.knownConditions}
              onChange={handleChange}
              placeholder={t('patient.profile.conditionsPlaceholder')}
              className="w-full min-h-[80px] rounded-xl border-2 border-gray-200 px-4 py-3 text-lg focus:border-green-500 focus:outline-none transition-colors resize-y"
              aria-label={t('patient.profile.knownConditions')}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white h-14 rounded-xl w-full text-lg font-semibold transition-colors"
            aria-label={t('patient.profile.saveChanges')}
          >
            {saving ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave className="text-xl" />
            )}
            {saving
              ? t('common.saving')
              : t('patient.profile.saveChanges')}
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-50 h-14 rounded-xl w-full text-lg font-semibold transition-colors"
            aria-label={t('patient.profile.logout')}
          >
            <FiLogOut className="text-xl" />
            {t('patient.profile.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
