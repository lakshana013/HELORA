const CACHE_VERSION = 1;
const STATIC_CACHE = `healora-static-v${CACHE_VERSION}`;
const API_CACHE = `healora-api-v${CACHE_VERSION}`;
const FONT_CACHE = `healora-fonts-v${CACHE_VERSION}`;

const PRECACHE = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const valid = [STATIC_CACHE, API_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('healora-') && !valid.includes(k)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || offlineResponse()))
    );
    return;
  }

  event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

async function networkFirst(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ success: false, error: 'You are offline', offline: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return offlineResponse();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchP = fetch(request).then((res) => {
    if (res.ok) cache.put(request, res.clone());
    return res;
  }).catch(() => null);
  return cached || (await fetchP) || offlineResponse();
}

function offlineResponse() {
  return new Response('Offline', { status: 503, statusText: 'Offline' });
}
