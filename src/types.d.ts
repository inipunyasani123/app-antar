declare module 'react-native-web' {
  import type { ReactElement } from 'react';
  export function unstable_createElement(tag: string, props?: Record<string, unknown>): ReactElement;
}

declare module 'qrcode/lib/core/qrcode' {
  const QR: { create(teks: string, opsi?: { errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' }): { modules: { size: number; get(x: number, y: number): number | boolean } } };
  export default QR;
}
