import { StyleSheet, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';
import { unstable_createElement } from 'react-native-web';

type Props = { sumber: ImageSourcePropType; alt: string; style?: StyleProp<ImageStyle>; prioritas?: boolean };

/**
 * Web: <img> asli supaya foto ikut di HTML statis, dimuat malas (loading="lazy"),
 * dan punya ukuran intrinsik (tanpa pergeseran tata letak).
 */
export function Foto({ sumber, alt, style, prioritas }: Props) {
  const s = sumber as { uri: string; width?: number; height?: number };
  return unstable_createElement('img', {
    src: s.uri,
    alt,
    width: s.width,
    height: s.height,
    loading: prioritas ? 'eager' : 'lazy',
    decoding: 'async',
    draggable: false,
    style: [gaya.dasar, style],
  });
}

const gaya = StyleSheet.create({ dasar: { objectFit: 'cover', display: 'flex', maxWidth: '100%' } as object });
