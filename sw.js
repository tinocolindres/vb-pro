// MacroCiclo VB PRO — Service Worker v4 (SELF-DESTRUCT)
// This SW unregisters itself and clears ALL caches on activation

self.addEventListener('install', () => {
  console.log('[SW v4] Installing self-destruct SW');
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', async () => {
  console.log('[SW v4] Activating — clearing all caches and unregistering');
  
  // Clear ALL caches
  const keys = await caches.keys();
  await Promise.all(keys.map(k => caches.delete(k)));
  console.log('[SW v4] All caches cleared:', keys);
  
  // Unregister self
  await self.registration.unregister();
  console.log('[SW v4] Service Worker unregistered');
  
  // Force all clients to reload with fresh content
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const client of clients) {
    client.navigate(client.url);
  }
});

// Pass all fetches through to network — no caching
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
