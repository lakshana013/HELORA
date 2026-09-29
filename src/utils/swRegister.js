export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers not supported');
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      if (worker) {
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') {
            console.log('Healora SW updated and activated');
          }
        });
      }
    });
    console.log('Healora service worker registered');
    return registration;
  } catch (err) {
    console.error('SW registration failed:', err);
    return null;
  }
}
