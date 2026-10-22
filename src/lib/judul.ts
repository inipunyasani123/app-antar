import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Platform } from 'react-native';

/** Perbarui judul tab browser saat layar tampil (navigasi di sisi klien tidak memuat ulang HTML). */
export function useJudulDokumen(judul: string) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') document.title = judul;
    }, [judul]),
  );
}
