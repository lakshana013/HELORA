import db from './offlineDb.js';
import connectionManager from './connectionManager.js';

class SyncManager {
  constructor() {
    this._processing = false;
    this._listeners = new Set();
    this._maxRetries = 5;
    this._retryDelay = 3000;
    connectionManager.subscribe((status) => {
      if (status === 'online' && !this._processing) {
        this.processQueue();
      }
    });
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  _notify() {
    for (const fn of this._listeners) {
      try { fn(); } catch {}
    }
  }

  async addToQueue(entity, entityId, action, url, method, data) {
    await db.syncQueue.add({
      entity,
      entityId,
      action,
      url,
      method,
      data: JSON.stringify(data),
      status: 'PENDING_SYNC',
      createdAt: new Date().toISOString(),
      retryCount: 0,
      lastError: null,
      syncedAt: null,
    });
    this._notify();
  }

  async getStats() {
    const all = await db.syncQueue.toArray();
    const pending = all.filter(i => i.status === 'PENDING_SYNC').length;
    const synced = all.filter(i => i.status === 'SYNCED').length;
    const failed = all.filter(i => i.status === 'FAILED').length;
    const lastSync = all
      .filter(i => i.syncedAt)
      .sort((a, b) => b.syncedAt.localeCompare(a.syncedAt))[0]?.syncedAt || null;
    return { pending, synced, failed, total: all.length, lastSync };
  }

  async getQueueItems() {
    return db.syncQueue.orderBy('createdAt').reverse().toArray();
  }

  async processQueue() {
    if (this._processing || !connectionManager.getIsOnline()) return;
    this._processing = true;
    this._notify();

    try {
      const pending = await db.syncQueue
        .where('status').equals('PENDING_SYNC')
        .toArray();

      for (const item of pending) {
        if (!connectionManager.getIsOnline()) break;
        await this._syncItem(item);
      }
    } catch (e) {
      console.error('Sync queue processing error:', e);
    } finally {
      this._processing = false;
      this._notify();
    }
  }

  async _syncItem(item) {
    try {
      const token = localStorage.getItem('healora_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const opts = { method: item.method, headers };
      if (item.data && item.method !== 'GET') {
        opts.body = item.data;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      opts.signal = controller.signal;

      const res = await fetch(item.url, opts);
      clearTimeout(timeout);

      if (res.ok) {
        const serverData = await res.json().catch(() => ({}));
        await db.syncQueue.update(item.localId, {
          status: 'SYNCED',
          syncedAt: new Date().toISOString(),
          serverResponse: JSON.stringify(serverData),
        });

        if (serverData.data?.id && item.entityId?.startsWith('local_')) {
          await this._updateLocalId(item.entity, item.entityId, serverData.data.id);
        }
      } else if (res.status === 409) {
        await db.syncQueue.update(item.localId, {
          status: 'CONFLICT',
          lastError: 'Server conflict - record changed remotely',
          retryCount: item.retryCount + 1,
        });
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (e) {
      const newCount = (item.retryCount || 0) + 1;
      await db.syncQueue.update(item.localId, {
        status: newCount >= this._maxRetries ? 'FAILED' : 'PENDING_SYNC',
        lastError: e.message,
        retryCount: newCount,
      });
    }
    this._notify();
  }

  async _updateLocalId(entity, localId, serverId) {
    const table = db[entity];
    if (!table) return;
    try {
      const record = await table.get(localId);
      if (record) {
        await table.delete(localId);
        await table.put({ ...record, id: serverId, syncStatus: 'SYNCED' });
      }
    } catch {}
  }

  async clearSynced() {
    await db.syncQueue.where('status').equals('SYNCED').delete();
    this._notify();
  }

  isProcessing() {
    return this._processing;
  }
}

const syncManager = new SyncManager();
export default syncManager;
