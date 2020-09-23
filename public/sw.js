import {registerRoute} from 'workbox-routing';
import {NetworkFirst, StaleWhileRevalidate} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {precacheAndRoute} from 'workbox-precaching';

// eslint-disable-next-line no-restricted-globals
precacheAndRoute(self.__WB_MANIFEST);


/**
 * No son necesarios porque ya se cachean estos recursos con "precacheAndRoute" * 
 * 
         registerRoute(
           ({request}) => request.destination === 'script',
           new CacheFirst()
         );
         registerRoute(
             ({request}) => request.destination === 'style',
             new CacheFirst({
                 cacheName: 'css-cache'
             })
         )
 * 
 */

registerRoute('http://localhost:3001/data', 
    new NetworkFirst({
        cacheName: 'server-data',
        // Tiempo a esperar por el service worker antes de responder con los datos de la cache
        networkTimeoutSeconds: 1
    })
)

registerRoute(
    ({request, url}) => {
        return url.href.startsWith('http://localhost:3001/public/images/avatars/');
    },
    new StaleWhileRevalidate({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 7 * 24 * 60 * 60
            })
        ]
    })
)

