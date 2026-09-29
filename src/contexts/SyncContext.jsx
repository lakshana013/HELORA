import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import syncManager from '../utils/syncManager.js';

const SyncContext = createContext({
  stats: { pending: 0, synced: 0, failed: 0, total: 0, lastSync: null },
  isProcessing: false,
  triggerSync: () => {},
  clearSynced: () => {},
  getQueueItems: async () => [],
});

export function SyncProvider({ children }) {
  const [stats, setStats] = useState({ pending: 0, synced: 0, failed: 0, total: 0, lastSync: null });
  const [isProcessing, setIsProcessing] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const s = await syncManager.getStats();
      setStats(s);
      setIsProcessing(syncManager.isProcessing());
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    return syncManager.subscribe(refresh);
  }, [refresh]);

  const triggerSync = useCallback(() => {
    syncManager.processQueue();
  }, []);

  const clearSynced = useCallback(async () => {
    await syncManager.clearSynced();
  }, []);

  const getQueueItems = useCallback(() => {
    return syncManager.getQueueItems();
  }, []);

  return (
    <SyncContext.Provider value={{ stats, isProcessing, triggerSync, clearSynced, getQueueItems }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}

export default SyncContext;
