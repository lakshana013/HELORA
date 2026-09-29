import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSync } from '../../contexts/SyncContext.jsx';
import { useConnection } from '../../contexts/ConnectionContext.jsx';
import { FiRefreshCw, FiCheck, FiClock, FiAlertCircle, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';

const STATUS_CONFIG = {
  PENDING_SYNC: { icon: FiClock, color: 'text-amber-600 bg-amber-50', label: 'Pending' },
  SYNCED: { icon: FiCheck, color: 'text-green-600 bg-green-50', label: 'Synced' },
  FAILED: { icon: FiAlertCircle, color: 'text-red-600 bg-red-50', label: 'Failed' },
  CONFLICT: { icon: FiAlertCircle, color: 'text-purple-600 bg-purple-50', label: 'Conflict' },
};

export default function SyncStatusPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stats, isProcessing, triggerSync, clearSynced, getQueueItems } = useSync();
  const { isOnline } = useConnection();
  const [items, setItems] = useState([]);

  useEffect(() => {
    getQueueItems().then(setItems);
  }, [getQueueItems, stats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 px-4 sm:px-6 max-w-2xl mx-auto pb-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('offline.sync_status') || 'Sync Status'}</h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100">
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-xs font-medium text-amber-600 mt-1">{t('offline.pending') || 'Pending'}</p>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
            <p className="text-2xl font-bold text-green-700">{stats.synced}</p>
            <p className="text-xs font-medium text-green-600 mt-1">{t('offline.synced') || 'Synced'}</p>
          </div>
          <div className="bg-red-50 rounded-2xl p-4 text-center border border-red-100">
            <p className="text-2xl font-bold text-red-700">{stats.failed}</p>
            <p className="text-xs font-medium text-red-600 mt-1">{t('offline.failed') || 'Failed'}</p>
          </div>
        </div>

        {stats.lastSync && (
          <p className="text-sm text-gray-500 mb-4">
            {t('offline.last_sync') || 'Last sync'}: {new Date(stats.lastSync).toLocaleString()}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={triggerSync}
            disabled={!isOnline || isProcessing || stats.pending === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiRefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            {isProcessing ? (t('offline.syncing') || 'Syncing...') : (t('offline.sync_now') || 'Sync Now')}
          </button>
          {stats.synced > 0 && (
            <button
              onClick={clearSynced}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{t('offline.clear_synced') || 'Clear Synced'}</span>
            </button>
          )}
        </div>

        {/* Queue items */}
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
              <FiCheck className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">{t('offline.queue_empty') || 'Sync queue is empty'}</p>
            </div>
          ) : (
            items.map((item) => {
              const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.PENDING_SYNC;
              const Icon = cfg.icon;
              return (
                <div key={item.localId} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.entity} - {item.action}</p>
                    <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                    {item.lastError && (
                      <p className="text-xs text-red-500 mt-0.5 truncate">{item.lastError}</p>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
