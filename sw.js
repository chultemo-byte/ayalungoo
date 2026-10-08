var CACHE = "ayalungoo-school-9";
var ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/melody.html",
  "/amita-show.html",
  "/swimming/",
  "/swimming/index.html",
  "/swimming/lesson.html",
  "/swimming/lessons.js",
  "/swimming/school.css",
  "/swimming/amita.css",
  "/swimming/amita.js",
  "/swimming/scenes.js",
  "/swimming/rig.js",
  "/swimming/amita-locked.jpg",
  "/swimming/parts/body.png",
  "/swimming/parts/arm-l.png",
  "/swimming/parts/arm-r.png",
  "/swimming/parts/thigh-l.png",
  "/swimming/parts/thigh-r.png",
  "/swimming/parts/calf-l.png",
  "/swimming/parts/calf-r.png",
  "/swimming/hero-banner.jpg",
  "/swimming/app.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return cache.addAll(ASSETS);
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key !== CACHE;
    }).map(function (key) {
      return caches.delete(key);
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async function () {
    try {
      var fresh = await fetch(req);
      var cache = await caches.open(CACHE);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      var cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === "navigate") return caches.match("/index.html");
      throw err;
    }
  })());
});
