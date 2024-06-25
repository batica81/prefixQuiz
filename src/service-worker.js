const CACHE_NAME = "V1";
const STATIC_CACHE_URLS = [
    "app.js",
    "darkmode-js.min.js",
    "favicon.ico",
    "icon-512.png",
    "index.html",
    "manifest.json",
    "prefixList.js",
    "sc01.png",
    "sc02.png",
    "style.css"
];

self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS))
    );
});

self.addEventListener("activate", event => {
    console.log("Service Worker activating.");
});

self.addEventListener("fetch", (event) => {
    // Cache-First Strategy
    event.respondWith(
        caches
            .match(event.request) // check if the request has already been cached
            .then((cached) => cached || fetch(event.request)) // otherwise request network
    );
});
