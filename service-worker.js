self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("matgen-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/style.css",
        "/script.js",
        "/manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      return resp || fetch(event.request);
    })
  );
});

/*Isso permite:

✔ funcionar offline
✔ abrir instantaneamente
✔ virar app instalável
*/