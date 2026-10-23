import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { KATEGORI, type Warung } from '@/lib/data';
import { km, menitJalan, ongkir, rupiah } from '@/lib/harga';
import { JARAK_MAKS_M, rute } from '@/lib/peta';
import { useStore } from '@/lib/store';
import { bayangan, huruf, radius, warna } from '@/lib/theme';
import { statusBuka, type StatusBuka } from '@/lib/waktu';
import { Foto } from './Foto';
import { Ikon } from './Ikon';
import { Tenda } from './Motif';

export const hargaMulai = (w: Warung) => Math.min(...w.bagian.flatMap((b) => b.menu.filter((m) => !m.habis).map((m) => m.harga)));

export function useInfoWarung(w: Warung, now: number | null) {
  const { alamat, siap } = useStore();
  const r = rute({ x: w.x, y: w.y }, alamat);
  const status = now ? statusBuka(w.jadwal, now) : null;
  return { meter: r.meter, ongkir: ongkir(r.meter), terjangkau: r.meter <= JARAK_MAKS_M, status, siap, menit: w.masakMenit + menitJalan(r.meter) };
}

const warnaStatus = (s: StatusBuka) =>
  s.bisaPesan ? { bg: warna.daunMuda, fg: warna.daunTua } : s.buka || s.jenis === 'istirahat' || s.jenis === 'belum' ? { bg: warna.kunyitMuda, fg: warna.tinta } : { bg: warna.sambalMuda, fg: warna.sambalTua };

/** Lencana status buka/tutup dengan alasan (libur, istirahat, belum buka). Sebelum jam diketahui tampil netral. */
export function StatusWarung({ w, now, besar, satuBaris }: { w: Warung; now: number | null; besar?: boolean; satuBaris?: boolean }) {
  if (!now) {
    return (
      <View style={[gaya.status, { backgroundColor: warna.kertas2 }]}>
        <Ikon nama="jam" ukuran={14} warna={warna.tinta2} />
        <Text style={[gaya.statusTeks, { color: warna.tinta2 }]}>Cek jam buka</Text>
      </View>
    );
  }
  const s = statusBuka(w.jadwal, now);
  const c = warnaStatus(s);
  return (
    <View style={[gaya.status, { backgroundColor: c.bg }, besar && { paddingVertical: 6 }]}>
      <Ikon nama="jam" ukuran={14} warna={c.fg} />
      <Text style={[gaya.statusTeks, { color: c.fg }]} numberOfLines={satuBaris ? 1 : undefined}>
        <Text style={{ fontFamily: huruf.hitam }}>{s.label}</Text> · {s.ket}
      </Text>
    </View>
  );
}

/** Kartu warung besar (untuk 2–3 warung teratas yang bisa dipesan). */
export function KartuWarung({ w, now }: { w: Warung; now: number | null }) {
  const info = useInfoWarung(w, now);
  const tutup = info.status ? !info.status.bisaPesan : false;
  const kat = w.kategori.map((k) => KATEGORI.find((x) => x.id === k)?.nama).filter(Boolean).slice(0, 2).join(' · ');
  return (
    <Link href={`/warung/${w.id}`} asChild>
      <Pressable style={StyleSheet.flatten([gaya.kartu, bayangan])}>
        <View style={{ opacity: tutup ? 0.62 : 1 }}>
          <Foto sumber={w.foto} alt="" style={gaya.foto} />
        </View>
        <Tenda warnaTenda={w.warna} tinggi={14} style={{ marginTop: -7 }} />
        <View style={gaya.isi}>
          <Text style={gaya.nama} numberOfLines={1}>
            {w.nama}
          </Text>
          <Text style={gaya.tagline} numberOfLines={1}>
            {w.tagline}
          </Text>
          <Text style={gaya.meta} numberOfLines={1}>
            {kat} · mulai {rupiah(hargaMulai(w))}
          </Text>
          <View style={[gaya.baris, { justifyContent: 'space-between', marginTop: 8 }]}>
            <StatusWarung w={w} now={now} />
            <Text style={gaya.ongkir}>
              ±{info.menit} mnt · {km(info.meter)} · {info.terjangkau ? rupiah(info.ongkir) : 'di luar jangkauan'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

/** Kartu warung ringkas mendatar: foto 96×96 bertepi tenda, nama, waktu-jarak-ongkir, harga mulai, status. */
export function KartuWarungRingkas({ w, now }: { w: Warung; now: number | null }) {
  const info = useInfoWarung(w, now);
  const tutup = info.status ? !info.status.bisaPesan : false;
  return (
    <Link href={`/warung/${w.id}`} asChild>
      <Pressable style={gaya.ringkas}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ opacity: tutup ? 0.6 : 1 }}>
            <Foto sumber={w.foto} alt="" style={gaya.ringkasFoto} />
          </View>
          <TendaTegak warnaTenda={w.warna} />
        </View>
        <View style={{ flex: 1, paddingVertical: 10, paddingRight: 12, gap: 2 }}>
          <Text style={gaya.ringkasNama} numberOfLines={1}>
            {w.nama}
          </Text>
          <Text style={gaya.tagline} numberOfLines={1}>
            {w.tagline}
          </Text>
          <Text style={gaya.ringkasMeta} numberOfLines={1}>
            ±{info.menit} mnt · {km(info.meter)} · {info.terjangkau ? `ongkir ${rupiah(info.ongkir)}` : 'di luar jangkauan'}
          </Text>
          <Text style={gaya.mulai} numberOfLines={1}>
            mulai {rupiah(hargaMulai(w))}
          </Text>
          <View style={{ marginTop: 4 }}>
            <StatusWarung w={w} now={now} satuBaris />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

/** Tepi tenda tegak di sisi kanan foto kartu ringkas. */
function TendaTegak({ warnaTenda }: { warnaTenda: string }) {
  let d = '';
  for (let y = 0; y < 120; y += 12) d += `M0 ${y}h4a5 6 0 0 1 0 12H0z`;
  return (
    <View style={{ width: 9, marginLeft: -4 }} aria-hidden>
      <Svg width={9} height={120} viewBox="0 0 9 120" aria-hidden focusable={false}>
        <Path d={d} fill={warnaTenda} />
      </Svg>
    </View>
  );
}

export function KerangkaKartu() {
  return (
    <View style={[gaya.ringkas, { backgroundColor: warna.kertas2, borderColor: warna.kertas2 }]} aria-hidden>
      <View style={[gaya.ringkasFoto, { backgroundColor: '#EAD9B8' }]} />
      <TendaTegak warnaTenda="#E2D2B6" />
      <View style={{ flex: 1, padding: 12, gap: 8 }}>
        <View style={{ height: 16, width: '70%', borderRadius: 6, backgroundColor: '#EAD9B8' }} />
        <View style={{ height: 12, width: '90%', borderRadius: 6, backgroundColor: '#EFE2C9' }} />
        <View style={{ height: 12, width: '55%', borderRadius: 6, backgroundColor: '#EFE2C9' }} />
      </View>
    </View>
  );
}

const gaya = StyleSheet.create({
  kartu: { backgroundColor: warna.putih, borderRadius: radius.besar, overflow: 'hidden', borderWidth: 1, borderColor: warna.garis },
  foto: { width: '100%', height: 128 },
  isi: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 14 },
  nama: { fontFamily: huruf.display, fontSize: 19, lineHeight: 25, color: warna.tinta },
  tagline: { fontFamily: huruf.sedang, fontSize: 13.5, lineHeight: 19, color: warna.tinta2 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  meta: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, color: warna.tinta2, marginTop: 2, fontVariant: ['tabular-nums'] },
  ongkir: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, color: warna.tinta, fontVariant: ['tabular-nums'] },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pil, paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start', flexShrink: 1 },
  statusTeks: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, flexShrink: 1 },
  ringkas: { flexDirection: 'row', gap: 12, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, overflow: 'hidden', minHeight: 120 },
  ringkasFoto: { width: 96, height: '100%', minHeight: 120 },
  ringkasNama: { fontFamily: huruf.display, fontSize: 17, lineHeight: 23, color: warna.tinta },
  ringkasMeta: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta, fontVariant: ['tabular-nums'] },
  mulai: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta2, fontVariant: ['tabular-nums'] },
});
