import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useHurufApp } from '@/lib/fonts';
import { StoreProvider } from '@/lib/store';
import { warna } from '@/lib/theme';

export default function RootLayout() {
  const siap = useHurufApp();
  if (!siap) return null;
  return (
    <StoreProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: warna.kertas }, animation: 'slide_from_right' }} />
    </StoreProvider>
  );
}
