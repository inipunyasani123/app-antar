import { Slot } from 'expo-router';
import { View } from 'react-native';
import { BilahKeranjang } from '@/components/BilahKeranjang';
import { TabBar } from '@/components/TabBar';
import { warna } from '@/lib/theme';

/** Empat tab utama dengan bilah tab buatan sendiri; bilah keranjang mengambang di atasnya. */
export default function TabLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: warna.kertas }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <BilahKeranjang />
      <TabBar />
    </View>
  );
}
