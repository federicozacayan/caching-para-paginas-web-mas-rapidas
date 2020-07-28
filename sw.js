let cacheName = 'v1'
let cacheAssets = [
    '/',
    '/fallback.html',
    '/header.html',
]

self.addEventListener('install', function (event) {
    console.log('sw  INSTALADO')
    //caching from a list
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Service Worker: Caching files')
            cache.addAll(cacheAssets)
        }).then(() => self.skipWaiting())
    )
})

//clean old cache
self.addEventListener('activate', function (event) {
    console.log('sw  ACTIVADO')
    //remove unwanted caches
    event.waitUntil(
        caches.keys().then(cacheList => {
            return Promise.all(
                cacheList.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: cleaning old caches')
                        return caches.delete(cache)
                    }
                })
            )
        }))
})

self.addEventListener('fetch', (e) => {
    
    e.respondWith(
        caches.match(e.request).then(res => {
            //getLast request
            let response = fetch(e.request).then(fetchRes => {
                return caches.open(cacheName).then(cache => {
                    console.log('-------------------storing from server', e.request.url)
                    cache.put(e.request, fetchRes.clone())
                    return fetchRes
                })
            }).catch(e=>{
                console.log('*********IMPOSIBLE get from INTERNET')
                if(typeof res == 'undefined'){
                    throw 'No insternet conection'
                }
            })
            if(typeof res !== 'undefined'){
                console.log('answering from cache', e.request.url)
            }
            //attemp retun from cache
            return res || response
        }).catch(() => {
            console.warn('geting a fallback')
            // if (e.request.url.indexOf('.html') > -1) {
                return caches.match('/fallback.html')
            // }
        })
    )


})
