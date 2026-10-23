import { Link } from 'expo-router';
import { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ikon, type NamaIkon } from '@/components/Ikon';
import { LogoPincuk, UratDaun } from '@/components/Motif';
import { Chip, Judul, SubJudul, Tombol } from '@/components/ui';
import { judulHalaman, meta, SITUS } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { warungById } from '@/lib/data';
import { KartuWarungRingkas } from '@/components/Warung';
import { huruf, radius, warna } from '@/lib/theme';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Akun Saya', deskripsi: 'Alamat tersimpan, promo, metode bayar, dan pengaturan data demo Pincuk, aplikasi pesan-antar kuliner fiktif buatan PintuWeb.', path: '/saya' });
}

export default function Saya() {
  useJudulDokumen(judulHalaman('Akun Saya'));
  const ins = useSafeAreaInsets();
  const { s, siap, pilihBayar, resetDemo, setKenalan } = useStore();
  const now = useSekarang(60000);
  const [buka, setBuka] = useState<number | null>(null);
  const favorit = siap ? s.favorit.map((id) => warungById(id)).filter(Boolean) : [];
  const [yakin, setYakin] = useState(false);
  const [selesai, setSelesai] = useState(false);
  return (
    <View style={{ flex: 1 }} role="main">
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        <View style={[gaya.kepala, { paddingTop: ins.top + 16 }]}>
          <UratDaun />
          <Judul level={1} ukuran={26} warna={warna.kertas}>
            Saya
          </Judul>
          <Text style={gaya.sapa}>Kamu masuk sebagai tamu demo. Semua data tersimpan di perangkat ini saja.</Text>
        </View>
        <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 16 }}>
          <Baris href="/alamat" ikon="pin" judul="Alamat tersimpan" sub={siap ? `${s.alamat.length} alamat` : 'Rumah, kantor, kos'} />
          <Baris href="/promo" ikon="tiket" judul="Promo" sub="3 kode promo, syarat jelas" />
          <Baris href="/pesanan" ikon="nota" judul="Riwayat pesanan" sub="Lihat nota dan pesan lagi" />

          <SubJudul style={{ marginTop: 14 }}>Metode bayar bawaan</SubJudul>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Tunai" ikon="uang" aktif={s.bayar === 'tunai'} onPress={() => pilihBayar('tunai')} />
            <Chip label="QRIS (simulasi)" ikon="qr" aktif={s.bayar === 'qris'} onPress={() => pilihBayar('qris')} />
          </View>

          <SubJudul style={{ marginTop: 14 }}>Warung favorit</SubJudul>
          {favorit.length ? (
            <View style={{ gap: 10 }}>
              {favorit.map((w) => (
                <KartuWarungRingkas key={w!.id} w={w!} now={now} />
              ))}
            </View>
          ) : (
            <View style={gaya.favKosong}>
              <Ikon nama="hati" ukuran={22} warna={warna.sambal} />
              <Text style={[gaya.kecil, { flex: 1 }]}>Ketuk ikon hati di halaman warung untuk menyimpannya di sini.</Text>
            </View>
          )}

          <SubJudul style={{ marginTop: 14 }}>Bantuan</SubJudul>
          <View style={gaya.bantuan}>
            {TANYA.map((t, i) => (
              <View key={t.q} style={i < TANYA.length - 1 ? gaya.bantuanGaris : undefined}>
                <Pressable role="button" aria-expanded={buka === i} onPress={() => setBuka(buka === i ? null : i)} style={gaya.tanya}>
                  <Ikon nama="tanya" ukuran={20} warna={warna.daunTua} />
                  <Text style={gaya.tanyaTeks}>{t.q}</Text>
                  <View style={{ transform: [{ rotate: buka === i ? '180deg' : '0deg' }] }}>
                    <Ikon nama="bawah" ukuran={18} warna={warna.tinta} />
                  </View>
                </Pressable>
                {buka === i ? <Text style={gaya.jawab}>{t.a}</Text> : null}
              </View>
            ))}
          </View>
          <Tombol label="Lihat pengantar lagi" varian="garis" kecil ikon="info" onPress={() => setKenalan(false)} style={{ alignSelf: 'flex-start' }} />
          {siap && !s.kenalan ? <Text style={gaya.kecil}>Pengantar tampil lagi di Beranda.</Text> : null}

          <SubJudul style={{ marginTop: 14 }}>Data demo</SubJudul>
          <Text style={gaya.kecil}>Menghapus keranjang, pesanan, chat, dan alamat tambahan, lalu mengembalikan contoh awal.</Text>
          {selesai ? (
            <Text style={[gaya.kecil, { color: warna.daun, fontFamily: huruf.tebal }]} aria-live="polite">
              Data demo sudah dikembalikan ke awal.
            </Text>
          ) : yakin ? (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Tombol label="Ya, hapus" varian="utama" kecil ikon="sampah" onPress={() => { resetDemo(); setYakin(false); setSelesai(true); }} style={{ flex: 1 }} />
              <Tombol label="Batal" varian="garis" kecil onPress={() => setYakin(false)} style={{ flex: 1 }} />
            </View>
          ) : (
            <Tombol label="Atur ulang data demo" varian="garis" kecil ikon="ulang" onPress={() => setYakin(true)} />
          )}
          <View style={[gaya.tentang, { marginTop: 18 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <LogoPincuk ukuran={44} latar={warna.sambal} />
              <View style={{ flex: 1 }}>
                <Text style={gaya.tentangJudul}>Tentang demo ini</Text>
                <Text style={gaya.kecil}>Pincuk versi 1.0 · React Native + Expo</Text>
              </View>
            </View>
            <Text style={gaya.teks}>
              Pincuk adalah contoh aplikasi pesan-antar buatan PintuWeb, agensi web dan aplikasi yang berlokasi di Tulungagung. Kota Tirtalaya, warung, menu, harga, dan kurir di sini rekaan. Pembayaran
              QRIS hanya simulasi, tidak ada uang yang berpindah.
            </Text>
            <Text style={gaya.teks}>Satu kode yang sama bisa dibangun menjadi aplikasi Android, iOS, dan web.</Text>
            {Platform.OS === 'web' ? (
              <Link href={SITUS.kontak as never} style={gaya.tautan}>
                Pesan aplikasi seperti ini di PintuWeb
              </Link>
            ) : (
              <Tombol label="Pesan aplikasi seperti ini" varian="utama" onPress={() => Linking.openURL(SITUS.kontak)} />
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

function Baris({ href, ikon, judul, sub }: { href: string; ikon: NamaIkon; judul: string; sub: string }) {
  return (
    <Link href={href as never} asChild>
      <Pressable style={gaya.baris}>
        <View style={gaya.barisIkon}>
          <Ikon nama={ikon} ukuran={22} warna={warna.sambalTua} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={gaya.barisJudul}>{judul}</Text>
          <Text style={gaya.kecil}>{sub}</Text>
        </View>
        <Ikon nama="kanan" ukuran={20} warna={warna.tinta2} />
      </Pressable>
    </Link>
  );
}

const TANYA = [
  { q: 'Kenapa warung kadang tidak bisa dipesan?', a: 'Tiap warung punya jam buka sendiri dalam WIB, termasuk hari libur dan jam istirahat. Pesanan ditutup 15 menit sebelum warung tutup supaya dapur sempat memasak.' },
  { q: 'Bagaimana ongkir dihitung?', a: 'Dari panjang jalan di peta Tirtalaya antara warung dan alamat aktifmu: Rp6.000 untuk 2 km pertama, lalu Rp1.000 per 500 m. Jarak maksimal 6 km.' },
  { q: 'Bisa minta kuah atau sambal dipisah?', a: 'Bisa. Ketuk menu untuk membuka pilihannya: kuah dipisah, level sambal, tambahan lauk, atau catatan khusus. Pilihan itu ikut tercetak di nota.' },
  { q: 'Bagaimana membatalkan pesanan?', a: 'Selama pesanan masih "diterima warung" (sebelum dimasak), tombol Batalkan ada di halaman Lacak. Setelah dimasak, pesanan tidak bisa dibatalkan.' },
];

const gaya = StyleSheet.create({
  favKosong: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 14 },
  bantuan: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, paddingHorizontal: 12 },
  bantuanGaris: { borderBottomWidth: 1, borderColor: warna.garis },
  tanya: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 52, paddingVertical: 8 },
  tanyaTeks: { flex: 1, fontFamily: huruf.tebal, fontSize: 14.5, lineHeight: 20, color: warna.tinta },
  jawab: { fontFamily: huruf.sedang, fontSize: 14, lineHeight: 20, color: warna.tinta, paddingBottom: 12, paddingLeft: 30 },
  kepala: { backgroundColor: warna.daun, paddingHorizontal: 16, paddingBottom: 20, overflow: 'hidden' },
  sapa: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 20, color: '#E8F0DD', marginTop: 4 },
  baris: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.putih, borderRadius: radius.besar, padding: 12, borderWidth: 1, borderColor: warna.garis },
  barisIkon: { width: 44, height: 44, borderRadius: 14, backgroundColor: warna.sambalMuda, alignItems: 'center', justifyContent: 'center' },
  barisJudul: { fontFamily: huruf.hitam, fontSize: 15.5, lineHeight: 21, color: warna.tinta },
  kecil: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  tentang: { marginTop: 14, backgroundColor: warna.kunyitMuda, borderRadius: radius.besar, padding: 16, gap: 10 },
  tentangJudul: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 21, color: warna.tinta },
  teks: { fontFamily: huruf.sedang, fontSize: 14, lineHeight: 20, color: warna.tinta },
  tautan: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 24, color: warna.sambalTua, textDecorationLine: 'underline', paddingVertical: 6 },
});
