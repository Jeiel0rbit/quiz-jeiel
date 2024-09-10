// Nome do cache
const CACHE_NAME = 'site-cache-v1';

// Arquivos a serem armazenados no cache
const urlsToCache = [
  '/',
  '/index.html',
  '/resultado.html',
  '/bible.json',
  '/script.js',
];

// Instalando o Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Abrindo cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Buscando os arquivos do cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retorna o arquivo do cache ou busca da rede
        return response || fetch(event.request);
      })
  );
});

// Atualizando o cache quando há mudanças
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
