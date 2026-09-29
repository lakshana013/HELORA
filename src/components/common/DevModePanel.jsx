import { useConnection } from '../../contexts/ConnectionContext.jsx';
import { useTranslation } from 'react-i18next';
import { FiWifi, FiWifiOff, FiActivity, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const MODES = [
  { id: null, icon: FiX, label: 'Real Network', desc: 'Use actual network status', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { id: 'online', icon: FiWifi, label: 'Force Online', desc: 'Simulate online connection', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'offline', icon: FiWifiOff, label: 'Force Offline', desc: 'Simulate no internet', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'slow', icon: FiActivity, label: 'Slow Network', desc: 'Simulate 2G/3G connection', color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

export default function DevModePanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { status, devMode, setDevMode } = useConnection();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 max-w-lg mx-auto pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('offline.dev_mode') || 'Developer Mode'}</h1>
            <p className="text-sm text-gray-500">Simulate network conditions for testing</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
          <p className="text-sm text-gray-500 mb-1">Current Status</p>
          <p className="text-lg font-bold capitalize text-gray-900">{status}</p>
          {devMode && (
            <p className="text-xs text-amber-600 font-medium mt-1">Dev override active</p>
          )}
        </div>

        <div className="space-y-3">
          {MODES.map((mode) => (
            <button
              key={String(mode.id)}
              onClick={() => setDevMode(mode.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                devMode === mode.id
                  ? `${mode.color} shadow-sm`
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                devMode === mode.id ? mode.color : 'bg-gray-50'
              }`}>
                <mode.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{mode.label}</p>
                <p className="text-sm text-gray-500">{mode.desc}</p>
              </div>
              {devMode === mode.id && (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
