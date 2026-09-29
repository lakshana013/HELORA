import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiAlertTriangle } from 'react-icons/fi';

export default function EmergencyButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <button
      onClick={() => navigate('/patient/emergency')}
      className="w-full flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl p-4 hover:bg-red-100 active:bg-red-200 transition-colors"
      aria-label={t('patient.emergency_help')}
    >
      <span className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl text-2xl">
        <FiAlertTriangle />
      </span>
      <span className="text-lg font-semibold">{t('patient.emergency_help')}</span>
    </button>
  );
}
