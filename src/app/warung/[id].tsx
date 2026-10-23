import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BilahKeranjang } from '@/components/BilahKeranjang';
import { Foto } from '@/components/Foto';
import { Ikon } from '@/components/Ikon';
import { IlustrasiMenu } from '@/components/IlustrasiMenu';
import { kembaliKe } from '@/components/Layar';
import { Lembar } from '@/components/Lembar';
import { LembarMenu } from '@/components/LembarMenu';
import { Tenda } from '@/components/Motif';
import { Toast } from '@/components/Toast';
import { Judul, Lencana, Tombol, TombolIkon } from '@/components/ui';
import { StatusWarung, useInfoWarung } from '@/components/Warung';
import { KATEGORI, versiBesar, WARUNG, warungById, type Menu, type PilihanMenu, type Warung } from '@/lib/data';
import { km, rupiah } from '@/lib/harga';
import { useJudulDokumen } from '@/lib/judul';
import { judulHalaman, meta } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { barisJadwal, teksLibur, wib } from '@/lib/waktu';
import HalamanTidakAda from '../+not-found';

export function generateStaticParams() {
  return WARUNG.map((w) => ({ id: w.id }));
}

export function generateMetadata(_req: unknown, params: Record<string, string | string[]>) {
  const w = warungById(String(params.id));
  if (!w) return meta({ judul: 'Warung tidak ditemukan', path: '/warung', noindex: true });
  let desk = `${w.tagline}. Menu, harga, dan jam buka (WIB) ${w.nama}, warung fiktif di demo aplikasi pesan-antar Pincuk.`;
  if (desk.length > 155) desk = desk.slice(0, 152).replace(/\s+\S*$/, '') + '…';
  return meta({ judul: `${w.nama}: Menu & Jam Buka`, deskripsi: desk, path: `/warung/${w.id}` });
}

export default function HalamanWarung() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const w = warungById(String(id));
  if (!w) return <HalamanTidakAda />;
  return <IsiWarung w={w} />;
}

function IsiWarung({ w }: { w: Warung }) {
  useJudulDokumen(judulHalaman(`${w.nama}: Menu & Jam Buka`));
  const ins = useSafeAreaInsets();
  const now = useSekarang(30000);
  const info = useInfoWarung(w, now);
  const { s, siap, tambah, toggleFavorit, lihatWarung } = useStore();
  const [jadwalBuka, setJadwalBuka] = useState(false);
  const [detail, setDetail] = useState<Menu | null>(null);
  const [konflik, setKonflik] = useState<{ m: Menu; pilih?: PilihanMenu; qty?: number; catatan?: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [aktif, setAktif] = useState(0);
  const gulir = useRef<ComponentRef<typeof ScrollView>>(null);
  const posisi = useRef<number[]>([]);
  const tinggiTab = useRef(56);

  useEffect(() => {
    if (siap) lihatWarung(w.id);
  }, [siap, w.id, lihatWarung]);

  const tutupKonflik = useCallback(() => setKonflik(null), []);
  const tutupDetail = useCallback(() => setDetail(null), []);
  const hilangToast = useCallback(() => setToast(null), []);

  const bisaPesan = !!info.status?.bisaPesan && info.terjangkau;
  const alasan = !now ? 'Memeriksa jam buka…' : !info.terjangkau ? 'Alamat aktifmu lebih dari 6 km dari warung ini.' : !info.status?.bisaPesan ? `${info.status?.label}, ${info.status?.ket}.` : undefined;
  const hariIni = now ? wib(now).hari : -1;
  const kat = w.kategori.map((k) => KATEGORI.find((x) => x.id === k)?.nama).join(' · ');
  const libur = teksLibur(w.jadwal);
  const favorit = siap && s.favorit.includes(w.id);
  const wKeranjang = s.keranjang.warungId ? warungById(s.keranjang.warungId) : undefined;
  const qtyDi = (m: Menu) => (siap && s.keranjang.warungId === w.id ? s.keranjang.item.filter((i) => i.menuId === m.id).reduce((n, i) => n + i.qty, 0) : 0);

  const masukkan = (m: Menu, pilih?: PilihanMenu, qty?: number, catatan?: string) => {
    if (tambah(w.id, m.id, { pilih, qty, catatan }) === 'beda-warung') {
      setKonflik({ m, pilih, qty, catatan });
      return false;
    }
    setToast(`${qty ?? 1}× ${m.nama} masuk keranjang`);
    return true;
  };

  const keBagian = (i: number) => {
    const y = posisi.current[i];
    if (y != null) gulir.current?.scrollTo({ y: Math.max(0, y - tinggiTab.current + 2), animated: true });
    setAktif(i);
  };
  const saatGulir = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y + tinggiTab.current + 12;
    let n = 0;
    posisi.current.forEach((p, i) => {
      if (p != null && p <= y) n = i;
    });
    if (n !== aktif) setAktif(n);
  };

  return (
    <View style={{ flex: 1, backgroundColor: warna.kertas }} role="main">
      <ScrollView ref={gulir} contentContainerStyle={{ paddingBottom: 24 }} stickyHeaderIndices={[1]} onScroll={saatGulir} scrollEventThrottle={64}>
        <View>
          <Foto sumber={w.foto} alt={`Foto ilustrasi hidangan ${w.nama}`} style={gaya.sampul} prioritas />
          <View style={[gaya.atas, { top: ins.top + 10 }]}>
            <TombolIkon ikon="kembali" label="Kembali" onPress={() => kembaliKe('/')} />
            <TombolIkon
              ikon="hati"
              label={favorit ? `Hapus ${w.nama} dari favorit` : `Simpan ${w.nama} ke favorit`}
              aria-pressed={favorit}
              warnaIkon={favorit ? warna.sambal : warna.tinta}
              onPress={() => {
                toggleFavorit(w.id);
                setToast(favorit ? 'Dihapus dari warung favorit' : 'Disimpan ke warung favorit');
              }}
            />
          </View>
          <Tenda warnaTenda={w.warna} tinggi={18} style={{ marginTop: -9 }} />
          <View style={gaya.isi}>
            <Text style={gaya.kat}>{kat}</Text>
            <Judul level={1} ukuran={28} style={{ marginTop: 2 }}>
              {w.nama}
            </Judul>
            <Text style={gaya.tagline}>{w.tagline}</Text>
            <View style={{ marginTop: 12 }}>
              <StatusWarung w={w} now={now} besar />
            </View>
            <View style={gaya.chips}>
              <Lencana teks={`±${info.menit} menit`} latar={warna.daunMuda} fg={warna.daunTua} style={gaya.lencana} />
              <Lencana teks={`${km(info.meter)} · ongkir ${info.terjangkau ? rupiah(info.ongkir) : '—'}`} latar={warna.kertas2} style={gaya.lencana} />
              {libur ? <Lencana teks={libur} latar={warna.kunyitMuda} style={gaya.lencana} /> : null}
            </View>
            <Text style={gaya.alamat}>
              {w.alamat} · {w.pemilik}
            </Text>
            <Text style={gaya.cerita}>{w.cerita}</Text>
            <Pressable onPress={() => setJadwalBuka(!jadwalBuka)} role="button" aria-expanded={jadwalBuka} style={gaya.jadwalTombol}>
              <Ikon nama="jam" ukuran={18} warna={warna.tinta} />
              <Text style={gaya.jadwalTombolTeks}>{jadwalBuka ? 'Sembunyikan jam buka' : 'Lihat jam buka (WIB)'}</Text>
            </Pressable>
            {jadwalBuka ? (
              <View style={gaya.jadwal}>
                {barisJadwal(w.jadwal).map((b) => (
                  <View key={b.hari} style={[gaya.jadwalBaris, b.idx === hariIni && gaya.jadwalHariIni]}>
                    <Text style={[gaya.jadwalHari, b.idx === hariIni && { fontFamily: huruf.hitam }]}>
                      {b.hari}
                      {b.idx === hariIni ? ' (hari ini)' : ''}
                    </Text>
                    <Text style={gaya.jadwalJam}>{b.jam}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>

        {/* tab bagian menu, menempel saat digulir */}
        <View style={gaya.tabWadah} onLayout={(e) => (tinggiTab.current = e.nativeEvent.layout.height)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}>
            {w.bagian.map((b, i) => (
              <Pressable key={b.judul} role="button" aria-current={aktif === i ? 'true' : undefined} onPress={() => keBagian(i)} style={[gaya.tab, aktif === i && gaya.tabAktif]}>
                <Text style={[gaya.tabTeks, aktif === i && { color: warna.tinta }]}>
                  {b.judul} <Text style={{ fontFamily: huruf.sedang }}>{b.menu.length}</Text>
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {w.bagian.map((b, i) => (
          <View key={b.judul} style={{ marginTop: 18, paddingHorizontal: 16 }} onLayout={(e) => (posisi.current[i] = e.nativeEvent.layout.y)}>
            <Text style={gaya.bagian} role="heading" aria-level={2}>
              {b.judul}
            </Text>
            <View style={gaya.daftar}>
              {b.menu.map((m, n) => (
                <BarisMenu
                  key={m.id}
                  m={m}
                  terakhir={n === b.menu.length - 1}
                  jumlah={qtyDi(m)}
                  bisa={bisaPesan && !!now}
                  onBuka={() => setDetail(m)}
                  onTambah={() => (m.opsi?.length ? setDetail(m) : masukkan(m))}
                />
              ))}
            </View>
          </View>
        ))}
        <Text style={gaya.catatan}>Warung, pemilik, menu, dan harga rekaan. Foto hanya ilustrasi jenis hidangan (CC0/domain publik).</Text>
      </ScrollView>

      {now && (!info.status?.bisaPesan || !info.terjangkau) ? (
        <View style={gaya.peringatan} role="status">
          <Ikon nama={info.terjangkau ? 'jam' : 'pin'} ukuran={20} warna={warna.sambalTua} />
          <Text style={gaya.peringatanTeks}>
            {!info.terjangkau
              ? 'Alamat aktifmu lebih dari 6 km dari warung ini. Ganti alamat dulu, ya.'
              : info.status?.buka
                ? `Dapur sudah berhenti menerima pesanan (${info.status.ket}).`
                : `${info.status?.label}, ${info.status?.ket}. Menu tetap bisa dilihat.`}
          </Text>
        </View>
      ) : null}
      <BilahKeranjang />
      <Toast teks={toast} onHilang={hilangToast} bawah={siap && s.keranjang.item.length ? 84 : 12} />

      <LembarMenu
        menu={detail}
        fotoBesar={detail?.foto ? versiBesar(detail.foto) : undefined}
        bisa={bisaPesan && !!now && !detail?.habis}
        alasan={detail?.habis ? 'Menu ini habis hari ini.' : alasan}
        onTutup={tutupDetail}
        onTambah={(pilih, qty, catatan) => {
          if (!detail) return;
          const m = detail;
          setDetail(null);
          masukkan(m, pilih, qty, catatan);
        }}
      />
      <Lembar terbuka={!!konflik} judul="Ganti isi keranjang?" onTutup={tutupKonflik}>
        <Text style={gaya.lembarTeks}>Satu pesanan hanya dari satu warung, supaya kurir cukup mampir sekali. Keranjangmu sekarang berisi menu dari {wKeranjang?.nama}.</Text>
        <Tombol
          label={`Kosongkan & pilih ${konflik?.m.nama ?? ''}`}
          onPress={() => {
            if (konflik) tambah(w.id, konflik.m.id, { pilih: konflik.pilih, qty: konflik.qty, catatan: konflik.catatan, ganti: true });
            setKonflik(null);
          }}
        />
        <Link href="/keranjang" asChild>
          <Tombol label="Lihat keranjang lama" varian="garis" onPress={() => setKonflik(null)} />
        </Link>
        <Tombol label="Batal" varian="teks" onPress={() => setKonflik(null)} />
      </Lembar>
    </View>
  );
}

function BarisMenu({ m, terakhir, jumlah, bisa, onBuka, onTambah }: { m: Menu; terakhir: boolean; jumlah: number; bisa: boolean; onBuka: () => void; onTambah: () => void }) {
  const habis = !!m.habis;
  const adaOpsi = !!m.opsi?.length;
  return (
    <View style={[gaya.menu, !terakhir && gaya.menuGaris]}>
      <Pressable onPress={onBuka} role="button" style={gaya.menuKiri}>
        <View style={{ opacity: habis ? 0.55 : 1 }}>
          {m.foto ? <Foto sumber={m.foto} alt="" style={gaya.menuFoto} /> : <IlustrasiMenu jenis={m.ilustrasi ?? 'mangkuk'} ukuran={84} radius={16} />}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={gaya.menuNama}>{m.nama}</Text>
          <Text style={gaya.menuKet} numberOfLines={2}>
            {m.ket}
          </Text>
          <Text style={gaya.menuHarga}>
            {rupiah(m.harga)}
            {adaOpsi ? <Text style={gaya.menuOpsi}> · ada pilihan</Text> : null}
          </Text>
        </View>
      </Pressable>
      <View style={gaya.menuKanan}>
        {jumlah > 0 ? <Lencana teks={`${jumlah} di keranjang`} latar={warna.daunMuda} fg={warna.daunTua} /> : null}
        {habis ? (
          <Lencana teks="Habis hari ini" latar={warna.kertas2} />
        ) : (
          <Tombol
            label={adaOpsi ? 'Pilih' : 'Tambah'}
            aria-label={adaOpsi ? `Pilih ${m.nama}` : `Tambah ${m.nama} ke keranjang`}
            ikon={adaOpsi ? undefined : 'tambah'}
            kecil
            varian={bisa ? 'utama' : 'garis'}
            disabled={!bisa}
            onPress={onTambah}
            style={{ minHeight: 44, paddingHorizontal: 14 }}
          />
        )}
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  sampul: { width: '100%', height: 220 },
  atas: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  isi: { paddingHorizontal: 16, paddingTop: 6 },
  kat: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta2, textTransform: 'uppercase', letterSpacing: 1 },
  tagline: { fontFamily: huruf.sedang, fontSize: 15, lineHeight: 21, color: warna.tinta2, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  lencana: { paddingVertical: 6 },
  alamat: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, color: warna.tinta, marginTop: 12 },
  cerita: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 21, color: warna.tinta, marginTop: 6 },
  jadwalTombol: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, alignSelf: 'flex-start', marginTop: 6 },
  jadwalTombolTeks: { fontFamily: huruf.hitam, fontSize: 14.5, color: warna.sambalTua, textDecorationLine: 'underline' },
  jadwal: { backgroundColor: warna.putih, borderRadius: radius.sedang, borderWidth: 1, borderColor: warna.garis, padding: 6 },
  jadwalBaris: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  jadwalHariIni: { backgroundColor: warna.kunyitMuda },
  jadwalHari: { fontFamily: huruf.tebal, fontSize: 14, color: warna.tinta },
  jadwalJam: { fontFamily: huruf.mono, fontSize: 13.5, color: warna.tinta },
  tabWadah: { backgroundColor: warna.daun, paddingVertical: 8, marginTop: 14 },
  tab: { minHeight: 44, paddingHorizontal: 16, borderRadius: radius.pil, borderWidth: 1.5, borderColor: 'rgba(251,243,228,0.5)', justifyContent: 'center' },
  tabAktif: { backgroundColor: warna.kunyit, borderColor: warna.kunyit },
  tabTeks: { fontFamily: huruf.hitam, fontSize: 14, color: warna.kertas },
  bagian: { fontFamily: huruf.display, fontSize: 19, lineHeight: 25, color: warna.tinta, marginBottom: 8 },
  daftar: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, paddingHorizontal: 12 },
  menu: { paddingVertical: 12, gap: 8 },
  menuGaris: { borderBottomWidth: 1, borderColor: warna.garis, borderStyle: 'dashed' },
  menuKiri: { flexDirection: 'row', gap: 12 },
  menuKanan: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  menuFoto: { width: 84, height: 84, borderRadius: 16 },
  menuNama: { fontFamily: huruf.hitam, fontSize: 15.5, lineHeight: 21, color: warna.tinta },
  menuKet: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  menuHarga: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta, marginTop: 2, fontVariant: ['tabular-nums'] },
  menuOpsi: { fontFamily: huruf.tebal, fontSize: 12.5, color: warna.daun },
  catatan: { fontFamily: huruf.sedang, fontSize: 12.5, lineHeight: 18, color: warna.tinta2, marginTop: 20, paddingHorizontal: 16 },
  lembarTeks: { fontFamily: huruf.sedang, fontSize: 15, lineHeight: 21, color: warna.tinta },
  peringatan: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: warna.sambalMuda, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#EBC2B2' },
  peringatanTeks: { flex: 1, fontFamily: huruf.tebal, fontSize: 14, lineHeight: 20, color: warna.sambalTua },
});
