import { KELURAHAN, KURIR, warungById, type Kurir, type PilihanMenu } from './data';
import { rupiah } from './harga';
import { posisiDiRute, rute, type Titik } from './peta';

/** Simulasi pelacakan dipercepat: 1 menit di aplikasi = 4 detik sungguhan. */
export const PERCEPAT = 15;

export type ItemPesanan = { menuId: string; nama: string; harga: number; qty: number; pilih?: PilihanMenu; opsiTeks?: string; catatan?: string };
export type Penilaian = { nilai: number; tanda: string[]; catatan: string; waktu: number };
export type AlamatSnap = { label: string; detail: string; patokan: string; x: number; y: number };

export type Pesanan = {
  id: string;
  kode: string;
  warungId: string;
  item: ItemPesanan[];
  catatan: string;
  alamat: AlamatSnap;
  meter: number;
  subtotal: number;
  ongkir: number;
  potongan: number;
  promo: string | null;
  total: number;
  bayar: 'tunai' | 'qris';
  dibuat: number;
  dibayar: number | null;
  batal: number | null;
  lompat: number; // ms simulasi yang dilewati lewat tombol "percepat"
  masakMenit: number;
  jalanMenit: number;
  kurirId: string;
  contoh?: boolean;
};

export const TAHAP = [
  { id: 'bayar', judul: 'Menunggu pembayaran', pendek: 'Bayar' },
  { id: 'diterima', judul: 'Pesanan diterima warung', pendek: 'Diterima' },
  { id: 'dimasak', judul: 'Sedang dimasak', pendek: 'Dimasak' },
  { id: 'diambil', judul: 'Kurir mengambil pesanan', pendek: 'Diambil' },
  { id: 'diantar', judul: 'Kurir menuju kamu', pendek: 'Diantar' },
  { id: 'sampai', judul: 'Pesanan sampai', pendek: 'Sampai' },
] as const;

export type StatusPesanan = {
  tahap: number; // indeks TAHAP; -1 = dibatalkan
  progres: number; // 0..1 di dalam tahap
  mulai: number[]; // jam simulasi (ms) awal tiap tahap 1..5
  sisaMenit: number; // menit simulasi sampai tiba
  selesai: boolean;
};

const DURASI_TERIMA = 1.5;
const DURASI_AMBIL = 2;

/** Rentang jam tiba (jam simulasi), mis. "07.13–07.18". Saat sudah sampai: jam sampai saja. */
export function rentangTiba(s: StatusPesanan): { dari: number; sampai: number; tiba: boolean } {
  const t = s.mulai[4];
  if (s.tahap >= 5) return { dari: t, sampai: t, tiba: true };
  return { dari: t - 2 * 60000, sampai: t + 3 * 60000, tiba: false };
}

export function durasiTahap(p: Pesanan): number[] {
  return [DURASI_TERIMA, p.masakMenit, DURASI_AMBIL, p.jalanMenit];
}

export function statusPesanan(p: Pesanan, now: number): StatusPesanan {
  const dur = durasiTahap(p);
  const t0 = p.bayar === 'qris' ? p.dibayar : p.dibuat;
  const total = dur.reduce((a, b) => a + b, 0);
  const mulai: number[] = [];
  let acc = 0;
  const awal = t0 ?? p.dibuat;
  for (let i = 0; i <= dur.length; i++) {
    mulai.push(awal + acc * 60000);
    if (i < dur.length) acc += dur[i];
  }
  if (p.batal) return { tahap: -1, progres: 0, mulai, sisaMenit: 0, selesai: true };
  if (t0 == null) return { tahap: 0, progres: 0, mulai, sisaMenit: total, selesai: false };
  const simMenit = ((now - t0) * PERCEPAT + p.lompat) / 60000;
  let sisa = simMenit;
  for (let i = 0; i < dur.length; i++) {
    if (sisa < dur[i]) {
      const lewat = dur.slice(0, i).reduce((a, b) => a + b, 0) + sisa;
      return { tahap: i + 1, progres: sisa / dur[i], mulai, sisaMenit: Math.max(1, Math.ceil(total - lewat)), selesai: false };
    }
    sisa -= dur[i];
  }
  return { tahap: 5, progres: 1, mulai, sisaMenit: 0, selesai: true };
}

/** Lompatan (ms simulasi) supaya pesanan langsung masuk ke tahap berikutnya. */
export function lompatanKeTahapBerikut(p: Pesanan, now: number): number {
  const s = statusPesanan(p, now);
  if (s.tahap < 1 || s.tahap >= 5) return p.lompat;
  const dur = durasiTahap(p);
  const sisaTahap = (1 - s.progres) * dur[s.tahap - 1] * 60000;
  return p.lompat + sisaTahap + 1000;
}

export const kurirPesanan = (p: Pesanan): Kurir => KURIR.find((k) => k.id === p.kurirId) ?? KURIR[0];

export const PANGKALAN: Titik = { x: KELURAHAN[0].x, y: KELURAHAN[0].y };

/** Posisi kurir di peta untuk status sekarang. */
export function posisiKurir(p: Pesanan, s: StatusPesanan) {
  const w = warungById(p.warungId)!;
  const titikWarung = { x: w.x, y: w.y };
  if (s.tahap === 2) {
    const r = rute(PANGKALAN, titikWarung);
    return { ...posisiDiRute(r.titik, s.progres), rute: r.titik, menuju: 'warung' as const };
  }
  const r = rute(titikWarung, p.alamat);
  if (s.tahap === 4) return { ...posisiDiRute(r.titik, s.progres), rute: r.titik, menuju: 'kamu' as const };
  if (s.tahap >= 5) return { x: p.alamat.x, y: p.alamat.y, arah: 1, rute: r.titik, menuju: 'kamu' as const };
  return { x: w.x, y: w.y, arah: 1, rute: r.titik, menuju: 'warung' as const };
}

export type PesanChat = { id: string; dari: 'kamu' | 'kurir'; teks: string; waktu: number };

/** Pesan otomatis kurir, muncul sesuai tahap (waktu = jam sungguhan saat tahap dimulai). */
export function pesanOtomatis(p: Pesanan): PesanChat[] {
  const k = kurirPesanan(p);
  const w = warungById(p.warungId)!;
  const t0 = p.bayar === 'qris' ? p.dibayar : p.dibuat;
  if (t0 == null || p.batal) return [];
  const dur = durasiTahap(p);
  // ubah menit simulasi ke jam sungguhan, ikut memperhitungkan lompatan
  const nyata = (simMenit: number) => t0 + Math.max(0, (simMenit * 60000 - p.lompat) / PERCEPAT);
  const m2 = dur[0];
  const m3 = m2 + dur[1];
  const m4 = m3 + dur[2];
  const m5 = m4 + dur[3];
  const sapa = p.alamat.patokan ? ` (${p.alamat.patokan})` : '';
  const uang = p.bayar === 'tunai' ? ` Bayar tunai ${rupiah(p.total)} ya, Kak. Kalau ada uang pas lebih enak.` : ' Pembayaran QRIS sudah masuk, jadi tinggal terima saja.';
  return [
    { id: 'a1', dari: 'kurir', teks: `Halo, saya ${k.nama} yang mengantar pesananmu. Saya ke ${w.nama} dulu, ya.`, waktu: nyata(m2 + 0.3) },
    { id: 'a2', dari: 'kurir', teks: `Sudah di warung. Pesanan sedang dibungkus, sebentar lagi berangkat.`, waktu: nyata(m3 + 0.2) },
    { id: 'a3', dari: 'kurir', teks: `Berangkat sekarang, kira-kira ${p.jalanMenit} menit sampai.${uang}`, waktu: nyata(m4 + 0.1) },
    { id: 'a4', dari: 'kurir', teks: `Sudah sampai di ${p.alamat.label.toLowerCase()}${sapa}. Saya tunggu di depan, ya.`, waktu: nyata(m5) },
  ];
}

const pola: [RegExp, (p: Pesanan, s: StatusPesanan) => string][] = [
  [/kembali|uang|pecah|tunai|cash/i, (p) => (p.bayar === 'tunai' ? 'Aman, saya bawa uang kembalian.' : 'Sudah lunas lewat QRIS, jadi tidak perlu uang tunai, Kak.')],
  [/sambal|pedas|kuah|sendok|plastik|saus|kecap|level/i, (_p, s) => (s.tahap <= 2 ? 'Saya sampaikan ke warung sekarang, mumpung belum dibungkus.' : 'Wah, pesanan sudah dibungkus. Nanti saya cek lagi waktu serah terima, ya.')],
  [/lama|kapan|menit|sampai mana|di ?mana|posisi/i, (_p, s) => (s.tahap <= 3 ? 'Masih di warung, menunggu pesanan matang. Begitu siap langsung jalan.' : s.tahap === 4 ? `Sudah di jalan, sekitar ${s.sisaMenit} menit lagi.` : 'Saya sudah di depan, Kak.')],
  [/pagar|rumah|cat|warna|gang|gg|nomor|no\.|depan|samping|belakang|patokan|pos|satpam|titip/i, () => 'Siap, saya catat patokannya. Kalau bingung saya kabari lewat chat ini.'],
  [/makasih|terima kasih|suwun|nuwun|thanks/i, () => 'Sama-sama, Kak. Selamat makan nanti.'],
];

export function balasanKurir(teks: string, p: Pesanan, s: StatusPesanan): string {
  for (const [re, f] of pola) if (re.test(teks)) return f(p, s);
  return 'Oke, Kak. Pesannya sudah saya baca.';
}

export const kodePesanan = (ms: number, acak: number) => {
  const d = new Date(ms + 7 * 3600000);
  return `PCK-${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(acak).padStart(4, '0')}`;
};
