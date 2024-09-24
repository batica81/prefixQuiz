const CACHE_NAME = "v.1.0.3";
const STATIC_CACHE_URLS = [
    "/app.js",
    "/darkmode-js.min.js",
    "/favicon.ico",
    "/icon-192.png",
    "/icon-512.png",
    "/index.html",
    "/keyboard.min.js",
    "/manifest.json",
    "/offline.html",
    "/prefixList.js",
    "/prefixListNEW.js",
    "/prefixListNEW_ForLookup.js",
    "/sc01.png",
    "/sc02.png",
    "/service-worker.js",
    "/style.css"
];

self.addEventListener("install", (event) => {
    console.log("Service Worker installing.");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_CACHE_URLS).catch((error) => {
                console.error("Failed to cache:", error);
                STATIC_CACHE_URLS.forEach(async (url) => {
                    try {
                        await cache.add(url);
                    } catch (e) {
                        console.error(`Failed to cache ${url}:`, e);
                    }
                });
            });
        })
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
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            if (cachedResponse) {
                return cachedResponse;
            }
            // Otherwise, fetch from network
            return fetch(event.request).then((networkResponse) => {
                // Cache the new response for future requests
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                // Fallback to offline.html for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match('/offline.html');
                }
            });
        })
    );
});
