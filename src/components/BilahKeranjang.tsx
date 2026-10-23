import { Link } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { cariMenu, hargaSatuan, warungById } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { useGerakDikurangi } from '@/lib/gerak';
import { useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { Ikon } from './Ikon';

/** Subtotal keranjang (harga satuan sudah termasuk pilihan berbayar). */
export function useSubtotal() {
  const { s } = useStore();
  const wId = s.keranjang.warungId;
  return wId ? s.keranjang.item.reduce((n, i) => { const m = cariMenu(wId, i.menuId); return n + (m ? hargaSatuan(m, i.pilih) * i.qty : 0); }, 0) : 0;
}

/** Bilah keranjang mengambang: muncul kalau keranjang berisi; lencana jumlah "meletup" saat bertambah. */
export function BilahKeranjang() {
  const { s, siap, jumlahItem } = useStore();
  const subtotal = useSubtotal();
  const skala = useRef(new Animated.Value(1)).current;
  const sebelum = useRef(jumlahItem);
  const kurangiGerak = useGerakDikurangi();
  useEffect(() => {
    if (jumlahItem > sebelum.current && !kurangiGerak) {
      Animated.sequence([
        Animated.timing(skala, { toValue: 1.15, duration: 110, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(skala, { toValue: 1, duration: 140, useNativeDriver: Platform.OS !== 'web' }),
      ]).start();
    }
    sebelum.current = jumlahItem;
  }, [jumlahItem, kurangiGerak, skala]);
  if (!siap || !jumlahItem || !s.keranjang.warungId) return null;
  const w = warungById(s.keranjang.warungId);
  return (
    <View style={gaya.wadah}>
      <Link href="/keranjang" asChild>
        <Pressable style={gaya.bilah}>
          <Animated.View style={[gaya.jumlah, { transform: [{ scale: skala }] }]}>
            <Ikon nama="tas" ukuran={20} warna={warna.tinta} />
            <Text style={gaya.angka}>{jumlahItem}</Text>
          </Animated.View>
          <View style={{ flex: 1 }}>
            <Text style={gaya.judul} numberOfLines={1}>
              Lihat keranjang
            </Text>
            <Text style={gaya.sub} numberOfLines={1}>
              {w?.nama}
            </Text>
          </View>
          <Text style={gaya.harga}>{rupiah(subtotal)}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: { paddingHorizontal: 12, paddingBottom: 8, paddingTop: 4 },
  bilah: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.sambal, borderRadius: radius.besar, paddingVertical: 10, paddingLeft: 10, paddingRight: 16, minHeight: 56 },
  jumlah: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: warna.kunyit, borderRadius: radius.pil, paddingHorizontal: 10, paddingVertical: 6 },
  angka: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta, fontVariant: ['tabular-nums'] },
  judul: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: '#FFFFFF' },
  sub: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 17, color: '#FBE7B5' },
  harga: { fontFamily: huruf.hitam, fontSize: 15, color: '#FFFFFF', fontVariant: ['tabular-nums'] },
});
