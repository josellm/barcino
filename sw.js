const CACHE_NAME = 'barcino-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/app.js',
  './js/audio.js',
  './js/gameState.js',
  './js/components/AmuletBar.js',
  './js/components/DiplomaScreen.js',
  './js/components/IntroScreen.js',
  './js/components/Mission0Screen.js',
  './js/components/OnboardingFlow.js',
  './js/components/StageScreen.js',
  './data/stages.json',
  './assets/audio/barcino.mp3',
  './assets/img/barcino_intro.jpeg',
  './assets/img/bosc-fades-bg.jpg',
  './assets/img/intro-bg.jpg',
  './assets/img/palau-bg.jpg',
  './assets/img/placa-rei-bg.jpg',
  './assets/img/pont-bisbe-bg.jpg',
  './assets/img/santa-ana-bg.jpg',
  './assets/img/templo-augusto-bg.jpg',
  './assets/img/text.jpg',
  './assets/icons/icon-192.svg',
  './assets/icons/icon-512.svg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(APP_SHELL);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(cacheNames
        .filter(function (cacheName) {
          return cacheName !== CACHE_NAME;
        })
        .map(function (cacheName) {
          return caches.delete(cacheName);
        }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(function (response) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put('./index.html', responseCopy);
          });
          return response;
        })
        .catch(function () {
          return caches.match('./index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(function (response) {
        if (response.ok) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      });
    })
  );
});
