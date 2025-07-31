const CACHE_NAME = 'quiz-biblico-cache-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/script.js',
  '/bible.json',
  '/icon.png',
  '/manifest.json',
  '/sitemap.xml',
  '/robots.txt',
  // Adicione outros arquivos estáticos se necessário
];

// Instalação: pré-cache dos arquivos essenciais
self.addEventListener('install', event => {
  console.log('[SW] Instalando e cacheando assets essenciais...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigos e ativa imediatamente
self.addEventListener('activate', event => {
  console.log('[SW] Ativando e limpando caches antigos...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Busca: responde do cache, tenta rede e atualiza cache, fallback offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' ||
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.includes('/_vercel/insights/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Se offline e não tem no cache, tenta fallback
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          return cachedResponse;
        });

      // Retorna do cache imediatamente, atualiza em background
      return cachedResponse || fetchPromise;
    })
  );
});

// Mensagem: força atualização do SW quando receber 'SKIP_WAITING'
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});