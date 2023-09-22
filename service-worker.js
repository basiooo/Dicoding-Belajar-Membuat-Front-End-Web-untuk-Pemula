const CACHE_NAME = 'dicoding-submision-v2'
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        'index.html',
        'assets/'
      ])
    })
  )
})
self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)

    try {
      const cachedResponse = await cache.match(event.request)
      if (cachedResponse) {
        return cachedResponse
      }

      const fetchResponse = await fetch(event.request)
      if (fetchResponse) {
        console.log('fetchResponse: ', event.request.url)
        await cache.put(event.request, fetchResponse.clone())
        return fetchResponse
      }
    } catch (error) {
      console.log('Fetch failed: ', error)
      // const cachedResponse = await cache.match('/en/offline.html')
      // return cachedResponse
    }
  })())
})
