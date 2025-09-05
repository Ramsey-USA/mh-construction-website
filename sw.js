/* MH Construction - Service Worker for PWA Support */

const CACHE_NAME = 'mh-construction-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/projects.html',
  '/contact.html',
  '/css/style.css',
  '/css/responsive.css',
  '/css/components.css',
  '/css/chatbot.css',
  '/js/main.js',
  '/js/navigation.js',
  '/js/gallery.js',
  '/js/chatbot.js',
  '/images/logo.png',
  '/images/hero/construction-hero-poster.jpg',
  'https://fonts.googleapis.com/css2?family=Saira:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(function(err) {
        console.log('Cache install failed:', err);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
