import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMic, FiEdit3, FiAlertTriangle, FiMapPin, FiCalendar, FiClipboard, FiUser as FiDoctor, FiHome, FiActivity, FiClock, FiBook, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useConnection } from '../../contexts/ConnectionContext.jsx';
import Navbar from '../common/Navbar.jsx';

function getGreeting(t) {
  const h = new Date().getHours();
  if (h < 12) return t('patient.greeting');
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  { icon: FiAlertTriangle, labelKey: 'patient.emergency_help', path: '/patient/emergency', color: 'bg-red-50 text-red-600', iconBg: 'bg-red-100' },
  { icon: FiMapPin, labelKey: 'patient.find_care', path: '/patient/facilities', color: 'text-blue-600', iconBg: 'bg-blue-100' },
  { icon: FiCalendar, labelKey: 'patient.upcoming_camps', path: '/patient/camps', color: 'text-purple-600', iconBg: 'bg-purple-100' },
  { icon: FiClipboard, labelKey: 'patient.health_history', path: '/patient/history', color: 'text-teal-600', iconBg: 'bg-teal-100' },
  { icon: FiBook, labelKey: 'medicines.medicine_info', path: '/patient/medicines', color: 'text-amber-600', iconBg: 'bg-amber-100' },
  { icon: FiHeart, labelKey: 'ayurveda_info.title', path: '/patient/ayurveda', color: 'text-green-600', iconBg: 'bg-green-100' },
];

const NAV_ITEMS = [
  { icon: FiHome, labelKey: 'nav.home', path: '/patient' },
  { icon: FiActivity, labelKey: 'nav.health_assistant', path: '/patient/symptom-input' },
  { icon: FiMapPin, labelKey: 'nav.nearby_care', path: '/patient/facilities' },
  { icon: FiCalendar, labelKey: 'nav.health_camps', path: '/patient/camps' },
  { icon: FiClock, labelKey: 'nav.health_history', path: '/patient/history' },
];

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isOnline } = useConnection();

  return (
    <div className="min-h-screen bg-gray-50 pb-24 pt-14">
      <Navbar />

      <div className="px-4 sm:px-6 pt-6 pb-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">
          {getGreeting(t)}, {user?.name?.split(' ')[0] || t('auth.patient')}
        </h2>
        <p className="text-gray-500 text-lg mt-1">{t('patient.how_feeling')}</p>
      </div>

      {/* Main CTA Card */}
      <div className="px-4 sm:px-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl shadow-lg shadow-green-200 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FiMic className="text-white text-3xl" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('patient.tell_healora')}</h3>
            <p className="text-white/80 mb-6 text-sm">{t('patient.speak_or_type')}</p>

            {!isOnline && (
              <div className="bg-white/20 rounded-xl px-4 py-2 mb-4 text-sm">
                {t('offline.offline_notice')}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/patient/symptom-input?mode=voice')}
                className="flex-1 flex items-center justify-center gap-2 bg-white text-green-700 font-semibold text-lg px-6 py-4 rounded-2xl hover:bg-green-50 transition-colors active:scale-[0.98]"
              >
                <FiMic className="w-5 h-5" /> {t('patient.speak')}
              </button>
              <button
                onClick={() => navigate('/patient/symptom-input?mode=text')}
                className="flex-1 flex items-center justify-center gap-2 bg-white/20 text-white font-semibold text-lg px-6 py-4 rounded-2xl border border-white/30 hover:bg-white/30 transition-colors active:scale-[0.98]"
              >
                <FiEdit3 className="w-5 h-5" /> {t('patient.type')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 sm:px-6 mt-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.path + action.labelKey}
              to={action.path}
              className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all text-center"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.iconBg}`}>
                <action.icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-sm font-semibold text-gray-700 leading-tight">{t(action.labelKey)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 px-2 py-2 z-40">
        <div className="max-w-2xl mx-auto flex justify-around">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center gap-1 px-3 py-1.5 text-gray-400 hover:text-green-600 transition-colors rounded-lg"
            >
              <item.icon className="text-xl" />
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
