const CACHE_VERSION = 'v2';
const CACHE_NAME = `cycle-tracker-${CACHE_VERSION}`;
// Use relative paths so this works on GitHub Pages subpaths
const ASSETS = [
  'index.html',
  'style.css',
  'app.js',
  'register-sw.js',
  'cycletracker.json',
  'icon-192.png',
  'icon-512.png'
];

// Install event - cache all static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k.startsWith('cycle-tracker-') && k !== CACHE_NAME)
            .map(k => caches.delete(k))
      )
    )
  );
});

// Fetch event - serve from cache, falling back to network
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Handle navigation requests with a network-first strategy, fallback to cached index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('index.html'))
    );
    return;
  }

  // For other requests, use cache-first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
