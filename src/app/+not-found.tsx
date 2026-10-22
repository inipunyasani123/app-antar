import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, Text as SvgText } from 'react-native-svg';
import { Layar } from '@/components/Layar';
import { Judul, Tombol } from '@/components/ui';
import { meta, judulHalaman } from '@/lib/seo';
import { huruf, warna } from '@/lib/theme';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Halaman Tidak Ada', deskripsi: 'Halaman yang kamu cari tidak ada di demo Pincuk. Kembali ke beranda untuk memilih warung.', path: '/404', noindex: true });
}

/** 404 bergaya: gerobak dengan papan "TUTUP". */
export default function HalamanTidakAda() {
  useJudulDokumen(judulHalaman('Halaman Tidak Ada'));
  return (
    <Layar tanpaKepala>
      <View style={gaya.wadah}>
        <Svg width={220} height={170} viewBox="0 0 220 170" aria-hidden focusable={false}>
          <Ellipse cx={110} cy={160} rx={86} ry={7} fill="rgba(43,27,18,0.12)" />
          <Rect x={40} y={70} width={130} height={62} rx={6} fill={warna.sambal} />
          <Rect x={50} y={80} width={110} height={30} rx={4} fill={warna.putih} />
          <Path d="M36 46h138l-8 16H44z" fill={warna.kunyit} />
          <Path d="M44 62a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0a7 7 0 0 0 14 0" fill={warna.kunyit} />
          <Path d="M48 46V22M162 46V22" stroke={warna.tinta} strokeWidth={4} />
          <Circle cx={68} cy={146} r={14} fill={warna.tinta} />
          <Circle cx={68} cy={146} r={5} fill={warna.garisTegas} />
          <Circle cx={150} cy={146} r={14} fill={warna.tinta} />
          <Circle cx={150} cy={146} r={5} fill={warna.garisTegas} />
          <Path d="M170 100h30" stroke={warna.tinta} strokeWidth={5} strokeLinecap="round" />
          <Rect x={76} y={6} width={58} height={22} rx={4} fill={warna.tinta} transform="rotate(-6 105 17)" />
          <SvgText x={105} y={22} fontSize={13} fontFamily={huruf.hitam as string} fill={warna.kertas} textAnchor="middle" letterSpacing={2} transform="rotate(-6 105 17)">
            TUTUP
          </SvgText>
        </Svg>
        <Judul level={1} ukuran={30} style={{ textAlign: 'center', marginTop: 10 }}>
          Gerobaknya sudah pindah
        </Judul>
        <Text style={gaya.teks}>Halaman ini tidak ada atau warungnya sudah tidak mangkal di sini. Coba cari dari beranda.</Text>
        <Link href="/" asChild>
          <Tombol label="Kembali ke beranda" ikon="beranda" style={{ marginTop: 18 }} />
        </Link>
      </View>
    </Layar>
  );
}

const gaya = StyleSheet.create({
  wadah: { alignItems: 'center', paddingTop: 64, paddingHorizontal: 8 },
  teks: { fontFamily: huruf.sedang, fontSize: 15.5, lineHeight: 22, color: warna.tinta2, textAlign: 'center', marginTop: 8, maxWidth: 300 },
});
