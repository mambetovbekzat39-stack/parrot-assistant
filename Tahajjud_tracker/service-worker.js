const CACHE_NAME = "tahajjud-v5";

const urlsToCache = [
  "/tahajjud_tracker/",
  "/tahajjud_tracker/index.html",
  "/tahajjud_tracker/icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});