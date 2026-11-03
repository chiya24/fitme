// Offline support: keeps the app and its photos on the device.
// Bump VERSION whenever index.html or the photos change.
const VERSION = "fitme-v1";
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "w/bicycle.jpg",
  "w/bridge.jpg",
  "w/bss.jpg",
  "w/catcow.jpg",
  "w/childpose.jpg",
  "w/deadbug.jpg",
  "w/dip.jpg",
  "w/hamstring.jpg",
  "w/highplank.jpg",
  "w/hipflexor.jpg",
  "w/hipthrust.jpg",
  "w/inchworm.jpg",
  "w/jumpsquat.jpg",
  "w/kickback.jpg",
  "w/legraise.jpg",
  "w/monster.jpg",
  "w/pigeon.jpg",
  "w/plank.jpg",
  "w/pullapart.jpg",
  "w/pushup.jpg",
  "w/rdl.jpg",
  "w/renegade.jpg",
  "w/revcrunch.jpg",
  "w/revlunge.jpg",
  "w/rope.jpg",
  "w/row1.jpg",
  "w/shoulder.jpg",
  "w/sideplank.jpg",
  "w/sideraise.jpg",
  "w/slbridge.jpg",
  "w/splitjump.jpg",
  "w/starjump.jpg",
  "w/stepup.jpg",
  "w/sumo.jpg",
  "w/thruster.jpg",
  "w/tucks.jpg",
  "w/twist.jpg",
  "w/walk.jpg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // The page itself: try the network first so updates arrive, fall back to the saved copy offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return res; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Photos, icons and fonts: saved copy first.
  const keep = url.origin === location.origin || /(^|\.)(gstatic|googleapis)\.com$/.test(url.hostname);
  if (!keep) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
    return res;
  })));
});
