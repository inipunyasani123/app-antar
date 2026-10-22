import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BilahKeranjang } from '@/components/BilahKeranjang';
import { Foto } from '@/components/Foto';
import { Ikon } from '@/components/Ikon';
import { IlustrasiMenu } from '@/components/IlustrasiMenu';
import { kembaliKe } from '@/components/Layar';
import { Lembar } from '@/components/Lembar';
import { Tenda } from '@/components/Motif';
import { Judul, Lencana, SubJudul, Tombol, TombolIkon } from '@/components/ui';
import { StatusWarung, useInfoWarung } from '@/components/Warung';
import { KATEGORI, WARUNG, warungById, type Menu, type Warung } from '@/lib/data';
import { km, menitJalan, rupiah } from '@/lib/harga';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { barisJadwal, wib } from '@/lib/waktu';
import HalamanTidakAda from '../+not-found';
import { useJudulDokumen } from '@/lib/judul';

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
  const { s, siap, tambah, qty } = useStore();
  const [jadwalBuka, setJadwalBuka] = useState(false);
  const [konflik, setKonflik] = useState<Menu | null>(null);
  const tutupLembar = useCallback(() => setKonflik(null), []);

  const bisaPesan = !!info.status?.bisaPesan && info.terjangkau;
  const hariIni = now ? wib(now).hari : -1;
  const kat = w.kategori.map((k) => KATEGORI.find((x) => x.id === k)?.nama).join(' · ');
  const wKeranjang = s.keranjang.warungId ? warungById(s.keranjang.warungId) : undefined;
  const qtyDi = (m: Menu) => (siap && s.keranjang.warungId === w.id ? (s.keranjang.item.find((i) => i.menuId === m.id)?.qty ?? 0) : 0);

  const pilih = (m: Menu) => {
    if (tambah(w.id, m.id) === 'beda-warung') setKonflik(m);
  };

  return (
    <View style={{ flex: 1, backgroundColor: warna.kertas }} role="main">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View>
          <Foto sumber={w.foto} alt={`Foto ilustrasi hidangan ${w.nama}`} style={gaya.sampul} prioritas />
          <View style={[gaya.atas, { top: ins.top + 10 }]}>
            <TombolIkon ikon="kembali" label="Kembali" onPress={() => kembaliKe('/')} />
          </View>
          <Tenda warnaTenda={w.warna} tinggi={18} style={{ marginTop: -9 }} />
        </View>
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
            <Lencana teks={`${km(info.meter)} · ongkir ${info.terjangkau ? rupiah(info.ongkir) : '—'}`} latar={warna.kertas2} style={{ paddingVertical: 6 }} />
            <Lencana teks={`±${w.masakMenit + menitJalan(info.meter)} menit`} latar={warna.kertas2} style={{ paddingVertical: 6 }} />
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

          {w.bagian.map((b) => (
            <View key={b.judul} style={{ marginTop: 22 }}>
              <SubJudul style={{ marginBottom: 8 }}>{b.judul}</SubJudul>
              <View style={gaya.daftar}>
                {b.menu.map((m, i) => (
                  <BarisMenu key={m.id} m={m} terakhir={i === b.menu.length - 1} jumlah={qtyDi(m)} bisa={bisaPesan && !!now} onTambah={() => pilih(m)} onKurang={() => qty(m.id, -1)} />
                ))}
              </View>
            </View>
          ))}
          <Text style={gaya.catatan}>Warung, pemilik, menu, dan harga rekaan. Foto hanya ilustrasi jenis hidangan (CC0/domain publik).</Text>
        </View>
      </ScrollView>
      {now && (!info.status?.bisaPesan || !info.terjangkau) ? (
        <View style={gaya.peringatan} role="status">
          <Ikon nama={info.terjangkau ? 'jam' : 'pin'} ukuran={20} warna={warna.sambalTua} />
          <Text style={gaya.peringatanTeks}>
            {!info.terjangkau
              ? 'Alamat aktifmu lebih dari 6 km dari warung ini. Ganti alamat dulu, ya.'
              : info.status?.buka
                ? `Dapur sudah berhenti menerima pesanan (${info.status.ket}).`
                : `Warung sedang tutup, ${info.status?.ket}. Menu tetap bisa dilihat.`}
          </Text>
        </View>
      ) : null}
      <BilahKeranjang />
      <Lembar terbuka={!!konflik} judul="Ganti isi keranjang?" onTutup={tutupLembar}>
        <Text style={gaya.lembarTeks}>
          Satu pesanan hanya dari satu warung, supaya kurir cukup mampir sekali. Keranjangmu sekarang berisi menu dari {wKeranjang?.nama}.
        </Text>
        <Tombol
          label={`Kosongkan & pilih ${konflik?.nama ?? ''}`}
          onPress={() => {
            if (konflik) tambah(w.id, konflik.id, true);
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

function BarisMenu({ m, terakhir, jumlah, bisa, onTambah, onKurang }: { m: Menu; terakhir: boolean; jumlah: number; bisa: boolean; onTambah: () => void; onKurang: () => void }) {
  const habis = !!m.habis;
  return (
    <View style={[gaya.menu, !terakhir && gaya.menuGaris]}>
      <View style={{ opacity: habis ? 0.55 : 1 }}>
        {m.foto ? <Foto sumber={m.foto} alt={`Foto ilustrasi ${m.nama.toLowerCase()}`} style={gaya.menuFoto} /> : <IlustrasiMenu jenis={m.ilustrasi ?? 'mangkuk'} ukuran={84} radius={16} />}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={gaya.menuNama}>{m.nama}</Text>
        <Text style={gaya.menuKet}>{m.ket}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, gap: 8 }}>
          <Text style={gaya.menuHarga}>{rupiah(m.harga)}</Text>
          {habis ? (
            <Lencana teks="Habis hari ini" latar={warna.kertas2} />
          ) : jumlah > 0 ? (
            <View style={gaya.stepper}>
              <TombolIkon ikon="kurang" label={`Kurangi ${m.nama}`} ukuran={36} onPress={onKurang} />
              <Text style={gaya.stepperAngka} aria-label={`${jumlah} di keranjang`}>
                {jumlah}
              </Text>
              <TombolIkon ikon="tambah" label={`Tambah ${m.nama}`} ukuran={36} latar={warna.sambal} warnaIkon="#FFFFFF" onPress={onTambah} disabled={!bisa} />
            </View>
          ) : (
            <Tombol label="Tambah" aria-label={`Tambah ${m.nama} ke keranjang`} ikon="tambah" kecil varian={bisa ? 'utama' : 'garis'} disabled={!bisa} onPress={onTambah} style={{ minHeight: 38, paddingHorizontal: 12 }} />
          )}
        </View>
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  sampul: { width: '100%', height: 220 },
  atas: { position: 'absolute', left: 16 },
  isi: { paddingHorizontal: 16, paddingTop: 6 },
  kat: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta2, textTransform: 'uppercase', letterSpacing: 1 },
  tagline: { fontFamily: huruf.sedang, fontSize: 15, lineHeight: 21, color: warna.tinta2, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  alamat: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, color: warna.tinta, marginTop: 12 },
  cerita: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 21, color: warna.tinta, marginTop: 6 },
  jadwalTombol: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44, alignSelf: 'flex-start', marginTop: 6 },
  jadwalTombolTeks: { fontFamily: huruf.hitam, fontSize: 14.5, color: warna.sambalTua, textDecorationLine: 'underline' },
  jadwal: { backgroundColor: warna.putih, borderRadius: radius.sedang, borderWidth: 1, borderColor: warna.garis, padding: 6 },
  jadwalBaris: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  jadwalHariIni: { backgroundColor: warna.kunyitMuda },
  jadwalHari: { fontFamily: huruf.tebal, fontSize: 14, color: warna.tinta },
  jadwalJam: { fontFamily: huruf.mono, fontSize: 13.5, color: warna.tinta },
  peringatan: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: warna.sambalMuda, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#EBC2B2' },
  peringatanTeks: { flex: 1, fontFamily: huruf.tebal, fontSize: 14, lineHeight: 20, color: warna.sambalTua },
  daftar: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, paddingHorizontal: 12 },
  menu: { flexDirection: 'row', gap: 12, paddingVertical: 12 },
  menuGaris: { borderBottomWidth: 1, borderColor: warna.garis, borderStyle: 'dashed' },
  menuFoto: { width: 84, height: 84, borderRadius: 16 },
  menuNama: { fontFamily: huruf.hitam, fontSize: 15.5, lineHeight: 21, color: warna.tinta },
  menuKet: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  menuHarga: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperAngka: { fontFamily: huruf.hitam, fontSize: 16, minWidth: 18, textAlign: 'center', color: warna.tinta },
  catatan: { fontFamily: huruf.sedang, fontSize: 12.5, lineHeight: 18, color: warna.tinta2, marginTop: 20 },
  lembarTeks: { fontFamily: huruf.sedang, fontSize: 15, lineHeight: 21, color: warna.tinta },
});
