const CACHE_NAME = 'robot-control-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Кэширование файлов');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.log('Ошибка кэширования:', err))
    );
});

// Активация Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Удаление старого кэша:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Перехват запросов
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Из кэша:', event.request.url);
                    return response;
                }
                console.log('Из сети:', event.request.url);
                return fetch(event.request);
            })
            .catch(() => {
                console.log('Офлайн, нет в кэше:', event.request.url);
            })
    );
});
