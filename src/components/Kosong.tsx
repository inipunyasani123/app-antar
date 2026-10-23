import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { huruf, warna } from '@/lib/theme';
import { Tombol } from './ui';

export type JenisKosong = 'lacak' | 'chat' | 'berjalan' | 'keranjang' | 'cari';

/** Keadaan kosong bermotif Pincuk: ilustrasi sendiri + satu kalimat + satu aksi. */
export function Kosong({ jenis, judul, teks, aksi, href, sisi }: { jenis: JenisKosong; judul: string; teks: string; aksi?: string; href?: string; sisi?: ReactNode }) {
  return (
    <View style={gaya.wadah}>
      <IlustrasiKosong jenis={jenis} />
      <Text style={gaya.judul} role="heading" aria-level={2}>
        {judul}
      </Text>
      <Text style={gaya.teks}>{teks}</Text>
      {aksi && href ? (
        <Link href={href as never} asChild>
          <Tombol label={aksi} ikonKanan="kanan" style={{ marginTop: 6 }} />
        </Link>
      ) : null}
      {sisi}
    </View>
  );
}

function IlustrasiKosong({ jenis }: { jenis: JenisKosong }) {
  return (
    <Svg width={170} height={124} viewBox="0 0 170 124" aria-hidden focusable={false}>
      <Ellipse cx={85} cy={114} rx={66} ry={7} fill="rgba(43,27,18,0.12)" />
      {/* tenda kecil di latar */}
      <Path d="M22 26h126l-6 12H28z" fill={warna.daun} />
      <Path d="M28 38a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0a6 6 0 0 0 12 0" fill={warna.daun} />
      <Path d="M30 26V12M140 26V12" stroke={warna.tinta2} strokeWidth={3} />
      {jenis === 'lacak' ? (
        <G>
          {/* motor parkir, kotak antar kosong */}
          <Circle cx={60} cy={100} r={12} fill={warna.tinta} />
          <Circle cx={118} cy={100} r={12} fill={warna.tinta} />
          <Circle cx={60} cy={100} r={5} fill={warna.garisTegas} />
          <Circle cx={118} cy={100} r={5} fill={warna.garisTegas} />
          <Path d="M50 96c1-10 7-15 18-15h28c5 0 7-2 9-6l6-12h6l-3 12c7 5 11 11 12 21h-9c-2-6-6-10-12-10H70c-7 0-11 4-12 10z" fill="#2F5D8A" />
          <Rect x={46} y={58} width={28} height={24} rx={4} fill={warna.kunyit} />
          <Path d="M52 66h16" stroke={warna.tinta} strokeOpacity={0.3} strokeWidth={2} />
          <Path d="M122 60c0-7 5-11 11-11s11 4 11 11v3h-22z" fill="#2F5D8A" />
          <Path d="M131 52h12c1 2 1 6 0 9h-11c-2-3-2-6-1-9z" fill={warna.tinta} />
        </G>
      ) : jenis === 'chat' ? (
        <G>
          <Rect x={30} y={50} width={70} height={36} rx={14} fill={warna.putih} stroke={warna.garisTegas} strokeWidth={2} />
          <Path d="M44 86l-6 12 16-12z" fill={warna.putih} stroke={warna.garisTegas} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M44 64h42M44 73h26" stroke={warna.garisTegas} strokeWidth={3} strokeLinecap="round" />
          <Path d="M104 82c0-12 9-20 20-20s20 8 20 20v6h-40z" fill="#2E6B3B" />
          <Path d="M114 72h22c2 3 2 9 0 13h-22c-2-4-2-10 0-13z" fill={warna.tinta} />
          <Rect x={104} y={86} width={40} height={6} rx={3} fill="#2E6B3B" />
        </G>
      ) : jenis === 'cari' ? (
        <G>
          <Circle cx={78} cy={74} r={22} fill={warna.putih} stroke={warna.tinta} strokeWidth={5} />
          <Path d="M94 90l18 18" stroke={warna.tinta} strokeWidth={7} strokeLinecap="round" />
          <Path d="M70 70c3-4 9-4 12 0" stroke={warna.sambal} strokeWidth={3} strokeLinecap="round" fill="none" />
        </G>
      ) : (
        <G>
          {/* pincuk kosong dengan uap */}
          <Path d="M48 56h74L90 106a5 5 0 0 1-8 0z" fill={warna.daun} />
          <Path d="M85 58v44M85 70l-15-10M85 82l-11-9M85 70l15-10M85 82l11-9" stroke="#8DB27A" strokeWidth={2.2} strokeLinecap="round" />
          <Path d="M48 56h74l-4 6H52z" fill={warna.daunTua} />
          {jenis === 'berjalan' ? <Path d="M72 46c-3 4 3 7 0 11M85 42c-3 4 3 7 0 11M98 46c-3 4 3 7 0 11" stroke={warna.garisTegas} strokeWidth={3} strokeLinecap="round" fill="none" /> : null}
        </G>
      )}
    </Svg>
  );
}

/** Ilustrasi "pesanan sampai": tangan kurir berhelm menyerahkan bungkusan pincuk. Tanpa wajah. */
export function SerahPincuk({ helm = '#2F5D8A', jaket = warna.sambal }: { helm?: string; jaket?: string }) {
  return (
    <Svg width={210} height={150} viewBox="0 0 210 150" aria-hidden focusable={false}>
      <Ellipse cx={105} cy={142} rx={86} ry={7} fill="rgba(43,27,18,0.12)" />
      <Circle cx={105} cy={70} r={62} fill={warna.kunyitMuda} />
      {/* kurir */}
      <Path d="M22 142c3-30 18-46 40-46s34 16 37 46z" fill={jaket} />
      <Path d="M60 98v44" stroke="rgba(255,255,255,0.45)" strokeWidth={3} />
      <Path d="M36 74c0-17 12-28 26-28s26 11 26 28v8H36z" fill={helm} />
      <Path d="M44 66c0-5 4-9 9-9h20c5 0 9 4 9 9v8H44z" fill={warna.tinta} />
      <Path d="M52 62h10" stroke="rgba(255,255,255,0.55)" strokeWidth={3} strokeLinecap="round" />
      <Rect x={36} y={80} width={52} height={7} rx={3.5} fill={helm} />
      {/* lengan menyerahkan */}
      <Path d="M84 110c14-6 28-10 44-12" stroke={jaket} strokeWidth={14} strokeLinecap="round" />
      <Circle cx={131} cy={97} r={7} fill="#7A5236" />
      {/* bungkusan pincuk */}
      <Path d="M118 74h40l-17 30a3 3 0 0 1-5 0z" fill={warna.daun} />
      <Path d="M138 76v24M138 84l-7-5M138 90l-5-4M138 84l7-5M138 90l5-4" stroke="#8DB27A" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M118 74c2-6 9-9 20-9s18 3 20 9z" fill="#FFFDF8" />
      <Circle cx={132} cy={70} r={2.4} fill={warna.sambal} />
      <Path d="M128 58c-2 3 2 5 0 8M140 54c-2 3 2 5 0 8M150 58c-2 3 2 5 0 8" stroke={warna.tinta2} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      {/* tangan penerima */}
      <Path d="M196 118c-14-2-28-8-40-12" stroke="#C98F6E" strokeWidth={13} strokeLinecap="round" />
      <Path d="M200 112v26" stroke={warna.daun} strokeWidth={10} />
    </Svg>
  );
}

const gaya = StyleSheet.create({
  wadah: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 8, gap: 8 },
  judul: { fontFamily: huruf.display, fontSize: 21, lineHeight: 27, color: warna.tinta, textAlign: 'center' },
  teks: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 21, color: warna.tinta2, textAlign: 'center', maxWidth: 310 },
});
