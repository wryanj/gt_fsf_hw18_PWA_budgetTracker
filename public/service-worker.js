/* -------------------------------------------------------------------------- */
/*                            Service Worker Script                           */
/* -------------------------------------------------------------------------- */

    // Log a message confirming service worker recognition
    console.log("Service Worker Recognized!")


/* ----------- Setup Cache Via Cache API For Storing Files Offline ---------- */

    // Define cache name and files to cache
    const CACHE_NAME = "transactions-cache-v2";
    const DATA_CACHE_NAME = "transactions-cache-v1";
    const FILES_TO_CACHE = [
        "/",
        "/index.html",
        "/index.js",
        "/manifest.webmanifest",
        "/styles.css",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png"
    ];

    // Install Cache & Pre-Cache Key Assets
    self.addEventListener("install", function (evt) {
        // pre cache all static assets
        evt.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
        );
        // Tell browser to activate service worker as soon as it finishes installing
        self.skipWaiting();
    });

    // Activate Service Worker
    self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
        return Promise.all(
            keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                console.log("Removing old cache data", key);
                return caches.delete(key);
            }
            })
        );
        })
    );

    self.clients.claim();
    });

    // Setup service worker to intercept api calls

        /*
            This says that if any fetch request inclues our api routes, 
            I should intercept it, then make the call, and if its successful
            I clone the response to the cache, and if it fails, I check to see
            what the last reponse was to that requesst and use that instead 
        */

        // Add a listner for fetch coming from the client
        self.addEventListener("fetch", function(evt) {
            // If the fetch request is to get all the transactions...
            if (evt.request.url.includes("/api/transactionS")) {

                // Log the request URL that the service worker is intercepting
                console.log('[Service Worker] intercepted request to path ' , evt.request.url);

                // Respond to the Request
                evt.respondWith(
                    
                    // Open the cache transactions-cache-v1 and returns a promise (that is open)
                    caches.open(DATA_CACHE_NAME).then(cache => {

                        // Then Fetch using the request made to the server (if success go to .then, if fail jump to .catch)
                        return fetch(evt.request)

                        // Then after that...
                        .then(response => {

                            // If the response was good, clone it and store it in the cache.
                            if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                            console.log('request to server successful, request cloned to cache');
                            }
                            // And return the response to the client...
                            return response;
                        })
                        // If there was an error getting the response (e.x, network offline)
                        .catch(err => {

                            // Log this to myself
                            console.log('request to server failed, pulling last cloned response from cache');

                            // And Return the results of the last cloned response to that request (that I stored in my cache)
                            return cache.match(evt.request);
                        });

                    //If there was any error opening the cache log an error
                    }).catch(err => console.log(err))
                );
                return;
        }
       
        // This serves the static files from the cache
        evt.respondWith(
            // Open teh cache v1 (holding my static files)
            caches.open(CACHE_NAME).then(cache => {
                // Then return teh static files
                return cache.match(evt.request).then(response => {
                    // Then return the response or fetch based on the reqeust..
                    return response || fetch(evt.request);
                });
            })
        );
        });