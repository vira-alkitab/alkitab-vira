/* =====================================================================
   javascript.js · Alkitab Vira
   ---------------------------------------------------------------------
   SATU-SATUNYA bagian yang Anda isi ada di blok CONFIG di bawah ini.
   Kedua nilai ini BUKAN rahasia (memang dirancang Supabase untuk
   dipasang di tampilan). Keamanan dijaga aturan penjaga di database.
   JANGAN pernah menempel "service_role key" di sini.
   ===================================================================== */
const CONFIG = {
  SUPABASE_URL: "https://rxjtaifyqkiiounerhlr.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_h2zHyRG0srCis4In5sFjVQ_qE0vPhMH",
};
/* ===================================================================== */

/* Fitur yang sedang disembunyikan dari menu. Ubah ke true untuk menampilkan lagi.
   Datanya tidak dihapus. */
const FITUR = { lagu: false, cerita: false };

/* ---------------------------------------------------------------------
   1. ALAT BANTU
   --------------------------------------------------------------------- */
const $ = (sel, el = document) => el.querySelector(sel);

/** Membuat elemen. Teks selalu lewat textContent (aman dari kode jahat).
    Gaya (style) diberikan sebagai objek, mis. { left: "10px" }, karena aturan
    keamanan halaman (CSP) menolak gaya yang ditulis sebagai teks. */
function h(tag, props, ...anak) {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "style") { if (typeof v === "object") Object.assign(el.style, v); }
      else if (k === "text") el.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "value") el.value = v;
      else if (k === "checked" || k === "disabled" || k === "hidden") el[k] = !!v;
      else el.setAttribute(k, v === true ? "" : v);
    }
  }
  tambahAnak(el, anak);
  return el;
}
function tambahAnak(el, anak) {
  for (const a of anak.flat(Infinity)) {
    if (a == null || a === false) continue;
    el.append(a instanceof Node ? a : document.createTextNode(String(a)));
  }
}
function kosongkan(el) { while (el.firstChild) el.firstChild.remove(); return el; }

/* Ikon garis sederhana (gambar tetap, bukan dari data pengguna). */
const IKON = {
  rumah: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  buku: '<path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z"/>',
  musik: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  gambar: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  pena: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  cari: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  putar: '<path d="M7 4v16l13-8z" fill="currentColor" stroke="none"/>',
  jeda: '<path d="M7 4h4v16H7zM13 4h4v16h-4z" fill="currentColor" stroke="none"/>',
  lanjut: '<path d="M5 4l10 8-10 8z" fill="currentColor"/><path d="M19 5v14"/>',
  mundur: '<path d="M19 20 9 12l10-8z" fill="currentColor"/><path d="M5 19V5"/>',
  unduh: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  unggah: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',
  centang: '<path d="M20 6 9 17l-5-5"/>',
  tutup: '<path d="M18 6 6 18M6 6l12 12"/>',
  tambah: '<path d="M12 5v14M5 12h14"/>',
  kembali: '<path d="m15 18-6-6 6-6"/>',
  maju: '<path d="m9 18 6-6-6-6"/>',
  bawah: '<path d="m6 9 6 6 6-6"/>',
  penanda: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  salin: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  atur: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  sampah: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
  naik: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  turun: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  keluar: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  awan: '<path d="M2 2l20 20M17.5 17.5H7a5 5 0 0 1-1.8-9.7M10 5.3A6 6 0 0 1 18 10a4 4 0 0 1 3 6.6"/>',
  sisip: '<path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z"/><path d="M16 4v6M13 7h6"/><path d="M12 9v12a3 3 0 0 1 3-3h7v-5"/>',
  segar: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
  hati: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  hatiPenuh: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" fill="currentColor"/>',
};
function ikon(nama, ukuran = 22) {
  const s = document.createElement("span");
  s.className = "ikon";
  s.setAttribute("aria-hidden", "true");
  s.innerHTML = `<svg width="${ukuran}" height="${ukuran}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IKON[nama] || ""}</svg>`;
  return s;
}

let waktuKilat;
function kilat(teks, detik = 2.6) {
  const el = $("#pesan-kilat");
  el.textContent = teks;
  el.hidden = false;
  clearTimeout(waktuKilat);
  waktuKilat = setTimeout(() => (el.hidden = true), detik * 1000);
}

const fmtTanggal = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const fmtTanggalPendek = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" });
function tanggalLokal(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
function teksTanggal(iso, pendek) {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return (pendek ? fmtTanggalPendek : fmtTanggal).format(new Date(y, m - 1, d));
}
function durasi(detik) {
  detik = Math.max(0, Math.round(detik || 0));
  return `${Math.floor(detik / 60)}:${String(detik % 60).padStart(2, "0")}`;
}
function ukuranMB(b) { return (b / 1048576).toFixed(b > 10485760 ? 0 : 1) + " MB"; }
function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
  const x = [...b].map((v) => v.toString(16).padStart(2, "0")).join("");
  return `${x.slice(0, 8)}-${x.slice(8, 12)}-${x.slice(12, 16)}-${x.slice(16, 20)}-${x.slice(20)}`;
}
function baca(k, awal) { try { const v = localStorage.getItem("rohani." + k); return v == null ? awal : JSON.parse(v); } catch { return awal; } }
function tulis(k, v) { try { localStorage.setItem("rohani." + k, JSON.stringify(v)); } catch { /* abaikan */ } }
function tunda(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
function batasi(teks, n) { return String(teks || "").slice(0, n); }

/* ---------------------------------------------------------------------
   2. PENYIMPANAN DI HP (IndexedDB)
   kv     : data (lagu, cerita, catatan, ...), teks Alkitab
   berkas : file lagu & gambar yang sudah diunduh
   --------------------------------------------------------------------- */
const DB = (() => {
  let janji;
  const buka = () => (janji ||= new Promise((ok, gagal) => {
    const r = indexedDB.open("alkitab-vira", 1);
    r.onupgradeneeded = () => { r.result.createObjectStore("kv"); r.result.createObjectStore("berkas"); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => gagal(r.error);
  }));
  async function op(toko, mode, fn) {
    const db = await buka();
    return new Promise((ok, gagal) => {
      const tx = db.transaction(toko, mode);
      const req = fn(tx.objectStore(toko));
      tx.oncomplete = () => ok(req ? req.result : undefined);
      tx.onerror = () => gagal(tx.error);
      tx.onabort = () => gagal(tx.error);
    });
  }
  return {
    ambil: (t, k) => op(t, "readonly", (s) => s.get(k)),
    simpan: (t, k, v) => op(t, "readwrite", (s) => s.put(v, k)),
    hapus: (t, k) => op(t, "readwrite", (s) => s.delete(k)),
    kunci: (t) => op(t, "readonly", (s) => s.getAllKeys()),
    bersihkan: (t) => op(t, "readwrite", (s) => s.clear()),
  };
})();

/* ---------------------------------------------------------------------
   3. SAMBUNGAN KE SUPABASE (login Google, database, file)
   --------------------------------------------------------------------- */
class GalatSesi extends Error {}

const SB = (() => {
  const U = CONFIG.SUPABASE_URL.replace(/\/+$/, "");
  const K = CONFIG.SUPABASE_ANON_KEY;
  let sesi = baca("sesi", null);
  const simpanSesi = (s) => { sesi = s; s ? tulis("sesi", s) : localStorage.removeItem("rohani.sesi"); };
  const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const alamatKembali = () => location.origin + location.pathname;

  function dariToken(j, lama) {
    const u = j.user || {};
    const meta = u.user_metadata || {};
    simpanSesi({
      access_token: j.access_token,
      refresh_token: j.refresh_token,
      expires_at: j.expires_at || Math.floor(Date.now() / 1000) + (j.expires_in || 3600),
      email: u.email || lama?.email || "",
      nama: meta.full_name || meta.name || lama?.nama || "",
    });
  }

  async function masukGoogle() {
    const verifier = b64url(crypto.getRandomValues(new Uint8Array(48)));
    const tantangan = b64url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
    tulis("pkce", verifier);
    const p = new URLSearchParams({
      provider: "google",
      redirect_to: alamatKembali(),
      code_challenge: tantangan,
      code_challenge_method: "s256",
    });
    location.assign(`${U}/auth/v1/authorize?${p}`);
  }

  async function tanganiKembali() {
    const q = new URLSearchParams(location.search);
    const kode = q.get("code");
    const galat = q.get("error_description") || q.get("error");
    if (!kode && !galat) return false;
    history.replaceState(null, "", location.pathname + location.hash);
    if (galat) throw new Error(galat);
    const verifier = baca("pkce", "");
    localStorage.removeItem("rohani.pkce");
    const r = await fetch(`${U}/auth/v1/token?grant_type=pkce`, {
      method: "POST",
      headers: { apikey: K, "Content-Type": "application/json" },
      body: JSON.stringify({ auth_code: kode, code_verifier: verifier }),
    });
    if (!r.ok) throw new Error("Gagal masuk (" + r.status + ")");
    dariToken(await r.json());
    return true;
  }

  let segarkan = null;
  async function token() {
    if (!sesi) throw new GalatSesi("belum masuk");
    if (sesi.expires_at - 90 > Date.now() / 1000) return sesi.access_token;
    segarkan ||= (async () => {
      const r = await fetch(`${U}/auth/v1/token?grant_type=refresh_token`, {
        method: "POST",
        headers: { apikey: K, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: sesi.refresh_token }),
      });
      if (r.status === 400 || r.status === 401 || r.status === 403) { simpanSesi(null); throw new GalatSesi("sesi habis"); }
      if (!r.ok) throw new Error("jaringan");
      dariToken(await r.json(), sesi);
    })().finally(() => (segarkan = null));
    await segarkan;
    return sesi.access_token;
  }

  async function minta(url, opsi = {}) {
    const t = await token();
    const r = await fetch(url, { ...opsi, headers: { apikey: K, Authorization: "Bearer " + t, ...(opsi.headers || {}) } });
    if (r.status === 401) { simpanSesi(null); throw new GalatSesi("ditolak"); }
    if (!r.ok) {
      const isi = await r.text().catch(() => "");
      console.error("Supabase", r.status, isi);
      throw new Error("Permintaan gagal (" + r.status + ")");
    }
    return r;
  }
  const JSONH = { "Content-Type": "application/json" };
  const jalur = (p) => p.split("/").map(encodeURIComponent).join("/");

  const db = {
    ambil: async (tabel, q = "select=*") => (await minta(`${U}/rest/v1/${tabel}?${q}`)).json(),
    simpan: async (tabel, baris, konflik) =>
      (await minta(`${U}/rest/v1/${tabel}${konflik ? "?on_conflict=" + konflik : ""}`, {
        method: "POST",
        headers: { ...JSONH, Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(baris),
      })).json(),
    ubah: async (tabel, filter, isi) =>
      (await minta(`${U}/rest/v1/${tabel}?${filter}`, {
        method: "PATCH", headers: { ...JSONH, Prefer: "return=representation" }, body: JSON.stringify(isi),
      })).json(),
    hapus: (tabel, filter) => minta(`${U}/rest/v1/${tabel}?${filter}`, { method: "DELETE" }),
    rpc: async (fn, arg = {}) => (await minta(`${U}/rest/v1/rpc/${fn}`, { method: "POST", headers: JSONH, body: JSON.stringify(arg) })).json(),
  };
  const berkas = {
    unggah: (bucket, path, file, jenis) =>
      minta(`${U}/storage/v1/object/${bucket}/${jalur(path)}`, {
        method: "POST",
        headers: { "Content-Type": jenis || file.type || "application/octet-stream", "x-upsert": "true", "cache-control": "31536000" },
        body: file,
      }),
    unduh: async (bucket, path) => (await minta(`${U}/storage/v1/object/authenticated/${bucket}/${jalur(path)}`)).blob(),
    tautan: async (bucket, path, detik = 7200) => {
      const j = await (await minta(`${U}/storage/v1/object/sign/${bucket}/${jalur(path)}`, {
        method: "POST", headers: JSONH, body: JSON.stringify({ expiresIn: detik }),
      })).json();
      return U + "/storage/v1" + (j.signedURL || j.signedUrl);
    },
    hapus: (bucket, paths) => minta(`${U}/storage/v1/object/${bucket}`, { method: "DELETE", headers: JSONH, body: JSON.stringify({ prefixes: paths }) }),
  };

  async function keluar() {
    try { if (sesi && navigator.onLine) await fetch(`${U}/auth/v1/logout`, { method: "POST", headers: { apikey: K, Authorization: "Bearer " + sesi.access_token } }); } catch { /* abaikan */ }
    simpanSesi(null);
  }

  return {
    masukGoogle, tanganiKembali, keluar, db, berkas,
    adaSesi: () => !!sesi,
    email: () => sesi?.email || "",
    nama: () => sesi?.nama || "",
    siap: () => /^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(U) && !K.startsWith("ISI-") && K.length > 20,
  };
})();

/* ---------------------------------------------------------------------
   4. DATA & ALKITAB
   --------------------------------------------------------------------- */
const D = {
  alkitab: null, kitabKode: new Map(),
  lagu: [], playlist: [], cerita: [], halaman: [], catatan: [], tanda: null, pengaturan: {},
  simpan: [], // ayat tersimpan (ayat pilihan), terpisah dari baca harian
  berkas: new Set(), waktuSinkron: null,
  antrian: { catatan: {}, tanda: false, simpan: {} },
};

async function muatLokal() {
  const [data, antrian, alkitab, kunci] = await Promise.all([
    DB.ambil("kv", "data"), DB.ambil("kv", "antrian"), DB.ambil("kv", "alkitab"), DB.kunci("berkas"),
  ]);
  if (data) {
    delete data.riwayat; // fitur lama "riwayat baca" sudah diganti "ayat tersimpan"
    Object.assign(D, data);
  }
  if (antrian) {
    D.antrian = { catatan: {}, tanda: false, simpan: {}, ...antrian };
    delete D.antrian.riwayat;
  }
  if (!Array.isArray(D.simpan)) D.simpan = [];
  if (alkitab) pasangAlkitab(alkitab);
  D.berkas = new Set(kunci);
}
function simpanData() {
  const { lagu, playlist, cerita, halaman, catatan, tanda, pengaturan, simpan, waktuSinkron } = D;
  return DB.simpan("kv", "data", { lagu, playlist, cerita, halaman, catatan, tanda, pengaturan, simpan, waktuSinkron });
}
const simpanAntrian = () => DB.simpan("kv", "antrian", D.antrian);

function pasangAlkitab(a) {
  D.alkitab = a;
  D.kitabKode = new Map(a.kitab.map((k, i) => [k.kode, { ...k, indeks: i }]));
}
const kitab = (kode) => D.kitabKode.get(kode);
function namaRujukan(kode, pasal, mulai, sampai) {
  const k = kitab(kode);
  const nama = k ? k.nama : kode;
  if (!pasal) return nama;
  if (!mulai) return `${nama} ${pasal}`;
  return `${nama} ${pasal}:${mulai}${sampai && sampai > mulai ? "–" + sampai : ""}`;
}
function ayatDari(kode, pasal, mulai, sampai) {
  const k = kitab(kode);
  const p = k?.pasal[pasal - 1];
  if (!p) return [];
  const akhir = sampai || mulai;
  return p.filter(([n]) => n >= mulai && n <= akhir);
}
const norm = (s) => String(s).toLowerCase().replace(/[\s\-.]/g, "");

/** Kitab yang cocok dengan ketikan, misalnya "yo" → Yosua, Yoel, Yohanes, 1–3 Yohanes. */
function saringKitab(q) {
  q = norm(q);
  if (!q || !D.alkitab) return [];
  const tepat = [], awal = [];
  for (const k of D.alkitab.kitab) {
    const n = norm(k.nama), tanpaAngka = n.replace(/^\d/, ""), s = norm(k.singkat);
    if (s === q || n === q) tepat.push(k);
    else if (n.startsWith(q) || tanpaAngka.startsWith(q) || s.startsWith(q)) awal.push(k);
  }
  return [...tepat, ...awal];
}
/** Memahami ketikan seperti "yoh 3:16", "1 kor 13:4-7", "mzm 23". */
function uraiRujukan(teks) {
  const s = String(teks || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!s || !D.alkitab) return null;
  const m = s.match(/^(.+?)\s*(\d+)(?:\s*[:.,]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?$/);
  let namaKitab = m ? m[1] : s;
  let k = saringKitab(namaKitab)[0];
  if (!k && m && /^\d$/.test(m[1].trim())) return null;
  if (!k) return null;
  if (!m) return { kode: k.kode };
  const pasal = +m[2];
  if (pasal < 1 || pasal > k.pasal.length) return { kode: k.kode, galat: true };
  const jumlah = k.pasal[pasal - 1].length;
  let mulai = m[3] ? +m[3] : 0, sampai = m[4] ? +m[4] : 0;
  if (mulai && (mulai < 1 || mulai > jumlah)) return { kode: k.kode, pasal, galat: true };
  if (sampai && sampai < mulai) [mulai, sampai] = [sampai, mulai];
  if (sampai > jumlah) sampai = jumlah;
  return { kode: k.kode, pasal, mulai: mulai || 0, sampai: sampai || mulai || 0 };
}

const laguAktif = () => {
  const peta = new Map(D.lagu.filter((l) => !l.nonaktif).map((l) => [l.id, l]));
  return [...D.playlist].sort((a, b) => a.urutan - b.urutan).map((p) => peta.get(p.lagu_id)).filter(Boolean);
};
const ceritaAktif = () => D.cerita.filter((c) => !c.nonaktif).sort((a, b) => (a.urutan - b.urutan) || String(b.dibuat).localeCompare(String(a.dibuat)));
const halamanDari = (id) => D.halaman.filter((p) => p.cerita_id === id).sort((a, b) => a.urutan - b.urutan);
const catatanAktif = () => D.catatan.filter((c) => !c.nonaktif).sort((a, b) => String(b.tanggal).localeCompare(String(a.tanggal)) || String(b.diubah).localeCompare(String(a.diubah)));
const simpanAktif = () => D.simpan.filter((s) => !s.nonaktif).sort((a, b) => new Date(b.dibuat) - new Date(a.dibuat));
const kunciBerkas = (bucket, path) => bucket + "/" + path;

/* ---------------------------------------------------------------------
   5. SINKRON (kirim perubahan, ambil data terbaru, unduh berkas)
   --------------------------------------------------------------------- */
let sedangSinkron = false;
let ulangiSinkron = false;     // ada permintaan sinkron saat sinkron sedang berjalan
let pemilikPasti = false;      // akun sudah dipastikan pemilik oleh server di sesi ini

/** true = pemilik, false = bukan pemilik, null = belum bisa dipastikan (jaringan). */
async function cekPemilik() {
  try { return (await SB.db.rpc("is_owner")) === true; }
  catch (e) { if (e instanceof GalatSesi) throw e; console.error(e); return null; }
}

async function sinkron() {
  if (sedangSinkron) { ulangiSinkron = true; return; }
  if (!navigator.onLine || !SB.adaSesi()) return;
  sedangSinkron = true;
  try {
    // Aplikasi dibuka dari isi di HP dulu; akun dipastikan di sini sebelum data apa pun diambil.
    if (!pemilikPasti) {
      const ok = await cekPemilik();
      if (ok === null) return;
      if (!ok) { aksesDitolak(); return; }
      pemilikPasti = true;
      tulis("pemilik", SB.email());
    }
    await kirimAntrian();
    const [lagu, playlist, cerita, halaman, catatan, tanda, pengaturan, simpan] = await Promise.all([
      SB.db.ambil("lagu", "select=*&nonaktif=eq.false"),
      SB.db.ambil("playlist", "select=*"),
      SB.db.ambil("cerita", "select=*&nonaktif=eq.false"),
      SB.db.ambil("halaman_cerita", "select=*"),
      SB.db.ambil("catatan", "select=*&nonaktif=eq.false"),
      SB.db.ambil("tanda_baca", "select=*"),
      SB.db.ambil("pengaturan", "select=*"),
      // Tabel ayat_simpan baru ada setelah SQL tambahan dijalankan; sebelum itu, pakai data di HP saja.
      SB.db.ambil("ayat_simpan", "select=*&nonaktif=eq.false").catch(() => null),
    ]);
    // Perubahan yang belum terkirim tetap memakai versi di HP.
    const tertunda = D.catatan.filter((c) => D.antrian.catatan[c.id]);
    const idTertunda = new Set(tertunda.map((c) => c.id));
    D.lagu = lagu; D.playlist = playlist; D.cerita = cerita; D.halaman = halaman;
    D.catatan = [...catatan.filter((c) => !idTertunda.has(c.id)), ...tertunda];
    if (!D.antrian.tanda) D.tanda = tanda[0] || null;
    D.pengaturan = Object.fromEntries(pengaturan.map((p) => [p.kunci, p.nilai]));
    if (simpan) {
      const simpanTertunda = D.simpan.filter((s) => D.antrian.simpan[s.id]);
      const idSimpanTertunda = new Set(simpanTertunda.map((s) => s.id));
      D.simpan = [...simpan.filter((s) => !idSimpanTertunda.has(s.id)), ...simpanTertunda];
    }
    D.waktuSinkron = new Date().toISOString();
    await simpanData();
    if (!D.alkitab) await unduhAlkitab();
    segarkanTampilan("data");
    Unduhan.mulai();
  } catch (e) {
    if (e instanceof GalatSesi) return sesiHabis();
    console.error(e);
  } finally {
    sedangSinkron = false;
    if (ulangiSinkron) { ulangiSinkron = false; sinkronNanti(); }
  }
}
const sinkronNanti = tunda(sinkron, 1500);

/* Mengirim perubahan yang menunggu. Sebuah perubahan baru dicoret dari antrian
   kalau datanya TIDAK berubah lagi selama dikirim; kalau berubah (misalnya Anda
   masih mengetik), versi terbaru tetap menunggu dan ikut terkirim berikutnya. */
async function kirimAntrian() {
  for (const id of Object.keys(D.antrian.catatan)) {
    const c = D.catatan.find((x) => x.id === id);
    if (c) {
      const { id: _id, judul, tanggal, pengkhotbah, tempat, isi, nonaktif, dibuat } = c;
      await SB.db.simpan("catatan", [{ id: _id, judul, tanggal, pengkhotbah, tempat, isi, nonaktif: !!nonaktif, dibuat }]);
    }
    if (D.catatan.find((x) => x.id === id) === c) delete D.antrian.catatan[id];
    await simpanAntrian();
  }
  if (D.antrian.tanda && D.tanda) {
    const kirim = D.tanda;
    await SB.db.simpan("tanda_baca", [{ id: 1, kitab: kirim.kitab, pasal: kirim.pasal, ayat: kirim.ayat }], "id");
    if (D.tanda === kirim) D.antrian.tanda = false;
    await simpanAntrian();
  }
  // Ayat tersimpan. Gagal kirim (misalnya tabel belum dibuat) tidak menghentikan sinkron lain.
  try {
    for (const id of Object.keys(D.antrian.simpan)) {
      const s = D.simpan.find((x) => x.id === id);
      if (s) {
        await SB.db.simpan("ayat_simpan", [{
          id: s.id, kitab: s.kitab, pasal: s.pasal, ayat_mulai: s.ayat_mulai, ayat_sampai: s.ayat_sampai,
          nonaktif: !!s.nonaktif, dibuat: s.dibuat,
        }]);
      }
      if (D.simpan.find((x) => x.id === id) === s) delete D.antrian.simpan[id];
      await simpanAntrian();
    }
  } catch (e) {
    console.error("ayat tersimpan", e);
  }
}

async function unduhAlkitab() {
  try {
    const blob = await SB.berkas.unduh("alkitab", "alkitab-tb.json");
    const a = JSON.parse(await blob.text());
    if (!a || !Array.isArray(a.kitab) || a.kitab.length !== 66) throw new Error("berkas Alkitab tidak lengkap");
    await DB.simpan("kv", "alkitab", a);
    pasangAlkitab(a);
    segarkanTampilan("alkitab");
  } catch (e) {
    console.error("Alkitab", e);
  }
}

/** Mengunduh lagu & gambar yang belum ada di HP; menghapus yang tidak dipakai lagi. */
const Unduhan = {
  jalan: false, total: 0, selesai: 0, gagal: 0,
  daftarPerlu() {
    const perlu = new Map();
    if (FITUR.lagu) for (const l of laguAktif()) perlu.set(kunciBerkas("lagu", l.file_path), { bucket: "lagu", path: l.file_path });
    if (FITUR.cerita) for (const c of ceritaAktif()) {
      if (c.sampul_path) perlu.set(kunciBerkas("gambar", c.sampul_path), { bucket: "gambar", path: c.sampul_path });
      for (const p of halamanDari(c.id)) if (p.gambar_path) perlu.set(kunciBerkas("gambar", p.gambar_path), { bucket: "gambar", path: p.gambar_path });
    }
    return perlu;
  },
  async mulai() {
    if (this.jalan || !navigator.onLine || !D.waktuSinkron) return;
    this.jalan = true;
    try {
      const perlu = this.daftarPerlu();
      for (const k of await DB.kunci("berkas")) {
        if (!perlu.has(k)) { await DB.hapus("berkas", k); D.berkas.delete(k); lepasURL(k); }
      }
      const kurang = [...perlu].filter(([k]) => !D.berkas.has(k));
      kurang.sort(([a], [b]) => (a.startsWith("gambar") ? -1 : 0) - (b.startsWith("gambar") ? -1 : 0));
      this.total = kurang.length; this.selesai = 0; this.gagal = 0;
      segarkanTampilan("unduh");
      for (const [k, b] of kurang) {
        if (!navigator.onLine) break;
        try {
          const blob = await SB.berkas.unduh(b.bucket, b.path);
          await DB.simpan("berkas", k, blob);
          D.berkas.add(k);
        } catch (e) {
          if (e instanceof GalatSesi) { sesiHabis(); break; }
          this.gagal++;
          console.error("unduh", k, e);
        }
        this.selesai++;
        segarkanTampilan("unduh");
      }
    } finally {
      this.jalan = false;
      segarkanTampilan("unduh");
    }
  },
};

const petaURL = new Map();
function lepasURL(k) { const u = petaURL.get(k); if (u?.startsWith("blob:")) URL.revokeObjectURL(u); petaURL.delete(k); }
/** Alamat untuk memutar/menampilkan berkas: dari HP bila sudah tersimpan, kalau belum dari internet. */
async function urlBerkas(bucket, path) {
  if (!path) return null;
  const k = kunciBerkas(bucket, path);
  if (petaURL.has(k)) return petaURL.get(k);
  if (D.berkas.has(k)) {
    const blob = await DB.ambil("berkas", k);
    if (blob) { const u = URL.createObjectURL(blob); petaURL.set(k, u); return u; }
  }
  if (!navigator.onLine) return null;
  try { const u = await SB.berkas.tautan(bucket, path); petaURL.set(k, u); setTimeout(() => petaURL.get(k) === u && petaURL.delete(k), 3.5e6); return u; }
  catch (e) { console.error(e); return null; }
}
function gambar(path, alt = "") {
  const img = h("img", { alt, decoding: "async" });
  if (path) urlBerkas("gambar", path).then((u) => { if (u) img.src = u; });
  return img;
}

/* ---------------------------------------------------------------------
   6. TEMA & UKURAN HURUF
   --------------------------------------------------------------------- */
const mediaGelap = matchMedia("(prefers-color-scheme: dark)");
function terapkanTema() {
  const pilihan = baca("tema", "otomatis");
  const gelap = pilihan === "gelap" || (pilihan === "otomatis" && mediaGelap.matches);
  document.documentElement.dataset.tema = gelap ? "gelap" : "terang";
  document.documentElement.style.setProperty("--ukuran-baca", baca("ukuran", 19) + "px");
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", gelap ? "#151A17" : "#F7F3EA"));
}
mediaGelap.addEventListener?.("change", terapkanTema);
const UKURAN = [17, 19, 21, 23];
function gantiUkuran() {
  const i = UKURAN.indexOf(baca("ukuran", 19));
  const baru = UKURAN[(i + 1) % UKURAN.length];
  tulis("ukuran", baru);
  terapkanTema();
  kilat("Ukuran huruf " + ["kecil", "sedang", "besar", "sangat besar"][UKURAN.indexOf(baru)]);
}

/* ---------------------------------------------------------------------
   7. PEMUTAR LAGU (tetap jalan saat pindah menu)
   --------------------------------------------------------------------- */
const Pemutar = {
  audio: null, antre: [], indeks: -1,
  pasang() {
    this.audio = $("#audio");
    const a = this.audio;
    $("#pemutar-putar").append(ikon("putar", 20));
    $("#pemutar-mundur").append(ikon("mundur", 20));
    $("#pemutar-lanjut").append(ikon("lanjut", 20));
    $("#pemutar-putar").onclick = () => this.alih();
    $("#pemutar-mundur").onclick = () => this.mundur();
    $("#pemutar-lanjut").onclick = () => this.lanjut();
    $("#pemutar-info").onclick = () => (location.hash = "#/lagu");
    a.addEventListener("timeupdate", () => {
      $("#pemutar-maju").style.width = a.duration ? (a.currentTime / a.duration) * 100 + "%" : "0";
    });
    a.addEventListener("play", () => this.tampil());
    a.addEventListener("pause", () => this.tampil());
    a.addEventListener("ended", () => this.lanjut(true));
    a.addEventListener("error", () => { if (a.src) kilat("Lagu tidak bisa diputar."); });
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () => a.play());
      navigator.mediaSession.setActionHandler("pause", () => a.pause());
      navigator.mediaSession.setActionHandler("previoustrack", () => this.mundur());
      navigator.mediaSession.setActionHandler("nexttrack", () => this.lanjut());
    }
  },
  get lagu() { return this.antre[this.indeks] || null; },
  async putar(daftar, i) {
    this.antre = daftar; this.indeks = i;
    const l = this.lagu;
    if (!l) return;
    const u = await urlBerkas("lagu", l.file_path);
    if (!u) { kilat("Lagu ini belum tersimpan di HP dan sedang tidak ada internet."); return; }
    this.audio.src = u;
    tulis("laguTerakhir", l.id);
    try { await this.audio.play(); } catch (e) { console.error(e); }
    if ("mediaSession" in navigator && window.MediaMetadata) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: l.judul, artist: l.penyanyi || "Alkitab Vira", artwork: [{ src: "./icon-512.png", sizes: "512x512", type: "image/png" }] });
    }
    this.tampil();
    segarkanTampilan("pemutar");
  },
  alih() { if (!this.lagu) return; this.audio.paused ? this.audio.play() : this.audio.pause(); },
  lanjut(otomatis) {
    if (!this.antre.length) return;
    if (otomatis && this.indeks >= this.antre.length - 1) { this.indeks = 0; this.tampil(); return; }
    this.putar(this.antre, (this.indeks + 1) % this.antre.length);
  },
  mundur() {
    if (!this.antre.length) return;
    if (this.audio.currentTime > 4) { this.audio.currentTime = 0; return; }
    this.putar(this.antre, (this.indeks - 1 + this.antre.length) % this.antre.length);
  },
  sedangMain() { return this.audio && !this.audio.paused; },
  tampil() {
    const l = this.lagu;
    const el = $("#pemutar");
    el.hidden = !l;
    document.documentElement.style.setProperty("--tinggi-pemutar", l ? "74px" : "0px");
    if (!l) return;
    $("#pemutar-judul").textContent = l.judul;
    $("#pemutar-sub").textContent = [l.penyanyi, l.keterangan].filter(Boolean).join(" · ") || "Lagu rohani";
    const t = $("#pemutar-putar");
    kosongkan(t).append(ikon(this.sedangMain() ? "jeda" : "putar", 20));
    t.setAttribute("aria-label", this.sedangMain() ? "Jeda" : "Putar");
  },
};

/* ---------------------------------------------------------------------
   8. LEMBAR BAWAH (jendela pilihan dari bawah layar)
   --------------------------------------------------------------------- */
let lembarAktif = null;
function bukaLembar({ judul, saatTutup }) {
  tutupLembar();
  const lembar = $("#lembar"), latar = $("#lembar-latar");
  kosongkan(lembar);
  const judulEl = h("h2", { text: judul });
  const isi = h("div", { class: "lembar-isi" });
  const kaki = h("div", { class: "lembar-kaki", hidden: true });
  const tutup = h("button", { class: "ikon-tombol", type: "button", "aria-label": "Tutup", onclick: () => tutupLembar() }, ikon("tutup"));
  lembar.append(h("div", { class: "lembar-pegangan" }), h("div", { class: "lembar-kepala" }, judulEl, tutup), isi, kaki);
  lembar.hidden = false; latar.hidden = false;
  latar.onclick = () => tutupLembar();
  document.body.style.overflow = "hidden";
  lembarAktif = { isi, kaki, judulEl, saatTutup };
  return lembarAktif;
}
function tutupLembar(hasil) {
  if (!lembarAktif) return;
  const l = lembarAktif;
  lembarAktif = null;
  $("#lembar").hidden = true; $("#lembar-latar").hidden = true;
  document.body.style.overflow = "";
  l.saatTutup?.(hasil);
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") tutupLembar(); });

function konfirmasi(judul, teks, labelYa = "Ya", bahaya = false) {
  return new Promise((ok) => {
    let jawab = false;
    const l = bukaLembar({ judul, saatTutup: () => ok(jawab) });
    l.isi.append(h("p", { class: "teks-2", text: teks }));
    l.kaki.hidden = false;
    l.kaki.append(h("div", { class: "baris-tombol" },
      h("button", { class: "tombol", type: "button", text: "Batal", onclick: () => tutupLembar() }),
      h("button", { class: "tombol tombol-utama" + (bahaya ? " tombol-bahaya-isi" : ""), type: "button", text: labelYa, onclick: () => { jawab = true; tutupLembar(); } }),
    ));
  });
}

/* ---------------------------------------------------------------------
   9. PEMILIH AYAT
   Kolom Kitab : ketik 2 huruf petunjuk → pilih kitab dari opsi yang muncul.
   Kolom Pasal : kursor pindah sendiri, keyboard ANGKA.
   Kolom Ayat  : kursor pindah sendiri, keyboard ANGKA → ayat langsung disorot.
   mode "sisip" punya kolom tambahan "sampai ayat" (boleh kosong).
   --------------------------------------------------------------------- */
function pilihAyat({ mode = "baca", awal = {}, judul } = {}) {
  return new Promise((selesai) => {
    if (!D.alkitab) { kilat("Teks Alkitab belum tersimpan. Sambungkan ke internet sebentar."); selesai(null); return; }
    let hasil = null;
    const l = bukaLembar({ judul: judul || (mode === "sisip" ? "Sisipkan ayat" : "Cari ayat"), saatTutup: () => selesai(hasil) });
    let kode = awal.kode || null;
    let jedaPasal, jedaAyat;

    const kolom = (label, attrs) => {
      const inp = h("input", { autocomplete: "off", autocapitalize: "off", spellcheck: "false", ...attrs });
      return { inp, el: h("label", { class: "kolom-ayat" }, h("span", { text: label }), inp) };
    };
    const kKitab = kolom("Kitab", { type: "text", placeholder: "2 huruf", enterkeyhint: "next", value: kode ? kitab(kode).nama : "" });
    const angka = { type: "text", inputmode: "numeric", pattern: "[0-9]*", maxlength: "3" };
    const kPasal = kolom("Pasal", { ...angka, enterkeyhint: "next", value: awal.pasal || "" });
    const kAyat = kolom("Ayat", { ...angka, enterkeyhint: mode === "sisip" ? "next" : "go" });
    const kSampai = mode === "sisip" ? kolom("Sampai", { ...angka, placeholder: "opsional", enterkeyhint: "done" }) : null;
    const opsi = h("div", { class: "opsi-kitab" });
    const info = h("p", { class: "petunjuk" });
    l.isi.append(h("div", { class: "baris-kolom" + (kSampai ? " empat" : "") }, kKitab.el, kPasal.el, kAyat.el, kSampai?.el), info, opsi);
    l.kaki.hidden = false;
    const tombol = h("button", { class: "tombol tombol-utama tombol-lebar", type: "button", onmousedown: (e) => e.preventDefault() });
    l.kaki.append(tombol);

    const nilai = (k) => parseInt(k.inp.value, 10) || 0;
    const jmlPasal = () => (kode ? kitab(kode).pasal.length : 0);
    const jmlAyat = () => { const p = nilai(kPasal); return kode && p >= 1 && p <= jmlPasal() ? kitab(kode).pasal[p - 1].length : 0; };

    const perbarui = () => {
      const p = nilai(kPasal), a = nilai(kAyat), z = kSampai ? nilai(kSampai) : 0;
      kPasal.inp.disabled = !kode;
      kAyat.inp.disabled = !jmlAyat();
      if (kSampai) kSampai.inp.disabled = !(a >= 1 && a <= jmlAyat());
      kPasal.el.classList.toggle("salah", !!p && kode && p > jmlPasal());
      kAyat.el.classList.toggle("salah", !!a && a > jmlAyat());
      if (!kode) info.textContent = "Ketik 2 huruf kitab, mis. yo → Yohanes, mz → Mazmur.";
      else if (!jmlAyat()) info.textContent = `${kitab(kode).nama}: pasal 1–${jmlPasal()}`;
      else info.textContent = `${kitab(kode).nama} ${p}: ayat 1–${jmlAyat()}`;
      const ok = a >= 1 && a <= jmlAyat();
      const sampai = kSampai && z > a && z <= jmlAyat() ? z : a;
      tombol.disabled = mode === "sisip" ? !ok : !jmlAyat();
      tombol.textContent = mode === "sisip"
        ? (ok ? "Sisipkan " + namaRujukan(kode, p, a, sampai) : "Isi kitab, pasal, dan ayat")
        : (ok ? "Buka " + namaRujukan(kode, p, a) : jmlAyat() ? "Buka " + namaRujukan(kode, p) : "Isi kitab dan pasal");
    };

    const isiOpsi = () => {
      kosongkan(opsi);
      const q = kKitab.inp.value.trim();
      if (!q || (kode && kitab(kode).nama === q)) return;
      const cocok = saringKitab(q).slice(0, 12);
      if (!cocok.length) { opsi.append(h("p", { class: "teks-2 kecil", text: "Kitab tidak ditemukan. Coba huruf lain." })); return; }
      for (const k of cocok) opsi.append(h("button", { type: "button", class: "chip", onmousedown: (e) => e.preventDefault(), onclick: () => pilihKitab(k) }, k.nama));
    };

    const pilihKitab = (k) => {
      kode = k.kode;
      kKitab.inp.value = k.nama;
      kosongkan(opsi);
      kAyat.inp.value = ""; if (kSampai) kSampai.inp.value = "";
      if (k.pasal.length === 1) { kPasal.inp.value = "1"; perbarui(); kAyat.inp.focus(); }
      else { kPasal.inp.value = ""; perbarui(); kPasal.inp.focus(); }
    };

    const selesaiPilih = () => {
      const p = nilai(kPasal), a = nilai(kAyat);
      if (!jmlAyat()) return;
      if (mode === "sisip") {
        if (!(a >= 1 && a <= jmlAyat())) { kAyat.inp.focus(); return; }
        const z = kSampai ? nilai(kSampai) : 0;
        hasil = { kode, pasal: p, mulai: a, sampai: z > a && z <= jmlAyat() ? z : a };
      } else {
        hasil = { kode, pasal: p, mulai: a >= 1 && a <= jmlAyat() ? a : 0, sampai: a >= 1 && a <= jmlAyat() ? a : 0 };
      }
      tutupLembar();
    };
    tombol.onclick = selesaiPilih;

    // Kolom kitab: 2 huruf → opsi; satu-satunya yang cocok → langsung terpilih
    kKitab.inp.addEventListener("focus", () => kKitab.inp.select());
    kKitab.inp.addEventListener("input", () => {
      kode = null;
      const q = kKitab.inp.value.trim();
      // Ketikan lengkap seperti "yoh 3:16" tetap dipahami
      const ref = /\d+\s*[:.]\s*\d/.test(q) ? uraiRujukan(q) : null;
      if (ref && ref.pasal && ref.mulai && !ref.galat) {
        kode = ref.kode; kKitab.inp.value = kitab(kode).nama; kPasal.inp.value = ref.pasal; kAyat.inp.value = ref.mulai;
        if (kSampai && ref.sampai > ref.mulai) kSampai.inp.value = ref.sampai;
        kosongkan(opsi); perbarui(); kAyat.inp.focus(); return;
      }
      if (norm(q).length >= 2) {
        const cocok = saringKitab(q);
        if (cocok.length === 1) { pilihKitab(cocok[0]); return; }
      }
      perbarui(); isiOpsi();
    });
    kKitab.inp.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const k = saringKitab(kKitab.inp.value)[0];
      if (k) pilihKitab(k);
    });

    // Kolom pasal: angka; pindah otomatis ke ayat bila angkanya sudah pasti
    const keAyat = () => { clearTimeout(jedaPasal); if (jmlAyat()) { kAyat.inp.value = ""; perbarui(); kAyat.inp.focus(); } };
    kPasal.inp.addEventListener("input", () => {
      kPasal.inp.value = kPasal.inp.value.replace(/\D/g, "");
      kAyat.inp.value = ""; perbarui();
      clearTimeout(jedaPasal);
      const p = nilai(kPasal);
      if (!jmlAyat()) return;
      if (p * 10 > jmlPasal()) keAyat();                 // tidak mungkin ditambah digit lagi
      else jedaPasal = setTimeout(keAyat, 1100);          // tunggu sebentar, lalu pindah
    });
    kPasal.inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); keAyat(); } });

    // Kolom ayat: angka; mode baca langsung membuka & menyorot
    const ayatSiap = () => {
      clearTimeout(jedaAyat);
      const a = nilai(kAyat);
      if (!(a >= 1 && a <= jmlAyat())) return;
      if (mode === "baca") selesaiPilih();
      else kSampai?.inp.focus();
    };
    kAyat.inp.addEventListener("input", () => {
      kAyat.inp.value = kAyat.inp.value.replace(/\D/g, "");
      if (kSampai) kSampai.inp.value = "";
      perbarui();
      clearTimeout(jedaAyat);
      const a = nilai(kAyat);
      if (!(a >= 1 && a <= jmlAyat())) return;
      if (a * 10 > jmlAyat()) ayatSiap();
      else jedaAyat = setTimeout(ayatSiap, 1100);
    });
    kAyat.inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); mode === "sisip" && kSampai ? ayatSiap() : selesaiPilih(); } });
    if (kSampai) {
      kSampai.inp.addEventListener("input", () => { kSampai.inp.value = kSampai.inp.value.replace(/\D/g, ""); perbarui(); });
      kSampai.inp.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); selesaiPilih(); } });
    }

    perbarui();
    isiOpsi();
    requestAnimationFrame(() => (kode && !jmlAyat() ? kPasal.inp : kode ? kAyat.inp : kKitab.inp).focus());
  });
}

/* ---------------------------------------------------------------------
   10. KERANGKA TAMPILAN & RUTE
   --------------------------------------------------------------------- */
const isi = () => $("#isi");
let tampilanSaatIni = "";
let kakiEl = null;

function aturKepala({ judul, kembali = null, aksi = [] }) {
  $("#kepala-judul").textContent = judul;
  const k = $("#tombol-kembali");
  k.hidden = !kembali;
  if (kembali) { kosongkan(k).append(ikon("kembali", 24)); k.onclick = () => (history.length > 1 && kembali === "back" ? history.back() : (location.hash = kembali)); }
  const a = kosongkan($("#kepala-aksi"));
  tambahAnak(a, aksi);
}
const tombolAtur = () => h("a", { class: "ikon-tombol", href: "#/atur", "aria-label": "Pengaturan" }, ikon("atur"));
const tombolHuruf = () => h("button", { class: "ikon-tombol", type: "button", "aria-label": "Ukuran huruf", onclick: gantiUkuran },
  h("span", { text: "Aa", class: "teks-aa" }));

function pasangKaki(el) {
  hapusKaki();
  if (!el) return;
  kakiEl = el;
  document.body.append(el);
  requestAnimationFrame(() => document.documentElement.style.setProperty("--tinggi-kaki", el.offsetHeight + "px"));
}
function hapusKaki() {
  kakiEl?.remove(); kakiEl = null;
  document.documentElement.style.setProperty("--tinggi-kaki", "0px");
  tutupAksiAyat();
}

function bagianRute() { return location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent); }

function rute() {
  const [menu = "beranda", ...sisa] = bagianRute();
  // Alamat lama menu Riwayat diarahkan ke Ayat tersimpan.
  if (menu === "riwayat") { location.replace("#/tersimpan"); return; }
  hapusKaki();
  tutupLembar();
  document.querySelectorAll(".navigasi a").forEach((a) => a.classList.toggle("aktif", a.dataset.menu === (menu === "atur" ? "" : menu)));
  const el = kosongkan(isi());
  el.className = "isi"; // lepas gaya khusus halaman sebelumnya (mis. Beranda)
  tampilanSaatIni = menu + (sisa.length ? "/" + sisa[0] : "");
  const gulirAtas = !(menu === "alkitab" && sisa.length >= 3);
  try {
    switch (menu) {
      case "alkitab": tampilAlkitab(el, sisa); break;
      case "lagu": tampilLagu(el); break;
      case "cerita": sisa[0] ? tampilBacaCerita(el, sisa[0], sisa[1]) : tampilCerita(el); break;
      case "catatan": sisa[0] ? tampilEditor(el, sisa[0]) : tampilCatatan(el); break;
      case "tersimpan": tampilTersimpan(el); break;
      case "atur":
        if (sisa[0] === "lagu") tampilAturLagu(el);
        else if (sisa[0] === "cerita") sisa[1] ? tampilEditorCerita(el, sisa[1]) : tampilAturCerita(el);
        else tampilAtur(el);
        break;
      default: tampilBeranda(el);
    }
  } catch (e) {
    console.error(e);
    el.append(h("div", { class: "kosong" }, h("div", { class: "judul-kosong", text: "Ada yang salah" }), "Coba buka menu lain lalu kembali."));
  }
  if (gulirAtas) window.scrollTo(0, 0);
}

/** Dipanggil saat data baru datang; hanya menggambar ulang layar yang aman digambar ulang. */
function segarkanTampilan(alasan) {
  if (lembarAktif) return;
  const t = tampilanSaatIni;
  if (alasan === "pemutar") { if (t === "lagu") perbaruiDaftarLagu(); return; }
  if (alasan === "unduh") { if (t === "lagu") perbaruiDaftarLagu(); return; }
  // Jangan gambar ulang saat Anda sedang mengetik, supaya ketikan & keyboard tidak hilang.
  if (sedangMengetik()) return;
  if (alasan === "alkitab" && (t.startsWith("alkitab") || t === "beranda")) return rute();
  if (alasan === "data" && ["beranda", "lagu", "cerita", "catatan", "tersimpan", "atur"].includes(t)) {
    const y = window.scrollY; rute(); window.scrollTo(0, y);
  }
}
function sedangMengetik() {
  const f = document.activeElement;
  return !!f && isi().contains(f) && f.matches("input, textarea");
}

const NAMA_PANGGILAN = "Vira";
function salamWaktu() {
  const j = new Date().getHours();
  return j < 11 ? "Selamat Pagi" : j < 15 ? "Selamat Siang" : j < 19 ? "Selamat Sore" : "Selamat Malam";
}

/* Kotak cari ayat langsung (dipakai di Beranda dan menu Alkitab).
   Alur: ketik 2 huruf kitab → Enter → angka pasal → Enter → angka ayat → Enter. */
function kotakRujukan() {
  let tahap = "kitab"; // kitab | pasal | ayat
  let kode = null;
  let pasal = 0;

  const wadahChip = h("span", { class: "rujukan-chipwadah" });
  const input = h("input", { type: "search", autocomplete: "off", autocapitalize: "off", spellcheck: "false" });
  const saran = h("div", { class: "rujukan-saran" });
  const hasil = h("div", { class: "hasil-cari" });
  const kotak = h("div", { class: "cari-rujukan" },
    h("label", { class: "cari" }, ikon("cari", 20), wadahChip, input),
    saran, hasil);

  const segarkanChip = () => {
    kosongkan(wadahChip);
    if (!kode) return;
    const k = kitab(kode);
    const teks = tahap === "pasal" ? k.nama : `${k.nama} ${pasal}`;
    wadahChip.append(h("button", { class: "chip rujukan-chip", type: "button", "aria-label": "Ubah pilihan", onclick: () => mundur(), text: teks + "  ×" }));
  };
  const setTahap = (t, fokus = true) => {
    tahap = t;
    input.value = "";
    input.type = t === "kitab" ? "search" : "text";
    input.inputMode = t === "kitab" ? "text" : "numeric";
    input.enterKeyHint = t === "ayat" ? "go" : "next";
    input.placeholder = t === "kitab" ? "Ketik nama kitab, mis. yo"
      : t === "pasal" ? "Ketik nomor pasal" : "Ketik nomor ayat (kosongkan = satu pasal)";
    kosongkan(saran); kosongkan(hasil);
    segarkanChip();
    if (fokus) input.focus();
  };
  const mundur = () => {
    if (tahap === "ayat" && kitab(kode).pasal.length > 1) { pasal = 0; setTahap("pasal"); }
    else { kode = null; pasal = 0; setTahap("kitab"); }
  };
  const pilihKitab = (k) => {
    kode = k.kode;
    if (k.pasal.length === 1) { pasal = 1; setTahap("ayat"); }
    else setTahap("pasal");
  };

  input.addEventListener("input", tunda(() => {
    kosongkan(saran); kosongkan(hasil);
    if (tahap !== "kitab") return;
    const v = input.value.trim();
    if (!v) return;
    const cocok = saringKitab(v).slice(0, 10);
    if (cocok.length) {
      for (const k of cocok) saran.append(h("button", { class: "chip", type: "button", onmousedown: (e) => e.preventDefault(), onclick: () => pilihKitab(k) }, k.nama));
    } else if (v.length >= 3 && !/\d/.test(v)) cariAlkitab(v, hasil);
  }, 250));

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !input.value && tahap !== "kitab") { e.preventDefault(); mundur(); return; }
    if (e.key !== "Enter") return;
    e.preventDefault();
    const v = input.value.trim();
    if (tahap === "kitab") {
      const r = uraiRujukan(v);
      if (r && r.pasal && !r.galat) return bukaRujukan(r.kode, r.pasal, r.mulai, r.sampai);
      const cocok = saringKitab(v);
      if (cocok.length) pilihKitab(cocok[0]);
      else kilat("Kitab tidak ditemukan. Coba huruf lain.");
      return;
    }
    if (tahap === "pasal") {
      const jml = kitab(kode).pasal.length;
      const p = parseInt(v, 10);
      if (!(p >= 1 && p <= jml)) { kilat(`Pasal 1–${jml}`); return; }
      pasal = p;
      setTahap("ayat");
      return;
    }
    const jml = kitab(kode).pasal[pasal - 1].length;
    if (!v) return bukaRujukan(kode, pasal);
    const m = v.match(/^(\d+)\s*[-–]?\s*(\d*)$/);
    if (!m) { kilat("Tulis nomor ayat"); return; }
    const a = +m[1];
    if (a < 1 || a > jml) { kilat(`Ayat 1–${jml}`); return; }
    const z = m[2] ? Math.min(+m[2], jml) : a;
    bukaRujukan(kode, pasal, a, Math.max(z, a));
  });

  setTahap("kitab", false);
  return kotak;
}

/* ---------------------------------------------------------------------
   11. BERANDA
   Domba interaktif (gambar referensi): ketuk untuk menyapa, geser untuk
   memutar, kepalanya mengikuti kursor/jari. Data (baca harian, ayat
   tersimpan, kotak cari ayat) tetap dari aplikasi.
   --------------------------------------------------------------------- */
const SAPAAN_DOMBA = ["Tuhan memberkati", "Yesus love you", "God is good", "Yuk, baca Alkitab", "Allah sanggup", "Dia sanggup", "Tetap Percaya"];

function pasangDomba() {
  const gambar = h("img", { class: "domba-gambar", src: "aset/domba.png", alt: "" });
  const lampu = h("div", { class: "domba-lampu" });
  const tilt = h("div", { class: "domba-tilt" }, gambar, lampu);
  // Melayang & bernapas diurus animasi CSS (hemat baterai); JavaScript hanya untuk miring/putar.
  const ayun = h("div", { class: "domba-ayun" }, tilt);
  const lompat = h("div", { class: "domba-lompat" }, ayun);
  const bayang = h("div", { class: "domba-bayang" });
  const gelembung = h("div", { class: "domba-gelembung", "aria-live": "polite" });
  const panggung = h("div", { class: "domba-panggung", tabindex: "0", role: "button", "aria-label": "Domba. Ketuk untuk menyapa." },
    gelembung, lompat, bayang);

  for (let i = 0; i < 5; i++) {
    panggung.append(h("img", {
      class: "domba-kelopak", src: "aset/kelopak.png", alt: "",
      style: {
        left: `${10 + Math.random() * 80}%`,
        animationDuration: `${7 + Math.random() * 5}s`,
        animationDelay: `${-Math.random() * 10}s`,
      },
    }));
  }

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let tx = 0, ty = 0, px = 0, py = 0;
  let turun = false, lastX = 0, geser = 0, targetPutar = 0, putar = 0;
  let terakhirAktif = Date.now(), timerGelembung = null, jumlahZzz = 0;

  const sapa = () => {
    gelembung.textContent = SAPAAN_DOMBA[Math.floor(Math.random() * SAPAAN_DOMBA.length)];
    gelembung.classList.add("tampil");
    clearTimeout(timerGelembung);
    timerGelembung = setTimeout(() => gelembung.classList.remove("tampil"), 2000);
  };

  const animasiLompat = () => {
    lompat.animate([
      { transform: "translateY(0) scale(1,1)" },
      { transform: "translateY(0) scale(1.05,0.93)", offset: 0.18 },
      { transform: "translateY(-30px) scale(0.97,1.05)", offset: 0.5 },
      { transform: "translateY(0) scale(1.06,0.92)", offset: 0.78 },
      { transform: "translateY(0) scale(1,1)" },
    ], { duration: 900, easing: "ease-in-out" });
    bayang.animate([
      { transform: "scale(1)" }, { transform: "scale(0.8)", offset: 0.5 }, { transform: "scale(1)" },
    ], { duration: 900, easing: "ease-in-out" });
    lampu.animate([{ opacity: 0.5 }, { opacity: 1 }, { opacity: 0.5 }], { duration: 1400, easing: "ease-in-out" });
  };

  const percikan = (src, lebar, x, y, dx, dy, naik, durasi, putaran) => {
    const el = h("img", { class: "domba-fx", src, alt: "", style: { width: `${lebar}px`, left: `${x}px`, top: `${y}px` } });
    panggung.append(el);
    const a = el.animate([
      { transform: "translate(-50%,-50%) scale(0.2) rotate(0deg)", opacity: 1 },
      { transform: `translate(calc(-50% + ${dx * 0.6}px), calc(-50% + ${dy * 0.6}px)) scale(1) rotate(${putaran * 0.5}deg)`, opacity: 1, offset: 0.6 },
      { transform: `translate(calc(-50% + ${dx * 1.1}px), calc(-50% + ${dy * 1.1 - naik}px)) scale(0.5) rotate(${putaran}deg)`, opacity: 0 },
    ], { duration: durasi, easing: "cubic-bezier(.2,.7,.3,1)" });
    a.onfinish = () => el.remove();
  };

  const letupan = () => {
    const cx = panggung.clientWidth * 0.5, cy = panggung.clientHeight * 0.42;
    for (let i = 0; i < 30; i++) {
      const ang = (i / 30) * Math.PI * 2 + Math.random() * 0.4;
      const r = 40 + Math.random() * 45;
      percikan("aset/bintang-emas.png", 5 + Math.random() * 2, cx, cy, Math.cos(ang) * r, Math.sin(ang) * r, 20, 1000 + Math.random() * 400, Math.random() * 200 - 100);
    }
    for (let i = 0; i < 18; i++) {
      percikan("aset/hati.png", 6 + Math.random() * 2, cx + (Math.random() * 2 - 1) * 50, cy,
        (Math.random() * 2 - 1) * 60, -30, 90 + Math.random() * 50, 1700 + Math.random() * 600, (Math.random() * 2 - 1) * 30);
    }
  };

  const ketuk = () => {
    terakhirAktif = Date.now();
    animasiLompat();
    letupan();
    sapa();
  };

  /* Miring & putar: dihitung per bingkai HANYA selama domba disentuh atau masih
     kembali ke posisi diam. Saat diam, perhitungan berhenti (hemat baterai). */
  let loopJalan = false;
  const frame = () => {
    if (!panggung.isConnected) { loopJalan = false; return; }
    px += (tx - px) * 0.08;
    py += (ty - py) * 0.08;
    if (!turun) targetPutar *= 0.92;
    putar += (targetPutar - putar) * 0.15;
    tilt.style.transform = `rotateX(${-py * 8}deg) rotateY(${px * 12 + putar * 0.4}deg)`;
    const diam = !turun && Math.abs(tx - px) < 0.002 && Math.abs(ty - py) < 0.002
      && Math.abs(targetPutar) < 0.05 && Math.abs(putar) < 0.05;
    if (diam) { loopJalan = false; return; }
    requestAnimationFrame(frame);
  };
  const mulaiLoop = () => {
    if (reduce || loopJalan) return;
    loopJalan = true;
    requestAnimationFrame(frame);
  };
  const lepas = () => { turun = false; mulaiLoop(); };

  panggung.addEventListener("pointerdown", (e) => {
    turun = true; lastX = e.clientX; geser = 0; terakhirAktif = Date.now();
    panggung.setPointerCapture(e.pointerId);
    mulaiLoop();
  });
  panggung.addEventListener("pointermove", (e) => {
    const r = panggung.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    terakhirAktif = Date.now();
    if (turun) {
      const dx = e.clientX - lastX; lastX = e.clientX; geser += Math.abs(dx);
      targetPutar = Math.max(-30, Math.min(30, targetPutar + dx * 0.3));
    }
    mulaiLoop();
  });
  panggung.addEventListener("pointerup", () => { if (turun && geser < 8) ketuk(); lepas(); });
  // Dibatalkan (mis. layar mulai digulir): anggap jari sudah diangkat, supaya domba kembali tegak.
  panggung.addEventListener("pointercancel", () => { tx = 0; ty = 0; lepas(); });
  panggung.addEventListener("pointerleave", () => { if (!turun) { tx = 0; ty = 0; mulaiLoop(); } });
  panggung.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ketuk(); } });

  // "z" mengantuk muncul bila domba lama tidak disentuh; berhenti sendiri bila halaman berganti.
  const zzz = setInterval(() => {
    if (!panggung.isConnected) { clearInterval(zzz); return; }
    if (document.hidden || reduce) return;
    if (Date.now() - terakhirAktif > 10000 && !turun) {
      const z = h("span", { class: "domba-zzz", text: "z", style: {
        left: `${150 + Math.random() * 12}px`, top: "70px", fontSize: `${18 + (jumlahZzz % 3) * 6}px`,
      } });
      panggung.append(z);
      jumlahZzz++;
      const a = z.animate([
        { transform: "translate(0,0)", opacity: 0 },
        { transform: "translate(14px,-20px)", opacity: 1, offset: 0.3 },
        { transform: "translate(30px,-60px)", opacity: 0 },
      ], { duration: 2600, easing: "ease-out" });
      a.onfinish = () => z.remove();
    }
  }, 2600);

  return panggung;
}

/* Kotak cari di Beranda: tiga kotak berjajar Kitab · Pasal · Ayat.
   Pasal dan Ayat baru bisa diisi setelah kitab dipilih.
   Ayat dikosongkan = satu pasal penuh. */
function kotakRujukanBeranda() {
  let kode = null, jmlPasal = 0;
  let jedaPasal = null;

  const kKitab = h("input", { type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false", enterkeyhint: "next", placeholder: "mis. Amsal" });
  const kPasal = h("input", { type: "text", inputmode: "numeric", pattern: "[0-9]*", maxlength: "3", autocomplete: "off", enterkeyhint: "next", placeholder: "—", disabled: true });
  const kAyat = h("input", { type: "text", inputmode: "numeric", autocomplete: "off", maxlength: "9", enterkeyhint: "go", placeholder: "—", disabled: true });
  const kolom = (label, inp) => h("label", { class: "kolom-ayat" }, h("span", { text: label }), inp);
  const info = h("p", { class: "petunjuk" });
  const saran = h("div", { class: "opsi-kitab" });
  const tombol = h("button", { class: "tombol tombol-utama tombol-lebar", type: "button", disabled: true, text: "Buka" });

  const ayatMaks = (p) => (kode && p >= 1 && p <= jmlPasal ? kitab(kode).pasal[p - 1].length : 0);
  const pasalSekarang = () => parseInt(kPasal.value, 10) || 0;
  /* "5" → {mulai:5, sampai:5}; "5-7" → {mulai:5, sampai:7}; kosong → null */
  function bacaAyat() {
    const m = kAyat.value.trim().match(/^(\d+)\s*[-–]?\s*(\d*)$/);
    if (!m) return null;
    const a = +m[1], z = m[2] ? +m[2] : a;
    return { mulai: a, sampai: Math.max(a, z) };
  }

  function perbarui() {
    const p = pasalSekarang();
    const maks = ayatMaks(p);
    kPasal.disabled = !kode;
    kAyat.disabled = !maks;
    kAyat.placeholder = maks ? `1–${maks}` : "—";
    kPasal.parentElement?.classList.toggle("salah", !!kode && !!p && p > jmlPasal);
    if (!kode) info.textContent = "Ketik nama kitab, lalu pilih dari daftar.";
    else if (!maks) info.textContent = `${kitab(kode).nama}: pasal 1–${jmlPasal}`;
    else info.textContent = `${kitab(kode).nama}: ayat 1–${maks}. Kosongkan ayat untuk satu pasal penuh.`;
    tombol.disabled = !maks;
    if (!maks) tombol.textContent = "Buka";
    else {
      const r = kAyat.value.trim() ? bacaAyat() : null;
      tombol.textContent = "Buka " + namaRujukan(kode, p, r?.mulai, r?.sampai);
    }
  }

  function pilihKitab(k) {
    kode = k.kode;
    jmlPasal = k.pasal.length;
    kKitab.value = k.nama;
    kosongkan(saran);
    kPasal.value = "";
    kAyat.value = "";
    if (jmlPasal === 1) { kPasal.value = "1"; perbarui(); kAyat.focus(); }
    else { perbarui(); kPasal.focus(); }
  }

  function buka() {
    const p = pasalSekarang();
    const maks = ayatMaks(p);
    if (!maks) { kilat("Isi pasal dulu."); return; }
    if (!kAyat.value.trim()) return bukaRujukan(kode, p);
    const r = bacaAyat();
    if (!r || r.mulai < 1 || r.mulai > maks) { kilat(`Ayat 1–${maks}`); return; }
    bukaRujukan(kode, p, r.mulai, Math.min(r.sampai, maks));
  }

  /* Kitab */
  kKitab.addEventListener("input", () => {
    const q = kKitab.value.trim();
    kode = null; jmlPasal = 0;
    kPasal.value = ""; kAyat.value = "";
    kosongkan(saran);
    perbarui();
    if (!q) return;
    const cocok = saringKitab(q);
    if (cocok.length && norm(cocok[0].nama) === norm(q)) return pilihKitab(cocok[0]);
    for (const k of cocok.slice(0, 8)) {
      saran.append(h("button", { class: "chip", type: "button", onmousedown: (e) => e.preventDefault(), onclick: () => pilihKitab(k) }, k.nama));
    }
    if (!cocok.length) saran.append(h("p", { class: "teks-2 kecil", text: "Kitab tidak ditemukan. Coba huruf lain." }));
  });
  kKitab.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (kode) { kPasal.focus(); return; }
    const k = saringKitab(kKitab.value)[0];
    if (k) pilihKitab(k); else kilat("Kitab tidak ditemukan.");
  });

  /* Pasal: angka saja; setelah pasal jelas, kursor pindah ke Ayat */
  kPasal.addEventListener("input", () => {
    kPasal.value = kPasal.value.replace(/\D/g, "");
    kAyat.value = "";
    perbarui();
    clearTimeout(jedaPasal);
    const p = pasalSekarang();
    if (!ayatMaks(p)) return;
    if (p * 10 > jmlPasal) kAyat.focus();
    else jedaPasal = setTimeout(() => kAyat.focus(), 1000);
  });
  kPasal.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (ayatMaks(pasalSekarang())) kAyat.focus(); else kilat(`Pasal 1–${jmlPasal}`);
  });

  /* Ayat: angka atau rentang (5 atau 5-7); kosong = satu pasal */
  kAyat.addEventListener("input", () => {
    kAyat.value = kAyat.value.replace(/[^\d\-–]/g, "");
    perbarui();
  });
  kAyat.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); buka(); }
  });

  tombol.onclick = buka;

  perbarui();
  return h("div", { class: "beranda-rujukan" },
    h("div", { class: "baris-kolom" }, kolom("Kitab", kKitab), kolom("Pasal", kPasal), kolom("Ayat", kAyat)),
    info,
    saran,
    tombol);
}

function tampilBeranda(el) {
  aturKepala({ judul: "Beranda", aksi: [tombolAtur()] });
  el.classList.add("beranda");

  el.append(
    h("header", { class: "bera-kepala" },
      h("div", { class: "label tanpa-titik bera-tanggal", text: teksTanggal(tanggalLokal()) }),
      h("div", { class: "bera-hero" },
        h("h2", { class: "bera-sapaan", text: `${salamWaktu()}, ${NAMA_PANGGILAN}.` }),
        pasangDomba()),
      h("p", { class: "bera-petunjuk", text: "Ketuk domba untuk menyapa, lalu geser untuk memutarnya." }),
    ),
    kotakRujukanBeranda(),
  );

  // Baca harian (data asli dari aplikasi)
  const t = D.tanda;
  if (t && D.alkitab && kitab(t.kitab)) {
    const [ayat] = ayatDari(t.kitab, t.pasal, t.ayat);
    el.append(h("a", { class: "bera-kartu bera-baca", href: `#/alkitab/${t.kitab}/${t.pasal}/${t.ayat}` },
      h("img", { class: "bera-pita", src: "aset/pita-penanda.png", alt: "" }),
      h("div", { class: "label tanpa-titik" }, ikon("penanda", 18), "Baca harian · lanjutkan"),
      ayat ? h("p", { class: "bera-kutip", text: "“" + ayat[1] + "”" }) : null,
      h("div", { class: "bera-rujukan", text: namaRujukan(t.kitab, t.pasal, t.ayat) }),
    ));
  } else {
    el.append(h("a", { class: "bera-kartu bera-mulai", href: "#/alkitab" },
      h("span", { class: "bera-lingkar" }, ikon("buku", 28)),
      h("div", { class: "bera-tengah" },
        h("div", { class: "bera-utama", text: "Mulai baca harian" }),
        h("div", { class: "bera-sub", text: D.alkitab ? "Tandai ayat terakhir dibaca agar bisa dilanjutkan" : "Teks Alkitab sedang disiapkan…" })),
      ikon("maju", 22)));
  }

  // Ayat tersimpan (ayat pilihan; terpisah dari baca harian)
  const tersimpan = simpanAktif();
  const terbaru = tersimpan[0];
  el.append(h("a", { class: "bera-kartu bera-mulai", href: "#/tersimpan" },
    h("span", { class: "bera-lingkar" }, ikon("hati", 28)),
    h("div", { class: "bera-tengah" },
      h("div", { class: "bera-utama", text: "Ayat tersimpan" }),
      h("div", { class: "bera-sub", text: terbaru
        ? `${tersimpan.length} ayat · terbaru ${namaRujukan(terbaru.kitab, terbaru.pasal, terbaru.ayat_mulai, terbaru.ayat_sampai)}`
        : "Ketuk ayat di Alkitab, lalu pilih Simpan" })),
    ikon("maju", 22)));

  // Hiasan bawah
  el.append(h("div", { class: "bera-kaki", "aria-hidden": "true" },
    h("img", { class: "bera-daun", src: "aset/daun-sudut.png", alt: "" }),
    h("img", { class: "bera-buku", src: "aset/buku-terbuka.png", alt: "" })));
}

/* ---------------------------------------------------------------------
   12. ALKITAB
   --------------------------------------------------------------------- */
const A = baca("posisiBaca", { kode: "GEN", pasal: 1 });
let sorot = null; // { mulai, sampai } — stabilo lembut pada ayat yang dipilih

function tampilAlkitab(el, sisa) {
  aturKepala({ judul: "Alkitab", aksi: [tombolHuruf(), tombolAtur()] });
  if (!D.alkitab) {
    el.append(h("div", { class: "kosong" }, h("div", { class: "putar-muat" }),
      h("div", { class: "judul-kosong", text: "Menyiapkan teks Alkitab" }),
      navigator.onLine ? "Sedang diunduh sekali saja (sekitar 5 MB). Setelah itu bisa dibuka tanpa internet." : "Sambungkan ke internet sebentar agar teks Alkitab bisa diunduh."));
    return;
  }
  // Dari tautan: #/alkitab/KODE/PASAL/AYAT(-AKHIR)
  if (sisa[0] && kitab(sisa[0])) {
    const k = kitab(sisa[0]);
    A.kode = k.kode;
    A.pasal = Math.min(Math.max(1, +sisa[1] || 1), k.pasal.length);
    if (sisa[2]) {
      const [m, s] = sisa[2].split("-").map(Number);
      sorot = m ? { mulai: m, sampai: s || m } : null;
    } else sorot = null;
    tulis("posisiBaca", A);
    // Alamat diganti ke pasal yang sedang dibuka (tanpa nomor ayat), supaya tombol
    // Kembali di HP membawa ke pasal sebelumnya, bukan diam di tempat.
    history.replaceState(null, "", `#/alkitab/${A.kode}/${A.pasal}`);
  }
  if (!kitab(A.kode)) { A.kode = "GEN"; A.pasal = 1; }
  gambarPasal(el);
}

function bukaRujukan(kode, pasal, mulai, sampai) {
  location.hash = `#/alkitab/${kode}/${pasal}` + (mulai ? `/${mulai}${sampai && sampai > mulai ? "-" + sampai : ""}` : "");
}

function gambarPasal(el) {
  const k = kitab(A.kode);
  const ayatList = k.pasal[A.pasal - 1];

  el.append(kotakRujukan());

  // Lanjutkan baca harian (hanya berubah lewat tombol "Tandai terakhir dibaca")
  const t = D.tanda;
  if (t && kitab(t.kitab) && !(t.kitab === A.kode && t.pasal === A.pasal)) {
    el.append(h("button", { class: "alk-lanjut", type: "button", onclick: () => bukaRujukan(t.kitab, t.pasal, t.ayat) },
      ikon("penanda", 18), h("span", null, "Lanjutkan baca harian: ", h("b", { text: namaRujukan(t.kitab, t.pasal, t.ayat) }))));
  }

  // Halaman pasal
  const halaman = h("article", { class: "alk-halaman" });
  halaman.append(h("div", { class: "alk-kepala" },
    h("div", { class: "label", text: k.pl ? "Perjanjian Lama" : "Perjanjian Baru" }),
    h("h2", { text: `${k.nama} ${A.pasal}` })));
  for (const [n, teks] of ayatList) {
    const p = h("p", { class: "ayat", "data-ayat": n, tabindex: "0" }, h("sup", { text: n }), teks);
    p.addEventListener("click", () => pilihAyatBaca(n));
    p.addEventListener("keydown", (e) => { if (e.key === "Enter") pilihAyatBaca(n); });
    halaman.append(p);
  }
  halaman.append(h("div", { class: "alk-akhir", text: `AKHIR ${k.nama.toUpperCase()} ${A.pasal}` }));
  el.append(halaman);

  // Pasal sebelum/berikut
  const [sebelum, sesudah] = [geserPasal(-1), geserPasal(1)];
  el.append(h("div", { class: "alk-pindah" },
    sebelum ? h("button", { type: "button", onclick: () => bukaRujukan(sebelum.kode, sebelum.pasal) }, h("small", { text: "Sebelumnya" }), h("span", { text: namaRujukan(sebelum.kode, sebelum.pasal) })) : h("span"),
    sesudah ? h("button", { type: "button", onclick: () => bukaRujukan(sesudah.kode, sesudah.pasal) }, h("small", { text: "Selanjutnya" }), h("span", { text: namaRujukan(sesudah.kode, sesudah.pasal) })) : h("span"),
  ));

  tandaiAyat();
  if (sorot) {
    requestAnimationFrame(() => {
      const target = $(`.ayat[data-ayat="${sorot.mulai}"]`);
      if (target) target.scrollIntoView({ block: "center" });
      tampilAksiAyat();
    });
  }
}

function geserPasal(arah) {
  const k = kitab(A.kode);
  let p = A.pasal + arah;
  if (p >= 1 && p <= k.pasal.length) return { kode: k.kode, pasal: p };
  const lain = D.alkitab.kitab[k.indeks + arah];
  if (!lain) return null;
  return { kode: lain.kode, pasal: arah > 0 ? 1 : lain.pasal.length };
}

function tandaiAyat() {
  const t = D.tanda;
  const disimpan = new Set();
  for (const s of D.simpan) {
    if (s.nonaktif || s.kitab !== A.kode || s.pasal !== A.pasal) continue;
    for (let n = s.ayat_mulai; n <= s.ayat_sampai; n++) disimpan.add(n);
  }
  document.querySelectorAll(".ayat").forEach((p) => {
    const n = +p.dataset.ayat;
    p.classList.toggle("stabilo", !!sorot && n >= sorot.mulai && n <= sorot.sampai);
    p.classList.toggle("tanda-baca", !!t && t.kitab === A.kode && t.pasal === A.pasal && t.ayat === n);
    p.classList.toggle("disimpan", disimpan.has(n));
  });
}

function pilihAyatBaca(n) {
  if (sorot && sorot.mulai === n && sorot.sampai === n && $(".aksi-ayat")) { lepasSorot(); return; }
  sorot = { mulai: n, sampai: n };
  tandaiAyat();
  tampilAksiAyat();
}

/** Batalkan pilihan ayat: stabilo hilang dan bilah aksi ditutup. */
function lepasSorot() {
  sorot = null;
  tandaiAyat();
  tutupAksiAyat();
}
function tutupAksiAyat() {
  $(".aksi-ayat")?.remove();
  document.documentElement.style.setProperty("--tinggi-aksi", "0px");
}

function tampilAksiAyat() {
  tutupAksiAyat();
  if (!sorot) return;
  const { mulai, sampai } = sorot;
  const ref = namaRujukan(A.kode, A.pasal, mulai, sampai);
  const sudahDisimpan = !!cariSimpan(A.kode, A.pasal, mulai, sampai, true);
  const bilah = h("div", { class: "aksi-ayat", role: "toolbar", "aria-label": "Aksi ayat " + ref },
    h("div", { class: "ref" }, h("span", { text: ref }),
      h("button", { class: "ikon-tombol", type: "button", "aria-label": "Tutup", onclick: lepasSorot }, ikon("tutup", 20))),
    h("div", { class: "kisi-aksi" },
      h("button", { type: "button", onclick: () => salinAyat(A.kode, A.pasal, mulai, sampai) }, ikon("salin"), "Salin"),
      h("button", { type: "button", class: "tombol-simpan", "aria-pressed": String(sudahDisimpan), onclick: async () => {
        await aturSimpan(A.kode, A.pasal, mulai, sampai);
        tandaiAyat();
        tampilAksiAyat();
      } }, ikon(sudahDisimpan ? "hatiPenuh" : "hati"), sudahDisimpan ? "Tersimpan" : "Simpan"),
      h("button", { type: "button", onclick: () => sisipKeCatatan({ kode: A.kode, pasal: A.pasal, mulai, sampai }) }, ikon("sisip"), "Ke catatan"),
      h("button", { type: "button", class: "utama", onclick: () => tandaiTerakhir(A.kode, A.pasal, mulai) }, ikon("penanda", 20), "Tandai terakhir dibaca"),
    ));
  document.body.append(bilah);
  // Beri ruang di bawah halaman supaya ayat terakhir tidak tertutup bilah ini.
  requestAnimationFrame(() => {
    if (bilah.isConnected) document.documentElement.style.setProperty("--tinggi-aksi", bilah.offsetHeight + 8 + "px");
  });
}

async function salinAyat(kode, pasal, mulai, sampai) {
  const ayat = ayatDari(kode, pasal, mulai, sampai);
  const teks = ayat.map(([n, t]) => (ayat.length > 1 ? n + " " : "") + t).join(" ") + `\n— ${namaRujukan(kode, pasal, mulai, sampai)} (TB)`;
  try { await navigator.clipboard.writeText(teks); kilat("Ayat disalin"); }
  catch { kilat("Tidak bisa menyalin di perangkat ini"); }
}

/** Baca harian: hanya SATU penanda "sampai sini terakhir dibaca". */
async function tandaiTerakhir(kode, pasal, ayat) {
  D.tanda = { id: 1, kitab: kode, pasal, ayat, diubah: new Date().toISOString() };
  D.antrian.tanda = true;
  await Promise.all([simpanData(), simpanAntrian()]);
  sorot = null;
  tandaiAyat();
  tutupAksiAyat();
  kilat("Terakhir dibaca: " + namaRujukan(kode, pasal, ayat));
  sinkronNanti();
}

/* ---- Ayat tersimpan: ayat pilihan yang ingin disimpan (bukan posisi baca) ---- */
function cariSimpan(kode, pasal, mulai, sampai, hanyaAktif) {
  sampai = sampai || mulai;
  const cocok = (s) => s.kitab === kode && s.pasal === pasal && s.ayat_mulai === mulai && s.ayat_sampai === sampai;
  return D.simpan.find((s) => cocok(s) && !s.nonaktif) || (hanyaAktif ? null : D.simpan.find(cocok)) || null;
}
async function pasangSimpan(s) {
  const i = D.simpan.findIndex((x) => x.id === s.id);
  if (i >= 0) D.simpan[i] = s; else D.simpan.push(s);
  D.antrian.simpan[s.id] = true;
  await Promise.all([simpanData(), simpanAntrian()]);
  sinkronNanti();
}
/** Simpan ayat. Kalau ayat itu sudah tersimpan, ketukan kedua menghapusnya dari daftar. */
async function aturSimpan(kode, pasal, mulai, sampai) {
  sampai = sampai || mulai;
  const ada = cariSimpan(kode, pasal, mulai, sampai);
  const kini = new Date().toISOString();
  let s;
  if (ada && !ada.nonaktif) s = { ...ada, nonaktif: true };
  else if (ada) s = { ...ada, nonaktif: false, dibuat: kini };
  else s = { id: uuid(), kitab: kode, pasal, ayat_mulai: mulai, ayat_sampai: sampai, nonaktif: false, dibuat: kini };
  await pasangSimpan(s);
  kilat(s.nonaktif ? "Dihapus dari ayat tersimpan" : namaRujukan(kode, pasal, mulai, sampai) + " disimpan");
  return !s.nonaktif;
}

function cariAlkitab(q, wadah) {
  kosongkan(wadah);
  q = q.trim();
  if (!q) return;
  const ref = uraiRujukan(q);
  if (ref && ref.pasal && !ref.galat) {
    wadah.append(h("button", { type: "button", onclick: () => bukaRujukan(ref.kode, ref.pasal, ref.mulai, ref.sampai) },
      h("div", { class: "ref", text: "Buka " + namaRujukan(ref.kode, ref.pasal, ref.mulai, ref.sampai) }),
      ref.mulai ? h("div", { class: "teks", text: ayatDari(ref.kode, ref.pasal, ref.mulai, ref.sampai).map((a) => a[1]).join(" ") }) : null));
    return;
  }
  if (ref && !ref.pasal) {
    const k = kitab(ref.kode);
    wadah.append(h("button", { type: "button", onclick: async () => {
      const r = await pilihAyat({ mode: "baca", awal: { kode: k.kode } });
      if (r) bukaRujukan(r.kode, r.pasal, r.mulai, r.sampai);
    } }, h("div", { class: "ref", text: "Pilih pasal " + k.nama })));
  }
  if (q.length < 3) return;
  const kata = q.toLowerCase();
  const temuan = [];
  outer: for (const k of D.alkitab.kitab) {
    for (let p = 0; p < k.pasal.length; p++) {
      for (const [n, t] of k.pasal[p]) {
        if (t.toLowerCase().includes(kata)) { temuan.push([k.kode, p + 1, n, t]); if (temuan.length >= 100) break outer; }
      }
    }
  }
  wadah.append(h("p", { class: "teks-2 kecil", text: temuan.length ? `${temuan.length >= 100 ? "100+" : temuan.length} ayat ditemukan` : "Tidak ada ayat yang cocok." }));
  for (const [kode, pasal, n, t] of temuan) {
    const teksEl = h("div", { class: "teks" });
    const i = t.toLowerCase().indexOf(kata);
    teksEl.append(t.slice(0, i), h("mark", { text: t.slice(i, i + kata.length) }), t.slice(i + kata.length));
    wadah.append(h("button", { type: "button", onclick: () => bukaRujukan(kode, pasal, n) },
      h("div", { class: "ref", text: namaRujukan(kode, pasal, n) }), teksEl));
  }
}

/** Dari Alkitab: pilih catatan tujuan, ayat masuk sebagai blok tersendiri. */
function sisipKeCatatan(ref) {
  const l = bukaLembar({ judul: "Sisipkan ke catatan" });
  l.isi.append(h("p", { class: "petunjuk", text: namaRujukan(ref.kode, ref.pasal, ref.mulai, ref.sampai) + " akan masuk ke catatan yang Anda pilih." }));
  l.isi.append(h("button", { class: "tombol tombol-utama tombol-lebar", type: "button", onclick: async () => {
    const c = catatanBaru();
    c.isi = [{ jenis: "ayat", kitab: ref.kode, pasal: ref.pasal, mulai: ref.mulai, sampai: ref.sampai }, { jenis: "teks", teks: "" }];
    await simpanCatatan(c);
    tutupLembar();
    location.hash = "#/catatan/" + c.id;
  } }, ikon("tambah", 20), "Catatan baru"));
  const daftar = catatanAktif().slice(0, 30);
  if (daftar.length) l.isi.append(h("div", { class: "label tanpa-titik", text: "Atau pilih catatan" }));
  for (const c of daftar) {
    l.isi.append(h("button", { class: "baris-atur", type: "button", onclick: async () => {
      const isiBaru = [...(c.isi || [])];
      const terakhir = isiBaru[isiBaru.length - 1];
      if (terakhir && terakhir.jenis === "teks" && !terakhir.teks.trim()) isiBaru.pop();
      isiBaru.push({ jenis: "ayat", kitab: ref.kode, pasal: ref.pasal, mulai: ref.mulai, sampai: ref.sampai }, { jenis: "teks", teks: "" });
      await simpanCatatan({ ...c, isi: isiBaru });
      tutupLembar();
      kilat("Ayat disisipkan ke “" + (c.judul || "Tanpa judul") + "”");
    } }, h("div", { class: "tengah" }, h("div", { class: "utama", text: c.judul || "Tanpa judul" }), h("div", { class: "sub", text: teksTanggal(c.tanggal, true) })), ikon("maju")));
  }
}

/* ---------------------------------------------------------------------
   13. LAGU
   --------------------------------------------------------------------- */
let filterLagu = "";
function tampilLagu(el) {
  aturKepala({ judul: "Lagu", aksi: [tombolAtur()] });
  const daftar = laguAktif();
  el.append(h("div", { class: "label", text: "Playlist" }), h("h2", { class: "judul-besar", text: "Lagu rohani" }));
  if (D.pengaturan.playlist_diganti) el.append(h("p", { class: "teks-2 kecil", text: "Diganti " + teksTanggal(D.pengaturan.playlist_diganti) }));
  if (!daftar.length) {
    el.append(h("div", { class: "kosong" }, h("div", { class: "judul-kosong", text: "Playlist masih kosong" }),
      "Unggah lagu dan pilih lagu untuk playlist di Pengaturan.",
      h("div", { style: null }, h("a", { class: "tombol tombol-utama", href: "#/atur/lagu", text: "Atur playlist" }))));
    return;
  }
  el.append(h("div", { class: "kartu ringkas-unduh kartu-lanjut", id: "ringkas-unduh" }));
  const input = h("input", { type: "search", placeholder: "Cari judul atau penyanyi", value: filterLagu, autocomplete: "off" });
  input.addEventListener("input", () => { filterLagu = input.value; perbaruiDaftarLagu(); });
  el.append(h("label", { class: "cari" }, ikon("cari", 20), input));
  el.append(h("div", { class: "baris-tombol" },
    h("button", { class: "tombol tombol-utama", type: "button", onclick: () => Pemutar.putar(laguAktif(), 0) }, ikon("putar", 18), "Putar semua"),
    h("a", { class: "tombol", href: "#/atur/lagu" }, ikon("atur", 18), "Atur playlist")));
  el.append(h("ul", { class: "daftar-lagu", id: "daftar-lagu" }));
  perbaruiDaftarLagu();
}

function perbaruiDaftarLagu() {
  const ul = $("#daftar-lagu"), ringkas = $("#ringkas-unduh");
  if (!ul) return;
  const semua = laguAktif();
  const tersimpan = semua.filter((l) => D.berkas.has(kunciBerkas("lagu", l.file_path))).length;
  const totalByte = semua.reduce((s, l) => s + (+l.ukuran_byte || 0), 0);
  tambahAnak(kosongkan(ringkas), [
    h("span", { class: "lingkar" }, ikon(tersimpan === semua.length ? "centang" : "unduh")),
    h("div", { class: "tengah" },
      h("b", { text: `${tersimpan} dari ${semua.length} lagu tersimpan di HP` }),
      h("div", { class: "teks-2 kecil", text: tersimpan === semua.length ? `Bisa diputar tanpa internet · ${ukuranMB(totalByte)}`
        : Unduhan.jalan ? `Sedang mengunduh… (${Unduhan.selesai}/${Unduhan.total})`
        : navigator.onLine ? "Akan diunduh otomatis" : "Diunduh saat ada internet" }),
      h("div", { class: "batang" }, h("div"))),
    !Unduhan.jalan && tersimpan < semua.length && navigator.onLine
      ? h("button", { class: "tombol tombol-kecil", type: "button", onclick: () => Unduhan.mulai() }, "Unduh") : null,
  ]);
  $(".batang > div", ringkas).style.width = (semua.length ? (tersimpan / semua.length) * 100 : 0) + "%";

  kosongkan(ul);
  const q = filterLagu.trim().toLowerCase();
  semua.forEach((l, i) => {
    if (q && !(`${l.judul} ${l.penyanyi} ${l.keterangan}`.toLowerCase().includes(q))) return;
    const main = Pemutar.lagu?.id === l.id;
    const ok = D.berkas.has(kunciBerkas("lagu", l.file_path));
    ul.append(h("li", null, h("button", { class: "baris-lagu" + (main ? " diputar" : ""), type: "button", onclick: () => {
      if (main) Pemutar.alih(); else Pemutar.putar(semua, i);
    } },
      h("span", { class: "nomor" }, main ? ikon(Pemutar.sedangMain() ? "jeda" : "putar", 18) : String(i + 1)),
      h("div", { class: "tengah" },
        h("div", { class: "judul", text: l.judul }),
        h("div", { class: "sub" },
          [l.penyanyi, durasi(l.durasi_detik)].filter(Boolean).join(" · "), " · ",
          h("span", { class: "status-simpan" + (ok ? " ok" : "") }, ikon(ok ? "centang" : "unduh", 14), ok ? "Tersimpan" : "Belum tersimpan"))),
    )));
  });
}

/* ---------------------------------------------------------------------
   14. CERITA
   --------------------------------------------------------------------- */
let filterCerita = { perjanjian: "semua", q: "" };
const posisiCerita = () => baca("posisiCerita", {});

function kartuSorotan(c) {
  const hal = halamanDari(c.id);
  const pos = posisiCerita()[c.id];
  return h("div", { class: "kartu sorotan" },
    h("div", { class: "gambar" }, gambar(c.sampul_path || hal[0]?.gambar_path, c.judul),
      h("span", { class: "lencana", text: c.perjanjian === "PL" ? "PERJANJIAN LAMA" : "PERJANJIAN BARU" })),
    h("div", { class: "label tanpa-titik", text: [c.rujukan, hal.length + " halaman"].filter(Boolean).join(" · ") }),
    h("h3", { text: c.judul }),
    c.ringkasan ? h("p", { class: "teks-2", text: c.ringkasan }) : null,
    h("a", { class: "tombol tombol-utama", href: `#/cerita/${c.id}` + (pos ? "/" + pos : "") }, pos ? `Lanjutkan hal. ${pos}` : "Baca cerita", ikon("maju", 18)));
}

function tampilCerita(el) {
  aturKepala({ judul: "Cerita", aksi: [tombolAtur()] });
  const semua = ceritaAktif();
  el.append(h("div", { class: "label", text: "Cerita Alkitab bergambar" }), h("h2", { class: "judul-besar", text: "Pilih cerita" }));
  if (!semua.length) {
    el.append(h("div", { class: "kosong" }, h("div", { class: "judul-kosong", text: "Belum ada cerita" }), "Tambahkan cerita di Pengaturan.",
      h("div", null, h("a", { class: "tombol tombol-utama", href: "#/atur/cerita", text: "Tambah cerita" }))));
    return;
  }
  const input = h("input", { type: "search", placeholder: "Cari tokoh, kisah, atau kitab", value: filterCerita.q, autocomplete: "off" });
  const kisi = h("div", { class: "kisi-cerita" });
  const chips = h("div", { class: "chips" });
  const jumlah = { semua: semua.length, PL: semua.filter((c) => c.perjanjian === "PL").length, PB: semua.filter((c) => c.perjanjian === "PB").length };
  for (const [k, label] of [["semua", "Semua"], ["PL", "Perjanjian Lama"], ["PB", "Perjanjian Baru"]]) {
    chips.append(h("button", { class: "chip", type: "button", "aria-pressed": String(filterCerita.perjanjian === k), onclick: (e) => {
      filterCerita.perjanjian = k;
      chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b === e.currentTarget)));
      isiKisi();
    } }, `${label} (${jumlah[k]})`));
  }
  const pos = posisiCerita();
  const isiKisi = () => {
    kosongkan(kisi);
    const q = filterCerita.q.trim().toLowerCase();
    const tampil = semua.filter((c) => (filterCerita.perjanjian === "semua" || c.perjanjian === filterCerita.perjanjian)
      && (!q || `${c.judul} ${c.rujukan} ${c.ringkasan}`.toLowerCase().includes(q)));
    if (!tampil.length) kisi.append(h("p", { class: "teks-2", text: "Tidak ada cerita yang cocok." }));
    for (const c of tampil) {
      const hal = halamanDari(c.id);
      kisi.append(h("a", { class: "kartu-cerita", href: `#/cerita/${c.id}` + (pos[c.id] ? "/" + pos[c.id] : "") },
        h("div", { class: "gambar" }, gambar(c.sampul_path || hal[0]?.gambar_path, ""),
          h("span", { class: "lencana", text: c.perjanjian + (c.rujukan ? " · " + c.rujukan : "") })),
        h("div", { class: "badan" }, h("div", { class: "judul", text: c.judul }),
          h("div", { class: "meta", text: `${hal.length} halaman` + (pos[c.id] ? ` · lanjut hal. ${pos[c.id]}` : "") }))));
    }
  };
  input.addEventListener("input", () => { filterCerita.q = input.value; isiKisi(); });
  el.append(h("label", { class: "cari" }, ikon("cari", 20), input), chips, kisi);
  isiKisi();
}

function tampilBacaCerita(el, id, halStr) {
  const c = D.cerita.find((x) => x.id === id);
  aturKepala({ judul: c ? c.judul : "Cerita", kembali: "#/cerita", aksi: [tombolHuruf()] });
  if (!c) { el.append(h("div", { class: "kosong", text: "Cerita tidak ditemukan." })); return; }
  const hal = halamanDari(id);
  const n = Math.min(Math.max(0, parseInt(halStr, 10) || 0), hal.length);

  const pindah = (ke) => {
    if (ke > hal.length) { const p = posisiCerita(); delete p[id]; tulis("posisiCerita", p); location.hash = "#/cerita"; kilat("Cerita selesai dibaca"); return; }
    location.replace(`#/cerita/${id}/${ke}`);
  };

  if (n === 0) {
    // Layar pertama: judul & jumlah halaman, lalu Mulai
    const pos = posisiCerita()[id];
    el.append(h("div", { class: "baca-sampul" },
      h("div", { class: "gambar" }, gambar(c.sampul_path || hal[0]?.gambar_path, c.judul)),
      h("div", { class: "label", style: null, text: (c.perjanjian === "PL" ? "Perjanjian Lama" : "Perjanjian Baru") + (c.rujukan ? " · " + c.rujukan : "") }),
      h("h2", { text: c.judul }),
      h("div", { class: "teks-2", text: hal.length + " halaman" }),
      c.ringkasan ? h("p", { text: c.ringkasan }) : null));
    const kaki = h("div", { class: "kaki-baca" });
    if (pos && pos > 1) kaki.append(h("button", { class: "tombol", type: "button", onclick: () => pindah(1) }, "Dari awal"),
      h("button", { class: "tombol tombol-utama", type: "button", onclick: () => pindah(pos) }, `Lanjut hal. ${pos}`, ikon("maju", 18)));
    else kaki.append(h("button", { class: "tombol tombol-utama", type: "button", disabled: !hal.length, onclick: () => pindah(1) }, "Mulai", ikon("maju", 18)));
    pasangKaki(kaki);
    return;
  }

  const p = hal[n - 1];
  const pos = posisiCerita(); pos[id] = n; tulis("posisiCerita", pos);
  const wadah = h("div", { class: "baca-hal" });
  wadah.append(
    h("div", { class: "gambar" }, gambar(p.gambar_path, "")),
    h("div", { class: "nomor-hal", text: `Halaman ${n} dari ${hal.length}` }),
    h("p", { class: "teks-cerita", text: p.teks }));
  if (p.kitab && p.pasal && D.alkitab && kitab(p.kitab)) {
    const ayat = p.ayat_mulai ? ayatDari(p.kitab, p.pasal, p.ayat_mulai, p.ayat_sampai) : [];
    wadah.append(h("div", { class: "landasan" },
      h("div", { class: "label tanpa-titik" }, ikon("buku", 16), "Landasan Kitab Suci"),
      ayat.length ? h("p", { class: "ayat-kutip", text: "“" + ayat.map((a) => a[1]).join(" ") + "”" }) : null,
      h("div", { class: "baris-tombol" },
        h("span", { class: "rujukan", text: namaRujukan(p.kitab, p.pasal, p.ayat_mulai, p.ayat_sampai) }),
        h("button", { class: "tombol tombol-kecil", type: "button", onclick: () => bukaRujukan(p.kitab, p.pasal, p.ayat_mulai, p.ayat_sampai) }, "Buka di Alkitab"))));
  } else if (p.kitab && p.pasal) {
    wadah.append(h("div", { class: "landasan" }, h("span", { class: "rujukan", text: namaRujukan(p.kitab, p.pasal, p.ayat_mulai, p.ayat_sampai) })));
  }
  const titik = h("div", { class: "titik-hal", "aria-hidden": "true" });
  hal.forEach((_, i) => titik.append(h("span", { class: i === n - 1 ? "aktif" : "" })));
  wadah.append(titik);
  el.append(wadah);

  // Geser kiri/kanan
  let x0 = null, y0 = null;
  wadah.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  wadah.addEventListener("touchend", (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) pindah(dx < 0 ? n + 1 : Math.max(1, n - 1));
  });

  pasangKaki(h("div", { class: "kaki-baca" },
    h("button", { class: "tombol", type: "button", onclick: () => pindah(n - 1) }, ikon("kembali", 18), n === 1 ? "Sampul" : "Sebelumnya"),
    h("button", { class: "tombol tombol-utama", type: "button", onclick: () => pindah(n + 1) }, n === hal.length ? "Selesai" : "Berikutnya", ikon(n === hal.length ? "centang" : "maju", 18))));
}

/* ---------------------------------------------------------------------
   15. CATATAN KHOTBAH
   --------------------------------------------------------------------- */
let filterCatatan = "";
function ringkasCatatan(c) {
  const teks = (c.isi || []).filter((b) => b.jenis === "teks").map((b) => b.teks).join(" ").replace(/\s+/g, " ").trim();
  const ayat = (c.isi || []).filter((b) => b.jenis === "ayat");
  return { teks, ayat };
}
function kartuCatatan(c) {
  const { teks, ayat } = ringkasCatatan(c);
  return h("a", { class: "kartu kartu-tekan kartu-catatan", href: "#/catatan/" + c.id },
    h("div", { class: "tgl", text: [teksTanggal(c.tanggal, true), c.pengkhotbah, c.tempat].filter(Boolean).join(" · ") }),
    h("h3", { text: c.judul || "Tanpa judul" }),
    ayat.length ? h("div", null, ayat.slice(0, 3).map((b) => h("span", { class: "pil-ayat", text: namaRujukan(b.kitab, b.pasal, b.mulai, b.sampai) })),
      ayat.length > 3 ? h("span", { class: "pil-ayat", text: "+" + (ayat.length - 3) }) : null) : null,
    teks ? h("div", { class: "cuplik", text: teks }) : null);
}

function tampilCatatan(el) {
  aturKepala({ judul: "Catatan", aksi: [tombolAtur()] });
  el.append(h("div", { class: "label", text: "Rangkuman khotbah" }), h("h2", { class: "judul-besar", text: "Catatan khotbah" }));
  el.append(h("a", { class: "tombol tombol-utama tombol-lebar", href: "#/catatan/baru" }, ikon("pena", 20), "Tulis catatan baru"));
  const semua = catatanAktif();
  const daftar = h("div", { style: null });
  const input = h("input", { type: "search", placeholder: "Cari judul, isi, atau ayat", value: filterCatatan, autocomplete: "off" });
  const isiDaftar = () => {
    kosongkan(daftar);
    const q = filterCatatan.trim().toLowerCase();
    const tampil = semua.filter((c) => {
      if (!q) return true;
      const { teks, ayat } = ringkasCatatan(c);
      return `${c.judul} ${c.pengkhotbah} ${c.tempat} ${teks} ${ayat.map((b) => namaRujukan(b.kitab, b.pasal, b.mulai, b.sampai)).join(" ")}`.toLowerCase().includes(q);
    });
    if (!tampil.length) daftar.append(h("div", { class: "kosong" }, h("div", { class: "judul-kosong", text: semua.length ? "Tidak ada yang cocok" : "Belum ada catatan" }),
      semua.length ? "Coba kata lain." : "Tekan Tulis catatan baru untuk mulai."));
    tampil.forEach((c) => daftar.append(kartuCatatan(c)));
  };
  input.addEventListener("input", () => { filterCatatan = input.value; isiDaftar(); });
  if (semua.length) el.append(h("label", { class: "cari" }, ikon("cari", 20), input));
  else el.append(h("div", { style: null }, h("br")));
  el.append(daftar);
  isiDaftar();
}

function catatanBaru() {
  const kini = new Date().toISOString();
  return { id: uuid(), judul: "", tanggal: tanggalLokal(), pengkhotbah: "", tempat: "", isi: [{ jenis: "teks", teks: "" }], nonaktif: false, dibuat: kini, diubah: kini };
}
async function simpanCatatan(c) {
  c.diubah = new Date().toISOString();
  const i = D.catatan.findIndex((x) => x.id === c.id);
  if (i >= 0) D.catatan[i] = c; else D.catatan.push(c);
  D.antrian.catatan[c.id] = true;
  await Promise.all([simpanData(), simpanAntrian()]);
  sinkronNanti();
}
const catatanKosong = (c) => !c.judul.trim() && !c.pengkhotbah.trim() && !c.tempat.trim() && !(c.isi || []).some((b) => b.jenis === "ayat" || b.teks.trim());

function tampilEditor(el, id) {
  if (id === "baru") {
    const c = catatanBaru();
    history.replaceState(null, "", "#/catatan/" + c.id);
    tampilanSaatIni = "catatan/" + c.id;
    return gambarEditor(el, c, true);
  }
  const c = D.catatan.find((x) => x.id === id && !x.nonaktif);
  if (!c) { aturKepala({ judul: "Catatan", kembali: "#/catatan" }); el.append(h("div", { class: "kosong", text: "Catatan tidak ditemukan." })); return; }
  gambarEditor(el, structuredClone(c), false);
}

function gambarEditor(el, c, baru) {
  let tersimpanDiDaftar = !baru;
  const status = h("span", { class: "status-simpan-catatan", text: baru ? "" : "Tersimpan" });
  const tombolHapus = h("button", { class: "ikon-tombol", type: "button", "aria-label": "Hapus catatan", onclick: async () => {
    if (!(await konfirmasi("Hapus catatan?", "Catatan “" + (c.judul || "Tanpa judul") + "” akan dihapus.", "Hapus"))) return;
    if (tersimpanDiDaftar) { c.nonaktif = true; await simpanCatatan(c); }
    location.hash = "#/catatan";
    kilat("Catatan dihapus");
  } }, ikon("sampah"));
  const tombolWA = h("button", { class: "ikon-tombol", type: "button", "aria-label": "Kirim ke WA", onclick: async () => {
    if (catatanKosong(c)) { kilat("Catatan masih kosong"); return; }
    tombolWA.disabled = true; tombolWA.style.opacity = ".4";
    try { await kirimWA(teksCatatanWA(c)); } finally { tombolWA.disabled = false; tombolWA.style.opacity = ""; }
  } }, h("img", { src: "./aset/wa-hijau.svg", alt: "", width: "24", height: "24" }));
  aturKepala({ judul: "Catatan", kembali: "#/catatan", aksi: [status, tombolWA, tombolHapus] });

  // Fokus terakhir, supaya ayat disisipkan tepat di posisi kursor.
  let fokus = { indeks: -1, posisi: 0 };

  const simpanNanti = tunda(async () => {
    if (!tersimpanDiDaftar && catatanKosong(c)) return;
    await simpanCatatan(structuredClone(c));
    tersimpanDiDaftar = true;
    status.textContent = navigator.onLine ? "Tersimpan" : "Tersimpan di HP";
  }, 700);
  const berubah = () => { status.textContent = "Menyimpan…"; simpanNanti(); };

  // Judul & keterangan
  const judul = h("textarea", { class: "editor-judul", rows: "1", placeholder: "Judul khotbah", maxlength: "200", value: c.judul });
  judul.addEventListener("input", () => { c.judul = judul.value.replace(/\n/g, " "); tinggiOtomatis(judul); berubah(); });
  const meta = (label, kunci, jenis = "text", ph = "") => {
    const inp = h("input", { type: jenis, value: c[kunci] || "", placeholder: ph, maxlength: "120" });
    inp.addEventListener("input", () => { c[kunci] = inp.value || (kunci === "tanggal" ? tanggalLokal() : ""); berubah(); });
    return h("label", null, h("span", { text: label }), inp);
  };
  el.append(judul, h("div", { class: "editor-meta" },
    meta("Tanggal", "tanggal", "date"), meta("Pengkhotbah", "pengkhotbah", "text", "nama"), meta("Tempat", "tempat", "text", "gereja")));

  const wadah = h("div", { class: "blok-wadah" });
  el.append(wadah);

  const rapikan = () => {
    // Gabungkan teks yang berdampingan, pastikan selalu diakhiri blok teks.
    const hasil = [];
    for (const b of c.isi) {
      const akhir = hasil[hasil.length - 1];
      if (b.jenis === "teks" && akhir?.jenis === "teks") akhir.teks = [akhir.teks, b.teks].filter((t) => t !== "").join("\n");
      else hasil.push(b);
    }
    if (!hasil.length || hasil[hasil.length - 1].jenis !== "teks") hasil.push({ jenis: "teks", teks: "" });
    if (hasil[0].jenis !== "teks") hasil.unshift({ jenis: "teks", teks: "" });
    c.isi = hasil;
  };

  const gambarBlok = () => {
    const y = window.scrollY; // ingat posisi layar, supaya tidak loncat ke atas
    rapikan();
    kosongkan(wadah);
    c.isi.forEach((b, i) => {
      if (b.jenis === "teks") {
        const ta = h("textarea", { class: "blok-teks", rows: "1", value: b.teks,
          placeholder: i === 0 ? "Tulis rangkuman khotbah di sini…" : (i === c.isi.length - 1 ? "Lanjutkan menulis…" : "") });
        const ingat = () => (fokus = { indeks: i, posisi: ta.selectionStart ?? ta.value.length });
        ta.addEventListener("input", () => { b.teks = ta.value; tinggiOtomatis(ta); ingat(); berubah(); });
        ["focus", "click", "keyup", "select"].forEach((ev) => ta.addEventListener(ev, ingat));
        ta.addEventListener("blur", ingat);
        // Tetap ditampilkan walau kosong & di tengah, tapi dibuat ramping
        if (!b.teks && i > 0 && i < c.isi.length - 1) ta.style.minHeight = "28px";
        wadah.append(ta);
      } else {
        const ayat = ayatDari(b.kitab, b.pasal, b.mulai, b.sampai);
        const ref = namaRujukan(b.kitab, b.pasal, b.mulai, b.sampai);
        wadah.append(h("div", { class: "blok-ayat" },
          h("div", { class: "ref" }, h("b", { text: ref }), h("div", { class: "aksi" },
            h("button", { class: "ikon-tombol", type: "button", "aria-label": "Buka di Alkitab", onclick: () => bukaRujukan(b.kitab, b.pasal, b.mulai, b.sampai) }, ikon("buku", 18)),
            h("button", { class: "ikon-tombol", type: "button", "aria-label": "Hapus ayat ini", onclick: () => { c.isi.splice(i, 1); fokus = { indeks: -1, posisi: 0 }; gambarBlok(); berubah(); } }, ikon("tutup", 18)))),
          h("div", { class: "teks" }, ayat.length
            ? ayat.map(([n, t]) => [ayat.length > 1 ? h("sup", { text: n }) : null, t, " "])
            : (D.alkitab ? "Ayat tidak ditemukan." : "Teks ayat muncul setelah Alkitab tersimpan."))));
      }
    });
    wadah.querySelectorAll("textarea").forEach(tinggiOtomatis);
    window.scrollTo(0, y);
  };

  const sisipkan = (ref) => {
    const blokAyat = { jenis: "ayat", kitab: ref.kode, pasal: ref.pasal, mulai: ref.mulai, sampai: ref.sampai || ref.mulai };
    let i = fokus.indeks;
    if (i < 0 || !c.isi[i] || c.isi[i].jenis !== "teks") i = c.isi.length - 1;
    const b = c.isi[i];
    const pos = Math.min(fokus.indeks === i ? fokus.posisi : b.teks.length, b.teks.length);
    const sebelum = b.teks.slice(0, pos).replace(/\s+$/, ""), sesudah = b.teks.slice(pos).replace(/^\s+/, "");
    c.isi.splice(i, 1, { jenis: "teks", teks: sebelum }, blokAyat, { jenis: "teks", teks: sesudah });
    if (!sebelum && i === 0 && c.isi.length > 3) c.isi.splice(i, 1);
    gambarBlok();
    berubah();
    // Kursor pindah ke teks sesudah ayat yang baru disisipkan
    const idx = c.isi.indexOf(blokAyat);
    fokus = { indeks: idx + 1, posisi: 0 };
    kilat(namaRujukan(blokAyat.kitab, blokAyat.pasal, blokAyat.mulai, blokAyat.sampai) + " disisipkan");
    const blokEl = wadah.children[idx];
    blokEl?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  gambarBlok();
  requestAnimationFrame(() => tinggiOtomatis(judul));

  // Bilah sisip cepat di bawah: ketik "yoh 3:16" lalu Sisipkan, atau ketuk tombol buku untuk memilih dengan angka.
  const input = h("input", { type: "text", placeholder: "Ayat, mis. yoh 3:16", autocomplete: "off", autocapitalize: "off", spellcheck: "false", enterkeyhint: "done", "aria-label": "Sisipkan ayat" });
  const proses = async () => {
    const teks = input.value.trim();
    if (!teks) { const r = await pilihAyat({ mode: "sisip" }); if (r) sisipkan(r); return; }
    const ref = uraiRujukan(teks);
    if (!ref || ref.galat) { kilat("Ayat tidak ditemukan. Contoh: yoh 3:16"); return; }
    input.value = "";
    if (ref.mulai) { sisipkan(ref); return; }
    // Baru kitab/pasal → lanjutkan dengan tombol angka
    const r = await pilihAyat({ mode: "sisip", awal: { kode: ref.kode, pasal: ref.pasal || null } });
    if (r) sisipkan(r);
  };
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); input.blur(); proses(); } });
  pasangKaki(h("div", { class: "bilah-sisip" },
    h("button", { class: "ikon-tombol", type: "button", "aria-label": "Pilih ayat dengan angka", onmousedown: (e) => e.preventDefault(), onclick: async () => {
      const r = await pilihAyat({ mode: "sisip" }); if (r) sisipkan(r);
    } }, ikon("buku")),
    h("label", { class: "cari" }, input),
    h("button", { class: "tombol tombol-utama", type: "button", onmousedown: (e) => e.preventDefault(), onclick: proses }, "Sisipkan")));

  if (baru) requestAnimationFrame(() => judul.focus());
}

function tinggiOtomatis(ta) {
  const y = window.scrollY; // tanpa ini, layar loncat ke atas tiap kali mengetik
  ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px";
  window.scrollTo(0, y);
}

/** Isi catatan jadi teks siap kirim (judul, info, tulisan, ayat). */
function teksCatatanWA(c) {
  const info = [c.tanggal && teksTanggal(c.tanggal), c.pengkhotbah && "Pengkhotbah: " + c.pengkhotbah, c.tempat && "Tempat: " + c.tempat].filter(Boolean);
  const isi = (c.isi || []).map((b) => {
    if (b.jenis !== "ayat") return b.teks.trim();
    const a = ayatDari(b.kitab, b.pasal, b.mulai, b.sampai);
    return `_${namaRujukan(b.kitab, b.pasal, b.mulai, b.sampai)}_\n` + a.map(([n, t]) => (a.length > 1 ? n + " " : "") + t).join(" ");
  }).filter(Boolean);
  return [`*${c.judul.trim() || "Catatan khotbah"}*`, info.join("\n"), ...isi].filter(Boolean).join("\n\n");
}

/** Buka WhatsApp dengan teks siap kirim; kontaknya dipilih di WhatsApp. */
async function kirimWA(teks) {
  const url = "https://wa.me/?text=" + encodeURIComponent(teks);
  if (url.length <= 3500) { kilat("Membuka WhatsApp…"); window.open(url, "_blank", "noopener"); return; }
  if (navigator.share) { try { await navigator.share({ text: teks }); } catch (e) { if (e.name !== "AbortError") kilat("Gagal membagikan"); } return; }
  try { await navigator.clipboard.writeText(teks); kilat("Catatan panjang, sudah disalin. Tempel di WhatsApp."); }
  catch { kilat("Catatan terlalu panjang untuk dikirim"); }
}

/* ---------------------------------------------------------------------
   15b. AYAT TERSIMPAN (ayat pilihan yang ingin disimpan)
   Berbeda dari baca harian: baca harian hanya satu penanda "terakhir sampai
   mana", sedangkan di sini berisi banyak ayat yang Anda simpan karena bagus.
   --------------------------------------------------------------------- */
/** Jumlah perubahan yang belum terkirim ke internet. */
function jumlahTertunda() {
  return Object.keys(D.antrian.catatan).length + Object.keys(D.antrian.simpan).length + (D.antrian.tanda ? 1 : 0);
}

let filterSimpan = "";
function tampilTersimpan(el) {
  aturKepala({ judul: "Tersimpan", aksi: [tombolHuruf(), tombolAtur()] });
  const semua = simpanAktif();
  el.append(h("div", { class: "label", text: "Ayat pilihan" }),
    h("h2", { class: "judul-besar", text: "Ayat tersimpan" }));
  if (!semua.length) {
    el.append(h("div", { class: "kosong" },
      h("div", { class: "judul-kosong", text: "Belum ada ayat tersimpan" }),
      "Saat menemukan ayat yang menguatkan, ketuk ayatnya di Alkitab lalu pilih Simpan.",
      h("div", null, h("a", { class: "tombol tombol-utama", href: "#/alkitab" }, ikon("buku", 18), "Buka Alkitab"))));
    return;
  }
  el.append(h("p", { class: "teks-2 kecil", text: `${semua.length} ayat · terbaru di atas` }));
  const daftar = h("div");
  const input = h("input", { type: "search", placeholder: "Cari kitab atau kata", value: filterSimpan, autocomplete: "off" });
  const isiDaftar = () => {
    kosongkan(daftar);
    const q = filterSimpan.trim().toLowerCase();
    const tampil = semua.filter((s) => !q || teksCariSimpan(s).includes(q));
    if (!tampil.length) daftar.append(h("div", { class: "kosong" }, h("div", { class: "judul-kosong", text: "Tidak ada yang cocok" }), "Coba kata lain."));
    for (const s of tampil) daftar.append(kartuSimpan(s));
  };
  input.addEventListener("input", () => { filterSimpan = input.value; isiDaftar(); });
  if (semua.length > 3) el.append(h("label", { class: "cari" }, ikon("cari", 20), input));
  el.append(daftar);
  isiDaftar();
}

function teksCariSimpan(s) {
  const ref = namaRujukan(s.kitab, s.pasal, s.ayat_mulai, s.ayat_sampai);
  const ayat = ayatDari(s.kitab, s.pasal, s.ayat_mulai, s.ayat_sampai).map((a) => a[1]).join(" ");
  return (ref + " " + ayat).toLowerCase();
}

function tanggalSimpan(iso) {
  const d = new Date(iso);
  return isNaN(d) ? "" : "Disimpan " + fmtTanggalPendek.format(d);
}

function kartuSimpan(s) {
  const ref = namaRujukan(s.kitab, s.pasal, s.ayat_mulai, s.ayat_sampai);
  const ayat = ayatDari(s.kitab, s.pasal, s.ayat_mulai, s.ayat_sampai);
  const nomor = s.ayat_mulai + (s.ayat_sampai > s.ayat_mulai ? "-" + s.ayat_sampai : "");
  return h("article", { class: "kartu kartu-simpan" },
    h("a", { class: "simpan-buka", href: `#/alkitab/${s.kitab}/${s.pasal}/${nomor}` },
      h("div", { class: "rujukan", text: ref }),
      ayat.length
        ? h("p", { class: "simpan-teks" }, ayat.map(([n, t]) => [ayat.length > 1 ? h("sup", { text: n }) : null, t, " "]))
        : h("p", { class: "teks-2 kecil", text: D.alkitab ? "Ayat tidak ditemukan." : "Teks ayat muncul setelah Alkitab tersimpan." })),
    h("div", { class: "simpan-kaki" },
      h("span", { class: "simpan-tgl", text: tanggalSimpan(s.dibuat) }),
      h("span", { class: "simpan-aksi" },
        h("button", { class: "ikon-tombol", type: "button", "aria-label": "Salin " + ref, onclick: () => salinAyat(s.kitab, s.pasal, s.ayat_mulai, s.ayat_sampai) }, ikon("salin", 20)),
        h("button", { class: "ikon-tombol", type: "button", "aria-label": "Hapus " + ref + " dari ayat tersimpan", onclick: () => hapusSimpan(s) }, ikon("sampah", 20)))));
}

async function hapusSimpan(s) {
  const ref = namaRujukan(s.kitab, s.pasal, s.ayat_mulai, s.ayat_sampai);
  if (!(await konfirmasi("Hapus dari tersimpan?", `${ref} dihapus dari daftar ayat tersimpan. Ayatnya tetap ada di Alkitab.`, "Hapus", true))) return;
  await pasangSimpan({ ...s, nonaktif: true });
  kilat("Dihapus dari ayat tersimpan");
  const y = window.scrollY; rute(); window.scrollTo(0, y);
}

/* ---------------------------------------------------------------------
   16. PENGATURAN
   --------------------------------------------------------------------- */
function tampilAtur(el) {
  aturKepala({ judul: "Pengaturan", kembali: "#/beranda" });
  const tema = baca("tema", "otomatis");
  const chipsTema = h("div", { class: "chips" });
  for (const [k, label] of [["otomatis", "Ikut HP"], ["terang", "Terang"], ["gelap", "Gelap (malam)"]]) {
    chipsTema.append(h("button", { class: "chip", type: "button", "aria-pressed": String(tema === k), onclick: () => { tulis("tema", k); terapkanTema(); rute(); } }, label));
  }
  const ukuran = baca("ukuran", 19);
  const chipsUkuran = h("div", { class: "chips" });
  UKURAN.forEach((u, i) => chipsUkuran.append(h("button", { class: "chip", type: "button", "aria-pressed": String(ukuran === u), onclick: () => { tulis("ukuran", u); terapkanTema(); rute(); } },
    ["Kecil", "Sedang", "Besar", "Sangat besar"][i])));

  const tertunda = jumlahTertunda();
  const infoSimpan = h("div", { class: "sub", text: "Menghitung…" });
  navigator.storage?.estimate?.().then((e) => (infoSimpan.textContent = `Terpakai ${ukuranMB(e.usage || 0)} di HP`)).catch(() => (infoSimpan.textContent = ""));

  el.append(
    h("div", { class: "label", text: "Tampilan" }),
    h("div", { class: "kartu" },
      h("div", { class: "utama", text: "Mode" }), chipsTema,
      h("div", { class: "utama", text: "Ukuran huruf Alkitab & cerita" }), chipsUkuran,
      h("p", { class: "ayat", style: null }, h("sup", { text: "1" }), "Contoh ukuran huruf ayat.")),
    ...(FITUR.lagu || FITUR.cerita ? [h("div", { class: "label", text: "Isi aplikasi" }),
    h("div", { class: "kartu" },
      ...(FITUR.lagu ? [h("a", { class: "baris-atur", href: "#/atur/lagu" }, ikon("musik"), h("div", { class: "tengah" }, h("div", { class: "utama", text: "Lagu & playlist" }), h("div", { class: "sub", text: `${laguAktif().length} lagu di playlist` })), ikon("maju"))] : []),
      ...(FITUR.cerita ? [h("a", { class: "baris-atur", href: "#/atur/cerita" }, ikon("gambar"), h("div", { class: "tengah" }, h("div", { class: "utama", text: "Cerita bergambar" }), h("div", { class: "sub", text: `${ceritaAktif().length} cerita` })), ikon("maju"))] : [])),
    ] : []),
    h("div", { class: "label", text: "Penyimpanan di HP" }),
    h("div", { class: "kartu" },
      h("div", { class: "baris-atur" }, ikon("buku"), h("div", { class: "tengah" }, h("div", { class: "utama", text: "Teks Alkitab TB" }),
        h("div", { class: "sub", text: D.alkitab ? `Tersimpan · ${D.alkitab.jumlah_ayat?.toLocaleString("id-ID") || ""} ayat` : "Belum tersimpan" }))),
      h("div", { class: "baris-atur" }, ikon("unduh"), h("div", { class: "tengah" }, h("div", { class: "utama", text: "Ruang terpakai" }), infoSimpan)),
      h("div", { class: "baris-atur" }, ikon("segar"), h("div", { class: "tengah" }, h("div", { class: "utama", text: "Sinkron" }),
        h("div", { class: "sub", text: (D.waktuSinkron ? "Terakhir " + new Date(D.waktuSinkron).toLocaleString("id-ID") : "Belum pernah") + (tertunda ? ` · ${tertunda} perubahan menunggu internet` : "") })),
        h("button", { class: "tombol tombol-kecil", type: "button", disabled: !navigator.onLine, onclick: async () => { kilat("Menyinkronkan…"); await sinkron(); kilat("Sinkron selesai"); } }, "Sekarang"))),
    h("div", { class: "label", text: "Akun" }),
    h("div", { class: "kartu" },
      h("div", { class: "baris-atur" }, h("div", { class: "tengah" }, h("div", { class: "utama", text: SB.nama() || "Pemilik" }), h("div", { class: "sub", text: SB.email() }))),
      h("button", { class: "tombol tombol-bahaya tombol-lebar", type: "button", onclick: keluarAkun }, ikon("keluar", 20), "Keluar")),
    h("p", { class: "teks-2 kecil", text: "Alkitab Vira · versi 2" }),
  );
}

async function keluarAkun() {
  const tertunda = jumlahTertunda();
  const pesan = tertunda
    ? `Ada ${tertunda} perubahan yang belum terkirim. Jika keluar sekarang, perubahan itu hilang. Isi yang tersimpan di HP juga dihapus.`
    : "Isi yang tersimpan di HP (Alkitab, catatan, ayat tersimpan) akan dihapus dari HP ini. Data di Supabase tetap aman.";
  if (!(await konfirmasi("Keluar dari akun?", pesan, "Keluar", true))) return;
  Pemutar.audio.pause();
  await SB.keluar();
  await Promise.all([DB.bersihkan("kv"), DB.bersihkan("berkas")]).catch(() => {});
  ["pemilik", "posisiCerita", "laguTerakhir", "posisiBaca"].forEach((k) => localStorage.removeItem("rohani." + k));
  location.replace(location.pathname);
}

/* ---- Atur lagu & playlist ---- */
function tampilAturLagu(el) {
  aturKepala({ judul: "Lagu & playlist", kembali: "#/atur" });
  if (!navigator.onLine) { el.append(h("div", { class: "kosong", text: "Butuh internet untuk mengatur lagu." })); return; }
  const semua = D.lagu.filter((l) => !l.nonaktif);
  const dipilih = laguAktif().map((l) => l.id);

  // Unggah
  const status = h("div", { class: "teks-2 kecil" });
  const inputFile = h("input", { type: "file", accept: "audio/*", multiple: true });
  inputFile.addEventListener("change", async () => {
    const files = [...inputFile.files];
    inputFile.value = "";
    if (!files.length) return;
    let ok = 0;
    for (const [i, f] of files.entries()) {
      status.textContent = `Mengunggah ${i + 1} dari ${files.length}: ${f.name}…`;
      try {
        if (f.size > 50 * 1048576) throw new Error("File lebih dari 50 MB");
        const ext = (f.name.split(".").pop() || "mp3").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "mp3";
        const id = uuid(), path = `${id}.${ext}`;
        const det = await durasiAudio(f);
        await SB.berkas.unggah("lagu", path, f, f.type || "audio/mpeg");
        const judul = batasi(f.name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").trim(), 200) || "Tanpa judul";
        const [baris] = await SB.db.simpan("lagu", [{ id, judul, penyanyi: "", durasi_detik: Math.round(det), file_path: path, ukuran_byte: f.size }]);
        D.lagu.push(baris);
        dipilih.push(id);
        // Cache langsung di HP supaya tidak perlu diunduh lagi
        await DB.simpan("berkas", kunciBerkas("lagu", path), f); D.berkas.add(kunciBerkas("lagu", path));
        ok++;
      } catch (e) {
        console.error(e);
        kilat("Gagal mengunggah " + f.name);
      }
    }
    await simpanData();
    status.textContent = `${ok} lagu berhasil diunggah. Jangan lupa tekan Simpan playlist.`;
    gambarDaftar();
  });

  el.append(
    h("div", { class: "kartu" },
      h("div", { class: "utama", style: null, text: "Unggah lagu baru" }),
      h("p", { class: "teks-2 kecil", text: "Pilih file lagu (MP3/M4A) dari HP atau komputer. Bisa beberapa sekaligus. Lagu baru otomatis dicentang masuk playlist." }),
      h("label", { class: "tombol tombol-lebar pilih-file" }, ikon("unggah", 20), "Pilih file lagu", inputFile),
      status));

  const jumlahEl = h("span", { class: "teks-2 kecil" });
  const daftar = h("div");
  const gambarDaftar = () => {
    kosongkan(daftar);
    const semuaLagu = D.lagu.filter((l) => !l.nonaktif);
    const urut = [...dipilih.map((id) => semuaLagu.find((l) => l.id === id)).filter(Boolean), ...semuaLagu.filter((l) => !dipilih.includes(l.id))];
    jumlahEl.textContent = `${dipilih.length} lagu dipilih`;
    if (!urut.length) daftar.append(h("p", { class: "teks-2", text: "Belum ada lagu. Unggah dulu di atas." }));
    for (const l of urut) {
      const masuk = dipilih.includes(l.id);
      const i = dipilih.indexOf(l.id);
      daftar.append(h("div", { class: "baris-atur" },
        h("button", { class: "kotak-centang", type: "button", role: "checkbox", "aria-checked": String(masuk), "aria-label": "Masuk playlist", onclick: () => {
          if (masuk) dipilih.splice(i, 1); else dipilih.push(l.id);
          gambarDaftar();
        } }, ikon("centang", 16)),
        h("button", { class: "tengah", type: "button", style: null, onclick: () => ubahLagu(l, gambarDaftar) },
          h("div", { class: "utama", text: (masuk ? i + 1 + ". " : "") + l.judul }),
          h("div", { class: "sub", text: [l.penyanyi || "Penyanyi belum diisi", durasi(l.durasi_detik), ukuranMB(+l.ukuran_byte || 0)].join(" · ") })),
        masuk ? h("button", { class: "ikon-tombol", type: "button", "aria-label": "Naikkan", disabled: i === 0, onclick: () => { [dipilih[i - 1], dipilih[i]] = [dipilih[i], dipilih[i - 1]]; gambarDaftar(); } }, ikon("naik", 18)) : null,
        masuk ? h("button", { class: "ikon-tombol", type: "button", "aria-label": "Turunkan", disabled: i === dipilih.length - 1, onclick: () => { [dipilih[i + 1], dipilih[i]] = [dipilih[i], dipilih[i + 1]]; gambarDaftar(); } }, ikon("turun", 18)) : null,
      ));
    }
  };
  el.append(h("h3", { class: "judul-bagian" }, "Pilih lagu playlist", jumlahEl),
    h("p", { class: "teks-2 kecil", text: "Centang lagu yang masuk playlist (disarankan sekitar 20). Atur urutan dengan panah. Ketuk judul untuk mengubah judul atau penyanyi." }),
    daftar);
  gambarDaftar();

  const tombolSimpan = h("button", { class: "tombol tombol-utama tombol-lebar", type: "button", onclick: async () => {
    tombolSimpan.disabled = true; tombolSimpan.textContent = "Menyimpan…";
    try {
      const baris = dipilih.map((id, i) => ({ lagu_id: id, urutan: i + 1 }));
      if (baris.length) await SB.db.simpan("playlist", baris, "lagu_id");
      await SB.db.hapus("playlist", dipilih.length ? `lagu_id=not.in.(${dipilih.join(",")})` : "lagu_id=not.is.null");
      await SB.db.simpan("pengaturan", [{ kunci: "playlist_diganti", nilai: tanggalLokal() }], "kunci");
      await sinkron();
      kilat("Playlist disimpan");
      location.hash = "#/lagu";
    } catch (e) {
      console.error(e); kilat("Gagal menyimpan. Coba lagi.");
      tombolSimpan.disabled = false; tombolSimpan.textContent = "Simpan playlist";
    }
  } }, "Simpan playlist");
  pasangKaki(h("div", { class: "kaki-baca" }, tombolSimpan));
}

function durasiAudio(file) {
  return new Promise((ok) => {
    const a = new Audio();
    const u = URL.createObjectURL(file);
    const selesai = (d) => { URL.revokeObjectURL(u); ok(isFinite(d) ? d : 0); };
    a.preload = "metadata";
    a.onloadedmetadata = () => selesai(a.duration);
    a.onerror = () => selesai(0);
    setTimeout(() => selesai(a.duration || 0), 8000);
    a.src = u;
  });
}

function ubahLagu(l, setelah) {
  const lmb = bukaLembar({ judul: "Ubah lagu" });
  const judul = h("input", { type: "text", value: l.judul, maxlength: "200" });
  const penyanyi = h("input", { type: "text", value: l.penyanyi, maxlength: "200", placeholder: "mis. Paduan Suara" });
  const ket = h("input", { type: "text", value: l.keterangan || "", maxlength: "200", placeholder: "mis. KJ 28" });
  lmb.isi.append(
    h("label", { class: "isian" }, h("span", { text: "Judul" }), judul),
    h("label", { class: "isian" }, h("span", { text: "Penyanyi" }), penyanyi),
    h("label", { class: "isian" }, h("span", { text: "Keterangan (boleh kosong)" }), ket));
  lmb.kaki.hidden = false;
  lmb.kaki.append(h("div", { class: "baris-tombol" },
    h("button", { class: "tombol tombol-bahaya", type: "button", onclick: async () => {
      tutupLembar();
      if (!(await konfirmasi("Hapus lagu?", `“${l.judul}” akan dihapus dari aplikasi dan dari penyimpanan.`, "Hapus", true))) return;
      try {
        await SB.db.ubah("lagu", "id=eq." + l.id, { nonaktif: true });
        await SB.db.hapus("playlist", "lagu_id=eq." + l.id);
        await SB.berkas.hapus("lagu", [l.file_path]).catch((e) => console.error(e));
        l.nonaktif = true;
        D.playlist = D.playlist.filter((p) => p.lagu_id !== l.id);
        await simpanData();
        kilat("Lagu dihapus");
        rute();
      } catch (e) { console.error(e); kilat("Gagal menghapus"); }
    } }, ikon("sampah", 18), "Hapus"),
    h("button", { class: "tombol tombol-utama", type: "button", onclick: async () => {
      const isiBaru = { judul: batasi(judul.value.trim(), 200) || l.judul, penyanyi: batasi(penyanyi.value.trim(), 200), keterangan: batasi(ket.value.trim(), 200) };
      try {
        await SB.db.ubah("lagu", "id=eq." + l.id, isiBaru);
        Object.assign(l, isiBaru);
        await simpanData();
        tutupLembar(); setelah?.(); kilat("Lagu disimpan");
      } catch (e) { console.error(e); kilat("Gagal menyimpan"); }
    } }, "Simpan")));
}

/* ---- Atur cerita ---- */
function tampilAturCerita(el) {
  aturKepala({ judul: "Cerita bergambar", kembali: "#/atur" });
  if (!navigator.onLine) { el.append(h("div", { class: "kosong", text: "Butuh internet untuk mengatur cerita." })); return; }
  el.append(h("a", { class: "tombol tombol-utama tombol-lebar", href: "#/atur/cerita/baru" }, ikon("tambah", 20), "Tambah cerita"), h("br"));
  const semua = ceritaAktif();
  if (!semua.length) el.append(h("p", { class: "teks-2", text: "Belum ada cerita." }));
  for (const c of semua) {
    el.append(h("a", { class: "baris-atur", href: "#/atur/cerita/" + c.id },
      h("div", { class: "tengah" }, h("div", { class: "utama", text: c.judul }),
        h("div", { class: "sub", text: `${c.perjanjian} · ${c.rujukan || "tanpa rujukan"} · ${halamanDari(c.id).length} halaman` })),
      ikon("maju")));
  }
}

/** Mengecilkan gambar sebelum diunggah (hemat kuota & cepat dibuka). */
async function kecilkanGambar(file, maks = 1400) {
  try {
    const bmp = await createImageBitmap(file);
    const skala = Math.min(1, maks / Math.max(bmp.width, bmp.height));
    const kanvas = document.createElement("canvas");
    kanvas.width = Math.round(bmp.width * skala); kanvas.height = Math.round(bmp.height * skala);
    kanvas.getContext("2d").drawImage(bmp, 0, 0, kanvas.width, kanvas.height);
    const blob = await new Promise((ok) => kanvas.toBlob(ok, "image/jpeg", 0.85));
    return blob || file;
  } catch { return file; }
}

function pemilihGambar(pathAwal, saatPilih) {
  const img = h("img", { class: "pratinjau-gambar", alt: "" });
  if (pathAwal) urlBerkas("gambar", pathAwal).then((u) => u && (img.src = u));
  const input = h("input", { type: "file", accept: "image/*" });
  input.addEventListener("change", async () => {
    const f = input.files[0];
    if (!f) return;
    const blob = await kecilkanGambar(f);
    img.src = URL.createObjectURL(blob);
    saatPilih(blob);
  });
  return h("div", null, img, h("label", { class: "tombol tombol-kecil pilih-file" }, ikon("gambar", 18), "Pilih gambar", input));
}

function tampilEditorCerita(el, id) {
  const lama = id === "baru" ? null : D.cerita.find((c) => c.id === id);
  if (id !== "baru" && !lama) { el.append(h("div", { class: "kosong", text: "Cerita tidak ditemukan." })); return; }
  aturKepala({ judul: lama ? "Ubah cerita" : "Cerita baru", kembali: "#/atur/cerita" });
  if (!navigator.onLine) { el.append(h("div", { class: "kosong", text: "Butuh internet untuk mengatur cerita." })); return; }

  const c = lama ? { ...lama } : { id: uuid(), judul: "", perjanjian: "PL", rujukan: "", ringkasan: "", sampul_path: "", urutan: 0 };
  const hal = (lama ? halamanDari(lama.id) : []).map((p) => ({ ...p }));
  const gambarBaru = new Map(); // objek halaman/cerita → blob

  const inpJudul = h("input", { type: "text", value: c.judul, maxlength: "200", placeholder: "mis. Bahtera Nuh" });
  const inpRujukan = h("input", { type: "text", value: c.rujukan, maxlength: "100", placeholder: "mis. Kejadian 6–9" });
  const inpRingkas = h("textarea", { maxlength: "600", placeholder: "Satu-dua kalimat tentang cerita ini" }); inpRingkas.value = c.ringkasan;
  const chips = h("div", { class: "chips" });
  for (const [k, label] of [["PL", "Perjanjian Lama"], ["PB", "Perjanjian Baru"]]) {
    chips.append(h("button", { class: "chip", type: "button", "aria-pressed": String(c.perjanjian === k), onclick: (e) => {
      c.perjanjian = k; chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", String(b === e.currentTarget)));
    } }, label));
  }
  el.append(h("div", { class: "kartu" },
    h("label", { class: "isian" }, h("span", { text: "Judul cerita" }), inpJudul),
    h("div", { class: "isian" }, h("span", { text: "Bagian Alkitab" }), chips),
    h("label", { class: "isian" }, h("span", { text: "Rujukan singkat" }), inpRujukan),
    h("label", { class: "isian" }, h("span", { text: "Ringkasan" }), inpRingkas),
    h("div", { class: "isian" }, h("span", { text: "Gambar sampul (boleh kosong, otomatis pakai gambar halaman 1)" }),
      pemilihGambar(c.sampul_path, (b) => gambarBaru.set(c, b)))));

  const daftar = h("div", { class: "daftar-hal-editor" });
  const gambarHal = () => {
    kosongkan(daftar);
    hal.forEach((p, i) => {
      p.urutan = i + 1;
      const teks = h("textarea", { maxlength: "2000", placeholder: "Teks singkat halaman ini (2–5 kalimat)" }); teks.value = p.teks || "";
      teks.addEventListener("input", () => (p.teks = teks.value));
      const tombolAyat = h("button", { class: "tombol tombol-kecil", type: "button", onclick: async () => {
        const r = await pilihAyat({ mode: "sisip", judul: "Rujukan ayat halaman " + (i + 1), awal: p.kitab ? { kode: p.kitab, pasal: p.pasal } : {} });
        if (r) { Object.assign(p, { kitab: r.kode, pasal: r.pasal, ayat_mulai: r.mulai, ayat_sampai: r.sampai }); gambarHal(); }
      } }, ikon("buku", 18), p.kitab ? namaRujukan(p.kitab, p.pasal, p.ayat_mulai, p.ayat_sampai) : "Pilih rujukan ayat");
      daftar.append(h("div", { class: "kartu" },
        h("div", { class: "judul-bagian", style: null }, `Halaman ${i + 1}`, h("span", { class: "baris-tombol" },
          h("button", { class: "ikon-tombol", type: "button", "aria-label": "Naikkan", disabled: i === 0, onclick: () => { [hal[i - 1], hal[i]] = [hal[i], hal[i - 1]]; gambarHal(); } }, ikon("naik", 18)),
          h("button", { class: "ikon-tombol", type: "button", "aria-label": "Turunkan", disabled: i === hal.length - 1, onclick: () => { [hal[i + 1], hal[i]] = [hal[i], hal[i + 1]]; gambarHal(); } }, ikon("turun", 18)),
          h("button", { class: "ikon-tombol", type: "button", "aria-label": "Hapus halaman", onclick: () => { hal.splice(i, 1); gambarHal(); } }, ikon("sampah", 18)))),
        pemilihGambar(p.gambar_path, (b) => gambarBaru.set(p, b)),
        h("label", { class: "isian" }, teks),
        tombolAyat));
    });
  };
  el.append(h("h3", { class: "judul-bagian", text: "Halaman" }), h("p", { class: "teks-2 kecil", text: "Sebaiknya 8–12 halaman. Setiap halaman: satu gambar, teks singkat, dan rujukan ayat." }), daftar,
    h("button", { class: "tombol tombol-lebar", type: "button", onclick: () => { hal.push({ id: uuid(), cerita_id: c.id, teks: "", gambar_path: "", kitab: "" }); gambarHal(); daftar.lastElementChild?.scrollIntoView({ behavior: "smooth" }); } }, ikon("tambah", 20), "Tambah halaman"));
  if (lama) el.append(h("br"), h("button", { class: "tombol tombol-bahaya tombol-lebar", type: "button", onclick: async () => {
    if (!(await konfirmasi("Hapus cerita?", `“${lama.judul}” tidak akan tampil lagi.`, "Hapus", true))) return;
    try { await SB.db.ubah("cerita", "id=eq." + lama.id, { nonaktif: true }); await sinkron(); location.hash = "#/atur/cerita"; kilat("Cerita dihapus"); }
    catch (e) { console.error(e); kilat("Gagal menghapus"); }
  } }, ikon("sampah", 20), "Hapus cerita"));
  gambarHal();

  const tombol = h("button", { class: "tombol tombol-utama tombol-lebar", type: "button", onclick: async () => {
    c.judul = batasi(inpJudul.value.trim(), 200);
    c.rujukan = batasi(inpRujukan.value.trim(), 100);
    c.ringkasan = batasi(inpRingkas.value.trim(), 600);
    if (!c.judul) { kilat("Judul cerita belum diisi"); inpJudul.focus(); return; }
    if (!hal.length) { kilat("Tambahkan minimal satu halaman"); return; }
    tombol.disabled = true;
    try {
      let n = 0;
      for (const [obj, blob] of gambarBaru) {
        if (obj !== c && !hal.includes(obj)) continue;
        tombol.textContent = `Mengunggah gambar ${++n} dari ${gambarBaru.size}…`;
        const path = `${c.id}/${uuid()}.jpg`;
        await SB.berkas.unggah("gambar", path, blob, "image/jpeg");
        await DB.simpan("berkas", kunciBerkas("gambar", path), blob); D.berkas.add(kunciBerkas("gambar", path));
        if (obj === c) c.sampul_path = path; else obj.gambar_path = path;
      }
      tombol.textContent = "Menyimpan…";
      const { id: cid, judul, perjanjian, rujukan, ringkasan, sampul_path, urutan } = c;
      await SB.db.simpan("cerita", [{ id: cid, judul, perjanjian, rujukan, ringkasan, sampul_path, urutan }]);
      // Halaman lama diganti seluruhnya (supaya urutan baru tidak bentrok)
      if (lama) await SB.db.hapus("halaman_cerita", "cerita_id=eq." + cid);
      await SB.db.simpan("halaman_cerita", hal.map((p) => ({
        id: p.id, cerita_id: cid, urutan: p.urutan, gambar_path: p.gambar_path || "", teks: batasi(p.teks, 2000),
        kitab: p.kitab || "", pasal: p.pasal || null, ayat_mulai: p.ayat_mulai || null, ayat_sampai: p.ayat_sampai || null,
      })));
      await sinkron();
      kilat("Cerita disimpan");
      location.hash = "#/cerita/" + cid;
    } catch (e) {
      console.error(e); kilat("Gagal menyimpan. Coba lagi.");
      tombol.disabled = false; tombol.textContent = "Simpan cerita";
    }
  } }, "Simpan cerita");
  pasangKaki(h("div", { class: "kaki-baca" }, tombol));
}

/* ---------------------------------------------------------------------
   17. MASUK & MULAI
   --------------------------------------------------------------------- */
function tampilMasuk(pesan, ditolak = false, tanpaTombol = false) {
  $("#aplikasi").hidden = true;
  $("#layar-masuk").hidden = false;
  if (pesan) $("#masuk-teks").textContent = pesan;
  $("#tombol-google").hidden = ditolak || tanpaTombol;
  $("#tombol-keluar-ditolak").hidden = !ditolak || tanpaTombol;
}
function sesiHabis() {
  tampilMasuk("Sesi masuk sudah habis. Silakan masuk lagi dengan Google. Isi yang tersimpan di HP tetap aman.");
}
/** Server menyatakan akun ini bukan pemilik: tutup isi aplikasi. */
function aksesDitolak() {
  pemilikPasti = false;
  localStorage.removeItem("rohani.pemilik");
  Pemutar.audio?.pause();
  tampilMasuk(`Akun ${SB.email()} tidak punya akses ke aplikasi ini.`, true);
}
function tampilAplikasi() {
  $("#layar-masuk").hidden = true;
  $("#aplikasi").hidden = false;
}

function perbaruiStatusInternet() {
  $("#pita-offline").hidden = navigator.onLine;
}

async function mulai() {
  // Cegah aplikasi dimuat di dalam bingkai situs lain (clickjacking)
  if (window.top !== window.self) { try { window.top.location = window.self.location.href; } catch { document.body.textContent = ""; } return; }
  terapkanTema();
  document.querySelectorAll(".nav-ikon").forEach((s) => s.append(ikon(s.dataset.ikon, 22)));
  Pemutar.pasang();
  $("#tombol-google").onclick = () => {
    if (!SB.siap()) { kilat("CONFIG di javascript.js belum diisi"); return; }
    if (!navigator.onLine) { kilat("Butuh internet untuk masuk"); return; }
    SB.masukGoogle();
  };
  $("#tombol-keluar-ditolak").onclick = async () => { await SB.keluar(); location.replace(location.pathname); };
  window.addEventListener("online", () => { perbaruiStatusInternet(); sinkron(); });
  window.addEventListener("offline", perbaruiStatusInternet);
  window.addEventListener("hashchange", rute);
  window.addEventListener("scroll", () => $("#kepala").classList.toggle("bergulir", scrollY > 4), { passive: true });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") sinkronNanti(); });
  perbaruiStatusInternet();

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch((e) => console.error("sw", e));
  navigator.storage?.persist?.().catch(() => {});

  if (!SB.siap()) { tampilMasuk("Aplikasi belum disambungkan ke Supabase. Isi blok CONFIG di bagian atas javascript.js (lihat panduan langkah 6)."); $("#tombol-google").hidden = true; return; }

  try { await SB.tanganiKembali(); }
  catch (e) { console.error(e); tampilMasuk("Gagal masuk. Coba lagi."); return; }
  if (!SB.adaSesi()) { tampilMasuk(); return; }

  // Pastikan yang masuk adalah pemilik (diperiksa oleh server).
  // - Pertama kali di HP ini: tunggu jawaban server dulu sebelum isi dibuka.
  // - Sudah pernah lolos: isi di HP langsung tampil (tanpa layar kosong);
  //   pemeriksaan berjalan di latar saat sinkron. Data di server tetap
  //   dijaga aturan penjaga (RLS), jadi ini tidak melemahkan keamanan.
  if (baca("pemilik", "") !== SB.email()) {
    if (!navigator.onLine) { tampilMasuk("Butuh internet untuk masuk pertama kali."); return; }
    tampilMasuk("Memeriksa akun…", false, true);
    let ok;
    try { ok = await cekPemilik(); }
    catch { tampilMasuk("Silakan masuk lagi dengan Google."); return; }
    if (ok === null) { tampilMasuk("Tidak bisa memeriksa akun. Periksa internet lalu coba lagi."); return; }
    if (!ok) { aksesDitolak(); return; }
    tulis("pemilik", SB.email());
    pemilikPasti = true;
  }

  await muatLokal();
  tampilAplikasi();
  if (!location.hash) history.replaceState(null, "", "#/beranda");
  rute();
  sinkron();
}

mulai();
