import { forwardRef, useState, type ComponentRef, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { huruf, radius, warna } from '@/lib/theme';
import { Ikon, type NamaIkon } from './Ikon';

type TeksProps = TextProps & { gaya?: 'sedang' | 'tebal' | 'hitam' | 'mono'; ukuran?: number; warna?: string; style?: StyleProp<TextStyle> };

export function Teks({ gaya = 'sedang', ukuran = 15, warna: w = warna.tinta, style, ...rest }: TeksProps) {
  return <Text {...rest} style={[{ fontFamily: huruf[gaya], fontSize: ukuran, lineHeight: Math.round(ukuran * 1.4), color: w }, style]} />;
}

/** Judul berhuruf display (Shrikhand). level 1 = h1 di web. */
export function Judul({ level = 2, ukuran, warna: w = warna.tinta, style, children, ...rest }: TextProps & { level?: 1 | 2 | 3; ukuran?: number; warna?: string }) {
  const u = ukuran ?? (level === 1 ? 28 : level === 2 ? 21 : 17);
  return (
    <Text role="heading" aria-level={level} {...rest} style={[{ fontFamily: huruf.display, fontSize: u, lineHeight: Math.round(u * 1.22), color: w, letterSpacing: 0.1 }, style]}>
      {children}
    </Text>
  );
}

/** Subjudul tanpa huruf display (untuk judul bagian kecil). */
export function SubJudul({ level = 2, children, style, warna: w = warna.tinta }: { level?: 2 | 3; children: ReactNode; style?: StyleProp<TextStyle>; warna?: string }) {
  return (
    <Text role="heading" aria-level={level} style={[{ fontFamily: huruf.hitam, fontSize: 16, lineHeight: 22, color: w }, style]}>
      {children}
    </Text>
  );
}

type TombolProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  varian?: 'utama' | 'kedua' | 'garis' | 'teks' | 'gelap';
  ikon?: NamaIkon;
  ikonKanan?: NamaIkon;
  kecil?: boolean;
  penuh?: boolean;
  style?: StyleProp<ViewStyle>;
  sisi?: ReactNode;
};

const VARIAN = {
  utama: { bg: warna.sambal, fg: '#FFFFFF', garis: warna.sambal },
  gelap: { bg: warna.tinta, fg: warna.kertas, garis: warna.tinta },
  kedua: { bg: warna.kunyit, fg: warna.tinta, garis: warna.kunyit },
  garis: { bg: 'transparent', fg: warna.tinta, garis: warna.garisTegas },
  teks: { bg: 'transparent', fg: warna.sambalTua, garis: 'transparent' },
};

export const Tombol = forwardRef<ComponentRef<typeof View>, TombolProps>(function Tombol({ label, varian = 'utama', ikon, ikonKanan, kecil, penuh, style, disabled, sisi, onPressIn, onPressOut, ...rest }, ref) {
  const v = VARIAN[varian];
  const mati = !!disabled;
  const [ditekan, setDitekan] = useState(false);
  // Gaya diratakan jadi satu objek (bukan fungsi/array) supaya aman dipakai di dalam <Link asChild>.
  const gayaAkhir = StyleSheet.flatten([
    gaya.tombol,
    kecil && gaya.tombolKecil,
    penuh && { alignSelf: 'stretch' as const },
    { backgroundColor: mati ? warna.kertas2 : v.bg, borderColor: mati ? warna.garis : v.garis },
    ditekan && !mati && { transform: [{ translateY: 1 }], opacity: 0.92 },
    style,
  ]);
  return (
    <Pressable
      ref={ref}
      role="button"
      aria-label={rest['aria-label'] ?? label}
      disabled={mati}
      aria-disabled={mati}
      onPressIn={(e) => {
        setDitekan(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setDitekan(false);
        onPressOut?.(e);
      }}
      {...rest}
      style={gayaAkhir}
    >
      {ikon ? <Ikon nama={ikon} ukuran={kecil ? 18 : 20} warna={mati ? warna.tinta2 : v.fg} /> : null}
      <Text style={[gaya.tombolTeks, kecil && { fontSize: 14 }, { color: mati ? warna.tinta2 : v.fg }]} numberOfLines={1}>
        {label}
      </Text>
      {sisi}
      {ikonKanan ? <Ikon nama={ikonKanan} ukuran={kecil ? 18 : 20} warna={mati ? warna.tinta2 : v.fg} /> : null}
    </Pressable>
  );
});

/** Tombol ikon bulat (target ≥44 px). */
export const TombolIkon = forwardRef<ComponentRef<typeof View>, Omit<PressableProps, 'style'> & { ikon: NamaIkon; label: string; latar?: string; warnaIkon?: string; ukuran?: number; style?: StyleProp<ViewStyle> }>(
  function TombolIkon({ ikon, label, latar = warna.putih, warnaIkon = warna.tinta, ukuran = 44, style, ...rest }, ref) {
    return (
      <Pressable
        ref={ref}
        role="button"
        aria-label={label}
        {...rest}
        style={StyleSheet.flatten([{ width: ukuran, height: ukuran, borderRadius: ukuran / 2, backgroundColor: latar, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: warna.garis }, style])}
      >
        <Ikon nama={ikon} ukuran={Math.round(ukuran * 0.48)} warna={warnaIkon} />
      </Pressable>
    );
  },
);

export function Chip({ label, aktif, onPress, ikon, aksen = warna.tinta }: { label: string; aktif?: boolean; onPress?: () => void; ikon?: NamaIkon; aksen?: string }) {
  return (
    <Pressable
      role={onPress ? 'button' : undefined}
      aria-pressed={onPress ? !!aktif : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        gaya.chip,
        { backgroundColor: aktif ? aksen : warna.putih, borderColor: aktif ? aksen : warna.garisTegas },
        pressed && { opacity: 0.85 },
      ]}
    >
      {ikon ? <Ikon nama={ikon} ukuran={16} warna={aktif ? warna.kertas : warna.tinta} /> : null}
      <Text style={[gaya.chipTeks, { color: aktif ? warna.kertas : warna.tinta }]}>{label}</Text>
    </Pressable>
  );
}

export function Lencana({ teks, latar = warna.kunyitMuda, fg = warna.tinta, style }: { teks: string; latar?: string; fg?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ backgroundColor: latar, borderRadius: radius.pil, paddingHorizontal: 9, paddingVertical: 3, alignSelf: 'flex-start' }, style]}>
      <Text style={{ fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: fg }}>{teks}</Text>
    </View>
  );
}

export function Garis({ putus, style }: { putus?: boolean; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: 0, borderTopWidth: 1.5, borderColor: warna.garisTegas, borderStyle: putus ? 'dashed' : 'solid', marginVertical: 12 }, style]} />;
}

export const gaya = StyleSheet.create({
  tombol: {
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: radius.pil,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...(Platform.OS === 'web' ? ({ cursor: 'pointer', userSelect: 'none' } as object) : null),
  },
  tombolKecil: { minHeight: 40, paddingHorizontal: 14 },
  tombolTeks: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 22 },
  chip: { minHeight: 38, paddingHorizontal: 14, borderRadius: radius.pil, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipTeks: { fontFamily: huruf.tebal, fontSize: 14, lineHeight: 19 },
  kartu: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis },
});
