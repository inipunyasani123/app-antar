import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/** true kalau pengguna meminta gerak dikurangi (prefers-reduced-motion di web). */
export function useGerakDikurangi(): boolean {
  const [kurangi, setKurangi] = useState(false);
  useEffect(() => {
    let aktif = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => aktif && setKurangi(v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => setKurangi(v));
    return () => {
      aktif = false;
      sub?.remove?.();
    };
  }, []);
  return kurangi;
}
