import connectionManager from './connectionManager.js';
import db, { cacheServerData, getCachedData } from './offlineDb.js';
import syncManager from './syncManager.js';

const BASE_URL = '';
const TIMEOUT = 10000;
const MAX_RETRIES = 2;

const API_TO_TABLE = {
  '/api/patients/profile': 'patients',
  '/api/patients/health-history': 'healthHistory',
  '/api/patients/sessions': 'symptomSessions',
  '/api/medicines': 'medicines',
  '/api/ayurveda': 'ayurvedaHerbs',
  '/api/facilities': 'healthFacilities',
  '/api/facilities/nearby': 'healthFacilities',
  '/api/camps': 'healthCamps',
  '/api/doctors/profile': 'doctors',
  '/api/doctors/patients': 'patients',
  '/api/doctors/stats': null,
  '/api/auth/me': 'users',
};

function getAuthHeaders() {
  const token = localStorage.getItem('healora_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function handleUnauthorized() {
  localStorage.removeItem('healora_token');
  localStorage.removeItem('healora_user');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

function getCacheTable(url) {
  for (const [prefix, table] of Object.entries(API_TO_TABLE)) {
    if (url.startsWith(prefix)) return table;
  }
  return null;
}

async function fetchWithTimeout(url, options, timeout = TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  if (connectionManager.isSlow()) {
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 2000));
  }

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    throw e;
  }
}

async function request(url, options = {}, retries = MAX_RETRIES) {
  const fullUrl = `${BASE_URL}${url}`;
  const method = options.method || 'GET';
  const isOnline = connectionManager.getIsOnline();

  if (!isOnline && method === 'GET') {
    return offlineGet(url);
  }

  if (!isOnline && (method === 'POST' || method === 'PUT')) {
    return offlineMutate(url, method, options.body);
  }

  if (!isOnline) {
    throw createOfflineError();
  }

  const config = { headers: getAuthHeaders(), ...options };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(fullUrl, config);

      if (response.status === 401) {
        handleUnauthorized();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `Request failed with status ${response.status}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      if (response.status === 204) return null;

      const data = await response.json();

      if (method === 'GET') {
        const table = getCacheTable(url);
        if (table && data) {
          const toCache = Array.isArray(data) ? data : data.data ? (Array.isArray(data.data) ? data.data : [data.data]) : null;
          if (toCache) cacheServerData(table, toCache).catch(() => {});
        }
      }

      return data;
    } catch (error) {
      if (error.message === 'Unauthorized') throw error;
      if (error.status && error.status < 500) throw error;

      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      if (method === 'GET') {
        try {
          return await offlineGet(url);
        } catch {
          // fall through to throw original error
        }
      }

      if (!error.status) {
        error.message = 'Network error. Please check your connection.';
        error.offline = true;
      }
      throw error;
    }
  }
}

async function offlineGet(url) {
  const table = getCacheTable(url);
  if (!table) {
    throw createOfflineError();
  }
  const cached = await getCachedData(table);
  if (cached && cached.length > 0) {
    return { data: cached, _fromCache: true, _offline: true };
  }
  throw createOfflineError();
}

async function offlineMutate(url, method, body) {
  let parsed = {};
  try { parsed = body ? JSON.parse(body) : {}; } catch {}

  const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const entity = getCacheTable(url);

  if (entity && db[entity]) {
    try {
      await db[entity].put({ ...parsed, id: localId, syncStatus: 'PENDING_SYNC', createdAt: new Date().toISOString() });
    } catch {}
  }

  const fullUrl = `${BASE_URL}${url}`;
  await syncManager.addToQueue(entity || 'unknown', localId, method === 'POST' ? 'create' : 'update', fullUrl, method, parsed);

  return { data: { ...parsed, id: localId }, _offline: true, _pendingSync: true };
}

function createOfflineError() {
  const err = new Error('You are offline. This data is not available locally.');
  err.offline = true;
  return err;
}

const api = {
  get(url) {
    return request(url, { method: 'GET' });
  },
  post(url, body) {
    return request(url, { method: 'POST', body: JSON.stringify(body) });
  },
  put(url, body) {
    return request(url, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete(url) {
    return request(url, { method: 'DELETE' });
  },
};

export default api;
