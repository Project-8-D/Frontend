try {
    const PRECACHE = "precache-v2";
    const RUNTIME = "runtime";

    // A list of local resources we always want to be cached.
    const PRECACHE_URLS = [
    `https://fonts.googleapis.com/icon?family=Material+Icons+Round`, // Alias for index.html
    ];

    // The install handler takes care of precaching the resources we always need.
    self.addEventListener("install", (event) => {
    console.log("installing sw");
    event.waitUntil(
        caches
        .open(PRECACHE)
        .then((cache) => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
    });
    // The activate handler takes care of cleaning up old caches.
    self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];
    console.log("activate cache");
    event.waitUntil(
        caches
        .keys()
        .then((cacheNames) => {
            return cacheNames.filter(
            (cacheName) => !currentCaches.includes(cacheName)
            );
        })
        .then((cachesToDelete) => {
            console.log("cache is deleting");
            return Promise.all(
            cachesToDelete.map((cacheToDelete) => {
                return caches.delete(cacheToDelete);
            })
            );
        })
        .then(() => self.clients.claim())
    );
    });
    
    self.addEventListener("fetch", event => {
        event.respondWith(
            fetch(event.request).then(async response => {
                if (response.ok) {
                    let url = event.request.url;
                    if (new URL(event.request.url).origin === location.origin)
                        url = url.split(/[?#]/g)[0];
                    const cache = await caches.open(RUNTIME);
                    cache.put(url, response.clone());
                    return response;
                }
                throw new Error("Network request failed");
            }).catch(async () => {
                const response = await caches.match(event.request, { ignoreSearch: true });
                if (response)
                    return response;
                if (new URL(event.request.url).pathname.split("/").pop().indexOf(".") < 0)
                    return caches.match("/");
            })
        );
    });

} catch(e) {
  console.log(e)
}
