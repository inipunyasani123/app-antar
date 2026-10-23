import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BilahKeranjang } from '@/components/BilahKeranjang';
import { Foto } from '@/components/Foto';
import { Layar } from '@/components/Layar';
import { KartuWarungRingkas } from '@/components/Warung';
import { KATEGORI, WARUNG } from '@/lib/data';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import HalamanTidakAda from '../+not-found';
import { useJudulDokumen } from '@/lib/judul';

export function generateStaticParams() {
  return KATEGORI.map((k) => ({ id: k.id }));
}

export function generateMetadata(_req: unknown, params: Record<string, string | string[]>) {
  const k = KATEGORI.find((x) => x.id === String(params.id));
  if (!k) return meta({ judul: 'Kategori tidak ditemukan', path: '/kategori', noindex: true });
  return meta({ judul: `${k.sapaan} di Tirtalaya`, deskripsi: k.ket, path: `/kategori/${k.id}` });
}

export default function HalamanKategori() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const k = KATEGORI.find((x) => x.id === String(id));
  const now = useSekarang(30000);
  useJudulDokumen(judulHalaman(k ? `${k.sapaan} di Tirtalaya` : 'Halaman Tidak Ada'));
  if (!k) return <HalamanTidakAda />;
  const daftar = WARUNG.filter((w) => w.kategori.includes(k.id));
  return (
    <View style={{ flex: 1 }}>
      <Layar judul={k.sapaan} kembali="/">
        <View style={gaya.sampul}>
          <Foto sumber={k.foto} alt="" style={gaya.foto} prioritas />
          <View style={gaya.label}>
            <Text style={gaya.ket}>{k.ket}</Text>
          </View>
        </View>
        <Text style={gaya.jumlah}>{daftar.length} warung · jam buka mengikuti WIB</Text>
        <View style={{ gap: 10 }}>
          {daftar.map((w) => (
            <KartuWarungRingkas key={w.id} w={w} now={now} />
          ))}
        </View>
      </Layar>
      <BilahKeranjang />
    </View>
  );
}

const gaya = StyleSheet.create({
  sampul: { borderRadius: radius.besar, overflow: 'hidden', height: 170, justifyContent: 'flex-end', backgroundColor: warna.kertas2 },
  foto: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  label: { backgroundColor: warna.putih, margin: 10, borderRadius: 14, padding: 10 },
  ket: { fontFamily: huruf.sedang, fontSize: 14, lineHeight: 20, color: warna.tinta },
  jumlah: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, color: warna.tinta2, marginTop: 14, marginBottom: 10 },
});
