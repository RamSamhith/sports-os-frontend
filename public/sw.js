/*
 * SportsOS Service Worker
 * Version: 1.0.0
 *
 * Caching Strategies:
 * - App Shell (HTML): Network-first with cache fallback
 * - Static Assets (_next/static): Cache-first (immutable, content-hashed)
 * - Images/Icons: Cache-first with network fallback
 * - API Routes: Network-only (never cached)
 * - Offline: Served from pre-cached fallback page
 */

const CACHE_VERSION = 'sportsos-v1';
const STATIC_CACHE = CACHE_VERSION + '-static';
const PAGES_CACHE = CACHE_VERSION + '-pages';
const IMAGES_CACHE = CACHE_VERSION + '-images';

var PRECACHE_URLS = ['/', '/offline', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(function (cache) {
        return cache.addAll(PRECACHE_URLS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  var validCaches = [STATIC_CACHE, PAGES_CACHE, IMAGES_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then(function (names) {
        return Promise.all(
          names
            .filter(function (name) {
              return validCaches.indexOf(name) === -1;
            })
            .map(function (name) {
              return caches.delete(name);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  var pathname = url.pathname;

  if (pathname.startsWith('/api/')) return;

  if (pathname.startsWith('/_next/data/')) {
    event.respondWith(networkFirst(request, PAGES_CACHE));
    return;
  }

  if (pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(pathname) || pathname.startsWith('/images/') || pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request, IMAGES_CACHE));
    return;
  }

  if (/\.(js|css)$/i.test(pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, PAGES_CACHE));
});

function cacheFirst(request, cacheName) {
  return caches.match(request).then(function (cached) {
    if (cached) return cached;

    return fetch(request)
      .then(function (response) {
        if (response && response.ok) {
          var clone = response.clone();
          caches.open(cacheName).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(function () {
        return new Response('', { status: 503, statusText: 'Offline' });
      });
  });
}

function networkFirst(request, cacheName) {
  return fetch(request)
    .then(function (response) {
      if (response && response.ok) {
        var clone = response.clone();
        caches.open(cacheName).then(function (cache) {
          cache.put(request, clone);
        });
      }
      return response;
    })
    .catch(function () {
      return caches.match(request).then(function (cached) {
        if (cached) return cached;
        return caches.match('/offline');
      });
    });
}

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
