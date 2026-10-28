import type { ImageSourcePropType } from 'react-native';

/**
 * Semua usaha, orang, menu, dan harga di sini FIKTIF (demo PintuWeb).
 * Kota Tirtalaya juga rekaan, digambarkan sebagai kota kecil di Jawa Timur.
 * Foto hanya ilustrasi jenis hidangan (CC0/PD) — sumber di assets/images/SUMBER.md.
 */

export const KOTA = 'Tirtalaya';

export type KategoriId = 'sarapan' | 'nasi' | 'kuah' | 'pecel' | 'jajan' | 'minum';

export type Kategori = {
  id: KategoriId;
  nama: string;
  sapaan: string; // judul halaman kategori
  ket: string; // deskripsi singkat (≤155 karakter untuk meta)
  foto: ImageSourcePropType;
};

const f = {
  pecel: require('../../assets/images/menu/pecel.webp'),
  urap: require('../../assets/images/menu/urap.webp'),
  rempeyek: require('../../assets/images/menu/rempeyek.webp'),
  tempe: require('../../assets/images/menu/tempe-goreng.webp'),
  bakso: require('../../assets/images/menu/bakso.webp'),
  mieAyam: require('../../assets/images/menu/mie-ayam.webp'),
  esJeruk: require('../../assets/images/menu/es-jeruk.webp'),
  nasiGoreng: require('../../assets/images/menu/nasi-goreng.webp'),
  mieGoreng: require('../../assets/images/menu/mie-goreng.webp'),
  mieRebus: require('../../assets/images/menu/mie-rebus.webp'),
  geprek: require('../../assets/images/menu/ayam-geprek.webp'),
  penyet: require('../../assets/images/menu/ayam-penyet.webp'),
  tahu: require('../../assets/images/menu/tahu-goreng.webp'),
  rawon: require('../../assets/images/menu/rawon.webp'),
  soto: require('../../assets/images/menu/soto-ayam.webp'),
  nasiCampur: require('../../assets/images/menu/nasi-campur.webp'),
  klepon: require('../../assets/images/menu/klepon.webp'),
  dadar: require('../../assets/images/menu/dadar-gulung.webp'),
  pisang: require('../../assets/images/menu/pisang-goreng.webp'),
  kolak: require('../../assets/images/menu/kolak.webp'),
  getuk: require('../../assets/images/menu/getuk.webp'),
  onde: require('../../assets/images/menu/onde-onde.webp'),
  esKopi: require('../../assets/images/menu/es-kopi-susu.webp'),
  kopi: require('../../assets/images/menu/kopi-tubruk.webp'),
  uwuh: require('../../assets/images/menu/wedang-uwuh.webp'),
  esTeh: require('../../assets/images/menu/es-teh.webp'),
  sate: require('../../assets/images/menu/sate-ayam.webp'),
  nasiJagung: require('../../assets/images/menu/nasi-jagung.webp'),
  nasiKuning: require('../../assets/images/menu/nasi-kuning.webp'),
  lontong: require('../../assets/images/menu/lontong-sayur.webp'),
  dawet: require('../../assets/images/menu/es-dawet.webp'),
  terangBulan: require('../../assets/images/menu/terang-bulan.webp'),
  martabakTelur: require('../../assets/images/menu/martabak-telur.webp'),
  esCampur: require('../../assets/images/menu/es-campur.webp'),
  telurAsin: require('../../assets/images/menu/telur-asin.webp'),
  mieAyamBakso: require('../../assets/images/menu/mie-ayam-bakso.webp'),
  nasiPutih: require('../../assets/images/menu/nasi-putih.webp'),
  telurCeplok: require('../../assets/images/menu/telur-ceplok.webp'),
  angsle: require('../../assets/images/menu/angsle.webp'),
  ayamGepuk: require('../../assets/images/menu/ayam-gepuk.webp'),
  esTeh2: require('../../assets/images/menu/es-teh-2.webp'),
  esTeh3: require('../../assets/images/menu/es-teh-3.webp'),
  esTeh5: require('../../assets/images/menu/es-teh-5.webp'),
  lemper: require('../../assets/images/menu/lemper.webp'),
  nasiBungkus: require('../../assets/images/menu/nasi-bungkus.webp'),
  rujakCingur: require('../../assets/images/menu/rujak-cingur.webp'),
  rujakSayur: require('../../assets/images/menu/rujak-sayur.webp'),
  tahuTempe: require('../../assets/images/menu/tahu-tempe.webp'),
  tehHangat: require('../../assets/images/menu/teh-hangat.webp'),
  tehHangat2: require('../../assets/images/menu/teh-hangat-2.webp'),
  wedangRonde: require('../../assets/images/menu/wedang-ronde.webp'),
};

/** Versi kecil (256×192) untuk gambar menu di daftar; versi 640×480 untuk sampul & ubin. */
const k = {
  pecel: require('../../assets/images/menu/kecil/pecel.webp'),
  urap: require('../../assets/images/menu/kecil/urap.webp'),
  rempeyek: require('../../assets/images/menu/kecil/rempeyek.webp'),
  tempe: require('../../assets/images/menu/kecil/tempe-goreng.webp'),
  bakso: require('../../assets/images/menu/kecil/bakso.webp'),
  mieAyam: require('../../assets/images/menu/kecil/mie-ayam.webp'),
  esJeruk: require('../../assets/images/menu/kecil/es-jeruk.webp'),
  nasiGoreng: require('../../assets/images/menu/kecil/nasi-goreng.webp'),
  mieGoreng: require('../../assets/images/menu/kecil/mie-goreng.webp'),
  mieRebus: require('../../assets/images/menu/kecil/mie-rebus.webp'),
  geprek: require('../../assets/images/menu/kecil/ayam-geprek.webp'),
  penyet: require('../../assets/images/menu/kecil/ayam-penyet.webp'),
  tahu: require('../../assets/images/menu/kecil/tahu-goreng.webp'),
  rawon: require('../../assets/images/menu/kecil/rawon.webp'),
  soto: require('../../assets/images/menu/kecil/soto-ayam.webp'),
  nasiCampur: require('../../assets/images/menu/kecil/nasi-campur.webp'),
  klepon: require('../../assets/images/menu/kecil/klepon.webp'),
  dadar: require('../../assets/images/menu/kecil/dadar-gulung.webp'),
  pisang: require('../../assets/images/menu/kecil/pisang-goreng.webp'),
  kolak: require('../../assets/images/menu/kecil/kolak.webp'),
  getuk: require('../../assets/images/menu/kecil/getuk.webp'),
  onde: require('../../assets/images/menu/kecil/onde-onde.webp'),
  esKopi: require('../../assets/images/menu/kecil/es-kopi-susu.webp'),
  kopi: require('../../assets/images/menu/kecil/kopi-tubruk.webp'),
  uwuh: require('../../assets/images/menu/kecil/wedang-uwuh.webp'),
  esTeh: require('../../assets/images/menu/kecil/es-teh.webp'),
  sate: require('../../assets/images/menu/kecil/sate-ayam.webp'),
  nasiJagung: require('../../assets/images/menu/kecil/nasi-jagung.webp'),
  nasiKuning: require('../../assets/images/menu/kecil/nasi-kuning.webp'),
  lontong: require('../../assets/images/menu/kecil/lontong-sayur.webp'),
  dawet: require('../../assets/images/menu/kecil/es-dawet.webp'),
  terangBulan: require('../../assets/images/menu/kecil/terang-bulan.webp'),
  martabakTelur: require('../../assets/images/menu/kecil/martabak-telur.webp'),
  esCampur: require('../../assets/images/menu/kecil/es-campur.webp'),
  telurAsin: require('../../assets/images/menu/kecil/telur-asin.webp'),
  mieAyamBakso: require('../../assets/images/menu/kecil/mie-ayam-bakso.webp'),
  nasiPutih: require('../../assets/images/menu/kecil/nasi-putih.webp'),
  telurCeplok: require('../../assets/images/menu/kecil/telur-ceplok.webp'),
  angsle: require('../../assets/images/menu/kecil/angsle.webp'),
  ayamGepuk: require('../../assets/images/menu/kecil/ayam-gepuk.webp'),
  esTeh2: require('../../assets/images/menu/kecil/es-teh-2.webp'),
  esTeh3: require('../../assets/images/menu/kecil/es-teh-3.webp'),
  esTeh5: require('../../assets/images/menu/kecil/es-teh-5.webp'),
  lemper: require('../../assets/images/menu/kecil/lemper.webp'),
  nasiBungkus: require('../../assets/images/menu/kecil/nasi-bungkus.webp'),
  rujakCingur: require('../../assets/images/menu/kecil/rujak-cingur.webp'),
  rujakSayur: require('../../assets/images/menu/kecil/rujak-sayur.webp'),
  tahuTempe: require('../../assets/images/menu/kecil/tahu-tempe.webp'),
  tehHangat: require('../../assets/images/menu/kecil/teh-hangat.webp'),
  tehHangat2: require('../../assets/images/menu/kecil/teh-hangat-2.webp'),
  wedangRonde: require('../../assets/images/menu/kecil/wedang-ronde.webp'),
};

const besar = new Map<unknown, ImageSourcePropType>((Object.keys(k) as (keyof typeof k)[]).map((n) => [k[n], f[n]]));
/** Versi 640×480 dari foto kecil menu (untuk lembar detail). */
export const versiBesar = (src: ImageSourcePropType) => besar.get(src) ?? src;

/** Versi 400×300 khusus ubin bento kategori (lebih ringan untuk gambar terbesar di beranda). */
const ubin = {
  pecel: require('../../assets/images/menu/sedang/pecel.webp'),
  geprek: require('../../assets/images/menu/sedang/ayam-geprek.webp'),
  bakso: require('../../assets/images/menu/sedang/bakso.webp'),
  urap: require('../../assets/images/menu/sedang/urap.webp'),
  klepon: require('../../assets/images/menu/sedang/klepon.webp'),
  esKopi: require('../../assets/images/menu/sedang/es-kopi-susu.webp'),
};

export const KATEGORI: Kategori[] = [
  { id: 'sarapan', nama: 'Sarapan', sapaan: 'Sarapan pagi', ket: 'Pecel, nasi jagung, lontong lodeh, rawon, dan jajan pasar yang siap sejak subuh. Pesan dari warung pagi di Tirtalaya, diantar hangat.', foto: ubin.pecel },
  { id: 'nasi', nama: 'Nasi & lauk', sapaan: 'Nasi & lauk', ket: 'Ayam geprek, nasi goreng, nasi campur, dan lauk rumahan dari warung tetangga. Pilih menu, cek ongkir, lalu pesan.', foto: ubin.geprek },
  { id: 'kuah', nama: 'Bakso & berkuah', sapaan: 'Yang berkuah', ket: 'Bakso urat, mie ayam, rawon, dan soto ayam. Kuah dipisah supaya mie tidak lembek di jalan.', foto: ubin.bakso },
  { id: 'pecel', nama: 'Pecel & sayur', sapaan: 'Pecel & sayur', ket: 'Pecel pincuk, urap, rujak cingur, dan sayur rumahan dengan sambal kacang atau petis dari warung Tirtalaya.', foto: ubin.urap },
  { id: 'jajan', nama: 'Jajan pasar', sapaan: 'Jajan pasar', ket: 'Klepon, getuk, onde-onde, dan kolak dari tenong pagi dan sore, sampai terang bulan dan martabak telur untuk malam.', foto: ubin.klepon },
  { id: 'minum', nama: 'Minuman', sapaan: 'Kopi & minuman', ket: 'Kopi tubruk, es dawet, es campur, wedang uwuh, dan wedang ronde. Warung kopinya buka 24 jam.', foto: ubin.esKopi },
];

export type Pilihan = { id: string; label: string; harga?: number };
/** Pilihan terstruktur per menu: 'satu' = pilih tepat satu, 'banyak' = boleh beberapa (tambahan berbayar). */
export type Opsi = { id: string; judul: string; jenis: 'satu' | 'banyak'; pilihan: Pilihan[]; bawaan?: string };
export type PilihanMenu = Record<string, string[]>;

export type Menu = {
  id: string;
  nama: string;
  ket: string;
  harga: number;
  foto?: ImageSourcePropType;
  ilustrasi?: 'lemper' | 'nasi' | 'gelas' | 'mangkuk' | 'bungkus' | 'rujak' | 'ronde' | 'angsle' | 'penyet' | 'empal';
  habis?: boolean;
  opsi?: Opsi[];
};

export type Bagian = { judul: string; menu: Menu[] };

/** Jadwal per hari (0 = Minggu … 6 = Sabtu), menit sejak 00.00 WIB. Tutup > 1440 berarti lewat tengah malam. */
export type Jadwal = Record<number, [number, number][]>;

export type Warung = {
  id: string;
  nama: string;
  pemilik: string; // tokoh fiktif
  tagline: string;
  cerita: string;
  kategori: KategoriId[];
  alamat: string;
  x: number;
  y: number;
  masakMenit: number;
  jadwal: Jadwal;
  foto: ImageSourcePropType;
  warna: string; // warna tenda
  bagian: Bagian[];
};

const j = (h: number, m = 0) => h * 60 + m;
const setiapHari = (sesi: [number, number][]): Jadwal => ({ 0: sesi, 1: sesi, 2: sesi, 3: sesi, 4: sesi, 5: sesi, 6: sesi });


// ——— pilihan menu yang dipakai ulang ———
const LEVEL: Opsi = { id: 'level', judul: 'Level sambal', jenis: 'satu', bawaan: 'l2', pilihan: [0, 1, 2, 3, 4, 5].map((n) => ({ id: `l${n}`, label: n === 0 ? '0 · tidak pedas' : `${n}` })) };
const PEDAS: Opsi = { id: 'pedas', judul: 'Pedasnya', jenis: 'satu', bawaan: 'sedang', pilihan: [{ id: 'tidak', label: 'Tidak pedas' }, { id: 'sedang', label: 'Sedang' }, { id: 'pedas', label: 'Pedas' }] };
const KUAH: Opsi = { id: 'kuah', judul: 'Kuah', jenis: 'satu', bawaan: 'pisah', pilihan: [{ id: 'pisah', label: 'Dipisah' }, { id: 'campur', label: 'Dicampur' }] };
const NASI_PISAH: Opsi = { id: 'nasi', judul: 'Nasi', jenis: 'satu', bawaan: 'pisah', pilihan: [{ id: 'pisah', label: 'Dipisah' }, { id: 'campur', label: 'Dicampur kuah' }] };
const SAMBAL_PISAH: Opsi = { id: 'sambal', judul: 'Sambal', jenis: 'satu', bawaan: 'pisah', pilihan: [{ id: 'pisah', label: 'Dipisah' }, { id: 'campur', label: 'Dicampur' }, { id: 'tanpa', label: 'Tanpa sambal' }] };
const PORSI: Opsi = { id: 'porsi', judul: 'Porsi', jenis: 'satu', bawaan: 'biasa', pilihan: [{ id: 'biasa', label: 'Biasa' }, { id: 'jumbo', label: 'Jumbo', harga: 5000 }] };
const TELUR: Opsi = { id: 'telur', judul: 'Telurnya', jenis: 'satu', bawaan: 'ceplok', pilihan: [{ id: 'ceplok', label: 'Ceplok' }, { id: 'dadar', label: 'Dadar' }, { id: 'orak', label: 'Orak-arik' }] };
const GULA: Opsi = { id: 'gula', judul: 'Gula', jenis: 'satu', bawaan: 'normal', pilihan: [{ id: 'normal', label: 'Normal' }, { id: 'sedikit', label: 'Sedikit' }, { id: 'tanpa', label: 'Tanpa gula' }] };
const ES: Opsi = { id: 'es', judul: 'Es batu', jenis: 'satu', bawaan: 'pisah', pilihan: [{ id: 'pisah', label: 'Dibungkus terpisah' }, { id: 'campur', label: 'Dicampur' }, { id: 'sedikit', label: 'Sedikit' }] };
const tambahan = (...p: Pilihan[]): Opsi => ({ id: 'tambah', judul: 'Tambahan', jenis: 'banyak', pilihan: p });
const T = {
  telur: { id: 'telur', label: 'Telur ceplok', harga: 3000 },
  tempe: { id: 'tempe', label: 'Tempe goreng', harga: 2000 },
  peyek: { id: 'peyek', label: 'Rempeyek', harga: 2000 },
  terong: { id: 'terong', label: 'Terong goreng', harga: 2000 },
  pangsit: { id: 'pangsit', label: 'Pangsit goreng', harga: 3000 },
  bakso: { id: 'bakso', label: 'Bakso halus 2 biji', harga: 3000 },
  ceker: { id: 'ceker', label: 'Ceker', harga: 3000 },
  perkedel: { id: 'perkedel', label: 'Perkedel', harga: 3000 },
  kerupuk: { id: 'kerupuk', label: 'Kerupuk', harga: 1000 },
  tahu: { id: 'tahu', label: 'Tahu', harga: 2000 },
  telurRebus: { id: 'telur-rebus', label: 'Telur rebus', harga: 3000 },
};

/** Pilihan bawaan sebuah menu. */
export function pilihanAwal(m: Menu): PilihanMenu {
  const p: PilihanMenu = {};
  for (const o of m.opsi ?? []) p[o.id] = o.jenis === 'satu' ? [o.bawaan ?? o.pilihan[0].id] : [];
  return p;
}

export function hargaSatuan(m: Menu, p: PilihanMenu): number {
  let h = m.harga;
  for (const o of m.opsi ?? []) for (const id of p[o.id] ?? []) h += o.pilihan.find((x) => x.id === id)?.harga ?? 0;
  return h;
}

/** Ringkasan pilihan untuk nota, mis. "Level 3 · Kuah dipisah · + Telur ceplok". */
export function ringkasPilihan(m: Menu, p: PilihanMenu): string {
  const bagian: string[] = [];
  for (const o of m.opsi ?? []) {
    const dipilih = (p[o.id] ?? []).map((id) => o.pilihan.find((x) => x.id === id)).filter(Boolean) as Pilihan[];
    if (!dipilih.length) continue;
    if (o.jenis === 'banyak') bagian.push('+ ' + dipilih.map((x) => x.label.toLowerCase()).join(', '));
    else if (o.id === 'level') bagian.push(`Level ${dipilih[0].id.slice(1)}`);
    else bagian.push(`${o.judul} ${dipilih[0].label.toLowerCase()}`);
  }
  return bagian.join(' · ');
}

export const kunciItem = (menuId: string, p: PilihanMenu, catatan = '') =>
  menuId + '|' + Object.keys(p).sort().map((k) => `${k}:${[...(p[k] ?? [])].sort().join(',')}`).join(';') + (catatan.trim() ? '|' + catatan.trim().toLowerCase() : '');

export const WARUNG: Warung[] = [
  {
    id: 'pecel-bu-ratmi',
    nama: 'Pecel Pojok Bu Ratmi',
    pemilik: 'Bu Ratmi',
    tagline: 'Pecel pincuk daun pisang, sambal kacang diulek tiap subuh',
    cerita: 'Lapak pagi di pojok Pasar Lama. Sambal kacangnya agak pedas, jadi pilih tingkat pedasnya saat memesan. Libur tiap Jumat untuk mengulek stok bumbu.',
    kategori: ['sarapan', 'pecel', 'nasi'],
    alamat: 'Pojok Pasar Lama, Jl. Pasar',
    x: 140, y: 110,
    masakMenit: 7,
    jadwal: { 0: [[j(5, 30), j(11)]], 1: [[j(5, 30), j(11)]], 2: [[j(5, 30), j(11)]], 3: [[j(5, 30), j(11)]], 4: [[j(5, 30), j(11)]], 5: [], 6: [[j(5, 30), j(11)]] },
    foto: f.pecel,
    warna: '#2E6B3B',
    bagian: [
      {
        judul: 'Andalan',
        menu: [
          { id: 'pecel-pincuk', nama: 'Nasi pecel pincuk', ket: 'Nasi, sayur rebus, kembang turi, sambal kacang, dan rempeyek. Dibungkus pincuk daun pisang.', harga: 10000, foto: k.pecel, opsi: [PEDAS, tambahan(T.telur, T.tempe, T.peyek)] },
          { id: 'pecel-telur', nama: 'Pecel + telur ceplok', ket: 'Nasi pecel lengkap dengan telur ceplok setengah matang.', harga: 13000, foto: k.pecel, opsi: [PEDAS, tambahan(T.tempe, T.peyek)] },
          { id: 'urap', nama: 'Urap daun kates', ket: 'Daun pepaya, kacang panjang, dan kelapa parut berbumbu. Pahitnya pas.', harga: 8000, foto: k.urap, opsi: [PEDAS] },
        ],
      },
      {
        judul: 'Lauk tambahan',
        menu: [
          { id: 'tempe', nama: 'Tempe goreng', ket: 'Dua potong, digoreng kering.', harga: 3000, foto: k.tempe },
          { id: 'rempeyek', nama: 'Rempeyek kacang', ket: 'Satu bungkus isi lima keping.', harga: 5000, foto: k.rempeyek },
          { id: 'tahu-pecel', nama: 'Tahu goreng', ket: 'Dua potong tahu putih goreng.', harga: 3000, foto: k.tahu },
        ],
      },
      {
        judul: 'Minum',
        menu: [{ id: 'teh-anget', nama: 'Teh manis hangat', ket: 'Teh tubruk gula batu, gelas plastik bertutup.', harga: 4000, foto: k.tehHangat, opsi: [GULA] }],
      },
    ],
  },
  {
    id: 'rawon-ndalem',
    nama: 'Depot Rawon Ndalem',
    pemilik: 'Pak Harsono',
    tagline: 'Rawon kuah keluak hitam, daging sengkel empuk',
    cerita: 'Depot keluarga di Jl. Pahlawan sejak generasi kedua. Kuah dan nasi dipisah, sambal dan tauge pendek dibungkus sendiri. Libur tiap Jumat.',
    kategori: ['sarapan', 'kuah', 'nasi'],
    alamat: 'Jl. Pahlawan No. 41',
    x: 290, y: 60,
    masakMenit: 8,
    jadwal: { 0: [[j(6), j(15)]], 1: [[j(6), j(15)]], 2: [[j(6), j(15)]], 3: [[j(6), j(15)]], 4: [[j(6), j(15)]], 5: [], 6: [[j(6), j(15)]] },
    foto: f.rawon,
    warna: '#2B1B12',
    bagian: [
      {
        judul: 'Andalan',
        menu: [
          { id: 'rawon', nama: 'Nasi rawon', ket: 'Daging sengkel, kuah keluak, telur asin separuh, tauge pendek, sambal terasi.', harga: 24000, foto: k.rawon, opsi: [NASI_PISAH, tambahan(T.perkedel, T.kerupuk)] },
          { id: 'soto', nama: 'Soto ayam', ket: 'Kuah bening kunyit, suwiran ayam kampung, soun, seledri. Nasi dipisah.', harga: 17000, foto: k.soto, opsi: [NASI_PISAH, tambahan(T.perkedel, T.kerupuk)] },
          { id: 'nasi-campur', nama: 'Nasi campur', ket: 'Nasi, sambal goreng ati, mi, perkedel, serundeng, dan kerupuk.', harga: 20000, foto: k.nasiCampur, opsi: [PEDAS, tambahan(T.perkedel, T.kerupuk)] },
        ],
      },
      {
        judul: 'Tambahan',
        menu: [
          { id: 'telur-asin', nama: 'Telur asin', ket: 'Satu butir, dibelah dua.', harga: 5000, foto: k.telurAsin },
          { id: 'ayam-gepuk', nama: 'Ayam gepuk + nasi', ket: 'Satu potong ayam goreng digepuk, nasi, dan sambal.', harga: 12000, habis: true, foto: k.ayamGepuk },
          { id: 'es-jeruk-rawon', nama: 'Es jeruk', ket: 'Jeruk peras, gula secukupnya.', harga: 6000, foto: k.esJeruk, opsi: [GULA, ES] },
        ],
      },
    ],
  },
  {
    id: 'tenong-bu-lastri',
    nama: 'Tenong Bu Lastri',
    pemilik: 'Bu Lastri',
    tagline: 'Jajan pasar dari tenong bambu, pagi dan sore',
    cerita: 'Jajanan dibuat dua kali sehari: pagi untuk sarapan, sore untuk teman ngeteh. Di antara dua sesi itu tenongnya kosong, jadi lapak tutup.',
    kategori: ['jajan', 'sarapan'],
    alamat: 'Gg. Sawo No. 7, Kauman',
    x: 95, y: 60,
    masakMenit: 4,
    jadwal: setiapHari([[j(5), j(9, 30)], [j(15), j(18)]]),
    foto: f.klepon,
    warna: '#E9A31B',
    bagian: [
      {
        judul: 'Isi tenong',
        menu: [
          { id: 'klepon', nama: 'Klepon', ket: 'Isi lima. Gula merah cair di dalam, kelapa parut di luar.', harga: 6000, foto: k.klepon },
          { id: 'dadar', nama: 'Dadar gulung', ket: 'Dua gulung, isi unti kelapa gula jawa.', harga: 5000, foto: k.dadar },
          { id: 'getuk', nama: 'Getuk lindri', ket: 'Singkong kukus warna-warni dengan kelapa parut.', harga: 5000, foto: k.getuk },
          { id: 'onde', nama: 'Onde-onde', ket: 'Tiga buah, isi kacang hijau, berbalut wijen.', harga: 6000, foto: k.onde },
          { id: 'lemper', nama: 'Lemper ayam', ket: 'Ketan gurih isi ayam suwir, dibungkus daun pisang.', harga: 4000, foto: k.lemper },
        ],
      },
      {
        judul: 'Yang hangat',
        menu: [
          { id: 'pisang', nama: 'Pisang goreng', ket: 'Pisang kepok, tepung tipis, empat potong.', harga: 6000, foto: k.pisang },
          { id: 'kolak', nama: 'Kolak pisang ubi', ket: 'Kuah santan gula jawa, pisang, ubi, dan daun pandan. Satu cup.', harga: 7000, foto: k.kolak },
        ],
      },
    ],
  },
  {
    id: 'bakso-kali-ijo',
    nama: 'Bakso Gerobak Kali Ijo',
    pemilik: 'Mas Wahyu',
    tagline: 'Bakso urat dan mie ayam, gerobak di tepi kali',
    cerita: 'Gerobak biru di pinggir jembatan Kali Ijo. Kuah dibungkus terpisah dan mie direbus setengah matang supaya tetap kenyal waktu sampai.',
    kategori: ['kuah', 'nasi'],
    alamat: 'Jembatan Kali Ijo, Jl. Melati',
    x: 205, y: 160,
    masakMenit: 6,
    jadwal: { 0: [[j(10), j(21)]], 1: [[j(10), j(21)]], 2: [], 3: [[j(10), j(21)]], 4: [[j(10), j(21)]], 5: [[j(10), j(21)]], 6: [[j(10), j(21)]] },
    foto: f.bakso,
    warna: '#2F5D8A',
    bagian: [
      {
        judul: 'Andalan',
        menu: [
          { id: 'bakso-urat', nama: 'Bakso urat', ket: 'Tiga bakso urat, dua bakso halus, tahu goreng, soun, kuah kaldu sapi.', harga: 17000, foto: k.bakso, opsi: [KUAH, SAMBAL_PISAH, tambahan(T.pangsit, T.bakso)] },
          { id: 'mie-ayam', nama: 'Mie ayam', ket: 'Mie lebar, ayam kecap, sawi, kuah dipisah.', harga: 14000, foto: k.mieAyam, opsi: [KUAH, SAMBAL_PISAH, tambahan(T.pangsit, T.ceker, T.bakso)] },
          { id: 'mie-ayam-bakso', nama: 'Mie ayam bakso', ket: 'Mie ayam dengan tambahan dua bakso halus.', harga: 18000, foto: k.mieAyamBakso, opsi: [KUAH, SAMBAL_PISAH, tambahan(T.pangsit, T.ceker)] },
        ],
      },
      {
        judul: 'Tambahan & minum',
        menu: [
          { id: 'tahu-bakso', nama: 'Tahu goreng tepung', ket: 'Lima potong, cocol sambal.', harga: 6000, foto: k.tahu },
          { id: 'es-jeruk', nama: 'Es jeruk', ket: 'Jeruk peras segar, es batu dibungkus terpisah.', harga: 6000, foto: k.esJeruk, opsi: [GULA, ES] },
          { id: 'es-teh-bakso', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: k.esTeh2, opsi: [GULA, ES] },
        ],
      },
    ],
  },
  {
    id: 'geprek-sambal-korek',
    nama: 'Geprek Sambal Korek',
    pemilik: 'Mbak Nisa',
    tagline: 'Ayam geprek dengan sambal korek level 0–5',
    cerita: 'Warung kecil dekat kos-kosan mahasiswa. Pilih level sambal saat memesan: 0 tidak pedas, 5 setara cabai 15 biji.',
    kategori: ['nasi'],
    alamat: 'Jl. Sawahan No. 3',
    x: 85, y: 260,
    masakMenit: 9,
    jadwal: setiapHari([[j(10), j(22)]]),
    foto: f.geprek,
    warna: '#B3321B',
    bagian: [
      {
        judul: 'Andalan',
        menu: [
          { id: 'geprek', nama: 'Ayam geprek + nasi', ket: 'Ayam goreng tepung digeprek dengan sambal korek, level 0–5.', harga: 15000, foto: k.geprek, opsi: [LEVEL, tambahan(T.telur, T.tempe, T.terong)] },
          { id: 'penyet', nama: 'Ayam penyet + nasi', ket: 'Ayam goreng bumbu kuning, sambal terasi, lalapan.', harga: 16000, foto: k.penyet, opsi: [LEVEL, tambahan(T.telur, T.tempe, T.terong)] },
          { id: 'tahu-tempe-penyet', nama: 'Tahu tempe penyet', ket: 'Pilihan tanpa daging: tahu, tempe, sambal, lalapan, nasi.', harga: 10000, foto: k.tahuTempe, opsi: [LEVEL, tambahan(T.telur, T.terong)] },
        ],
      },
      {
        judul: 'Tambahan & minum',
        menu: [
          { id: 'nasi-putih', nama: 'Nasi putih', ket: 'Satu porsi tambahan.', harga: 4000, foto: k.nasiPutih },
          { id: 'es-teh-geprek', nama: 'Es teh manis', ket: 'Gelas besar, es batu dibungkus terpisah.', harga: 4000, foto: k.esTeh3, opsi: [GULA, ES] },
        ],
      },
    ],
  },
  {
    id: 'nasgor-lampu-teplok',
    nama: 'Nasgor Lampu Teplok',
    pemilik: 'Pak Darto',
    tagline: 'Nasi goreng arang dan mie godhog, khusus malam',
    cerita: 'Gerobak malam di depan Stasiun Tirtalaya, dimasak di atas anglo arang. Buka dari magrib sampai lewat tengah malam.',
    kategori: ['nasi', 'kuah'],
    alamat: 'Depan Stasiun, Jl. Stasiun',
    x: 250, y: 230,
    masakMenit: 10,
    jadwal: setiapHari([[j(17), j(25)]]),
    foto: f.nasiGoreng,
    warna: '#3B2A1F',
    bagian: [
      {
        judul: 'Dari wajan',
        menu: [
          { id: 'nasgor', nama: 'Nasi goreng Jawa', ket: 'Bumbu ulek, kecap, suwiran ayam, telur, acar, kerupuk.', harga: 16000, foto: k.nasiGoreng, opsi: [PEDAS, TELUR, PORSI] },
          { id: 'mie-goreng', nama: 'Mie goreng', ket: 'Mie kuning, sawi, kol, telur, irisan tomat dan timun.', harga: 16000, foto: k.mieGoreng, opsi: [PEDAS, TELUR, PORSI] },
          { id: 'mie-godhog', nama: 'Mie godhog', ket: 'Mie rebus kuah kental, telur bebek, sawi. Kuah dipisah.', harga: 16000, foto: k.mieRebus, opsi: [PEDAS, KUAH, PORSI] },
          { id: 'sate-ayam', nama: 'Sate ayam (10 tusuk)', ket: 'Bumbu kacang, lontong dipisah.', harga: 20000, foto: k.sate },
        ],
      },
      {
        judul: 'Minum',
        menu: [{ id: 'es-teh-nasgor', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: k.esTeh5, opsi: [GULA, ES] }],
      },
    ],
  },
  {
    id: 'kopi-lincak',
    nama: 'Kopi Lincak',
    pemilik: 'Cak Rohman',
    tagline: 'Warung kopi bangku bambu, buka 24 jam',
    cerita: 'Warung kopi dengan lincak (bangku bambu) panjang di samping rel. Gantian jaga siang dan malam, jadi selalu ada yang menyeduh.',
    kategori: ['minum', 'jajan'],
    alamat: 'Jl. Stasiun No. 2',
    x: 320, y: 195,
    masakMenit: 4,
    jadwal: setiapHari([[0, 1440]]),
    foto: f.esKopi,
    warna: '#6A4E3C',
    bagian: [
      {
        judul: 'Seduhan',
        menu: [
          { id: 'kopi-tubruk', nama: 'Kopi hitam tubruk', ket: 'Robusta lereng Wilis, gula dipisah.', harga: 5000, foto: k.kopi, opsi: [{ id: 'gula', judul: 'Gula', jenis: 'satu', bawaan: 'pisah', pilihan: [{ id: 'pisah', label: 'Dipisah' }, { id: 'manis', label: 'Sudah manis' }, { id: 'tanpa', label: 'Tanpa gula' }] }] },
          { id: 'es-kopi-susu', nama: 'Es kopi susu', ket: 'Kopi tubruk, susu kental manis, es batu. Botol 250 ml.', harga: 10000, foto: k.esKopi, opsi: [{ id: 'manis', judul: 'Manisnya', jenis: 'satu', bawaan: 'normal', pilihan: [{ id: 'normal', label: 'Normal' }, { id: 'kurang', label: 'Kurang manis' }] }] },
          { id: 'wedang-uwuh', nama: 'Wedang uwuh', ket: 'Rempah secang, jahe, cengkih, kayu manis. Disajikan panas.', harga: 7000, foto: k.uwuh },
          { id: 'es-teh-kopi', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: k.esTeh, opsi: [GULA, ES] },
        ],
      },
      {
        judul: 'Teman ngopi',
        menu: [
          { id: 'nasi-bungkus', nama: 'Nasi bungkus sambal teri', ket: 'Nasi kepal, sambal teri, dibungkus kertas minyak.', harga: 4000, foto: k.nasiBungkus },
          { id: 'pisang-kopi', nama: 'Pisang goreng', ket: 'Tiga potong, masih hangat.', harga: 5000, foto: k.pisang },
          { id: 'tahu-kopi', nama: 'Tahu goreng tepung', ket: 'Lima potong.', harga: 6000, foto: k.tahu },
        ],
      },
    ],
  },
  {
    id: 'sego-jagung-bu-wartini',
    nama: 'Sego Jagung Bu Wartini',
    pemilik: 'Bu Wartini',
    tagline: 'Nasi jagung, urap, dan ikan asin untuk sarapan',
    cerita: 'Bakul sarapan di teras rumah ujung Jl. Kenanga. Jagungnya ditumbuk sendiri, dikukus bareng beras supaya pulen. Libur tiap Senin karena belanja ke pasar desa.',
    kategori: ['sarapan', 'nasi'],
    alamat: 'Jl. Kenanga No. 30, Bago',
    x: 40, y: 185,
    masakMenit: 5,
    jadwal: { 0: [[j(5, 30), j(10, 30)]], 1: [], 2: [[j(5, 30), j(10, 30)]], 3: [[j(5, 30), j(10, 30)]], 4: [[j(5, 30), j(10, 30)]], 5: [[j(5, 30), j(10, 30)]], 6: [[j(5, 30), j(10, 30)]] },
    foto: f.nasiJagung,
    warna: '#E9A31B',
    bagian: [
      {
        judul: 'Sarapan',
        menu: [
          { id: 'sego-jagung', nama: 'Sego jagung urap', ket: 'Nasi jagung, urap kecambah, ikan asin goreng, sambal bawang.', harga: 9000, foto: k.nasiJagung, opsi: [{ id: 'lauk', judul: 'Lauk', jenis: 'satu', bawaan: 'asin', pilihan: [{ id: 'asin', label: 'Ikan asin' }, { id: 'tempe', label: 'Tempe goreng' }, { id: 'dadar', label: 'Telur dadar', harga: 2000 }] }, PEDAS] },
          { id: 'nasi-kuning', nama: 'Nasi kuning', ket: 'Nasi kunyit santan, mi goreng, sambal goreng, serundeng, telur.', harga: 11000, foto: k.nasiKuning, opsi: [PEDAS, tambahan(T.perkedel, T.kerupuk)] },
          { id: 'telur-asin-jagung', nama: 'Telur asin', ket: 'Satu butir, dibelah dua.', harga: 5000, foto: k.telurAsin },
        ],
      },
      {
        judul: 'Minum',
        menu: [{ id: 'teh-jagung', nama: 'Teh manis hangat', ket: 'Teh tubruk, gelas plastik bertutup.', harga: 3000, foto: k.tehHangat2, opsi: [GULA] }],
      },
    ],
  },
  {
    id: 'lontong-teras-sumur',
    nama: 'Lontong Lodeh Teras Sumur',
    pemilik: 'Mbak Yayuk',
    tagline: 'Lontong kuah lodeh, tahu, dan telur pindang',
    cerita: 'Warung kecil di teras sebelah sumur gang. Kuah lodeh labu siam dimasak sejak subuh dan dibungkus terpisah dari lontong. Libur tiap Minggu.',
    kategori: ['sarapan', 'kuah'],
    alamat: 'Gg. Sumur No. 4, Kedungsari',
    x: 250, y: 115,
    masakMenit: 5,
    jadwal: { 0: [], 1: [[j(6), j(11)]], 2: [[j(6), j(11)]], 3: [[j(6), j(11)]], 4: [[j(6), j(11)]], 5: [[j(6), j(11)]], 6: [[j(6), j(11)]] },
    foto: f.lontong,
    warna: '#2E6B3B',
    bagian: [
      {
        judul: 'Lontong',
        menu: [
          { id: 'lontong-lodeh', nama: 'Lontong lodeh', ket: 'Lontong, lodeh labu siam, tahu, tempe, sambal, kerupuk.', harga: 10000, foto: k.lontong, opsi: [KUAH, SAMBAL_PISAH, tambahan(T.telurRebus, T.tahu, T.kerupuk)] },
          { id: 'telur-ceplok-lontong', nama: 'Telur ceplok', ket: 'Satu butir, kuning setengah matang.', harga: 3000, foto: k.telurCeplok },
        ],
      },
      {
        judul: 'Minum',
        menu: [{ id: 'es-teh-lontong', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: k.esTeh, opsi: [GULA, ES] }],
      },
    ],
  },
  {
    id: 'rujak-simpang-sawah',
    nama: 'Rujak Cingur Simpang Sawah',
    pemilik: 'Pak Kusnan',
    tagline: 'Rujak cingur petis dan es dawet, siang sampai sore',
    cerita: 'Lapak beratap terpal di simpang Jl. Sawahan. Bumbu petis diulek per porsi, jadi pilih jumlah cabainya. Libur tiap Senin.',
    kategori: ['pecel', 'minum', 'jajan'],
    alamat: 'Simpang Jl. Sawahan–Jl. Pasar',
    x: 140, y: 260,
    masakMenit: 7,
    jadwal: { 0: [[j(10), j(17)]], 1: [], 2: [[j(10), j(17)]], 3: [[j(10), j(17)]], 4: [[j(10), j(17)]], 5: [[j(10), j(17)]], 6: [[j(10), j(17)]] },
    foto: f.dawet,
    warna: '#3B2A1F',
    bagian: [
      {
        judul: 'Rujak',
        menu: [
          { id: 'rujak-cingur', nama: 'Rujak cingur', ket: 'Cingur, lontong, tahu, tempe, sayur rebus, buah, bumbu petis ulek.', harga: 15000, foto: k.rujakCingur, opsi: [{ id: 'cabai', judul: 'Cabai diulek', jenis: 'satu', bawaan: 'c2', pilihan: [{ id: 'c0', label: 'Tanpa cabai' }, { id: 'c2', label: '2 biji' }, { id: 'c5', label: '5 biji' }, { id: 'c10', label: '10 biji' }] }, { id: 'petis', judul: 'Bumbu', jenis: 'satu', bawaan: 'campur', pilihan: [{ id: 'campur', label: 'Dicampur' }, { id: 'pisah', label: 'Dipisah' }] }] },
          { id: 'rujak-sayur', nama: 'Rujak sayur tanpa cingur', ket: 'Lontong, tahu, tempe, kangkung, tauge, bumbu petis.', harga: 11000, foto: k.rujakSayur, opsi: [{ id: 'cabai', judul: 'Cabai diulek', jenis: 'satu', bawaan: 'c2', pilihan: [{ id: 'c0', label: 'Tanpa cabai' }, { id: 'c2', label: '2 biji' }, { id: 'c5', label: '5 biji' }] }] },
        ],
      },
      {
        judul: 'Yang segar',
        menu: [
          { id: 'es-dawet', nama: 'Es dawet', ket: 'Cendol hijau, santan, gula aren cair, es serut.', harga: 6000, foto: k.dawet, opsi: [{ id: 'manis', judul: 'Gula aren', jenis: 'satu', bawaan: 'normal', pilihan: [{ id: 'normal', label: 'Normal' }, { id: 'kurang', label: 'Kurang manis' }] }] },
          { id: 'es-campur', nama: 'Es campur', ket: 'Kolang-kaling, nangka, cincau, sirup merah, susu kental manis.', harga: 8000, foto: k.esCampur },
        ],
      },
    ],
  },
  {
    id: 'terang-bulan-petromaks',
    nama: 'Terang Bulan Lampu Petromaks',
    pemilik: 'Mas Gilang',
    tagline: 'Terang bulan tebal dan martabak telur, sore sampai malam',
    cerita: 'Gerobak bercahaya lampu petromaks di depan Pasar Sore. Adonan terang bulan didiamkan sejak siang supaya bersarang. Satu loyang dipanggang ±12 menit.',
    kategori: ['jajan'],
    alamat: 'Depan Pasar Sore, Jl. Stasiun',
    x: 320, y: 245,
    masakMenit: 12,
    jadwal: setiapHari([[j(16), j(23)]]),
    foto: f.terangBulan,
    warna: '#B3321B',
    bagian: [
      {
        judul: 'Dari loyang',
        menu: [
          { id: 'terang-bulan', nama: 'Terang bulan', ket: 'Satu loyang dipotong 8, mentega dioles merata.', harga: 22000, foto: k.terangBulan, opsi: [{ id: 'rasa', judul: 'Isi', jenis: 'satu', bawaan: 'coklat', pilihan: [{ id: 'coklat', label: 'Cokelat kacang' }, { id: 'keju', label: 'Keju', harga: 4000 }, { id: 'ck', label: 'Cokelat keju', harga: 6000 }, { id: 'pisang', label: 'Pisang cokelat', harga: 3000 }] }, { id: 'ukuran', judul: 'Ukuran', jenis: 'satu', bawaan: 'biasa', pilihan: [{ id: 'biasa', label: 'Biasa' }, { id: 'jumbo', label: 'Jumbo', harga: 8000 }] }] },
          { id: 'martabak-telur', nama: 'Martabak telur', ket: 'Kulit tipis, isi telur, daun bawang, daging cincang. Kuah kari dan acar dipisah.', harga: 20000, foto: k.martabakTelur, opsi: [{ id: 'telur', judul: 'Telur', jenis: 'satu', bawaan: 'ayam', pilihan: [{ id: 'ayam', label: '2 telur ayam' }, { id: 'bebek', label: '2 telur bebek', harga: 4000 }] }, { id: 'kuah', judul: 'Kuah kari', jenis: 'satu', bawaan: 'pakai', pilihan: [{ id: 'pakai', label: 'Pakai' }, { id: 'tanpa', label: 'Tanpa kuah' }] }] },
        ],
      },
    ],
  },
  {
    id: 'ronde-pos-ronda',
    nama: 'Ronde & Angsle Pos Ronda',
    pemilik: 'Pak Mul',
    tagline: 'Wedang ronde jahe dan angsle santan, khusus malam',
    cerita: 'Pikulan wedang yang mangkal di samping pos ronda Jl. Melati. Kuah jahe direbus dengan serai dan gula aren. Libur tiap Kamis.',
    kategori: ['minum', 'jajan'],
    alamat: 'Samping pos ronda, Jl. Melati',
    x: 90, y: 160,
    masakMenit: 4,
    jadwal: { 0: [[j(18), j(23, 30)]], 1: [[j(18), j(23, 30)]], 2: [[j(18), j(23, 30)]], 3: [[j(18), j(23, 30)]], 4: [], 5: [[j(18), j(23, 30)]], 6: [[j(18), j(23, 30)]] },
    foto: f.uwuh,
    warna: '#6A4E3C',
    bagian: [
      {
        judul: 'Wedang',
        menu: [
          { id: 'wedang-ronde', nama: 'Wedang ronde', ket: 'Ronde isi kacang, kolang-kaling, kacang sangrai, kuah jahe serai panas.', harga: 8000, foto: k.wedangRonde, opsi: [{ id: 'jahe', judul: 'Jahe', jenis: 'satu', bawaan: 'sedang', pilihan: [{ id: 'sedang', label: 'Sedang' }, { id: 'kuat', label: 'Jahe kuat' }] }, GULA] },
          { id: 'angsle', nama: 'Angsle', ket: 'Kuah santan hangat, ketan, putu mayang, roti tawar, kacang hijau.', harga: 9000, foto: k.angsle },
          { id: 'wedang-uwuh-ronde', nama: 'Wedang uwuh', ket: 'Rempah secang, jahe, cengkih, kayu manis.', harga: 6000, foto: k.uwuh, opsi: [GULA] },
        ],
      },
    ],
  },
];

export const warungById = (id: string) => WARUNG.find((w) => w.id === id);

export function cariMenu(warungId: string, menuId: string): Menu | undefined {
  const w = warungById(warungId);
  for (const b of w?.bagian ?? []) for (const m of b.menu) if (m.id === menuId) return m;
  return undefined;
}

export type Kurir = { id: string; nama: string; motor: string; nopol: string; helm: string; jaket: string };

export const KURIR: Kurir[] = [
  { id: 'bayu', nama: 'Mas Bayu', motor: 'Motor bebek biru', nopol: 'AG 0000 PC', helm: '#2F5D8A', jaket: '#B3321B' },
  { id: 'sri', nama: 'Mbak Sri', motor: 'Motor matik krem', nopol: 'AG 0000 PK', helm: '#E9A31B', jaket: '#B3321B' },
  { id: 'anton', nama: 'Mas Anton', motor: 'Motor bebek hitam', nopol: 'AG 0000 PN', helm: '#2E6B3B', jaket: '#B3321B' },
];

export type Kelurahan = { id: string; nama: string; x: number; y: number };

/** Titik acuan untuk alamat baru (bisa dipilih dengan keyboard, selain mengetuk peta). */
export const KELURAHAN: Kelurahan[] = [
  { id: 'kauman', nama: 'Kauman', x: 190, y: 60 },
  { id: 'kepatihan', nama: 'Kepatihan', x: 40, y: 125 },
  { id: 'bago', nama: 'Bago', x: 40, y: 215 },
  { id: 'pasar-lama', nama: 'Pasar Lama', x: 140, y: 215 },
  { id: 'sukorejo', nama: 'Sukorejo', x: 290, y: 260 },
  { id: 'kedungsari', nama: 'Kedungsari', x: 320, y: 110 },
];

export type Promo = { kode: string; judul: string; syarat: string; warna: string };

export const PROMO: Promo[] = [
  { kode: 'HEMATONGKIR', judul: 'Potong ongkir Rp4.000', syarat: 'Belanja minimal Rp30.000 dari satu warung.', warna: '#E9A31B' },
  { kode: 'SARAPAN', judul: 'Diskon 10% sarapan', syarat: 'Pesanan dibuat pukul 05.00–09.59 WIB. Potongan maksimal Rp6.000.', warna: '#2E6B3B' },
  { kode: 'BARENG', judul: 'Gratis ongkir pesanan bareng', syarat: 'Belanja minimal Rp80.000 dan jarak antar paling jauh 3 km.', warna: '#B3321B' },
];
