import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { cariMenu, hargaSatuan, kunciItem, KURIR, pilihanAwal, ringkasPilihan, warungById, type PilihanMenu } from './data';
import { cekPromo, menitJalan, ongkir } from './harga';
import { rute } from './peta';
import { balasanKurir, kodePesanan, lompatanKeTahapBerikut, statusPesanan, type Penilaian, type PesanChat, type Pesanan } from './pesanan';

export type Alamat = { id: string; label: string; detail: string; patokan: string; x: number; y: number };
export type ItemKeranjang = { kunci: string; menuId: string; qty: number; pilih: PilihanMenu; catatan: string };
export type Keranjang = { warungId: string | null; item: ItemKeranjang[]; catatan: string };

export type State = {
  versi: 2;
  favorit: string[];
  cariTerakhir: string[];
  dilihat: string[];
  kenalan: boolean; // pengantar sudah dilihat
  penilaian: Record<string, Penilaian>;
  alamat: Alamat[];
  alamatAktif: string;
  keranjang: Keranjang;
  promo: string | null;
  bayar: 'tunai' | 'qris';
  pesanan: Pesanan[];
  chat: Record<string, PesanChat[]>;
};

const KUNCI = 'pincuk.demo.v1'; // kunci tetap; isi dimigrasi dari versi 1

const ALAMAT_AWAL: Alamat[] = [
  { id: 'rumah', label: 'Rumah', detail: 'Jl. Kenanga Gg. 3 No. 12, Kepatihan', patokan: 'pagar hijau, depan musala', x: 40, y: 125 },
  { id: 'kantor', label: 'Kantor', detail: 'Ruko Jl. Pahlawan Blok B-4, Kauman', patokan: 'lantai 2, sebelah toko fotokopi', x: 190, y: 60 },
];

const KERANJANG_KOSONG: Keranjang = { warungId: null, item: [], catatan: '' };

export const STATE_AWAL: State = {
  versi: 2,
  favorit: [],
  cariTerakhir: [],
  dilihat: [],
  kenalan: false,
  penilaian: {},
  alamat: ALAMAT_AWAL,
  alamatAktif: 'rumah',
  keranjang: KERANJANG_KOSONG,
  promo: null,
  bayar: 'tunai',
  pesanan: [],
  chat: {},
};

/** Dua pesanan contoh supaya riwayat & "pesan lagi" bisa dicoba sejak kunjungan pertama. */
function riwayatContoh(now: number): Pesanan[] {
  const hari = 86400000;
  const buat = (warungId: string, menu: [string, number][], mundur: number, menitWib: number, bayar: 'tunai' | 'qris', alamatId: string): Pesanan => {
    const w = warungById(warungId)!;
    const a = ALAMAT_AWAL.find((x) => x.id === alamatId)!;
    const r = rute({ x: w.x, y: w.y }, a);
    const awalHariWib = Math.floor((now + 7 * 3600000) / hari) * hari - 7 * 3600000;
    const dibuat = awalHariWib - mundur * hari + menitWib * 60000;
    const item = menu.map(([id, qty]) => {
      const m = cariMenu(warungId, id)!;
      const pilih = pilihanAwal(m);
      return { menuId: id, nama: m.nama, harga: hargaSatuan(m, pilih), qty, pilih, opsiTeks: ringkasPilihan(m, pilih) };
    });
    const subtotal = item.reduce((s, i) => s + i.harga * i.qty, 0);
    const ok = ongkir(r.meter);
    return {
      id: `contoh-${warungId}`,
      kode: kodePesanan(dibuat, mundur * 1111),
      warungId,
      item,
      catatan: '',
      alamat: { label: a.label, detail: a.detail, patokan: a.patokan, x: a.x, y: a.y },
      meter: r.meter,
      subtotal,
      ongkir: ok,
      potongan: 0,
      promo: null,
      total: subtotal + ok,
      bayar,
      dibuat,
      dibayar: bayar === 'qris' ? dibuat + 60000 : null,
      batal: null,
      lompat: 0,
      masakMenit: w.masakMenit,
      jalanMenit: menitJalan(r.meter),
      kurirId: KURIR[mundur % KURIR.length].id,
      contoh: true,
    };
  };
  return [
    buat('geprek-sambal-korek', [['geprek', 2], ['es-teh-geprek', 2]], 2, 12 * 60 + 10, 'qris', 'kantor'),
    buat('pecel-bu-ratmi', [['pecel-pincuk', 1], ['rempeyek', 1], ['teh-anget', 1]], 6, 7 * 60 + 5, 'tunai', 'rumah'),
  ];
}

type Aksi =
  | { t: 'muat'; state: State }
  | { t: 'tambah'; warungId: string; item: ItemKeranjang; ganti?: boolean }
  | { t: 'qty'; kunci: string; delta: number }
  | { t: 'kembalikan'; item: ItemKeranjang; indeks: number }
  | { t: 'catatan'; teks: string }
  | { t: 'kosongkan' }
  | { t: 'alamatAktif'; id: string }
  | { t: 'simpanAlamat'; alamat: Alamat }
  | { t: 'hapusAlamat'; id: string }
  | { t: 'promo'; kode: string | null }
  | { t: 'bayar'; metode: 'tunai' | 'qris' }
  | { t: 'pesanan'; p: Pesanan }
  | { t: 'ubahPesanan'; id: string; ubah: Partial<Pesanan> }
  | { t: 'chat'; id: string; pesan: PesanChat[] }
  | { t: 'isiKeranjang'; keranjang: Keranjang }
  | { t: 'favorit'; id: string }
  | { t: 'cari'; q: string | null }
  | { t: 'lihat'; id: string }
  | { t: 'kenalan'; sudah: boolean }
  | { t: 'nilai'; id: string; nilai: Penilaian }
  | { t: 'reset'; state: State };

function reducer(s: State, a: Aksi): State {
  switch (a.t) {
    case 'muat':
    case 'reset':
      return a.state;
    case 'tambah': {
      const k = a.ganti || s.keranjang.warungId !== a.warungId ? { warungId: a.warungId, item: [], catatan: '' } : s.keranjang;
      const ada = k.item.find((i) => i.kunci === a.item.kunci);
      const item = ada ? k.item.map((i) => (i.kunci === a.item.kunci ? { ...i, qty: Math.min(20, i.qty + a.item.qty) } : i)) : [...k.item, a.item];
      return { ...s, keranjang: { ...k, item }, promo: a.ganti ? null : s.promo };
    }
    case 'qty': {
      const item = s.keranjang.item.map((i) => (i.kunci === a.kunci ? { ...i, qty: Math.min(20, i.qty + a.delta) } : i)).filter((i) => i.qty > 0);
      return { ...s, keranjang: item.length ? { ...s.keranjang, item } : { ...s.keranjang, item: [] } };
    }
    case 'kembalikan': {
      const item = [...s.keranjang.item];
      item.splice(Math.min(a.indeks, item.length), 0, a.item);
      return { ...s, keranjang: { ...s.keranjang, item } };
    }
    case 'catatan':
      return { ...s, keranjang: { ...s.keranjang, catatan: a.teks.slice(0, 160) } };
    case 'kosongkan':
      return { ...s, keranjang: KERANJANG_KOSONG, promo: null };
    case 'alamatAktif':
      return { ...s, alamatAktif: a.id };
    case 'simpanAlamat': {
      const ada = s.alamat.some((x) => x.id === a.alamat.id);
      const alamat = ada ? s.alamat.map((x) => (x.id === a.alamat.id ? a.alamat : x)) : [...s.alamat, a.alamat];
      return { ...s, alamat, alamatAktif: a.alamat.id };
    }
    case 'hapusAlamat': {
      const alamat = s.alamat.filter((x) => x.id !== a.id);
      if (!alamat.length) return s;
      return { ...s, alamat, alamatAktif: s.alamatAktif === a.id ? alamat[0].id : s.alamatAktif };
    }
    case 'promo':
      return { ...s, promo: a.kode };
    case 'bayar':
      return { ...s, bayar: a.metode };
    case 'pesanan':
      return { ...s, pesanan: [a.p, ...s.pesanan], keranjang: KERANJANG_KOSONG, promo: null };
    case 'ubahPesanan':
      return { ...s, pesanan: s.pesanan.map((p) => (p.id === a.id ? { ...p, ...a.ubah } : p)) };
    case 'chat':
      return { ...s, chat: { ...s.chat, [a.id]: [...(s.chat[a.id] ?? []), ...a.pesan] } };
    case 'isiKeranjang':
      return { ...s, keranjang: a.keranjang, promo: null };
    case 'favorit':
      return { ...s, favorit: s.favorit.includes(a.id) ? s.favorit.filter((x) => x !== a.id) : [a.id, ...s.favorit] };
    case 'cari':
      if (a.q === null) return { ...s, cariTerakhir: [] };
      return { ...s, cariTerakhir: [a.q, ...s.cariTerakhir.filter((x) => x.toLowerCase() !== a.q!.toLowerCase())].slice(0, 5) };
    case 'lihat':
      if (s.dilihat[0] === a.id) return s;
      return { ...s, dilihat: [a.id, ...s.dilihat.filter((x) => x !== a.id)].slice(0, 6) };
    case 'kenalan':
      return s.kenalan === a.sudah ? s : { ...s, kenalan: a.sudah };
    case 'nilai':
      return { ...s, penilaian: { ...s.penilaian, [a.id]: a.nilai } };
  }
}

/** Migrasi data tersimpan versi 1 (keranjang tanpa pilihan menu). */
function migrasi(x: unknown): State | null {
  const s = x as State & { versi: number };
  if (!s || !Array.isArray(s.alamat) || !Array.isArray(s.pesanan) || !s.keranjang) return null;
  if (s.versi === 2) return s;
  if (s.versi === 1) {
    const item = (s.keranjang.item as unknown as { menuId: string; qty: number }[]).map((i) => ({ kunci: kunciItem(i.menuId, {}), menuId: i.menuId, qty: i.qty, pilih: {}, catatan: '' }));
    return { ...STATE_AWAL, ...s, versi: 2, keranjang: { ...s.keranjang, item } };
  }
  return null;
}

type Nilai = {
  s: State;
  siap: boolean;
  alamat: Alamat;
  jumlahItem: number;
  tambah: (warungId: string, menuId: string, opsi?: { pilih?: PilihanMenu; qty?: number; catatan?: string; ganti?: boolean }) => 'ok' | 'beda-warung';
  qty: (kunci: string, delta: number) => void;
  kembalikan: (item: ItemKeranjang, indeks: number) => void;
  toggleFavorit: (id: string) => void;
  simpanCari: (q: string | null) => void;
  lihatWarung: (id: string) => void;
  setKenalan: (sudah: boolean) => void;
  nilai: (id: string, n: Penilaian) => void;
  catatan: (teks: string) => void;
  kosongkan: () => void;
  pilihAlamat: (id: string) => void;
  simpanAlamat: (a: Alamat) => void;
  hapusAlamat: (id: string) => void;
  pakaiPromo: (kode: string | null) => void;
  pilihBayar: (m: 'tunai' | 'qris') => void;
  buatPesanan: (now: number) => Pesanan | null;
  bayarQris: (id: string, now: number) => void;
  batalkan: (id: string, now: number) => void;
  percepat: (id: string, now: number) => void;
  kirimChat: (id: string, teks: string, now: number) => void;
  pesanLagi: (p: Pesanan) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Nilai | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, STATE_AWAL);
  const [siap, setSiap] = useState(false);
  const sRef = useRef(s);
  sRef.current = s;

  // Muat dari penyimpanan perangkat (localStorage di web) SETELAH hidrasi, supaya HTML statis tetap cocok.
  useEffect(() => {
    let batal = false;
    (async () => {
      let muat: State | null = null;
      try {
        const raw = await AsyncStorage.getItem(KUNCI);
        const x = raw ? JSON.parse(raw) : null;
        muat = migrasi(x);
      } catch {
        /* penyimpanan diblokir: jalan dengan data awal */
      }
      if (batal) return;
      dispatch({ t: 'muat', state: muat ?? { ...STATE_AWAL, pesanan: riwayatContoh(Date.now()) } });
      setSiap(true);
    })();
    return () => {
      batal = true;
    };
  }, []);

  useEffect(() => {
    if (!siap) return;
    const t = setTimeout(() => {
      AsyncStorage.setItem(KUNCI, JSON.stringify(s)).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [s, siap]);

  const alamat = s.alamat.find((a) => a.id === s.alamatAktif) ?? s.alamat[0];
  const jumlahItem = s.keranjang.item.reduce((n, i) => n + i.qty, 0);

  const tambah = useCallback((warungId: string, menuId: string, opsi?: { pilih?: PilihanMenu; qty?: number; catatan?: string; ganti?: boolean }) => {
    const k = sRef.current.keranjang;
    if (!opsi?.ganti && k.warungId && k.warungId !== warungId && k.item.length) return 'beda-warung' as const;
    const m = cariMenu(warungId, menuId);
    if (!m) return 'ok' as const;
    const pilih = opsi?.pilih ?? pilihanAwal(m);
    const catatan = (opsi?.catatan ?? '').trim().slice(0, 80);
    dispatch({ t: 'tambah', warungId, ganti: opsi?.ganti, item: { kunci: kunciItem(menuId, pilih, catatan), menuId, qty: opsi?.qty ?? 1, pilih, catatan } });
    return 'ok' as const;
  }, []);

  const buatPesanan = useCallback((now: number): Pesanan | null => {
    const st = sRef.current;
    const k = st.keranjang;
    const w = k.warungId ? warungById(k.warungId) : undefined;
    const a = st.alamat.find((x) => x.id === st.alamatAktif) ?? st.alamat[0];
    if (!w || !k.item.length || !a) return null;
    const item = k.item.map((i) => {
      const m = cariMenu(w.id, i.menuId)!;
      return { menuId: i.menuId, nama: m.nama, harga: hargaSatuan(m, i.pilih), qty: i.qty, pilih: i.pilih, opsiTeks: ringkasPilihan(m, i.pilih), catatan: i.catatan || undefined };
    });
    const subtotal = item.reduce((n, i) => n + i.harga * i.qty, 0);
    const r = rute({ x: w.x, y: w.y }, a);
    const ok = ongkir(r.meter);
    const promo = cekPromo(st.promo, subtotal, ok, r.meter, now);
    const potongan = promo.ok ? promo.potonganBarang + promo.potonganOngkir : 0;
    const acak = Math.floor(Math.random() * 9000) + 1000;
    const p: Pesanan = {
      id: `p${now.toString(36)}${acak}`,
      kode: kodePesanan(now, acak),
      warungId: w.id,
      item,
      catatan: k.catatan.trim(),
      alamat: { label: a.label, detail: a.detail, patokan: a.patokan, x: a.x, y: a.y },
      meter: r.meter,
      subtotal,
      ongkir: ok,
      potongan,
      promo: promo.ok ? st.promo : null,
      total: subtotal + ok - potongan,
      bayar: st.bayar,
      dibuat: now,
      dibayar: null,
      batal: null,
      lompat: 0,
      masakMenit: w.masakMenit,
      jalanMenit: menitJalan(r.meter),
      kurirId: KURIR[acak % KURIR.length].id,
    };
    dispatch({ t: 'pesanan', p });
    return p;
  }, []);

  const kirimChat = useCallback((id: string, teks: string, now: number) => {
    const p = sRef.current.pesanan.find((x) => x.id === id);
    if (!p || !teks.trim()) return;
    const st = statusPesanan(p, now);
    dispatch({
      t: 'chat',
      id,
      pesan: [
        { id: `k${now}`, dari: 'kamu', teks: teks.trim().slice(0, 300), waktu: now },
        { id: `b${now}`, dari: 'kurir', teks: balasanKurir(teks, p, st), waktu: now + 1600 },
      ],
    });
  }, []);

  // Aksi sederhana dibuat sekali (stabil), supaya aman dipakai sebagai dependensi efek di layar.
  const aksi = useMemo(
    () => ({
      qty: (kunci: string, delta: number) => dispatch({ t: 'qty', kunci, delta }),
      kembalikan: (item: ItemKeranjang, indeks: number) => dispatch({ t: 'kembalikan', item, indeks }),
      toggleFavorit: (id: string) => dispatch({ t: 'favorit', id }),
      simpanCari: (q: string | null) => dispatch({ t: 'cari', q }),
      lihatWarung: (id: string) => dispatch({ t: 'lihat', id }),
      setKenalan: (sudah: boolean) => dispatch({ t: 'kenalan', sudah }),
      nilai: (id: string, n: Penilaian) => dispatch({ t: 'nilai', id, nilai: n }),
      catatan: (teks: string) => dispatch({ t: 'catatan', teks }),
      kosongkan: () => dispatch({ t: 'kosongkan' }),
      pilihAlamat: (id: string) => dispatch({ t: 'alamatAktif', id }),
      simpanAlamat: (al: Alamat) => dispatch({ t: 'simpanAlamat', alamat: al }),
      hapusAlamat: (id: string) => dispatch({ t: 'hapusAlamat', id }),
      pakaiPromo: (kode: string | null) => dispatch({ t: 'promo', kode }),
      pilihBayar: (m: 'tunai' | 'qris') => dispatch({ t: 'bayar', metode: m }),
      bayarQris: (id: string, now: number) => dispatch({ t: 'ubahPesanan', id, ubah: { dibayar: now } }),
      batalkan: (id: string, now: number) => dispatch({ t: 'ubahPesanan', id, ubah: { batal: now } }),
      percepat: (id: string, now: number) => {
        const p = sRef.current.pesanan.find((x) => x.id === id);
        if (p) dispatch({ t: 'ubahPesanan', id, ubah: { lompat: lompatanKeTahapBerikut(p, now) } });
      },
      pesanLagi: (p: Pesanan) =>
        dispatch({
          t: 'isiKeranjang',
          keranjang: {
            warungId: p.warungId,
            item: p.item
              .filter((i) => cariMenu(p.warungId, i.menuId) && !cariMenu(p.warungId, i.menuId)!.habis)
              .map((i) => {
                const m = cariMenu(p.warungId, i.menuId)!;
                const pilih = i.pilih ?? pilihanAwal(m);
                return { kunci: kunciItem(i.menuId, pilih, i.catatan ?? ''), menuId: i.menuId, qty: i.qty, pilih, catatan: i.catatan ?? '' };
              }),
            catatan: p.catatan,
          },
        }),
      resetDemo: () => {
        AsyncStorage.removeItem(KUNCI).catch(() => {});
        dispatch({ t: 'reset', state: { ...STATE_AWAL, kenalan: true, pesanan: riwayatContoh(Date.now()) } });
      },
    }),
    [],
  );

  const nilai = useMemo<Nilai>(() => ({ s, siap, alamat, jumlahItem, tambah, buatPesanan, kirimChat, ...aksi }), [s, siap, alamat, jumlahItem, tambah, buatPesanan, kirimChat, aksi]);

  return <Ctx.Provider value={nilai}>{children}</Ctx.Provider>;
}

export function useStore(): Nilai {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore di luar StoreProvider');
  return v;
}

/** Jam sekarang (ms). null pada render pertama supaya cocok dengan HTML statis; lalu berdetak. */
export function useSekarang(setiapMs = 30000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), setiapMs);
    return () => clearInterval(t);
  }, [setiapMs]);
  return now;
}
