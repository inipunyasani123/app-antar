import { useId } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, Path, Pattern, Rect } from 'react-native-svg';
import { huruf, warna } from '@/lib/theme';

const bersihId = (s: string) => s.replace(/[^a-zA-Z0-9_-]/g, '');

/** Logo: pincuk (daun pisang dilipat kerucut) berisi nasi pecel, dengan uap. */
export function LogoPincuk({ ukuran = 40, latar }: { ukuran?: number; latar?: string }) {
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 64 64" aria-hidden focusable={false}>
      {latar ? <Rect width={64} height={64} rx={16} fill={latar} /> : null}
      <Path d="M24 10c-2 3 2 5 0 8M32 7c-2 3 2 5 0 8M40 10c-2 3 2 5 0 8" stroke={latar ? '#FBE7B5' : warna.tinta2} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <Path d="M14 30c2-7 10-10 18-10s16 3 18 10z" fill="#FFFDF8" />
      <Circle cx={26} cy={25} r={2.6} fill={warna.sambal} />
      <Circle cx={36} cy={24} r={2.2} fill={warna.kunyit} />
      <Path d="M10 29h44L34.5 57.5a3 3 0 0 1-5 0z" fill={warna.daun} />
      <Path d="M32 30v25M32 37l-9-6M32 43l-7-6M32 37l9-6M32 43l7-6" stroke="#8DB27A" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      <Path d="M10 29h44l-3 4.5H13z" fill={warna.daunTua} />
    </Svg>
  );
}

/** Tenda warung bergaris dengan tepi bergelombang. */
export function Tenda({ warnaTenda = warna.sambal, tinggi = 16, style }: { warnaTenda?: string; tinggi?: number; style?: StyleProp<ViewStyle> }) {
  const id = 'tenda' + bersihId(useId());
  return (
    <View style={[{ height: tinggi }, style]} aria-hidden>
      <Svg width="100%" height={tinggi} aria-hidden focusable={false}>
        <Defs>
          <Pattern id={id} width={24} height={tinggi} patternUnits="userSpaceOnUse">
            <Rect x={0} y={0} width={12} height={tinggi * 0.45} fill={warnaTenda} />
            <Rect x={12} y={0} width={12} height={tinggi * 0.45} fill="#F3E6CF" />
            <Path d={`M0 ${tinggi * 0.45} a6 ${tinggi * 0.5} 0 0 0 12 0z`} fill={warnaTenda} />
            <Path d={`M12 ${tinggi * 0.45} a6 ${tinggi * 0.5} 0 0 0 12 0z`} fill="#F3E6CF" />
          </Pattern>
        </Defs>
        <Rect width="100%" height={tinggi} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/** Tepi nota bergerigi (atas/bawah). */
export function TepiNota({ posisi = 'bawah', latar = warna.putih }: { posisi?: 'atas' | 'bawah'; latar?: string }) {
  const id = 'nota' + bersihId(useId());
  const d = posisi === 'bawah' ? 'M0 0h14l-7 8z' : 'M0 8h14L7 0z';
  return (
    <View style={{ height: 8 }} aria-hidden>
      <Svg width="100%" height={8} aria-hidden focusable={false}>
        <Defs>
          <Pattern id={id} width={14} height={8} patternUnits="userSpaceOnUse">
            <Path d={d} fill={latar} />
          </Pattern>
        </Defs>
        <Rect width="100%" height={8} fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/** Tekstur urat daun pisang untuk latar kartu hijau. */
export function UratDaun({ warnaGaris = 'rgba(255,253,248,0.10)', style }: { warnaGaris?: string; style?: StyleProp<ViewStyle> }) {
  const id = 'daun' + bersihId(useId());
  return (
    <View style={[{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }, style]} aria-hidden pointerEvents="none">
      <Svg width="100%" height="100%" aria-hidden focusable={false}>
        <Defs>
          <Pattern id={id} width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
            <Rect x={0} y={0} width={1.6} height={18} fill={warnaGaris} />
            <Rect x={9} y={0} width={0.8} height={18} fill={warnaGaris} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
    </View>
  );
}

/** Cap stempel bulat ala nota warung ("LUNAS", "SAMPAI"). Dekoratif; statusnya juga ditulis sebagai teks biasa. */
export function Cap({ teks, warnaCap = warna.sambal, ukuran = 76 }: { teks: string; warnaCap?: string; ukuran?: number }) {
  return (
    <View
      aria-hidden
      style={{ width: ukuran, height: ukuran, borderRadius: ukuran / 2, borderWidth: 2.5, borderColor: warnaCap, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-14deg' }] }}
    >
      <View style={{ position: 'absolute', left: 5, right: 5, top: 5, bottom: 5, borderRadius: ukuran, borderWidth: 1, borderColor: warnaCap }} />
      <Text style={{ fontFamily: huruf.hitam, fontSize: Math.round(ukuran / 7), letterSpacing: 0.8, color: warnaCap }}>{teks}</Text>
    </View>
  );
}
