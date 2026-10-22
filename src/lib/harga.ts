import { PROMO } from './data';
import { wib } from './waktu';

export const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('id-ID').replace(/,/g, '.');
export const km = (meter: number) => (meter / 1000).toFixed(1).replace('.', ',') + ' km';

export const ONGKIR_DASAR = 6000; // sampai 2 km
export const ONGKIR_PER_500M = 1000;

/** Ongkir dari jarak rute: Rp6.000 untuk 2 km pertama, lalu Rp1.000 per 500 m berikutnya. */
export function ongkir(meter: number): number {
  if (meter <= 2000) return ONGKIR_DASAR;
  return ONGKIR_DASAR + Math.ceil((meter - 2000) / 500) * ONGKIR_PER_500M;
}

export function rincianOngkir(meter: number): string {
  if (meter <= 2000) return `${km(meter)} · tarif dasar sampai 2 km`;
  const blok = Math.ceil((meter - 2000) / 500);
  return `${km(meter)} · dasar ${rupiah(ONGKIR_DASAR)} + ${blok} × ${rupiah(ONGKIR_PER_500M)} per 500 m`;
}

/** Perkiraan menit perjalanan kurir (±22 km/jam di jalan kota + 3 menit parkir & serah terima). */
export const menitJalan = (meter: number) => Math.max(4, Math.round((meter / 1000 / 22) * 60 + 3));

export type HasilPromo = { ok: boolean; potonganBarang: number; potonganOngkir: number; alasan: string };

export function cekPromo(kode: string | null, subtotal: number, ongkosKirim: number, meter: number, ms: number): HasilPromo {
  const kosong = { potonganBarang: 0, potonganOngkir: 0 };
  if (!kode) return { ok: false, ...kosong, alasan: '' };
  const p = PROMO.find((x) => x.kode === kode.trim().toUpperCase());
  if (!p) return { ok: false, ...kosong, alasan: 'Kode promo tidak dikenal.' };
  if (p.kode === 'HEMATONGKIR') {
    if (subtotal < 30000) return { ok: false, ...kosong, alasan: `Kurang ${rupiah(30000 - subtotal)} lagi untuk memakai HEMATONGKIR.` };
    return { ok: true, potonganBarang: 0, potonganOngkir: Math.min(4000, ongkosKirim), alasan: 'Ongkir dipotong Rp4.000.' };
  }
  if (p.kode === 'SARAPAN') {
    const m = wib(ms).menit;
    if (m < 300 || m >= 600) return { ok: false, ...kosong, alasan: 'SARAPAN hanya berlaku pukul 05.00–09.59 WIB.' };
    const pot = Math.min(6000, Math.round((subtotal * 0.1) / 100) * 100);
    return { ok: true, potonganBarang: pot, potonganOngkir: 0, alasan: `Diskon 10% (${rupiah(pot)}).` };
  }
  if (p.kode === 'BARENG') {
    if (subtotal < 80000) return { ok: false, ...kosong, alasan: `Kurang ${rupiah(80000 - subtotal)} lagi untuk memakai BARENG.` };
    if (meter > 3000) return { ok: false, ...kosong, alasan: 'BARENG hanya untuk jarak antar paling jauh 3 km.' };
    return { ok: true, potonganBarang: 0, potonganOngkir: ongkosKirim, alasan: 'Gratis ongkir.' };
  }
  return { ok: false, ...kosong, alasan: 'Kode promo tidak dikenal.' };
}
