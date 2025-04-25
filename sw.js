// sw.js
const CACHE_NAME = 'quiz-biblico-cache-v1'; // Incremente a versão se fizer mudanças significativas

// Evento de Instalação: Apenas garante que o SW avance para ativação
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  // Força o SW a pular a fase de espera e ativar imediatamente
  event.waitUntil(self.skipWaiting());
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Cache antigo limpo. Pronto para controlar clientes!');
      // Garante que o SW ativo controle as páginas abertas imediatamente
      return self.clients.claim();
    })
  );
});

// Evento Fetch: Tenta a rede primeiro, se falhar, tenta o cache. Cacheia respostas bem-sucedidas da rede.
self.addEventListener('fetch', event => {
  // Ignora requisições não-GET e de extensões/vercel
  if (event.request.method !== 'GET' ||
      event.request.url.startsWith('chrome-extension://') ||
      event.request.url.includes('/_vercel/insights/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Verifica se recebemos uma resposta válida da rede
        if (networkResponse && networkResponse.status === 200) {
          // Clona a resposta - precisamos de uma cópia para o cache e outra para o navegador
          const responseToCache = networkResponse.clone();
          // Abre o cache e armazena a resposta da rede
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        // Retorna a resposta original da rede para o navegador
        return networkResponse;
      })
      .catch(error => {
        // A rede falhou (offline ou erro) - tenta buscar no cache
        console.log('[Service Worker] Rede falhou, tentando o cache para:', event.request.url);
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              // Encontrou no cache, retorna a resposta cacheada
              return cachedResponse;
            }
            // Não encontrou na rede nem no cache.
            // Opcional: Retornar uma página offline padrão aqui
            // return caches.match('/offline.html');
            console.error('[Service Worker] Recurso não encontrado na rede nem no cache:', event.request.url);
            // Retorna undefined para deixar o navegador lidar com o erro padrão
            return undefined;
          });
      })
  );
});
