import { Link, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ikon } from '@/components/Ikon';
import { Kosong } from '@/components/Kosong';
import { Cap, TepiNota, UratDaun } from '@/components/Motif';
import { Judul, Lencana, SubJudul, Tombol } from '@/components/ui';
import { WARUNG, warungById } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { statusPesanan, TAHAP, type Pesanan } from '@/lib/pesanan';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, warna } from '@/lib/theme';
import { jamDari, statusBuka, tanggal } from '@/lib/waktu';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Pesanan & Riwayat', deskripsi: 'Pesanan berjalan dan riwayat pesanan di demo Pincuk. Lacak kurir per tahap, buka nota, atau pesan lagi menu yang sama.', path: '/pesanan', noindex: true });
}

export default function HalamanPesanan() {
  useJudulDokumen(judulHalaman('Pesanan & Riwayat'));
  const ins = useSafeAreaInsets();
  const now = useSekarang(5000);
  const { s, siap } = useStore();
  const daftar = siap && now ? s.pesanan.map((p) => ({ p, st: statusPesanan(p, now) })) : [];
  const berjalan = daftar.filter((x) => !x.st.selesai);
  const riwayat = daftar.filter((x) => x.st.selesai);

  return (
    <View style={{ flex: 1 }} role="main">
      <View style={[gaya.kepala, { paddingTop: ins.top + 14 }]}>
        <UratDaun />
        <Judul level={1} ukuran={26} warna={warna.kertas}>
          Pesanan
        </Judul>
        <Text style={gaya.kepalaSub}>Nota tersimpan di perangkat ini, lengkap dengan penilaianmu.</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 28 }}>
        {!siap || !now ? (
          <Text style={gaya.catatan}>Memuat pesanan di perangkat ini…</Text>
        ) : (
          <>
            <SubJudul style={{ marginTop: 16, marginBottom: 8 }}>Berjalan</SubJudul>
            {berjalan.length ? (
              <View style={{ gap: 14 }}>
                {berjalan.map(({ p, st }) => (
                  <Nota key={p.id} p={p} label={st.tahap === 0 ? 'Menunggu pembayaran QRIS' : TAHAP[st.tahap].judul} now={now} berjalan />
                ))}
              </View>
            ) : (
              <View style={gaya.kosong}>
                <Kosong
                  jenis="berjalan"
                  judul="Belum ada yang diantar"
                  teks={`${WARUNG.filter((w) => statusBuka(w.jadwal, now).bisaPesan).length} warung bisa pesan sekarang. Pesananmu akan muncul di sini lengkap dengan jam tiba.`}
                  aksi="Lihat warung yang buka"
                  href="/"
                />
              </View>
            )}
            <SubJudul style={{ marginTop: 22, marginBottom: 8 }}>Riwayat</SubJudul>
            {riwayat.length ? (
              <View style={{ gap: 14 }}>
                {riwayat.map(({ p, st }) => (
                  <Nota key={p.id} p={p} label={st.tahap === -1 ? 'Dibatalkan' : 'Sampai'} now={now} />
                ))}
              </View>
            ) : (
              <Text style={gaya.catatan}>Riwayat masih kosong.</Text>
            )}
            <Text style={[gaya.catatan, { marginTop: 18 }]}>Pesanan disimpan di perangkat ini saja (tanpa server). Pesanan bertanda “contoh” sudah disiapkan supaya fitur pesan lagi bisa dicoba.</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Nota({ p, label, now, berjalan }: { p: Pesanan; label: string; now: number; berjalan?: boolean }) {
  const { pesanLagi, s } = useStore();
  const nilai = s.penilaian[p.id];
  const w = warungById(p.warungId);
  const bisa = w ? statusBuka(w.jadwal, now).bisaPesan : false;
  const batal = !!p.batal;
  return (
    <View>
      <TepiNota posisi="atas" />
      <View style={gaya.nota}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={gaya.warung}>{w?.nama}</Text>
            <Text style={gaya.mono}>
              {p.kode} · {tanggal(p.dibuat)}, {jamDari(p.dibuat)}
            </Text>
          </View>
          {!berjalan && !batal ? <Cap teks="SAMPAI" warnaCap={warna.daun} ukuran={72} /> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <Lencana teks={label} latar={batal ? warna.sambalMuda : berjalan ? warna.kunyitMuda : warna.daunMuda} fg={batal ? warna.sambalTua : berjalan ? warna.tinta : warna.daun} />
          <Lencana teks={p.bayar === 'qris' ? 'QRIS (simulasi)' : 'Tunai'} latar={warna.kertas2} />
          {p.contoh ? <Lencana teks="contoh" latar={warna.kertas2} /> : null}
        </View>
        <View style={gaya.garis} />
        {p.item.map((i, n) => (
          <View key={`${i.menuId}-${n}`} style={{ marginVertical: 2 }}>
            <View style={gaya.baris}>
              <Text style={[gaya.mono, { color: warna.tinta, flex: 1 }]}>
                {i.qty}× {i.nama}
              </Text>
              <Text style={[gaya.mono, { color: warna.tinta }]}>{rupiah(i.harga * i.qty)}</Text>
            </View>
            {i.opsiTeks ? <Text style={gaya.monoOpsi}>  {i.opsiTeks}</Text> : null}
          </View>
        ))}
        <View style={gaya.garis} />
        <View style={gaya.baris}>
          <Text style={gaya.total}>Total</Text>
          <Text style={gaya.total}>{rupiah(p.total)}</Text>
        </View>
        {nilai ? (
          <View style={gaya.nilai}>
            <Text style={gaya.nilaiJudul}>Penilaianmu</Text>
            <View style={{ flexDirection: 'row', gap: 2 }} aria-label={`${nilai.nilai} dari 5 cabai`} role="img">
              {[1, 2, 3, 4, 5].map((n) => (
                <Ikon key={n} nama="cabai" ukuran={18} warna={n <= nilai.nilai ? warna.sambal : warna.garisTegas} isi={n <= nilai.nilai ? warna.sambal : undefined} />
              ))}
            </View>
            {nilai.tanda.length ? <Text style={gaya.nilaiTeks}>{nilai.tanda.join(' · ')}</Text> : null}
            {nilai.catatan ? <Text style={gaya.nilaiTeks}>“{nilai.catatan}”</Text> : null}
          </View>
        ) : null}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Link href={`/lacak?id=${p.id}`} asChild>
            <Tombol label={berjalan ? 'Lacak' : 'Lihat nota'} varian={berjalan ? 'utama' : 'garis'} kecil ikon={berjalan ? 'motor' : 'nota'} style={{ flex: 1 }} />
          </Link>
          {!berjalan ? (
            <Tombol
              label={bisa ? 'Pesan lagi' : 'Warung tutup'}
              varian={bisa ? 'gelap' : 'garis'}
              kecil
              ikon="ulang"
              disabled={!bisa}
              style={{ flex: 1 }}
              onPress={() => {
                pesanLagi(p);
                router.push('/keranjang');
              }}
            />
          ) : null}
        </View>
      </View>
      <TepiNota posisi="bawah" />
    </View>
  );
}

const gaya = StyleSheet.create({
  catatan: { fontFamily: huruf.sedang, fontSize: 13.5, lineHeight: 19, color: warna.tinta2 },
  kepala: { backgroundColor: warna.daun, paddingHorizontal: 16, paddingBottom: 16, overflow: 'hidden' },
  kepalaSub: { fontFamily: huruf.sedang, fontSize: 14, lineHeight: 20, color: '#E8F0DD', marginTop: 2 },
  kosong: { backgroundColor: warna.putih, borderRadius: 22, borderWidth: 1, borderColor: warna.garis },
  monoOpsi: { fontFamily: huruf.mono, fontSize: 12, lineHeight: 17, color: warna.daunTua },
  nilai: { marginTop: 10, backgroundColor: '#F2F7EC', borderRadius: 14, padding: 10, gap: 4 },
  nilaiJudul: { fontFamily: huruf.hitam, fontSize: 13.5, color: warna.daunTua },
  nilaiTeks: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta },
  nota: { backgroundColor: warna.putih, paddingHorizontal: 16, paddingVertical: 10 },
  warung: { fontFamily: huruf.hitam, fontSize: 16.5, lineHeight: 22, color: warna.tinta },
  mono: { fontFamily: huruf.mono, fontSize: 12.5, lineHeight: 18, color: warna.tinta2 },
  garis: { borderTopWidth: 1.5, borderColor: warna.garisTegas, borderStyle: 'dashed', marginVertical: 10 },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginVertical: 2 },
  total: { fontFamily: huruf.hitam, fontSize: 16, color: warna.tinta },
});
