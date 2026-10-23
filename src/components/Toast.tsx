import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { huruf, radius, warna } from '@/lib/theme';

/** Snackbar "… dihapus · Urungkan" yang hilang sendiri (4 detik). Tidak menutupi kepala layar. */
export function Toast({ teks, aksi, onAksi, onHilang, lama = 4000, bawah = 12 }: { teks: string | null; aksi?: string; onAksi?: () => void; onHilang: () => void; lama?: number; bawah?: number }) {
  useEffect(() => {
    if (!teks) return;
    const t = setTimeout(onHilang, lama);
    return () => clearTimeout(t);
  }, [teks, lama, onHilang]);
  return (
    <View style={[gaya.wadah, { bottom: bawah }]} pointerEvents="box-none" aria-live="polite" role="status">
      {teks ? (
        <View style={gaya.toast}>
          <Text style={gaya.teks} numberOfLines={2}>
            {teks}
          </Text>
          {aksi && onAksi ? (
            <Pressable role="button" onPress={onAksi} style={gaya.aksi}>
              <Text style={gaya.aksiTeks}>{aksi}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: { position: 'absolute', left: 12, right: 12, bottom: 12, zIndex: 15 },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: warna.daunTua, borderRadius: radius.sedang, paddingLeft: 16, paddingRight: 6, paddingVertical: 4, minHeight: 52 },
  teks: { flex: 1, fontFamily: huruf.tebal, fontSize: 14, lineHeight: 19, color: warna.kertas },
  aksi: { minHeight: 44, minWidth: 44, paddingHorizontal: 12, justifyContent: 'center', borderRadius: radius.pil },
  aksiTeks: { fontFamily: huruf.hitam, fontSize: 14.5, color: warna.kunyitMuda, textDecorationLine: 'underline' },
});
