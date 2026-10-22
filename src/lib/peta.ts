/** Peta ilustrasi Kota Tirtalaya (rekaan). Satuan = titik viewBox; 1 titik ≈ 14 meter. */
export type Titik = { x: number; y: number };

export const PETA = { lebar: 360, tinggi: 300 } as const;
export const JALAN_X = [40, 140, 250, 320] as const; // jalan utara–selatan
export const JALAN_Y = [60, 160, 260] as const; // jalan barat–timur
export const METER_PER_TITIK = 14;
export const JARAK_MAKS_M = 6000;

export const NAMA_JALAN = {
  x: ['Jl. Kenanga', 'Jl. Pasar', 'Jl. Kartini', 'Jl. Stasiun'],
  y: ['Jl. Pahlawan', 'Jl. Melati', 'Jl. Sawahan'],
};

const minX = JALAN_X[0];
const maxX = JALAN_X[JALAN_X.length - 1];
const minY = JALAN_Y[0];
const maxY = JALAN_Y[JALAN_Y.length - 1];
const jepit = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Titik ujung ruas jalan tempat p berada (1 titik kalau p tepat di simpang). */
function ujungRuas(p: Titik): Titik[] {
  const diX = (JALAN_X as readonly number[]).includes(p.x);
  const diY = (JALAN_Y as readonly number[]).includes(p.y);
  if (diX && diY) return [p];
  if (diY) {
    for (let i = 0; i < JALAN_X.length - 1; i++)
      if (p.x >= JALAN_X[i] && p.x <= JALAN_X[i + 1]) return [{ x: JALAN_X[i], y: p.y }, { x: JALAN_X[i + 1], y: p.y }];
  }
  if (diX) {
    for (let i = 0; i < JALAN_Y.length - 1; i++)
      if (p.y >= JALAN_Y[i] && p.y <= JALAN_Y[i + 1]) return [{ x: p.x, y: JALAN_Y[i] }, { x: p.x, y: JALAN_Y[i + 1] }];
  }
  return [tempelKeJalan(p)];
}

const sama = (a: Titik, b: Titik) => a.x === b.x && a.y === b.y;
const jarak = (a: Titik, b: Titik) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

/** Rute lewat jalan (kisi penuh, jadi jalur L antar-simpang selalu ada). */
export function rute(a: Titik, b: Titik): { titik: Titik[]; meter: number } {
  const ua = ujungRuas(a);
  const ub = ujungRuas(b);
  let terbaik: Titik[] = [];
  let panjang = Infinity;
  // satu ruas yang sama → langsung
  const satuRuas = ua.length === 2 && ub.length === 2 && sama(ua[0], ub[0]) && sama(ua[1], ub[1]);
  if (satuRuas || sama(a, b)) {
    terbaik = [a, b];
    panjang = jarak(a, b);
  }
  for (const p of ua)
    for (const q of ub) {
      const sudut = { x: q.x, y: p.y };
      const d = jarak(a, p) + jarak(p, q) + jarak(q, b);
      if (d < panjang) {
        panjang = d;
        terbaik = [a, p, sudut, q, b];
      }
    }
  const bersih = terbaik.filter((t, i) => i === 0 || !sama(t, terbaik[i - 1]));
  return { titik: bersih, meter: Math.round(panjang * METER_PER_TITIK) };
}

/** Posisi di sepanjang polyline untuk progres 0..1. */
export function posisiDiRute(titik: Titik[], progres: number): Titik & { arah: number } {
  const ruas = titik.slice(1).map((t, i) => ({ a: titik[i], b: t, d: jarak(titik[i], t) }));
  const total = ruas.reduce((s, r) => s + r.d, 0) || 1;
  let sisa = jepit(progres, 0, 1) * total;
  for (const r of ruas) {
    if (sisa <= r.d || r === ruas[ruas.length - 1]) {
      const k = r.d === 0 ? 0 : Math.min(1, sisa / r.d);
      return { x: r.a.x + (r.b.x - r.a.x) * k, y: r.a.y + (r.b.y - r.a.y) * k, arah: r.b.x < r.a.x ? -1 : 1 };
    }
    sisa -= r.d;
  }
  const akhir = titik[titik.length - 1];
  return { ...akhir, arah: 1 };
}

/** Tempelkan ketukan di peta ke titik jalan terdekat (dibulatkan ke kelipatan 5). */
export function tempelKeJalan(p: Titik): Titik {
  const bulat = (v: number) => Math.round(v / 5) * 5;
  const calon: Titik[] = [
    ...JALAN_Y.map((y) => ({ x: bulat(jepit(p.x, minX, maxX)), y })),
    ...JALAN_X.map((x) => ({ x, y: bulat(jepit(p.y, minY, maxY)) })),
  ];
  let pilih = calon[0];
  let min = Infinity;
  for (const c of calon) {
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    if (d < min) {
      min = d;
      pilih = c;
    }
  }
  return pilih;
}

/** Nama jalan untuk titik di jalan. */
export function namaJalanDi(p: Titik): string {
  const iy = (JALAN_Y as readonly number[]).indexOf(p.y);
  if (iy >= 0) return NAMA_JALAN.y[iy];
  const ix = (JALAN_X as readonly number[]).indexOf(p.x);
  if (ix >= 0) return NAMA_JALAN.x[ix];
  return 'Jalan kampung';
}
