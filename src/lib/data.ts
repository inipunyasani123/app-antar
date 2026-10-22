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
};

export const KATEGORI: Kategori[] = [
  { id: 'sarapan', nama: 'Sarapan', sapaan: 'Sarapan pagi', ket: 'Pecel, rawon, dan jajan pasar yang sudah siap sejak subuh. Pesan dari warung pagi di Tirtalaya, diantar selagi hangat.', foto: f.pecel },
  { id: 'nasi', nama: 'Nasi & lauk', sapaan: 'Nasi & lauk', ket: 'Ayam geprek, nasi goreng, nasi campur, dan lauk rumahan dari warung tetangga. Pilih menu, cek ongkir, lalu pesan.', foto: f.geprek },
  { id: 'kuah', nama: 'Bakso & berkuah', sapaan: 'Yang berkuah', ket: 'Bakso urat, mie ayam, rawon, dan soto ayam. Kuah dipisah supaya mie tidak lembek di jalan.', foto: f.bakso },
  { id: 'pecel', nama: 'Pecel & sayur', sapaan: 'Pecel & sayur', ket: 'Pecel pincuk, urap, dan sayur rumahan dengan sambal kacang dari warung pecel Tirtalaya.', foto: f.urap },
  { id: 'jajan', nama: 'Jajan pasar', sapaan: 'Jajan pasar', ket: 'Klepon, dadar gulung, getuk, onde-onde, dan kolak dari tenong jajanan pagi dan sore.', foto: f.klepon },
  { id: 'minum', nama: 'Minuman', sapaan: 'Kopi & minuman', ket: 'Kopi tubruk, es kopi susu, wedang uwuh, es jeruk, dan es teh dari warung kopi yang buka 24 jam.', foto: f.esKopi },
];

export type Menu = {
  id: string;
  nama: string;
  ket: string;
  harga: number;
  foto?: ImageSourcePropType;
  ilustrasi?: 'lemper' | 'nasi' | 'gelas' | 'mangkuk' | 'bungkus';
  habis?: boolean;
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

export const WARUNG: Warung[] = [
  {
    id: 'pecel-bu-ratmi',
    nama: 'Pecel Pojok Bu Ratmi',
    pemilik: 'Bu Ratmi',
    tagline: 'Pecel pincuk daun pisang, sambal kacang diulek tiap subuh',
    cerita: 'Lapak pagi di pojok Pasar Lama. Sambal kacangnya agak pedas; minta "sambal dipisah" di catatan kalau mau atur sendiri.',
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
          { id: 'pecel-pincuk', nama: 'Nasi pecel pincuk', ket: 'Nasi, sayur rebus, kembang turi, sambal kacang, dan rempeyek. Dibungkus pincuk daun pisang.', harga: 10000, foto: f.pecel },
          { id: 'pecel-telur', nama: 'Pecel + telur ceplok', ket: 'Nasi pecel lengkap dengan telur ceplok setengah matang.', harga: 13000, ilustrasi: 'nasi' },
          { id: 'urap', nama: 'Urap daun kates', ket: 'Daun pepaya, kacang panjang, dan kelapa parut berbumbu. Pahitnya pas.', harga: 8000, foto: f.urap },
        ],
      },
      {
        judul: 'Lauk tambahan',
        menu: [
          { id: 'tempe', nama: 'Tempe goreng', ket: 'Dua potong, digoreng kering.', harga: 3000, foto: f.tempe },
          { id: 'rempeyek', nama: 'Rempeyek kacang', ket: 'Satu bungkus isi lima keping.', harga: 5000, foto: f.rempeyek },
          { id: 'tahu-pecel', nama: 'Tahu goreng', ket: 'Dua potong tahu putih goreng.', harga: 3000, ilustrasi: 'nasi' },
        ],
      },
      {
        judul: 'Minum',
        menu: [{ id: 'teh-anget', nama: 'Teh manis hangat', ket: 'Teh tubruk gula batu, gelas plastik bertutup.', harga: 4000, ilustrasi: 'gelas' }],
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
          { id: 'rawon', nama: 'Nasi rawon', ket: 'Daging sengkel, kuah keluak, telur asin separuh, tauge pendek, sambal terasi.', harga: 24000, foto: f.rawon },
          { id: 'soto', nama: 'Soto ayam', ket: 'Kuah bening kunyit, suwiran ayam kampung, soun, seledri. Nasi dipisah.', harga: 17000, foto: f.soto },
          { id: 'nasi-campur', nama: 'Nasi campur', ket: 'Nasi, sambal goreng ati, mi, perkedel, serundeng, dan kerupuk.', harga: 20000, foto: f.nasiCampur },
        ],
      },
      {
        judul: 'Tambahan',
        menu: [
          { id: 'telur-asin', nama: 'Telur asin', ket: 'Satu butir, dibelah dua.', harga: 5000, ilustrasi: 'nasi' },
          { id: 'empal', nama: 'Empal goreng', ket: 'Satu potong daging empal manis gurih.', harga: 9000, habis: true, ilustrasi: 'nasi' },
          { id: 'es-jeruk-rawon', nama: 'Es jeruk', ket: 'Jeruk peras, gula secukupnya.', harga: 6000, foto: f.esJeruk },
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
          { id: 'klepon', nama: 'Klepon', ket: 'Isi lima. Gula merah cair di dalam, kelapa parut di luar.', harga: 6000, foto: f.klepon },
          { id: 'dadar', nama: 'Dadar gulung', ket: 'Dua gulung, isi unti kelapa gula jawa.', harga: 5000, foto: f.dadar },
          { id: 'getuk', nama: 'Getuk lindri', ket: 'Singkong kukus warna-warni dengan kelapa parut.', harga: 5000, foto: f.getuk },
          { id: 'onde', nama: 'Onde-onde', ket: 'Tiga buah, isi kacang hijau, berbalut wijen.', harga: 6000, foto: f.onde },
          { id: 'lemper', nama: 'Lemper ayam', ket: 'Ketan gurih isi ayam suwir, dibungkus daun pisang.', harga: 4000, ilustrasi: 'lemper' },
        ],
      },
      {
        judul: 'Yang hangat',
        menu: [
          { id: 'pisang', nama: 'Pisang goreng', ket: 'Pisang kepok, tepung tipis, empat potong.', harga: 6000, foto: f.pisang },
          { id: 'kolak', nama: 'Kolak pisang ubi', ket: 'Kuah santan gula jawa, pisang, ubi, dan daun pandan. Satu cup.', harga: 7000, foto: f.kolak },
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
          { id: 'bakso-urat', nama: 'Bakso urat', ket: 'Tiga bakso urat, dua bakso halus, tahu goreng, soun, kuah kaldu sapi.', harga: 17000, foto: f.bakso },
          { id: 'mie-ayam', nama: 'Mie ayam', ket: 'Mie lebar, ayam kecap, sawi, kuah dipisah.', harga: 14000, foto: f.mieAyam },
          { id: 'mie-ayam-bakso', nama: 'Mie ayam bakso', ket: 'Mie ayam dengan tambahan dua bakso halus.', harga: 18000, ilustrasi: 'mangkuk' },
        ],
      },
      {
        judul: 'Tambahan & minum',
        menu: [
          { id: 'tahu-bakso', nama: 'Tahu goreng tepung', ket: 'Lima potong, cocol sambal.', harga: 6000, foto: f.tahu },
          { id: 'es-jeruk', nama: 'Es jeruk', ket: 'Jeruk peras segar, es batu dibungkus terpisah.', harga: 6000, foto: f.esJeruk },
          { id: 'es-teh-bakso', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: f.esTeh },
        ],
      },
    ],
  },
  {
    id: 'geprek-sambal-korek',
    nama: 'Geprek Sambal Korek',
    pemilik: 'Mbak Nisa',
    tagline: 'Ayam geprek dengan sambal korek level 0–5',
    cerita: 'Warung kecil dekat kos-kosan mahasiswa. Tulis level sambal di catatan (0 = tidak pedas, 5 = cabai 15 biji).',
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
          { id: 'geprek', nama: 'Ayam geprek + nasi', ket: 'Ayam goreng tepung digeprek dengan sambal korek. Level ditulis di catatan.', harga: 15000, foto: f.geprek },
          { id: 'penyet', nama: 'Ayam penyet + nasi', ket: 'Ayam goreng bumbu kuning, sambal terasi, lalapan.', harga: 16000, foto: f.penyet },
          { id: 'tahu-tempe-penyet', nama: 'Tahu tempe penyet', ket: 'Pilihan tanpa daging: tahu, tempe, sambal, lalapan, nasi.', harga: 10000, ilustrasi: 'nasi' },
        ],
      },
      {
        judul: 'Tambahan & minum',
        menu: [
          { id: 'nasi-putih', nama: 'Nasi putih', ket: 'Satu porsi tambahan.', harga: 4000, ilustrasi: 'nasi' },
          { id: 'es-teh-geprek', nama: 'Es teh manis', ket: 'Gelas besar, es batu dibungkus terpisah.', harga: 4000, foto: f.esTeh },
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
          { id: 'nasgor', nama: 'Nasi goreng Jawa', ket: 'Bumbu ulek, kecap, suwiran ayam, telur, acar, kerupuk.', harga: 16000, foto: f.nasiGoreng },
          { id: 'mie-goreng', nama: 'Mie goreng', ket: 'Mie kuning, sawi, kol, telur, irisan tomat dan timun.', harga: 16000, foto: f.mieGoreng },
          { id: 'mie-godhog', nama: 'Mie godhog', ket: 'Mie rebus kuah kental, telur bebek, sawi. Kuah dipisah.', harga: 16000, foto: f.mieRebus },
          { id: 'sate-ayam', nama: 'Sate ayam (10 tusuk)', ket: 'Bumbu kacang, lontong dipisah.', harga: 20000, foto: f.sate },
        ],
      },
      {
        judul: 'Minum',
        menu: [{ id: 'es-teh-nasgor', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: f.esTeh }],
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
          { id: 'kopi-tubruk', nama: 'Kopi hitam tubruk', ket: 'Robusta lereng Wilis, gula dipisah.', harga: 5000, foto: f.kopi },
          { id: 'es-kopi-susu', nama: 'Es kopi susu', ket: 'Kopi tubruk, susu kental manis, es batu. Botol 250 ml.', harga: 10000, foto: f.esKopi },
          { id: 'wedang-uwuh', nama: 'Wedang uwuh', ket: 'Rempah secang, jahe, cengkih, kayu manis. Disajikan panas.', harga: 7000, foto: f.uwuh },
          { id: 'es-teh-kopi', nama: 'Es teh manis', ket: 'Gelas besar.', harga: 4000, foto: f.esTeh },
        ],
      },
      {
        judul: 'Teman ngopi',
        menu: [
          { id: 'nasi-bungkus', nama: 'Nasi bungkus sambal teri', ket: 'Nasi kepal, sambal teri, dibungkus kertas minyak.', harga: 4000, ilustrasi: 'bungkus' },
          { id: 'pisang-kopi', nama: 'Pisang goreng', ket: 'Tiga potong, masih hangat.', harga: 5000, foto: f.pisang },
          { id: 'tahu-kopi', nama: 'Tahu goreng tepung', ket: 'Lima potong.', harga: 6000, foto: f.tahu },
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
