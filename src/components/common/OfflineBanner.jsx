import { useConnection } from '../../contexts/ConnectionContext.jsx';
import { useTranslation } from 'react-i18next';
import { FiWifiOff } from 'react-icons/fi';

export default function OfflineBanner() {
  const { isOnline, status } = useConnection();
  const { t } = useTranslation();

  if (isOnline && status !== 'slow') return null;

  return (
    <div className={`fixed top-14 left-0 right-0 z-40 text-center text-sm font-medium py-2 px-4 flex items-center justify-center gap-2 transition-all ${
      status === 'slow'
        ? 'bg-amber-50 text-amber-800 border-b border-amber-200'
        : 'bg-orange-50 text-orange-800 border-b border-orange-200'
    }`}>
      <FiWifiOff className="w-4 h-4 flex-shrink-0" />
      <span>
        {status === 'slow'
          ? (t('offline.slow_connection') || 'Slow network detected. Some features may be delayed.')
          : (t('offline.banner_text') || 'You are offline. Your data is saved locally and will sync when connected.')}
      </span>
    </div>
  );
}
