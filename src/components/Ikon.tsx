import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { warna } from '@/lib/theme';

export type NamaIkon =
  | 'beranda'
  | 'cari'
  | 'nota'
  | 'saya'
  | 'tas'
  | 'tambah'
  | 'kurang'
  | 'kembali'
  | 'jam'
  | 'pin'
  | 'motor'
  | 'chat'
  | 'tutup'
  | 'centang'
  | 'kanan'
  | 'tiket'
  | 'sampah'
  | 'pensil'
  | 'qr'
  | 'uang'
  | 'kirim'
  | 'info'
  | 'ulang'
  | 'percepat'
  | 'wajan'
  | 'rumah'
  | 'cabai'
  | 'hati'
  | 'tanya'
  | 'bawah';

type Props = { nama: NamaIkon; ukuran?: number; warna?: string; tebal?: number; isi?: string };

/** Ikon garis buatan sendiri (24×24), dekoratif: label ada di elemen induknya. */
export function Ikon({ nama, ukuran = 22, warna: w = warna.tinta, tebal = 2, isi: fillIsi }: Props) {
  const g = { stroke: w, strokeWidth: tebal, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={ukuran} height={ukuran} viewBox="0 0 24 24" aria-hidden focusable={false}>
      {gambar(nama, g, w, fillIsi)}
    </Svg>
  );
}

function gambar(nama: NamaIkon, g: object, w: string, fillIsi?: string) {
  switch (nama) {
    case 'beranda':
      return (
        <>
          <Path d="M3.5 10.5 12 4l8.5 6.5" {...g} />
          <Path d="M5.5 9.5V20h13V9.5" {...g} />
          <Path d="M10 20v-5.5h4V20" {...g} />
        </>
      );
    case 'cari':
      return (
        <>
          <Circle cx={10.5} cy={10.5} r={6} {...g} />
          <Path d="m15 15 5 5" {...g} />
        </>
      );
    case 'nota':
      return (
        <>
          <Path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4z" {...g} />
          <Path d="M9 8.5h6M9 12h6M9 15.5h3.5" {...g} />
        </>
      );
    case 'saya':
      return (
        <>
          <Circle cx={12} cy={8.5} r={4} {...g} />
          <Path d="M4.5 20.5c1.2-4 4-6 7.5-6s6.3 2 7.5 6" {...g} />
        </>
      );
    case 'tas':
      return (
        <>
          <Path d="M5 8h14l-1.2 12.5H6.2z" {...g} />
          <Path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" {...g} />
        </>
      );
    case 'tambah':
      return <Path d="M12 5v14M5 12h14" {...g} />;
    case 'kurang':
      return <Path d="M5 12h14" {...g} />;
    case 'kembali':
      return <Path d="M15 5 8 12l7 7" {...g} />;
    case 'kanan':
      return <Path d="m9 5 7 7-7 7" {...g} />;
    case 'jam':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...g} />
          <Path d="M12 7.5V12l3 2" {...g} />
        </>
      );
    case 'pin':
      return (
        <>
          <Path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z" {...g} />
          <Circle cx={12} cy={10} r={2.3} {...g} />
        </>
      );
    case 'motor':
      return (
        <>
          <Circle cx={6} cy={16.5} r={3} {...g} />
          <Circle cx={18} cy={16.5} r={3} {...g} />
          <Path d="M9 16.5h5l2.5-6H19M13 10.5h-3l-2 3M16.5 10.5 15 7h-2" {...g} />
        </>
      );
    case 'chat':
      return <Path d="M4.5 5.5h15v10h-8l-4.5 3.5v-3.5H4.5z" {...g} />;
    case 'tutup':
      return <Path d="M6 6l12 12M18 6 6 18" {...g} />;
    case 'centang':
      return <Path d="m5 12.5 4.5 4.5L19 7.5" {...g} />;
    case 'tiket':
      return (
        <>
          <Path d="M3.5 7.5h17v3a1.8 1.8 0 0 0 0 3v3h-17v-3a1.8 1.8 0 0 0 0-3z" {...g} />
          <Path d="M14.5 7.5v9" {...g} strokeDasharray="1.5 2" />
        </>
      );
    case 'sampah':
      return (
        <>
          <Path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" {...g} />
        </>
      );
    case 'pensil':
      return <Path d="m4.5 19.5 1-4.5L16 4.5l3.5 3.5L9 18.5zM13.5 7l3.5 3.5" {...g} />;
    case 'qr':
      return (
        <>
          <Rect x={4} y={4} width={6} height={6} rx={1} {...g} />
          <Rect x={14} y={4} width={6} height={6} rx={1} {...g} />
          <Rect x={4} y={14} width={6} height={6} rx={1} {...g} />
          <Path d="M14 14h2.5v2.5H14zM18 18h2v2h-2zM18 14h2M14 19h1.5" {...g} />
        </>
      );
    case 'uang':
      return (
        <>
          <Rect x={3} y={6.5} width={18} height={11} rx={2} {...g} />
          <Circle cx={12} cy={12} r={2.6} {...g} />
          <Path d="M6.5 9.5v5M17.5 9.5v5" {...g} />
        </>
      );
    case 'kirim':
      return <Path d="M4 12 20 4.5 16 20l-4.5-6.5zM11.5 13.5 20 4.5" {...g} />;
    case 'info':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...g} />
          <Path d="M12 11v5.5" {...g} />
          <Circle cx={12} cy={7.8} r={0.6} fill={w} stroke={w} strokeWidth={1.2} />
        </>
      );
    case 'ulang':
      return <Path d="M5 12a7 7 0 0 1 12-4.9L19 9M19 4.5V9h-4.5M19 12a7 7 0 0 1-12 4.9L5 15M5 19.5V15h4.5" {...g} />;
    case 'percepat':
      return <Path d="M4.5 6.5 11 12l-6.5 5.5zM12.5 6.5 19 12l-6.5 5.5z" {...g} />;
    case 'wajan':
      return (
        <>
          <Path d="M3.5 11.5h13a6.5 6.5 0 0 1-13 0z" {...g} />
          <Path d="M16.5 11.5h4M8 8c-1-1.3 1-2.2 0-3.5M11.5 8c-1-1.3 1-2.2 0-3.5" {...g} />
        </>
      );
    case 'rumah':
      return (
        <>
          <Path d="M4 11 12 4.5 20 11" {...g} />
          <Path d="M6.5 9.5V19.5h11V9.5" {...g} />
          <Path d="M10.5 19.5v-5h3v5" {...g} />
        </>
      );
    case 'cabai':
      return (
        <>
          <Path d="M15.5 6.5c-5 .5-10 5-11 12.5 6-1.5 12-6 12.5-11z" {...g} fill={fillIsi ?? 'none'} />
          <Path d="M15.5 6.5c.5-1.5 1.5-2.5 3-3M17 8c1.5 0 2.5.5 3 1.5" {...g} />
        </>
      );
    case 'hati':
      return <Path d="M12 19.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z" {...g} fill={fillIsi ?? 'none'} />;
    case 'tanya':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...g} />
          <Path d="M9.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6" {...g} />
          <Circle cx={12} cy={16.6} r={0.6} fill={w} stroke={w} strokeWidth={1.2} />
        </>
      );
    case 'bawah':
      return <Path d="m6 9 6 6 6-6" {...g} />;
  }
}
