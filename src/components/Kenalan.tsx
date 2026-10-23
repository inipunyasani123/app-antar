import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { huruf, radius, warna } from '@/lib/theme';
import { Lembar } from './Lembar';
import { Tenda } from './Motif';
import { Tombol } from './ui';

const KARTU = [
  { judul: 'Warung tetangga, jam buka nyata', teks: 'Jam buka tiap warung mengikuti WIB. Kalau warung libur atau istirahat, alasannya ditulis dan tombol pesan dimatikan.' },
  { judul: 'Ongkir dari jarak rute', teks: 'Ongkir dihitung dari panjang jalan di peta Tirtalaya ke alamatmu: Rp6.000 untuk 2 km pertama, lalu Rp1.000 per 500 m.' },
  { judul: 'Pesan, lalu percepat', teks: 'Ini demo: tidak ada uang atau kurir sungguhan. Setelah memesan, tekan "Percepat tahap" untuk melihat pengantaran sampai tiba.' },
];

/** Pengantar sekali tampil (3 kartu, bisa dilewati). Bisa diputar ulang dari tab Saya. */
export function Kenalan({ terbuka, onSelesai }: { terbuka: boolean; onSelesai: () => void }) {
  const [i, setI] = useState(0);
  if (!terbuka) return null;
  const k = KARTU[i];
  const akhir = i === KARTU.length - 1;
  return (
    <Lembar
      terbuka
      judul={k.judul}
      onTutup={onSelesai}
      atas={
        <View style={gaya.atas}>
          <Gambar i={i} />
          <Tenda warnaTenda={warna.daun} tinggi={14} style={{ position: 'absolute', left: 0, right: 0, bottom: -1 }} />
        </View>
      }
      kaki={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Tombol label="Lewati" varian="garis" onPress={onSelesai} style={{ flex: 1 }} />
          <Tombol
            label={akhir ? 'Mulai pesan' : 'Lanjut'}
            ikonKanan={akhir ? undefined : 'kanan'}
            onPress={() => (akhir ? onSelesai() : setI(i + 1))}
            style={{ flex: 1.4 }}
          />
        </View>
      }
    >
      <Text style={gaya.teks}>{k.teks}</Text>
      <View style={gaya.titik} aria-label={`Kartu ${i + 1} dari ${KARTU.length}`} role="img">
        {KARTU.map((_, n) => (
          <View key={n} style={[gaya.bulat, n === i && gaya.bulatAktif]} />
        ))}
      </View>
    </Lembar>
  );
}

function Gambar({ i }: { i: number }) {
  return (
    <Svg width={220} height={120} viewBox="0 0 220 120" aria-hidden focusable={false}>
      {i === 0 ? (
        <>
          <Rect x={40} y={40} width={140} height={62} rx={8} fill={warna.sambal} />
          <Rect x={52} y={52} width={116} height={30} rx={5} fill={warna.putih} />
          <Circle cx={110} cy={30} r={22} fill={warna.putih} stroke={warna.tinta} strokeWidth={4} />
          <Path d="M110 18v12l8 5" stroke={warna.tinta} strokeWidth={4} strokeLinecap="round" fill="none" />
          <Path d="M64 67h40M64 74h24" stroke={warna.garisTegas} strokeWidth={4} strokeLinecap="round" />
        </>
      ) : i === 1 ? (
        <>
          <Rect x={20} y={20} width={180} height={86} rx={14} fill="#F1E4C8" />
          <Path d="M20 62h180M110 20v86" stroke={warna.putih} strokeWidth={10} />
          <Path d="M48 62h62v-28h52" stroke={warna.sambal} strokeWidth={5} strokeDasharray="9 7" fill="none" strokeLinecap="round" />
          <Circle cx={48} cy={62} r={9} fill={warna.daun} />
          <Circle cx={162} cy={34} r={9} fill={warna.tinta} />
        </>
      ) : (
        <>
          <Path d="M60 40h100L118 100a5 5 0 0 1-8 0z" fill={warna.daun} />
          <Path d="M60 40c3-10 25-15 50-15s47 5 50 15z" fill={warna.putih} />
          <Path d="M150 58l20 14-20 14zM170 58l20 14-20 14z" fill={warna.kunyit} stroke={warna.tinta} strokeWidth={3} strokeLinejoin="round" />
        </>
      )}
    </Svg>
  );
}

const gaya = StyleSheet.create({
  atas: { backgroundColor: warna.daunMuda, alignItems: 'center', paddingTop: 18, paddingBottom: 22 },
  teks: { fontFamily: huruf.sedang, fontSize: 15.5, lineHeight: 22, color: warna.tinta },
  titik: { flexDirection: 'row', gap: 6, alignSelf: 'center', marginTop: 4 },
  bulat: { width: 8, height: 8, borderRadius: radius.pil, backgroundColor: warna.garisTegas },
  bulatAktif: { width: 22, backgroundColor: warna.daun },
});
