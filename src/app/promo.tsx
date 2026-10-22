import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Ikon } from '@/components/Ikon';
import { Layar } from '@/components/Layar';
import { Tombol } from '@/components/ui';
import { PROMO } from '@/lib/data';
import { meta, judulHalaman } from '@/lib/seo';
import { useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Promo Pesan-antar', deskripsi: 'Tiga promo demo Pincuk dengan syarat jelas: potong ongkir Rp4.000, diskon sarapan 10% pagi hari WIB, dan gratis ongkir pesanan bareng.', path: '/promo' });
}

export default function Promo() {
  useJudulDokumen(judulHalaman('Promo Pesan-antar'));
  const { s, siap, pakaiPromo, jumlahItem } = useStore();
  return (
    <Layar judul="Promo" kembali="/">
      <Text style={gaya.kecil}>Satu promo per pesanan. Syarat dicek ulang saat kamu menekan tombol pesan.</Text>
      <View style={{ gap: 14, marginTop: 14 }}>
        {PROMO.map((p) => {
          const dipakai = siap && s.promo === p.kode;
          return (
            <View key={p.kode} style={gaya.tiket}>
              <View style={[gaya.sobek, { backgroundColor: p.warna }]}>
                <Ikon nama="tiket" ukuran={26} warna={p.warna === warna.kunyit ? warna.tinta : '#FFFFFF'} />
              </View>
              <View style={gaya.lubangAtas} />
              <View style={gaya.lubangBawah} />
              <View style={gaya.isi}>
                <Text style={gaya.kode}>{p.kode}</Text>
                <Text style={gaya.judul}>{p.judul}</Text>
                <Text style={gaya.kecil}>{p.syarat}</Text>
                <Tombol
                  label={dipakai ? 'Dipakai di keranjang' : 'Pakai promo ini'}
                  varian={dipakai ? 'garis' : 'gelap'}
                  ikon={dipakai ? 'centang' : undefined}
                  kecil
                  style={{ marginTop: 10, alignSelf: 'flex-start' }}
                  onPress={() => {
                    pakaiPromo(dipakai ? null : p.kode);
                    if (!dipakai && jumlahItem) router.push('/keranjang');
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
      <Text style={[gaya.kecil, { marginTop: 18 }]}>Promo di demo ini rekaan untuk menunjukkan cara kerja kode promo: syarat minimal belanja, jam berlaku (WIB), dan batas jarak.</Text>
    </Layar>
  );
}

const gaya = StyleSheet.create({
  kecil: { fontFamily: huruf.sedang, fontSize: 13.5, lineHeight: 19, color: warna.tinta2 },
  tiket: { flexDirection: 'row', backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, overflow: 'hidden' },
  sobek: { width: 64, alignItems: 'center', justifyContent: 'center', borderRightWidth: 2, borderStyle: 'dashed', borderColor: warna.putih },
  lubangAtas: { position: 'absolute', left: 54, top: -10, width: 20, height: 20, borderRadius: 10, backgroundColor: warna.kertas, borderWidth: 1, borderColor: warna.garis },
  lubangBawah: { position: 'absolute', left: 54, bottom: -10, width: 20, height: 20, borderRadius: 10, backgroundColor: warna.kertas, borderWidth: 1, borderColor: warna.garis },
  isi: { flex: 1, padding: 14, paddingLeft: 18 },
  kode: { fontFamily: huruf.mono, fontSize: 13, letterSpacing: 1.5, color: warna.sambalTua },
  judul: { fontFamily: huruf.display, fontSize: 19, lineHeight: 25, color: warna.tinta, marginVertical: 2 },
});
