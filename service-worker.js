const CACHE_PREFIX = 'to-do-list-';
const CACHE_NAME = `${CACHE_PREFIX}v2`;

const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './todo.js',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon-180.png',
    './icons/favicon-32.png'
];

// Instala o novo cache com o app shell e ativa imediatamente.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

// Remove caches antigos e assume o controle das páginas abertas.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) =>
                        key !== CACHE_NAME &&
                        (key.startsWith(CACHE_PREFIX) || key === 'meu-pwa-cache-v1')
                    )
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
    } else {
        event.respondWith(staleWhileRevalidate(request, event));
    }
});

// Navegação: rede primeiro, cache como fallback offline.
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request, { cache: 'no-cache' });

        if (response.ok) {
            try {
                await cache.put(request, response.clone());
            } catch (error) {
                console.warn('Não foi possível atualizar o cache:', error);
            }
        }

        return response;
    } catch (error) {
        return (await cache.match(request)) ||
            (await cache.match('./index.html')) ||
            (await cache.match('./')) ||
            Response.error();
    }
}

// Assets: responde do cache e atualiza em segundo plano quando há rede.
function staleWhileRevalidate(request, event) {
    const cachePromise = caches.open(CACHE_NAME);

    const networkPromise = cachePromise
        .then(async (cache) => {
            const response = await fetch(request, { cache: 'no-cache' });

            if (response.ok) {
                try {
                    await cache.put(request, response.clone());
                } catch (error) {
                    console.warn('Não foi possível atualizar o cache:', error);
                }
            }

            return response;
        })
        .catch(() => undefined);

    event.waitUntil(networkPromise);

    return cachePromise.then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        const response = await networkPromise;
        return response || Response.error();
    });
}
