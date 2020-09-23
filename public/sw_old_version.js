/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
//importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');


if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}

const {precaching, strategies} = workbox;
    // eslint-disable-next-line no-restricted-globals
new precaching.PrecacheController(self.__WB_MANIFEST);

self.addEventListener('fetch', (event) => {
    
    // Con esto funciiona el sitiom completamente offline
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
        caches.open('resourses').then(cache => {
            return cache.match(event.request).then(response => {
                if(response){
                    console.log();
                    return response;
                }
                
                console.log(' No response for %s found in cache. About to fetch from network...', event.request.url);
                return fetch(event.request.clone())
                    .then(response => {
                        console.log('  Response for %s from network is: %O', event.request.url, response);
                        if(response.status < 400){
                            console.log('Caching the response to ', event.request.url); 
                            cache.put(event.request, response.clone());
                        }else {
                            console.log('  Not caching the response to ', event.request.url);
                        }
                        return response;
                    });
            }).catch(err => {
                console.log('Error in fetch handler:', err);
                
            })
        })
    )
    

    
    

  });