import type { Jadwal } from './data';

const WIB_MS = 7 * 60 * 60 * 1000;
export const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export type WaktuWib = { hari: number; menit: number; tgl: number; bln: number; thn: number };

/** Waktu WIB (UTC+7) tanpa bergantung zona waktu perangkat. */
export function wib(ms: number): WaktuWib {
  const d = new Date(ms + WIB_MS);
  return { hari: d.getUTCDay(), menit: d.getUTCHours() * 60 + d.getUTCMinutes(), tgl: d.getUTCDate(), bln: d.getUTCMonth(), thn: d.getUTCFullYear() };
}

const dua = (n: number) => String(n).padStart(2, '0');
export const jam = (menit: number) => `${dua(Math.floor(menit / 60) % 24)}.${dua(menit % 60)}`;
export const jamDari = (ms: number) => jam(wib(ms).menit);
export const tanggal = (ms: number) => {
  const w = wib(ms);
  return `${HARI[w.hari]}, ${w.tgl} ${BULAN[w.bln]} ${w.thn}`;
};
export const tanggalPendek = (ms: number) => {
  const w = wib(ms);
  return `${w.tgl} ${BULAN[w.bln]}`;
};

export type BagianHari = 'pagi' | 'siang' | 'sore' | 'malam';
export function bagianHari(ms: number): BagianHari {
  const m = wib(ms).menit;
  if (m >= 240 && m < 600) return 'pagi';
  if (m >= 600 && m < 900) return 'siang';
  if (m >= 900 && m < 1080) return 'sore';
  return 'malam';
}

export type StatusBuka = {
  buka: boolean;
  bisaPesan: boolean;
  jenis: 'buka' | 'hampir' | 'libur' | 'istirahat' | 'belum' | 'tutup';
  label: string; // "Buka", "Libur Jumat", "Istirahat", "Belum buka", "Tutup", "Hampir tutup", "Buka 24 jam"
  ket: string; // "sampai 21.00" / "buka lagi Sabtu 05.30"
  tutupDalam?: number; // menit
};

const BATAS_PESAN = 15; // dapur berhenti menerima pesanan 15 menit sebelum tutup

/** Sesi yang sedang berjalan (termasuk sesi kemarin yang lewat tengah malam). */
function sesiAktif(jadwal: Jadwal, hari: number, menit: number): [number, number] | null {
  for (const [a, b] of jadwal[hari] ?? []) if (menit >= a && menit < b) return [a, b];
  const kemarin = (hari + 6) % 7;
  for (const [a, b] of jadwal[kemarin] ?? []) if (b > 1440 && menit < b - 1440) return [a - 1440, b - 1440];
  return null;
}

const is24Jam = (jadwal: Jadwal) => Object.values(jadwal).every((s) => s.length === 1 && s[0][0] === 0 && s[0][1] >= 1440);

/** "Libur tiap Jumat" / "Libur tiap Senin & Kamis" / "" */
export function teksLibur(jadwal: Jadwal): string {
  const libur = [1, 2, 3, 4, 5, 6, 0].filter((h) => !(jadwal[h] ?? []).length).map((h) => HARI[h]);
  return libur.length ? `Libur tiap ${libur.join(' & ')}` : '';
}

export function statusBuka(jadwal: Jadwal, ms: number): StatusBuka {
  if (is24Jam(jadwal)) return { buka: true, bisaPesan: true, jenis: 'buka', label: 'Buka 24 jam', ket: 'setiap hari' };
  const { hari, menit } = wib(ms);
  const s = sesiAktif(jadwal, hari, menit);
  if (s) {
    const sisa = s[1] - menit;
    if (sisa <= BATAS_PESAN) return { buka: true, bisaPesan: false, jenis: 'hampir', label: 'Hampir tutup', ket: `pesanan terakhir ${jam(s[1] - BATAS_PESAN)}`, tutupDalam: sisa };
    return { buka: true, bisaPesan: true, jenis: 'buka', label: 'Buka', ket: sisa <= 45 ? `tutup ${jam(s[1])}, ${sisa} menit lagi` : `sampai ${jam(s[1])}`, tutupDalam: sisa };
  }
  const hariIni = [...(jadwal[hari] ?? [])].sort((a, b) => a[0] - b[0]);
  const lagi = bukaLagi(jadwal, hari, menit);
  if (!hariIni.length) return { buka: false, bisaPesan: false, jenis: 'libur', label: `Libur ${HARI[hari]}`, ket: lagi };
  const nanti = hariIni.find(([a]) => a > menit);
  if (nanti && hariIni.some(([, b]) => b <= menit)) return { buka: false, bisaPesan: false, jenis: 'istirahat', label: 'Istirahat', ket: `buka lagi ${jam(nanti[0])}` };
  if (nanti) return { buka: false, bisaPesan: false, jenis: 'belum', label: 'Belum buka', ket: `buka ${jam(nanti[0])}` };
  return { buka: false, bisaPesan: false, jenis: 'tutup', label: 'Sudah tutup', ket: lagi };
}

function bukaLagi(jadwal: Jadwal, hari: number, menit: number): string {
  for (let i = 0; i < 8; i++) {
    const h = (hari + i) % 7;
    const sesi = [...(jadwal[h] ?? [])].sort((a, b) => a[0] - b[0]);
    for (const [a] of sesi) {
      if (i === 0 && a <= menit) continue;
      if (i === 0) return `buka lagi ${jam(a)}`;
      if (i === 1) return `buka lagi besok (${HARI[h]}) ${jam(a)}`;
      return `buka lagi ${HARI[h]} ${jam(a)}`;
    }
  }
  return 'jadwal belum ada';
}

/** Ringkasan jadwal per hari untuk ditampilkan. */
export function barisJadwal(jadwal: Jadwal): { hari: string; jam: string; idx: number }[] {
  const urut = [1, 2, 3, 4, 5, 6, 0];
  return urut.map((h) => {
    const s = jadwal[h] ?? [];
    const teks = s.length === 0 ? 'Libur' : s.map(([a, b]) => (a === 0 && b >= 1440 ? '24 jam' : `${jam(a)}–${jam(b)}`)).join(', ');
    return { hari: HARI[h], jam: teks, idx: h };
  });
}
