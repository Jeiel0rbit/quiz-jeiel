self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('quiz-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/script.js',
          '/style.css',
          '/manifest.json',
          '/icon.png'
          // Adicione outros recursos do seu aplicativo aqui
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  