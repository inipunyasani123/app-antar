import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cariMenu, warungById } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { Ikon } from './Ikon';

/** Bilah keranjang mengambang: muncul kalau keranjang berisi. */
export function BilahKeranjang() {
  const { s, siap, jumlahItem } = useStore();
  if (!siap || !jumlahItem || !s.keranjang.warungId) return null;
  const w = warungById(s.keranjang.warungId);
  const subtotal = s.keranjang.item.reduce((n, i) => n + (cariMenu(s.keranjang.warungId!, i.menuId)?.harga ?? 0) * i.qty, 0);
  return (
    <View style={gaya.wadah}>
      <Link href="/keranjang" asChild>
        <Pressable style={gaya.bilah}>
          <View style={gaya.jumlah}>
            <Ikon nama="tas" ukuran={20} warna={warna.tinta} />
            <Text style={gaya.angka}>{jumlahItem}</Text>
          </View>
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
  bilah: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.tinta, borderRadius: radius.besar, paddingVertical: 10, paddingLeft: 10, paddingRight: 16 },
  jumlah: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: warna.kunyit, borderRadius: radius.pil, paddingHorizontal: 10, paddingVertical: 6 },
  angka: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta },
  judul: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.kertas },
  sub: { fontFamily: huruf.sedang, fontSize: 12.5, lineHeight: 17, color: '#E9DCC4' },
  harga: { fontFamily: huruf.hitam, fontSize: 15, color: warna.kertas },
});
