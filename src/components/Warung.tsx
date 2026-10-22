import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { KATEGORI, type Warung } from '@/lib/data';
import { km, ongkir, rupiah } from '@/lib/harga';
import { JARAK_MAKS_M, rute } from '@/lib/peta';
import { useStore } from '@/lib/store';
import { bayangan, huruf, radius, warna } from '@/lib/theme';
import { statusBuka } from '@/lib/waktu';
import { Foto } from './Foto';
import { Ikon } from './Ikon';
import { Tenda } from './Motif';

export function useInfoWarung(w: Warung, now: number | null) {
  const { alamat, siap } = useStore();
  const r = rute({ x: w.x, y: w.y }, alamat);
  const status = now ? statusBuka(w.jadwal, now) : null;
  return { meter: r.meter, ongkir: ongkir(r.meter), terjangkau: r.meter <= JARAK_MAKS_M, status, siap };
}

/** Lencana status buka/tutup. Sebelum jam diketahui (render statis) tampil netral. */
export function StatusWarung({ w, now, besar }: { w: Warung; now: number | null; besar?: boolean }) {
  if (!now) {
    return (
      <View style={[gaya.status, { backgroundColor: warna.kertas2 }]}>
        <Ikon nama="jam" ukuran={14} warna={warna.tinta2} />
        <Text style={[gaya.statusTeks, { color: warna.tinta2 }]}>Cek jam buka</Text>
      </View>
    );
  }
  const s = statusBuka(w.jadwal, now);
  const bg = s.bisaPesan ? warna.daunMuda : s.buka ? warna.kunyitMuda : warna.sambalMuda;
  const fg = s.bisaPesan ? warna.daun : s.buka ? warna.tinta : warna.sambalTua;
  return (
    <View style={[gaya.status, { backgroundColor: bg }, besar && { paddingVertical: 6 }]}>
      <Ikon nama="jam" ukuran={14} warna={fg} />
      <Text style={[gaya.statusTeks, { color: fg }]}>
        <Text style={{ fontFamily: huruf.hitam }}>{s.label}</Text> · {s.ket}
      </Text>
    </View>
  );
}

/** Kartu warung untuk daftar: foto, tenda, nama, kategori, jarak & ongkir, status. */
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
          <Text style={gaya.tagline} numberOfLines={2}>
            {w.tagline}
          </Text>
          <View style={gaya.baris}>
            <Text style={gaya.meta}>{kat}</Text>
          </View>
          <View style={[gaya.baris, { justifyContent: 'space-between', marginTop: 8 }]}>
            <StatusWarung w={w} now={now} />
            <Text style={gaya.ongkir}>
              {km(info.meter)} · {info.terjangkau ? rupiah(info.ongkir) : 'di luar jangkauan'}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const gaya = StyleSheet.create({
  kartu: { backgroundColor: warna.putih, borderRadius: radius.besar, overflow: 'hidden', borderWidth: 1, borderColor: warna.garis },
  foto: { width: '100%', height: 132 },
  isi: { paddingHorizontal: 14, paddingTop: 4, paddingBottom: 14 },
  nama: { fontFamily: huruf.hitam, fontSize: 17, lineHeight: 23, color: warna.tinta },
  tagline: { fontFamily: huruf.sedang, fontSize: 14, lineHeight: 19, color: warna.tinta2, marginTop: 2 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  meta: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  ongkir: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, color: warna.tinta },
  status: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pil, paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start', flexShrink: 1 },
  statusTeks: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, flexShrink: 1 },
});
