const CACHE_NAME = "rk-health-fitness-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",
  "/calculators.html",
  "/workouts.html",
  "/diet.html",
  "/privacy.html",
  "/terms.html",
  "/copyright.html",
  "/admin.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-192.png",
  "/icons/icon-maskable-512.png"
];

// Install — caching
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener("fetch", (evt) => {
  evt.respondWith(
    fetch(evt.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, clone));
        return res;
      })
      .catch(() => caches.match(evt.request))
  );
});