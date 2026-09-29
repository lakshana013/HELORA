class ConnectionManager {
  constructor() {
    this._isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this._listeners = new Set();
    this._devMode = null;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this._update(true));
      window.addEventListener('offline', () => this._update(false));
    }
  }

  _update(online) {
    if (this._devMode !== null) return;
    const prev = this._isOnline;
    this._isOnline = online;
    if (prev !== online) this._notify();
  }

  _notify() {
    const status = this.getStatus();
    for (const fn of this._listeners) {
      try { fn(status); } catch (e) { console.error('Connection listener error:', e); }
    }
  }

  getIsOnline() {
    if (this._devMode === 'offline') return false;
    if (this._devMode === 'online' || this._devMode === 'slow') return true;
    return this._isOnline;
  }

  getStatus() {
    if (this._devMode) return this._devMode;
    return this._isOnline ? 'online' : 'offline';
  }

  isSlow() {
    return this._devMode === 'slow';
  }

  subscribe(fn) {
    this._listeners.add(fn);
    return () => this._listeners.delete(fn);
  }

  setDevMode(mode) {
    this._devMode = mode;
    this._notify();
  }

  getDevMode() {
    return this._devMode;
  }
}

const connectionManager = new ConnectionManager();
export default connectionManager;
