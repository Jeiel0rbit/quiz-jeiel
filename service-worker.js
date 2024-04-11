// Verifica se o serviço Worker está offline
function isServiceWorkerOffline() {
  return !navigator.onLine;
}

// Função para redirecionar para a página offline
function redirectToOfflinePage(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match('/offline-page.html');
    })
  );
}

// Adiciona um ouvinte para o evento 'fetch' para interceptar as requisições de rede
self.addEventListener('fetch', function(event) {
  if (isServiceWorkerOffline()) {
    redirectToOfflinePage(event);
  }
});