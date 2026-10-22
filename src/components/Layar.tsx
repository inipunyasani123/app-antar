import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { huruf, warna } from '@/lib/theme';
import { Judul, TombolIkon } from './ui';

type Props = {
  judul?: string;
  kembali?: boolean | string; // true = router.back, string = href cadangan
  kanan?: ReactNode;
  bawah?: ReactNode; // bilah tetap di bawah (mis. tombol bayar)
  children: ReactNode;
  gulir?: boolean;
  isiStyle?: StyleProp<ViewStyle>;
  latar?: string;
  tanpaKepala?: boolean;
};

export function kembaliKe(cadangan = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(cadangan as never);
}

/** Kerangka layar: kepala dengan tombol kembali + judul (h1), isi bergulir, bilah bawah opsional. */
export function Layar({ judul, kembali, kanan, bawah, children, gulir = true, isiStyle, latar = warna.kertas, tanpaKepala }: Props) {
  const ins = useSafeAreaInsets();
  return (
    <View style={[gaya.akar, { backgroundColor: latar }]} role="main">
      {!tanpaKepala ? (
        <View style={[gaya.kepala, { paddingTop: ins.top + 8 }]}>
          {kembali ? <TombolIkon ikon="kembali" label="Kembali" onPress={() => kembaliKe(typeof kembali === 'string' ? kembali : '/')} /> : null}
          {judul ? (
            <Judul level={1} ukuran={22} style={{ flex: 1 }} numberOfLines={1}>
              {judul}
            </Judul>
          ) : (
            <View style={{ flex: 1 }} />
          )}
          {kanan}
        </View>
      ) : null}
      {gulir ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={[gaya.isi, isiStyle]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, isiStyle]}>{children}</View>
      )}
      {bawah ? <View style={[gaya.bawah, { paddingBottom: Math.max(ins.bottom, 12) }]}>{bawah}</View> : null}
    </View>
  );
}

const gaya = StyleSheet.create({
  akar: { flex: 1 },
  kepala: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 10 },
  isi: { paddingHorizontal: 16, paddingBottom: 32 },
  bawah: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: warna.putih,
    borderTopWidth: 1,
    borderColor: warna.garis,
    ...(Platform.OS === 'web' ? ({ boxShadow: '0 -8px 20px -14px rgba(43,27,18,0.45)' } as object) : { elevation: 8 }),
  },
});

export const gayaTeksKecil = { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 };
