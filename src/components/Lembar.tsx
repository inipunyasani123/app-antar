import { useEffect, useRef, type ComponentRef, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { radius, warna } from '@/lib/theme';
import { Judul } from './ui';

/**
 * Lembar konfirmasi di dalam layar (bukan Modal portal), supaya tetap di dalam bingkai ponsel di web.
 * Fokus dipindah ke lembar saat terbuka; Escape menutup.
 */
export function Lembar({ terbuka, judul, onTutup, children }: { terbuka: boolean; judul: string; onTutup: () => void; children: ReactNode }) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    if (!terbuka || Platform.OS !== 'web') return;
    const el = ref.current as unknown as HTMLElement | null;
    const tombol = el?.querySelector?.('[role="button"]') as HTMLElement | null;
    tombol?.focus();
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onTutup();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [terbuka, onTutup]);
  if (!terbuka) return null;
  return (
    <View style={gaya.lapis}>
      <Pressable style={gaya.latar} onPress={onTutup} aria-label="Tutup" focusable={false} />
      <View ref={ref} style={gaya.lembar} role="dialog" aria-modal aria-label={judul}>
        <View style={gaya.pegangan} />
        <Judul level={2} ukuran={20}>
          {judul}
        </Judul>
        {children}
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  lapis: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'flex-end', zIndex: 20 },
  latar: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(43,27,18,0.45)' },
  lembar: { backgroundColor: warna.putih, borderTopLeftRadius: radius.besar + 6, borderTopRightRadius: radius.besar + 6, padding: 20, paddingBottom: 28, gap: 12 },
  pegangan: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: warna.garis, marginBottom: 4 },
});
