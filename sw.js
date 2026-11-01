/* sw.js · Alkitab Vira
   Menyimpan salinan file tampilan & huruf agar aplikasi bisa dibuka tanpa internet.
   Permintaan ke Supabase TIDAK disentuh di sini (data diurus aplikasi sendiri).
   Setiap kali index.html / stylesheet.css / javascript.js diubah, naikkan VERSI. */
const VERSI = "alkitab-vira-v9";
const HURUF = "alkitab-vira-huruf-v1";
const FILE = [
  "./",
  "./index.html",
  "./stylesheet.css",
  "./javascript.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./aset/domba.png",
  "./aset/daun-sudut.png",
  "./aset/bintang-emas.png",
  "./aset/hati.png",
  "./aset/kelopak.png",
  "./aset/buku-terbuka.png",
  "./aset/pita-penanda.png",
  "./aset/wa-hijau.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((nama) => Promise.all(nama.filter((n) => n !== VERSI && n !== HURUF).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Huruf Google: simpan setelah pertama kali dimuat
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(
      caches.open(HURUF).then(async (c) => {
        const ada = await c.match(req);
        if (ada) return ada;
        const r = await fetch(req);
        if (r.ok || r.type === "opaque") c.put(req, r.clone());
        return r;
      })
    );
    return;
  }

  // Hanya file tampilan milik aplikasi ini; selain itu langsung ke internet
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    // Halaman: coba internet dulu (agar versi baru cepat terlihat), kalau gagal pakai salinan
    e.respondWith(
      fetch(req).then((r) => {
        if (r.ok) caches.open(VERSI).then((c) => c.put("./index.html", r.clone()));
        return r;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((ada) => ada || fetch(req))
  );
});
