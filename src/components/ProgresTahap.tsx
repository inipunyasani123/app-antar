import { StyleSheet, Text, View } from 'react-native';
import { TAHAP } from '@/lib/pesanan';
import { huruf, warna } from '@/lib/theme';
import { Ikon, type NamaIkon } from './Ikon';

const IKON: NamaIkon[] = ['nota', 'wajan', 'tas', 'motor', 'rumah'];

/**
 * Garis progres 5 tahap (Diterima → Sampai). `tahap` = indeks TAHAP (1..5).
 * Tahap aktif diberi aria-current="step"; status juga ditulis sebagai teks, bukan warna saja.
 */
export function ProgresTahap({ tahap, gelap, ringkas }: { tahap: number; gelap?: boolean; ringkas?: boolean }) {
  const daftar = TAHAP.slice(1);
  const garisSelesai = gelap ? warna.kunyit : warna.daun;
  const garisBelum = gelap ? 'rgba(251,243,228,0.35)' : warna.garisTegas;
  return (
    <View style={gaya.wadah} role="list" aria-label={`Tahap ${Math.min(tahap, 5)} dari 5: ${TAHAP[Math.min(tahap, 5)]?.pendek}`}>
      {daftar.map((t, i) => {
        const idx = i + 1;
        const selesai = tahap > idx || tahap === 5;
        const kini = tahap === idx && tahap !== 5;
        const ukuran = ringkas ? 30 : 36;
        return (
          <View key={t.id} style={gaya.langkah} role="listitem" aria-current={kini ? 'step' : undefined} aria-label={`${t.pendek}${selesai ? ', selesai' : kini ? ', sedang berjalan' : ', belum'}`}>
            {i > 0 ? <View style={[gaya.garis, { top: ukuran / 2 - 1.5, backgroundColor: tahap >= idx ? garisSelesai : garisBelum }]} /> : null}
            <View
              style={[
                gaya.bulat,
                { width: ukuran, height: ukuran, borderRadius: ukuran / 2 },
                selesai && { backgroundColor: garisSelesai, borderColor: garisSelesai },
                kini && { backgroundColor: warna.kunyit, borderColor: gelap ? warna.kertas : warna.tinta, transform: [{ scale: 1.08 }] },
                !selesai && !kini && { backgroundColor: gelap ? 'transparent' : warna.putih, borderColor: garisBelum },
              ]}
            >
              <Ikon nama={selesai && !kini ? 'centang' : IKON[i]} ukuran={ringkas ? 16 : 19} warna={selesai || kini ? warna.tinta : gelap ? warna.kertas : warna.tinta2} tebal={selesai && !kini ? 3 : 2} />
            </View>
            <Text style={[gaya.label, { color: gelap ? (selesai || kini ? warna.kertas : '#D3E3D2') : selesai || kini ? warna.tinta : warna.tinta2 }, kini && { fontFamily: huruf.hitam }]} numberOfLines={1}>
              {t.pendek}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const gaya = StyleSheet.create({
  wadah: { flexDirection: 'row', alignItems: 'flex-start' },
  langkah: { flex: 1, alignItems: 'center', gap: 4 },
  garis: { position: 'absolute', height: 3, right: '50%', left: '-50%', borderRadius: 2 },
  bulat: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, zIndex: 1 },
  label: { fontFamily: huruf.tebal, fontSize: 12, lineHeight: 16 },
});
