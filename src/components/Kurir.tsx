import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { warna } from '@/lib/theme';

/**
 * Ilustrasi kurir buatan sendiri: helm berkaca gelap (tanpa wajah), jaket, motor, dan kotak antar.
 * Semua kurir di demo ini tokoh fiktif.
 */
export function KurirMotor({ lebar = 160, helm = '#2F5D8A', jaket = warna.sambal, motor = '#2F5D8A' }: { lebar?: number; helm?: string; jaket?: string; motor?: string }) {
  const tinggi = (lebar * 120) / 160;
  return (
    <Svg width={lebar} height={tinggi} viewBox="0 0 160 120" aria-hidden focusable={false}>
      <Ellipse cx={82} cy={113} rx={64} ry={5} fill="rgba(43,27,18,0.14)" />
      <Path d="M4 62h18M8 72h14M2 82h18" stroke={warna.garisTegas} strokeWidth={3} strokeLinecap="round" />
      {/* roda */}
      <Circle cx={40} cy={96} r={16} fill={warna.tinta} />
      <Circle cx={40} cy={96} r={7} fill={warna.garisTegas} />
      <Circle cx={124} cy={96} r={16} fill={warna.tinta} />
      <Circle cx={124} cy={96} r={7} fill={warna.garisTegas} />
      {/* bodi motor */}
      <Path d="M28 90c1-14 9-20 24-20h40c6 0 9-3 12-9l9-18h8l-4 17c9 6 15 15 16 30H112c-2-9-9-14-17-14H62c-9 0-15 6-17 14z" fill={motor} />
      <Path d="M58 76h40" stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} strokeLinecap="round" />
      <Circle cx={128} cy={61} r={4} fill={warna.kunyitMuda} />
      <Rect x={46} y={63} width={36} height={8} rx={4} fill={warna.tinta} />
      {/* kotak antar */}
      <Rect x={20} y={28} width={36} height={34} rx={5} fill={warna.kunyit} />
      <Path d="M20 38h36" stroke={warna.tinta} strokeOpacity={0.25} strokeWidth={2} />
      <Path d="M30 45h16l-8 12z" fill={warna.daun} />
      <Path d="M31 45c1-3 4-5 7-5s6 2 7 5z" fill={warna.putih} />
      {/* kaki & badan */}
      <Path d="M64 64l30 2 9 19-8 3-8-14H66z" fill="#2A3346" />
      <Path d="M101 84h10v6H97z" fill={warna.tinta} />
      <Path d="M62 66l4-30c1-6 6-9 12-8l9 3 13 19-7 5-9-12-2 23z" fill={jaket} />
      <Path d="M70 40l-2 22" stroke="rgba(255,255,255,0.45)" strokeWidth={2.5} strokeLinecap="round" />
      <Path d="M84 38l26 9" stroke={jaket} strokeWidth={8} strokeLinecap="round" />
      <Circle cx={111} cy={47} r={4.5} fill="#5B3A29" />
      <Path d="M108 43l12-4" stroke={warna.tinta} strokeWidth={3.5} strokeLinecap="round" />
      {/* helm berkaca gelap */}
      <G>
        <Path d="M64 22c0-9 7-15 15-15s15 6 15 15v4H64z" fill={helm} />
        <Path d="M78 13h16c2 3 2 8 1 12l-14 1c-3-4-4-9-3-13z" fill={warna.tinta} />
        <Path d="M84 15h7" stroke="rgba(255,255,255,0.5)" strokeWidth={2} strokeLinecap="round" />
        <Rect x={66} y={25} width={26} height={5} rx={2.5} fill={helm} />
      </G>
    </Svg>
  );
}

/** Avatar kurir: helm dan bahu jaket, tanpa wajah. */
export function AvatarKurir({ ukuran = 52, helm = '#2F5D8A', jaket = warna.sambal }: { ukuran?: number; helm?: string; jaket?: string }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 56 56" aria-hidden focusable={false}>
      <Circle cx={28} cy={28} r={28} fill={warna.kunyitMuda} />
      <Path d="M8 56c2-11 10-17 20-17s18 6 20 17z" fill={jaket} />
      <Path d="M28 40v16" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
      <Path d="M14 27c0-9 6-15 14-15s14 6 14 15v6H14z" fill={helm} />
      <Path d="M17 24c0-3 2-5 5-5h12c3 0 5 2 5 5v5H17z" fill={warna.tinta} />
      <Path d="M21 22h6" stroke="rgba(255,255,255,0.55)" strokeWidth={2} strokeLinecap="round" />
      <Rect x={14} y={32} width={28} height={4} rx={2} fill={helm} />
    </Svg>
  );
}
