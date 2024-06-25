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
    "service-worker.js",
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
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if(!CACHE_NAME.includes(key)){
                    return caches.delete(key);
                }
            })
        ))
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then(cached => cached
                // network request if not in cache
                || fetch(event.request).catch(() =>
                    // fallback: return offline.html if fetch fails
                    caches.match('offline.html')
                )
            )
    );
});
