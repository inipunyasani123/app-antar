import { Platform } from 'react-native';

/** Palet "warung": kertas nasi, sambal, kunyit, daun pisang. Semua pasangan teks lolos kontras ≥4.5:1. */
export const warna = {
  kertas: '#FBF3E4', // latar
  kertas2: '#F3E6CF', // kartu sekunder
  putih: '#FFFDF8', // kartu utama
  tinta: '#2B1B12', // teks utama (15:1 di kertas)
  tinta2: '#6A4E3C', // teks pelengkap (6.9:1 di kertas)
  garis: '#E2D2B6',
  garisTegas: '#C9B08C',
  sambal: '#B3321B', // aksen utama (6.2:1 dengan putih)
  sambalTua: '#8C2412',
  sambalMuda: '#F7DCCF',
  kunyit: '#E9A31B', // aksen kedua, selalu dengan teks tinta
  kunyitMuda: '#FBE7B5',
  daun: '#2E6B3B', // status buka
  daunTua: '#1F4D2B',
  daunMuda: '#DDE8CF',
  kali: '#9CC3C9', // sungai di peta
  sawah: '#CFDDB0',
  jalan: '#FFFDF8',
} as const;

const webStack = (nama: string, cadangan: string) => `${nama}, ${cadangan}`;
const sans = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

/** Nama keluarga huruf sama di web (@font-face di +html) dan native (useFonts). */
export const huruf = {
  display: Platform.select({ web: webStack('Shrikhand', 'Georgia, serif'), default: 'Shrikhand' }),
  sedang: Platform.select({ web: webStack('Figtree500', sans), default: 'Figtree500' }),
  tebal: Platform.select({ web: webStack('Figtree700', sans), default: 'Figtree700' }),
  hitam: Platform.select({ web: webStack('Figtree800', sans), default: 'Figtree800' }),
  mono: Platform.select({ web: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace', ios: 'Menlo', default: 'monospace' }),
} as const;

export const radius = { kecil: 10, sedang: 16, besar: 22, pil: 999 } as const;

export const bayangan = Platform.select({
  web: { boxShadow: '0 1px 0 rgba(43,27,18,0.08), 0 6px 18px -10px rgba(43,27,18,0.35)' } as object,
  default: { shadowColor: '#2B1B12', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
});
