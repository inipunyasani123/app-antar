import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Foto } from '@/components/Foto';
import { Ikon } from '@/components/Ikon';
import { LogoPincuk, Tenda, UratDaun } from '@/components/Motif';
import { Judul, SubJudul, Tombol } from '@/components/ui';
import { KartuWarung } from '@/components/Warung';
import { KATEGORI, KOTA, WARUNG, warungById, type KategoriId } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { rute } from '@/lib/peta';
import { statusPesanan, TAHAP } from '@/lib/pesanan';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { bayangan, huruf, radius, warna } from '@/lib/theme';
import { bagianHari, jamDari, statusBuka, type BagianHari } from '@/lib/waktu';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ path: '/' });
}

const SAPAAN: Record<BagianHari, { judul: string; utama: KategoriId }> = {
  pagi: { judul: 'Sarapan apa pagi ini?', utama: 'sarapan' },
  siang: { judul: 'Makan siang apa?', utama: 'nasi' },
  sore: { judul: 'Teman ngeteh sore?', utama: 'jajan' },
  malam: { judul: 'Lapar malam-malam?', utama: 'kuah' },
};

export default function Beranda() {
  useJudulDokumen(judulHalaman());
  const ins = useSafeAreaInsets();
  const now = useSekarang(30000);
  const { s, siap, alamat, pesanLagi } = useStore();
  const bagian = now ? bagianHari(now) : 'siang';
  const sapa = now ? SAPAAN[bagian] : { judul: 'Mau makan apa?', utama: 'nasi' as KategoriId };

  const urut = [...WARUNG].map((w) => ({ w, st: now ? statusBuka(w.jadwal, now) : null, m: rute({ x: w.x, y: w.y }, alamat).meter }));
  const buka = now ? urut.filter((x) => x.st?.bisaPesan).sort((a, b) => a.m - b.m) : urut;
  const tutup = now ? urut.filter((x) => !x.st?.bisaPesan).sort((a, b) => a.m - b.m) : [];

  // Ubin besar tetap (supaya gambar terbesar sudah ada di HTML statis); kategori yang pas dengan jam WIB diberi tanda setelah jam diketahui.
  const utama = KATEGORI.find((k) => k.id === 'nasi')!;
  const lain = KATEGORI.filter((k) => k.id !== 'nasi');
  const pas = now ? sapa.utama : null;
  const jumlahDi = (id: KategoriId) => WARUNG.filter((w) => w.kategori.includes(id)).length;

  const berjalan = siap && now ? s.pesanan.find((p) => !p.contoh && !statusPesanan(p, now).selesai) : undefined;
  const terakhir = siap ? s.pesanan.find((p) => !p.batal && (!now || statusPesanan(p, now).selesai)) : undefined;
  const wTerakhir = terakhir ? warungById(terakhir.warungId) : undefined;
  const bisaUlang = terakhir && wTerakhir && now ? statusBuka(wTerakhir.jadwal, now).bisaPesan : false;

  return (
    <View style={{ flex: 1 }} role="main">
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* kepala bertekstur daun */}
        <View style={[gaya.kepala, { paddingTop: ins.top + 14 }]}>
          <UratDaun />
          <View style={gaya.barisAtas}>
            <LogoPincuk ukuran={40} latar={warna.sambal} />
            <Link href="/alamat" asChild>
              <Pressable style={gaya.alamat}>
                <Ikon nama="pin" ukuran={18} warna={warna.kunyit} />
                <View style={{ flex: 1 }}>
                  <Text style={gaya.alamatKecil}>Antar ke {alamat.label}</Text>
                  <Text style={gaya.alamatTeks} numberOfLines={1}>
                    {alamat.detail}
                  </Text>
                </View>
                <Ikon nama="kanan" ukuran={18} warna={warna.kertas} />
              </Pressable>
            </Link>
          </View>
          <Judul level={1} ukuran={30} warna={warna.kertas} style={{ marginTop: 18 }}>
            {sapa.judul}
          </Judul>
          <Text style={gaya.subKepala}>
            {now ? `${buka.length} dari ${WARUNG.length} warung bisa pesan · ${jamDari(now)} WIB` : `Warung tetangga di ${KOTA}, Jawa Timur`}
          </Text>
          <Link href="/cari" asChild>
            <Pressable style={gaya.cari}>
              <Ikon nama="cari" ukuran={20} warna={warna.tinta2} />
              <Text style={gaya.cariTeks}>Cari pecel, bakso, kopi…</Text>
            </Pressable>
          </Link>
        </View>
        <Tenda warnaTenda={warna.daunTua} tinggi={14} />

        <View style={gaya.isi}>
          {berjalan ? (
            <Link href={`/lacak?id=${berjalan.id}`} asChild>
              <Pressable style={gaya.berjalan}>
                <Ikon nama="motor" ukuran={26} warna={warna.tinta} />
                <View style={{ flex: 1 }}>
                  <Text style={gaya.berjalanKecil}>{warungById(berjalan.warungId)?.nama}</Text>
                  <Text style={gaya.berjalanJudul}>{TAHAP[statusPesanan(berjalan, now!).tahap]?.judul}</Text>
                </View>
                <Text style={gaya.berjalanAksi}>Lacak</Text>
              </Pressable>
            </Link>
          ) : null}

          {/* bento kategori */}
          <SubJudul style={{ marginTop: 18, marginBottom: 10 }}>Mau yang mana?</SubJudul>
          <View style={gaya.bento}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <UbinKategori k={utama} besar jumlah={jumlahDi(utama.id)} pas={pas === utama.id} />
              <View style={{ flex: 1, gap: 10 }}>
                <UbinKategori k={lain[0]} jumlah={jumlahDi(lain[0].id)} pas={pas === lain[0].id} />
                <UbinKategori k={lain[1]} jumlah={jumlahDi(lain[1].id)} pas={pas === lain[1].id} />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {lain.slice(2).map((k) => (
                <UbinKategori key={k.id} k={k} kecil jumlah={jumlahDi(k.id)} pas={pas === k.id} />
              ))}
            </View>
            <Link href="/promo" asChild>
              <Pressable style={gaya.promo}>
                <View style={gaya.promoTiket}>
                  <Ikon nama="tiket" ukuran={22} warna={warna.tinta} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={gaya.promoJudul}>3 promo bisa dipakai</Text>
                  <Text style={gaya.promoSub}>Potong ongkir, diskon sarapan, gratis ongkir bareng</Text>
                </View>
                <Ikon nama="kanan" ukuran={20} warna={warna.tinta} />
              </Pressable>
            </Link>
          </View>

          {!siap ? <View style={[gaya.ulang, { minHeight: 150, borderStyle: 'dashed' }]} aria-hidden /> : null}
          {terakhir && wTerakhir ? (
            <View style={[gaya.ulang, bayangan]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Foto sumber={wTerakhir.foto} alt="" style={gaya.ulangFoto} />
                <View style={{ flex: 1 }}>
                  <Text style={gaya.ulangKecil}>Pesan lagi dari {wTerakhir.nama}</Text>
                  <Text style={gaya.ulangIsi} numberOfLines={2}>
                    {terakhir.item.map((i) => `${i.qty}× ${i.nama}`).join(', ')}
                  </Text>
                  <Text style={gaya.ulangHarga}>{rupiah(terakhir.subtotal)} + ongkir</Text>
                </View>
              </View>
              <Tombol
                label={bisaUlang ? 'Masukkan ke keranjang' : 'Warung sedang tutup'}
                ikon="ulang"
                varian={bisaUlang ? 'gelap' : 'garis'}
                kecil
                disabled={!bisaUlang}
                style={{ marginTop: 12 }}
                onPress={() => {
                  pesanLagi(terakhir);
                  router.push('/keranjang');
                }}
              />
            </View>
          ) : null}

          <SubJudul style={{ marginTop: 22, marginBottom: 10 }}>{now ? 'Bisa dipesan sekarang' : `Warung di ${KOTA}`}</SubJudul>
          <View style={{ gap: 14 }}>
            {buka.map(({ w }) => (
              <KartuWarung key={w.id} w={w} now={now} />
            ))}
          </View>
          {tutup.length ? (
            <>
              <SubJudul style={{ marginTop: 22, marginBottom: 4 }}>Sedang tutup</SubJudul>
              <Text style={gaya.catatan}>Jam buka mengikuti WIB. Menu tetap bisa dilihat, tapi pesanan baru dibuka saat warung buka.</Text>
              <View style={{ gap: 14, marginTop: 10 }}>
                {tutup.map(({ w }) => (
                  <KartuWarung key={w.id} w={w} now={now} />
                ))}
              </View>
            </>
          ) : null}
          <Text style={[gaya.catatan, { marginTop: 24, textAlign: 'center' }]}>
            Semua warung, menu, harga, dan kurir di Pincuk rekaan untuk demo. Foto hidangan berlisensi CC0/domain publik.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function UbinKategori({ k, besar, kecil, jumlah, pas }: { k: (typeof KATEGORI)[number]; besar?: boolean; kecil?: boolean; jumlah: number; pas?: boolean }) {
  return (
    <Link href={`/kategori/${k.id}`} asChild>
      <Pressable style={StyleSheet.flatten([gaya.ubin, besar ? gaya.ubinBesar : kecil ? gaya.ubinKecil : gaya.ubinSedang])}>
        <Foto sumber={k.foto} alt="" style={gaya.isiPenuh} prioritas={besar} />
        {pas ? (
          <View style={gaya.pas}>
            <Text style={gaya.pasTeks}>Pas jam segini</Text>
          </View>
        ) : null}
        <View style={[gaya.ubinLabel, besar && { padding: 10 }]}>
          {besar ? (
            <Text style={gaya.ubinBesarTeks}>{k.nama}</Text>
          ) : (
            <Text style={[gaya.ubinTeks, kecil && { fontSize: 13 }]} numberOfLines={1}>
              {k.nama}
            </Text>
          )}
          {besar ? <Text style={gaya.ubinJumlah}>{jumlah} warung</Text> : null}
        </View>
      </Pressable>
    </Link>
  );
}

const gaya = StyleSheet.create({
  kepala: { backgroundColor: warna.daun, paddingHorizontal: 16, paddingBottom: 18, overflow: 'hidden' },
  barisAtas: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  alamat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(31,77,43,0.85)', borderRadius: radius.sedang, paddingHorizontal: 12, paddingVertical: 7, minHeight: 44 },
  alamatKecil: { fontFamily: huruf.tebal, fontSize: 12, lineHeight: 16, color: warna.kunyitMuda },
  alamatTeks: { fontFamily: huruf.tebal, fontSize: 14, lineHeight: 19, color: warna.kertas },
  subKepala: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 20, color: '#E8F0DD', marginTop: 6 },
  cari: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: warna.putih, borderRadius: radius.pil, paddingHorizontal: 16, minHeight: 48, marginTop: 14 },
  cariTeks: { fontFamily: huruf.sedang, fontSize: 15, color: warna.tinta2 },
  isi: { paddingHorizontal: 16 },
  berjalan: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.kunyit, borderRadius: radius.besar, padding: 14 },
  berjalanKecil: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta },
  berjalanJudul: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 21, color: warna.tinta },
  berjalanAksi: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta, textDecorationLine: 'underline' },
  bento: { gap: 10 },
  isiPenuh: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  ubin: { borderRadius: radius.besar, overflow: 'hidden', backgroundColor: warna.kertas2, justifyContent: 'flex-end' },
  ubinBesar: { flex: 1.15, height: 222 },
  ubinSedang: { height: 106 },
  ubinKecil: { flex: 1, height: 92 },
  pas: { position: 'absolute', top: 8, left: 8, backgroundColor: warna.kunyit, borderRadius: radius.pil, paddingHorizontal: 9, paddingVertical: 3 },
  pasTeks: { fontFamily: huruf.hitam, fontSize: 11.5, lineHeight: 16, color: warna.tinta },
  ubinLabel: { margin: 8, alignSelf: 'flex-start', backgroundColor: warna.putih, borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5, maxWidth: '92%' },
  ubinTeks: { fontFamily: huruf.hitam, fontSize: 14, lineHeight: 18, color: warna.tinta },
  ubinBesarTeks: { fontFamily: huruf.display, fontSize: 21, lineHeight: 26, color: warna.sambalTua },
  ubinJumlah: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta2 },
  promo: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.kunyitMuda, borderRadius: radius.besar, padding: 14, borderWidth: 1.5, borderColor: warna.kunyit, borderStyle: 'dashed' },
  promoTiket: { width: 44, height: 44, borderRadius: 22, backgroundColor: warna.kunyit, alignItems: 'center', justifyContent: 'center' },
  promoJudul: { fontFamily: huruf.hitam, fontSize: 15.5, lineHeight: 21, color: warna.tinta },
  promoSub: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  ulang: { marginTop: 18, backgroundColor: warna.putih, borderRadius: radius.besar, padding: 14, borderWidth: 1, borderColor: warna.garis },
  ulangFoto: { width: 64, height: 64, borderRadius: 14 },
  ulangKecil: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.tinta2 },
  ulangIsi: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  ulangHarga: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, color: warna.tinta, marginTop: 2 },
  catatan: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
});
