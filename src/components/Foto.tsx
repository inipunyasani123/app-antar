import { Image, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';

type Props = { sumber: ImageSourcePropType; alt: string; style?: StyleProp<ImageStyle>; prioritas?: boolean };

/** Android/iOS: Image bawaan React Native. */
export function Foto({ sumber, alt, style }: Props) {
  return <Image source={sumber} style={style} resizeMode="cover" accessibilityLabel={alt || undefined} accessibilityIgnoresInvertColors accessible={!!alt} />;
}
