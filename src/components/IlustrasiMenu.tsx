import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import { warna } from '@/lib/theme';

export type JenisIlustrasi = 'lemper' | 'nasi' | 'gelas' | 'mangkuk' | 'bungkus' | 'rujak' | 'ronde' | 'angsle' | 'penyet' | 'empal';

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
    case 'rujak':
      return (
        <>
          <Ellipse cx={36} cy={50} rx={27} ry={8} fill={warna.putih} stroke={warna.garisTegas} strokeWidth={1.5} />
          <Path d="M14 46c4-10 40-10 44 0-6 6-38 6-44 0z" fill="#4A2E1F" />
          <Rect x={22} y={38} width={8} height={7} rx={1.5} fill="#FFFDF8" />
          <Rect x={33} y={36} width={8} height={7} rx={1.5} fill="#E9C27A" />
          <Rect x={44} y={39} width={7} height={6} rx={1.5} fill="#FFFDF8" />
          <Path d="M28 33c3-4 8-4 10 0M40 32c2-3 6-3 8 1" stroke={warna.daun} strokeWidth={2.4} strokeLinecap="round" fill="none" />
          <Circle cx={30} cy={47} r={1.6} fill={warna.sambal} />
        </>
      );
    case 'ronde':
      return (
        <>
          <Path d="M14 34h44c0 13-10 21-22 21S14 47 14 34z" fill={warna.putih} stroke={warna.garisTegas} strokeWidth={1.5} />
          <Ellipse cx={36} cy={34} rx={22} ry={4.5} fill="#C9853E" />
          <Circle cx={28} cy={33} r={4} fill="#F4D7DA" />
          <Circle cx={37} cy={32} r={4} fill="#FFFDF8" />
          <Circle cx={45} cy={34} r={3.6} fill="#CFE3B8" />
          <Path d="M28 22c-2 2 2 3 0 5M38 20c-2 2 2 3 0 5M46 23c-2 2 2 3 0 5" stroke={warna.tinta2} strokeWidth={1.6} strokeLinecap="round" fill="none" />
        </>
      );
    case 'angsle':
      return (
        <>
          <Path d="M14 34h44c0 13-10 21-22 21S14 47 14 34z" fill={warna.putih} stroke={warna.garisTegas} strokeWidth={1.5} />
          <Ellipse cx={36} cy={34} rx={22} ry={4.5} fill="#F6EEDC" />
          <Rect x={25} y={30} width={6} height={5} rx={1} fill="#E3C79C" />
          <Rect x={39} y={29} width={6} height={5} rx={1} fill="#E3C79C" />
          <Path d="M31 33c2-2 5-2 7 0" stroke="#D8708A" strokeWidth={2.2} strokeLinecap="round" fill="none" />
          <Circle cx={47} cy={34} r={1.6} fill="#7FA36A" />
          <Circle cx={23} cy={35} r={1.6} fill="#7FA36A" />
        </>
      );
    case 'penyet':
      return (
        <>
          <Ellipse cx={36} cy={50} rx={26} ry={8} fill="#8A7360" />
          <Ellipse cx={36} cy={47} rx={24} ry={7} fill="#A88B72" />
          <Rect x={20} y={38} width={13} height={9} rx={2} fill="#E3C79C" transform="rotate(-8 26 42)" />
          <Rect x={36} y={39} width={14} height={8} rx={2} fill="#C98F4E" transform="rotate(6 43 43)" />
          <Path d="M24 44c4 3 20 3 26-1" stroke={warna.sambal} strokeWidth={3.4} strokeLinecap="round" fill="none" />
          <Path d="M52 34l6-6M50 32l4-7" stroke={warna.daun} strokeWidth={2.2} strokeLinecap="round" />
        </>
      );
    case 'empal':
      return (
        <>
          <Ellipse cx={36} cy={50} rx={26} ry={7} fill={warna.putih} stroke={warna.garisTegas} strokeWidth={1.5} />
          <Path d="M18 44c2-9 12-12 20-11 9 1 16 5 16 11-8 4-28 5-36 0z" fill="#7A4A2E" />
          <Path d="M24 40l20 1M26 44l22 0" stroke="#A86A43" strokeWidth={1.6} strokeLinecap="round" />
          <Path d="M50 36c3-2 6-1 7 2" stroke={warna.daun} strokeWidth={2.2} strokeLinecap="round" fill="none" />
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
