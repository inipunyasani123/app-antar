import { Link } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ikon, type NamaIkon } from '@/components/Ikon';
import { LogoPincuk, UratDaun } from '@/components/Motif';
import { Chip, Judul, SubJudul, Tombol } from '@/components/ui';
import { meta, SITUS, judulHalaman } from '@/lib/seo';
import { useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Akun Saya', deskripsi: 'Alamat tersimpan, promo, metode bayar, dan pengaturan data demo Pincuk, aplikasi pesan-antar kuliner fiktif buatan PintuWeb.', path: '/saya' });
}

export default function Saya() {
  useJudulDokumen(judulHalaman('Akun Saya'));
  const ins = useSafeAreaInsets();
  const { s, siap, pilihBayar, resetDemo } = useStore();
  const [yakin, setYakin] = useState(false);
  const [selesai, setSelesai] = useState(false);
  return (
    <View style={{ flex: 1 }} role="main">
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={[gaya.kepala, { paddingTop: ins.top + 16 }]}>
          <UratDaun />
          <Judul level={1} ukuran={26} warna={warna.kertas}>
            Saya
          </Judul>
          <Text style={gaya.sapa}>Kamu masuk sebagai tamu demo. Semua data tersimpan di perangkat ini saja.</Text>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 16 }}>
          <Baris href="/alamat" ikon="pin" judul="Alamat tersimpan" sub={siap ? `${s.alamat.length} alamat` : 'Rumah, kantor, kos'} />
          <Baris href="/promo" ikon="tiket" judul="Promo" sub="3 kode promo, syarat jelas" />
          <Baris href="/pesanan" ikon="nota" judul="Riwayat pesanan" sub="Lihat nota dan pesan lagi" />

          <SubJudul style={{ marginTop: 14 }}>Metode bayar bawaan</SubJudul>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Tunai" ikon="uang" aktif={s.bayar === 'tunai'} onPress={() => pilihBayar('tunai')} />
            <Chip label="QRIS (simulasi)" ikon="qr" aktif={s.bayar === 'qris'} onPress={() => pilihBayar('qris')} />
          </View>

          <View style={gaya.tentang}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LogoPincuk ukuran={44} latar={warna.sambal} />
              <View style={{ flex: 1 }}>
                <Text style={gaya.tentangJudul}>Tentang demo ini</Text>
                <Text style={gaya.kecil}>Pincuk versi 1.0 · React Native + Expo</Text>
              </View>
            </View>
            <Text style={gaya.teks}>
              Pincuk adalah contoh aplikasi pesan-antar buatan PintuWeb, agensi web dan aplikasi yang berlokasi di Tulungagung. Kota Tirtalaya, warung, menu, harga, dan kurir di sini rekaan. Pembayaran
              QRIS hanya simulasi, tidak ada uang yang berpindah.
            </Text>
            <Text style={gaya.teks}>Satu kode yang sama bisa dibangun menjadi aplikasi Android, iOS, dan web.</Text>
            {Platform.OS === 'web' ? (
              <Link href={SITUS.kontak as never} style={gaya.tautan}>
                Pesan aplikasi seperti ini di PintuWeb
              </Link>
            ) : (
              <Tombol label="Pesan aplikasi seperti ini" varian="utama" onPress={() => Linking.openURL(SITUS.kontak)} />
            )}
          </View>

          <SubJudul style={{ marginTop: 14 }}>Data demo</SubJudul>
          <Text style={gaya.kecil}>Menghapus keranjang, pesanan, chat, dan alamat tambahan, lalu mengembalikan contoh awal.</Text>
          {selesai ? (
            <Text style={[gaya.kecil, { color: warna.daun, fontFamily: huruf.tebal }]} aria-live="polite">
              Data demo sudah dikembalikan ke awal.
            </Text>
          ) : yakin ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Tombol label="Ya, hapus" varian="utama" kecil ikon="sampah" onPress={() => { resetDemo(); setYakin(false); setSelesai(true); }} style={{ flex: 1 }} />
              <Tombol label="Batal" varian="garis" kecil onPress={() => setYakin(false)} style={{ flex: 1 }} />
            </View>
          ) : (
            <Tombol label="Atur ulang data demo" varian="garis" kecil ikon="ulang" onPress={() => setYakin(true)} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function Baris({ href, ikon, judul, sub }: { href: string; ikon: NamaIkon; judul: string; sub: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={gaya.baris}>
        <View style={gaya.barisIkon}>
          <Ikon nama={ikon} ukuran={22} warna={warna.sambalTua} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={gaya.barisJudul}>{judul}</Text>
          <Text style={gaya.kecil}>{sub}</Text>
        </View>
        <Ikon nama="kanan" ukuran={20} warna={warna.tinta2} />
      </Pressable>
    </Link>
  );
}

const gaya = StyleSheet.create({
  kepala: { backgroundColor: warna.daun, paddingHorizontal: 16, paddingBottom: 20, overflow: 'hidden' },
  sapa: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 20, color: '#E8F0DD', marginTop: 4 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.putih, borderRadius: radius.besar, padding: 12, borderWidth: 1, borderColor: warna.garis },
  barisIkon: { width: 44, height: 44, borderRadius: 14, backgroundColor: warna.sambalMuda, alignItems: 'center', justifyContent: 'center' },
  barisJudul: { fontFamily: huruf.hitam, fontSize: 15.5, lineHeight: 21, color: warna.tinta },
  kecil: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  tentang: { marginTop: 14, backgroundColor: warna.kunyitMuda, borderRadius: radius.besar, padding: 16, gap: 10 },
  tentangJudul: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 21, color: warna.tinta },
  teks: { fontFamily: huruf.sedang, fontSize: 14, lineHeight: 20, color: warna.tinta },
  tautan: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 24, color: warna.sambalTua, textDecorationLine: 'underline', paddingVertical: 6 },
});
