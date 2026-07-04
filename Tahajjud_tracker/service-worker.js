const CACHE = "tahajjud-v1";

self.addEventListener("install", e=>{
e.waitUntil(
caches.open(CACHE).then(cache=>{
return cache.addAll([
"/tahajjud_tracker/",
"/tahajjud_tracker/index.html",
"/tahajjud_tracker/style.css",
"/tahajjud_tracker/script.js",
"/tahajjud_tracker/icon.png"
]);
})
);
});

self.addEventListener("fetch",e=>{
e.respondWith(
caches.match(e.request).then(r=>r||fetch(e.request))
);
});