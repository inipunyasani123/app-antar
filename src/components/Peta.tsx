import { useId, useState } from 'react';
import { View, type GestureResponderEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Line, Path, Pattern, Rect, Text as SvgText } from 'react-native-svg';
import { JALAN_X, JALAN_Y, NAMA_JALAN, PETA, posisiDiRute, type Titik } from '@/lib/peta';
import { huruf, warna } from '@/lib/theme';

type PenandaWarung = Titik & { warna: string; nama?: string; redup?: boolean };

type Props = {
  label: string; // deskripsi untuk pembaca layar
  rute?: Titik[];
  progres?: number; // bagian rute yang sudah dilewati (0..1)
  kurir?: (Titik & { arah: number }) | null;
  warung?: PenandaWarung | null;
  warungLain?: PenandaWarung[];
  rumah?: (Titik & { label?: string }) | null;
  onPilih?: (t: Titik) => void;
  style?: StyleProp<ViewStyle>;
  tinggi?: number; // pratinjau tipis: tinggi tetap, peta dipotong di tengah
  mini?: boolean; // tanpa label nama tempat & jalan
};

const fontLabel = huruf.tebal as string;

/** Peta ILUSTRASI Kota Tirtalaya (bukan ubin peta sungguhan). */
export function Peta({ label, rute, progres = 0, kurir, warung, warungLain, rumah, onPilih, style, tinggi, mini }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [lebar, setLebar] = useState(0);
  const skala = lebar ? PETA.lebar / lebar : 1;

  const ketuk = (e: GestureResponderEvent) => {
    if (!onPilih || !lebar) return;
    const { locationX, locationY } = e.nativeEvent;
    onPilih({ x: locationX * skala, y: locationY * skala });
  };

  const d = rute && rute.length > 1 ? 'M' + rute.map((t) => `${t.x} ${t.y}`).join(' L') : null;
  let dLewat: string | null = null;
  if (rute && rute.length > 1 && progres > 0) {
    const pos = posisiDiRute(rute, progres);
    const titik: Titik[] = [rute[0]];
    // ambil simpul rute yang sudah dilewati
    let total = 0;
    const panjang = rute.slice(1).reduce((s, t, i) => s + Math.abs(t.x - rute[i].x) + Math.abs(t.y - rute[i].y), 0);
    for (let i = 1; i < rute.length; i++) {
      total += Math.abs(rute[i].x - rute[i - 1].x) + Math.abs(rute[i].y - rute[i - 1].y);
      if (total / panjang <= progres) titik.push(rute[i]);
      else break;
    }
    titik.push(pos);
    dLewat = 'M' + titik.map((t) => `${t.x} ${t.y}`).join(' L');
  }

  const isi = (
    <Svg width="100%" height="100%" viewBox={`0 0 ${PETA.lebar} ${PETA.tinggi}`} preserveAspectRatio={tinggi ? 'xMidYMid slice' : 'xMidYMid meet'} aria-hidden focusable={false}>
      <Defs>
        <Pattern id={`sawah${id}`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
          <Rect width={8} height={8} fill={warna.sawah} />
          <Rect width={8} height={1.4} fill="#B9CC92" />
        </Pattern>
        <Pattern id={`rel${id}`} width={8} height={8} patternUnits="userSpaceOnUse">
          <Rect width={2} height={8} fill="#8A7360" />
        </Pattern>
      </Defs>
      {/* tanah & sawah di tepi kota */}
      <Rect width={PETA.lebar} height={PETA.tinggi} fill="#F1E4C8" />
      <Rect x={0} y={0} width={30} height={PETA.tinggi} fill={`url(#sawah${id})`} />
      <Rect x={0} y={272} width={PETA.lebar} height={28} fill={`url(#sawah${id})`} />
      <Rect x={330} y={0} width={30} height={170} fill={`url(#sawah${id})`} />
      <Rect x={0} y={0} width={PETA.lebar} height={48} fill={`url(#sawah${id})`} />

      {/* blok kampung: atap-atap kecil */}
      {BLOK.map((b, i) => (
        <Rect key={`b${i}`} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx={6} fill="#EAD9B8" />
      ))}
      {ATAP.map(([x, y, w], i) => (
        <Path key={`a${i}`} d={`M${x} ${y + 7}l${w / 2} -7l${w / 2} 7v6h-${w}z`} fill={i % 3 === 0 ? '#D99A7A' : i % 3 === 1 ? '#C98F6E' : '#DDB08F'} />
      ))}

      {/* alun-alun dengan beringin */}
      <Rect x={158} y={76} width={76} height={68} rx={8} fill="#C9DBA8" />
      <Path d="M196 80v60M162 110h68" stroke="#E9F0D8" strokeWidth={3} />
      <Circle cx={180} cy={96} r={9} fill="#7FA36A" />
      <Circle cx={212} cy={124} r={9} fill="#7FA36A" />
      <Circle cx={180} cy={96} r={4} fill="#6A8F57" />
      <Circle cx={212} cy={124} r={4} fill="#6A8F57" />

      {/* Pasar Lama */}
      <Rect x={62} y={84} width={58} height={56} rx={4} fill="#E3C79C" />
      <Path d="M62 84l9-8 9 8 9-8 9 8 9-8 9 8 4-4" stroke="#B88A5A" strokeWidth={3} fill="none" strokeLinejoin="round" />
      <Rect x={84} y={118} width={14} height={22} fill="#B88A5A" />

      {/* Kali Ijo */}
      <Path d="M-10 236C70 214 140 182 200 168S300 128 372 98" stroke={warna.kali} strokeWidth={13} fill="none" strokeLinecap="round" />
      <Path d="M-10 236C70 214 140 182 200 168S300 128 372 98" stroke="#BFDADD" strokeWidth={3} fill="none" strokeDasharray="10 14" />

      {/* rel kereta & stasiun */}
      <Line x1={186} y1={306} x2={372} y2={164} stroke={`url(#rel${id})`} strokeWidth={9} />
      <Line x1={186} y1={306} x2={372} y2={164} stroke="#8A7360" strokeWidth={1.6} />
      <Rect x={262} y={222} width={40} height={14} rx={3} fill="#C98F6E" />
      <Path d="M258 222h48l-6-7h-36z" fill="#9E6B4F" />

      {/* jalan: casing lalu badan jalan */}
      {JALAN_Y.map((y) => (
        <Line key={`cy${y}`} x1={JALAN_X[0] - 12} y1={y} x2={JALAN_X[JALAN_X.length - 1] + 12} y2={y} stroke={warna.garisTegas} strokeWidth={12} strokeLinecap="round" />
      ))}
      {JALAN_X.map((x) => (
        <Line key={`cx${x}`} x1={x} y1={JALAN_Y[0] - 12} x2={x} y2={JALAN_Y[JALAN_Y.length - 1] + 12} stroke={warna.garisTegas} strokeWidth={12} strokeLinecap="round" />
      ))}
      {JALAN_Y.map((y) => (
        <Line key={`jy${y}`} x1={JALAN_X[0] - 12} y1={y} x2={JALAN_X[JALAN_X.length - 1] + 12} y2={y} stroke={warna.jalan} strokeWidth={8.5} strokeLinecap="round" />
      ))}
      {JALAN_X.map((x) => (
        <Line key={`jx${x}`} x1={x} y1={JALAN_Y[0] - 12} x2={x} y2={JALAN_Y[JALAN_Y.length - 1] + 12} stroke={warna.jalan} strokeWidth={8.5} strokeLinecap="round" />
      ))}

      {!mini ? (
        <G>
      <SvgText x={196} y={154} fontSize={8} fontFamily={fontLabel} fill={warna.tinta2} textAnchor="middle">
        Alun-alun
      </SvgText>
      <SvgText x={91} y={152} fontSize={8} fontFamily={fontLabel} fill={warna.tinta2} textAnchor="middle">
        Pasar Lama
      </SvgText>
      <SvgText x={282} y={250} fontSize={8} fontFamily={fontLabel} fill={warna.tinta2} textAnchor="middle">
        Stasiun
      </SvgText>
      <SvgText x={64} y={205} fontSize={8} fontFamily={fontLabel} fill="#3B666D" textAnchor="middle" transform="rotate(-14 64 205)">
        Kali Ijo
      </SvgText>
      {JALAN_Y.map((y, i) => (
        <SvgText key={`ny${y}`} x={JALAN_X[1] + 50} y={y + 2.6} fontSize={6.5} fontFamily={fontLabel} fill={warna.tinta2} textAnchor="middle">
          {NAMA_JALAN.y[i]}
        </SvgText>
      ))}

        </G>
      ) : null}

      {/* rute */}
      {d ? <Path d={d} stroke={warna.sambal} strokeWidth={4} fill="none" strokeDasharray="7 6" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {dLewat ? <Path d={dLewat} stroke={warna.sambalTua} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}

      {/* warung lain */}
      {warungLain?.map((w, i) => (
        <G key={`w${i}`} opacity={w.redup ? 0.45 : 1}>
          <Circle cx={w.x} cy={w.y} r={6.5} fill={warna.putih} stroke={w.warna} strokeWidth={3} />
        </G>
      ))}

      {/* penanda warung: pin bertenda */}
      {warung ? (
        <G transform={`translate(${warung.x} ${warung.y})`}>
          <Path d="M0 0c-9-11-14-17-14-24a14 14 0 0 1 28 0c0 7-5 13-14 24z" fill={warung.warna} stroke={warna.putih} strokeWidth={2} />
          <Path d="M-8 -28h16l-2 4h-12z" fill={warna.putih} />
          <Path d="M-8 -24a2 2 0 0 0 4 0a2 2 0 0 0 4 0a2 2 0 0 0 4 0a2 2 0 0 0 4 0" fill={warna.putih} />
          <Rect x={-5} y={-21} width={10} height={6} rx={1.5} fill={warna.putih} />
        </G>
      ) : null}

      {/* penanda rumah */}
      {rumah ? (
        <G transform={`translate(${rumah.x} ${rumah.y})`}>
          <Path d="M0 0c-9-11-14-17-14-24a14 14 0 0 1 28 0c0 7-5 13-14 24z" fill={warna.tinta} stroke={warna.putih} strokeWidth={2} />
          <Path d="M-7 -23l7-6 7 6v7h-14z" fill={warna.kunyit} />
          <Rect x={-2} y={-20} width={4} height={4} fill={warna.tinta} />
        </G>
      ) : null}

      {/* kurir */}
      {kurir ? (
        <G transform={`translate(${kurir.x} ${kurir.y})`}>
          <Circle r={13} fill={warna.kunyit} stroke={warna.tinta} strokeWidth={2} />
          <G transform={kurir.arah < 0 ? 'scale(-1 1)' : undefined}>
            <Circle cx={-5} cy={4} r={3.2} fill={warna.tinta} />
            <Circle cx={6} cy={4} r={3.2} fill={warna.tinta} />
            <Path d="M-6 3h9l3-6h3M-1 -3h-4l-2 3" stroke={warna.tinta} strokeWidth={1.8} fill="none" strokeLinecap="round" />
            <Rect x={-9} y={-8} width={6} height={6} rx={1} fill={warna.sambal} />
          </G>
        </G>
      ) : null}
    </Svg>
  );

  return (
    <View style={[{ width: '100%', backgroundColor: '#F1E4C8', overflow: 'hidden' }, tinggi ? { height: tinggi } : { aspectRatio: PETA.lebar / PETA.tinggi }, style]} onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
      {onPilih ? (
        <View role="img" aria-label={label} style={{ flex: 1 }} onStartShouldSetResponder={() => true} onResponderRelease={ketuk}>
          {isi}
        </View>
      ) : (
        <View role="img" aria-label={label} style={{ flex: 1 }}>
          {isi}
        </View>
      )}
    </View>
  );
}

// blok antar-jalan [x, y, w, h]
const BLOK: [number, number, number, number][] = [
  [48, 68, 84, 84],
  [148, 68, 94, 84],
  [258, 68, 54, 84],
  [48, 168, 84, 84],
  [148, 168, 94, 84],
  [258, 168, 54, 84],
];
// atap rumah [x, y, lebar]
const ATAP: [number, number, number][] = [
  [264, 74, 14], [284, 74, 12], [264, 96, 12], [290, 100, 14], [266, 124, 14], [290, 130, 12],
  [54, 176, 14], [76, 172, 12], [100, 178, 14], [56, 200, 12], [110, 226, 14], [60, 232, 14], [84, 236, 12],
  [154, 196, 14], [176, 204, 12], [200, 194, 14], [222, 214, 12], [160, 226, 14], [190, 232, 12], [214, 236, 14],
  [262, 176, 12], [286, 186, 12],
];
