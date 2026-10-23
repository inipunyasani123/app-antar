import { useEffect, useRef, type ComponentRef, type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { radius, warna } from '@/lib/theme';
import { Judul, TombolIkon } from './ui';

/**
 * Lembar bawah di dalam layar (bukan Modal portal), supaya tetap di dalam bingkai ponsel di web.
 * Fokus pindah ke lembar saat terbuka, kembali ke pemicu saat ditutup; Esc dan ketuk latar menutup.
 */
export function Lembar({ terbuka, judul, onTutup, children, kaki, atas }: { terbuka: boolean; judul: string; onTutup: () => void; children: ReactNode; kaki?: ReactNode; atas?: ReactNode }) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  const tutupRef = useRef(onTutup);
  tutupRef.current = onTutup;
  useEffect(() => {
    if (!terbuka || Platform.OS !== 'web') return;
    const pemicu = document.activeElement as HTMLElement | null;
    const el = ref.current as unknown as HTMLElement | null;
    const pertama = el?.querySelector?.('[role="button"],[role="radio"],[role="checkbox"],input,textarea') as HTMLElement | null;
    pertama?.focus();
    const tombol = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutupRef.current();
      if (e.key === 'Tab' && el) {
        const fokus = [...el.querySelectorAll<HTMLElement>('[tabindex="0"],input,textarea,a[href]')].filter((x) => !x.hasAttribute('disabled'));
        if (!fokus.length) return;
        const a = fokus[0];
        const z = fokus[fokus.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener('keydown', tombol);
    return () => {
      window.removeEventListener('keydown', tombol);
      pemicu?.focus?.();
    };
  }, [terbuka]);
  if (!terbuka) return null;
  return (
    <View style={gaya.lapis}>
      {/* latar redup: ketuk untuk menutup (pengguna keyboard memakai tombol Tutup atau Esc) */}
      <View style={gaya.latar} onStartShouldSetResponder={() => true} onResponderRelease={onTutup} />
      <View ref={ref} style={gaya.lembar} role="dialog" aria-modal aria-label={judul}>
        {atas}
        <View style={gaya.kepala}>
          <View style={gaya.pegangan} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Judul level={2} ukuran={21} style={{ flex: 1 }}>
              {judul}
            </Judul>
            <TombolIkon ikon="tutup" label="Tutup" onPress={onTutup} />
          </View>
        </View>
        <ScrollView style={{ flexGrow: 0, flexShrink: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 12 }} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        {kaki ? <View style={gaya.kaki}>{kaki}</View> : null}
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  lapis: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'flex-end', zIndex: 20 },
  latar: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(31,77,43,0.55)' },
  lembar: { backgroundColor: warna.putih, borderTopLeftRadius: radius.besar + 6, borderTopRightRadius: radius.besar + 6, maxHeight: '90%', overflow: 'hidden' },
  kepala: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, gap: 6 },
  pegangan: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: warna.garis },
  kaki: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderColor: warna.garis, backgroundColor: warna.putih, gap: 8 },
});
