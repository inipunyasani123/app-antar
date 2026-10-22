import { useFonts } from 'expo-font';

/** Android/iOS: muat huruf dari assets/fonts (lisensi OFL ada di folder yang sama). */
export function useHurufApp(): boolean {
  const [siap] = useFonts({
    Shrikhand: require('../../assets/fonts/Shrikhand-Regular.ttf'),
    Figtree500: require('../../assets/fonts/Figtree-Medium.ttf'),
    Figtree700: require('../../assets/fonts/Figtree-Bold.ttf'),
    Figtree800: require('../../assets/fonts/Figtree-ExtraBold.ttf'),
  });
  return siap;
}
