// The old MAX web app installed a service worker that cached its pages. This one replaces it once, clears those
// caches, unregisters itself and reloads open tabs, so returning visitors get the new site.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key);
      await self.registration.unregister();
      for (const client of await self.clients.matchAll({ type: "window" })) client.navigate(client.url);
    })(),
  );
});
