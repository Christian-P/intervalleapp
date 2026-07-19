const CACHE_NAME = 'laufband-app-v1';
const ASSETS = [
  'laufband.html',
  'manifest.json'
];

// 1. Dateien beim ersten Laden in den Cache sperren
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Alten Cache löschen, falls du die App updatest
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Netzwerkanfragen abfangen und stattdessen die Offline-Kopie ausgeben
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Wenn im Cache vorhanden, nutze die Offline-Kopie, sonst lade aus dem Internet
      return cachedResponse || fetch(event.request);
    })
  );
});
