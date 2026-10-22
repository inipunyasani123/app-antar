import { Link, usePathname } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { statusPesanan } from '@/lib/pesanan';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, warna } from '@/lib/theme';
import { Ikon, type NamaIkon } from './Ikon';

const TAB: { href: string; label: string; ikon: NamaIkon }[] = [
  { href: '/', label: 'Beranda', ikon: 'beranda' },
  { href: '/cari', label: 'Cari', ikon: 'cari' },
  { href: '/pesanan', label: 'Pesanan', ikon: 'nota' },
  { href: '/saya', label: 'Saya', ikon: 'saya' },
];

/** Bilah tab bawah buatan sendiri (tautan biasa, jadi bisa dibuka di tab baru di web). */
export function TabBar() {
  const path = usePathname();
  const ins = useSafeAreaInsets();
  const { s, siap } = useStore();
  const now = useSekarang(5000);
  const aktifBerjalan = siap && now ? s.pesanan.filter((p) => !statusPesanan(p, now).selesai).length : 0;
  return (
    <View style={[gaya.bar, { paddingBottom: Math.max(ins.bottom, 6) }]} role="navigation" aria-label="Menu utama">
      {TAB.map((t) => {
        const aktif = t.href === '/' ? path === '/' : path.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href as never} asChild>
            <Pressable style={gaya.item} aria-current={aktif ? 'page' : undefined} aria-label={t.href === '/pesanan' && aktifBerjalan ? `${t.label}, ${aktifBerjalan} berjalan` : t.label}>
              <View style={[gaya.ikon, aktif && { backgroundColor: warna.sambal }]}>
                <Ikon nama={t.ikon} ukuran={22} warna={aktif ? '#FFFFFF' : warna.tinta} />
                {t.href === '/pesanan' && aktifBerjalan > 0 ? <View style={gaya.titik} /> : null}
              </View>
              <Text style={[gaya.label, aktif && { color: warna.sambalTua, fontFamily: huruf.hitam }]}>{t.label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const gaya = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: warna.putih,
    borderTopWidth: 1,
    borderColor: warna.garis,
    paddingTop: 6,
    paddingHorizontal: 6,
    ...(Platform.OS === 'web' ? ({ boxShadow: '0 -10px 24px -18px rgba(43,27,18,0.5)' } as object) : { elevation: 10 }),
  },
  item: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: 2, minHeight: 52 },
  ikon: { width: 52, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: huruf.tebal, fontSize: 12, lineHeight: 16, color: warna.tinta },
  titik: { position: 'absolute', top: 3, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: warna.kunyit, borderWidth: 1.5, borderColor: warna.putih },
});
