import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { warna } from '@/lib/theme';

export type JenisIlustrasi = 'lemper' | 'nasi' | 'gelas' | 'mangkuk' | 'bungkus';

/** Ilustrasi buatan sendiri untuk menu yang tidak punya foto CC0 yang cocok. */
export function IlustrasiMenu({ jenis, ukuran = 72, radius = 14 }: { jenis: JenisIlustrasi; ukuran?: number; radius?: number }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 72 72" aria-hidden focusable={false}>
      <Rect width={72} height={72} rx={radius} fill={warna.kertas2} />
      <Path d="M0 54h72v18H0z" fill="#EAD9B8" />
      {gambar(jenis)}
    </Svg>
  );
}

function gambar(j: JenisIlustrasi) {
  switch (j) {
    case 'lemper':
      return (
        <>
          <Ellipse cx={36} cy={54} rx={24} ry={4} fill="rgba(43,27,18,0.12)" />
          <Path d="M14 46c0-10 10-16 22-16s22 6 22 16c0 4-4 6-8 6H22c-4 0-8-2-8-6z" fill={warna.daun} />
          <Path d="M20 34l32 16M30 30l26 13" stroke="#8DB27A" strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M50 30l6-6M22 30l-5-5" stroke="#8A7360" strokeWidth={2} strokeLinecap="round" />
        </>
      );
    case 'nasi':
      return (
        <>
          <Ellipse cx={36} cy={50} rx={26} ry={7} fill={warna.putih} stroke={warna.garisTegas} strokeWidth={1.5} />
          <Path d="M18 48c0-11 8-18 18-18s18 7 18 18z" fill="#FFFDF8" stroke={warna.garisTegas} strokeWidth={1.2} />
          <Path d="M27 38h2M34 34h2M41 39h2M31 43h2M39 44h2" stroke={warna.garisTegas} strokeWidth={1.6} strokeLinecap="round" />
        </>
      );
    case 'gelas':
      return (
        <>
          <Path d="M24 22h24l-3 32H27z" fill="#C98F4E" opacity={0.85} />
          <Path d="M24 22h24l-0.6 7H24.6z" fill="#FFFDF8" opacity={0.7} />
          <Path d="M24 22h24l-3 32H27z" fill="none" stroke={warna.tinta2} strokeWidth={1.6} />
          <Path d="M32 16c-2 2 2 3 0 5M40 16c-2 2 2 3 0 5" stroke={warna.tinta2} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </>
      );
    case 'bungkus':
      return (
        <>
          <Path d="M16 50l20-24 20 24z" fill="#B88A5A" />
          <Path d="M16 50h40l-4 4H20z" fill="#9E6B4F" />
          <Path d="M26 38l20 0" stroke={warna.kertas} strokeWidth={2.4} strokeLinecap="round" />
          <Circle cx={36} cy={32} r={2.4} fill={warna.sambal} />
        </>
      );
    default:
      return (
        <>
          <Path d="M14 36h44c0 12-10 20-22 20s-22-8-22-20z" fill={warna.putih} stroke={warna.garisTegas} strokeWidth={1.5} />
          <Ellipse cx={36} cy={36} rx={22} ry={4} fill="#D9A35E" />
          <Path d="M30 26c-2 2 2 3 0 5M38 24c-2 2 2 3 0 5" stroke={warna.tinta2} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </>
      );
  }
}
