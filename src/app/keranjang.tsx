import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { Ikon } from '@/components/Ikon';
import { Layar } from '@/components/Layar';
import { TepiNota } from '@/components/Motif';
import { Peta } from '@/components/Peta';
import { Chip, SubJudul, Tombol, TombolIkon } from '@/components/ui';
import { cariMenu, PROMO, warungById } from '@/lib/data';
import { cekPromo, km, ongkir, rincianOngkir, rupiah } from '@/lib/harga';
import { JARAK_MAKS_M, rute } from '@/lib/peta';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { statusBuka } from '@/lib/waktu';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Keranjang', deskripsi: 'Keranjang demo Pincuk: satu warung per pesanan, ongkir dari jarak rute, promo, dan pilihan bayar tunai atau QRIS simulasi.', path: '/keranjang', noindex: true });
}

export default function Keranjang() {
  useJudulDokumen(judulHalaman('Keranjang'));
  const now = useSekarang(15000);
  const st = useStore();
  const { s, siap, alamat } = st;
  const [kodeKetik, setKodeKetik] = useState('');
  const w = s.keranjang.warungId ? warungById(s.keranjang.warungId) : undefined;

  if (!siap) {
    return (
      <Layar judul="Keranjang" kembali>
        <Text style={gaya.kecil}>Memuat keranjang…</Text>
      </Layar>
    );
  }
  if (!w || !s.keranjang.item.length) return <KeranjangKosong />;

  const item = s.keranjang.item.map((i) => ({ ...i, m: cariMenu(w.id, i.menuId)! })).filter((i) => i.m);
  const subtotal = item.reduce((n, i) => n + i.m.harga * i.qty, 0);
  const r = rute({ x: w.x, y: w.y }, alamat);
  const ok = ongkir(r.meter);
  const promo = now ? cekPromo(s.promo, subtotal, ok, r.meter, now) : null;
  const potongan = promo?.ok ? promo.potonganBarang + promo.potonganOngkir : 0;
  const total = subtotal + ok - potongan;
  const status = now ? statusBuka(w.jadwal, now) : null;
  const jauh = r.meter > JARAK_MAKS_M;
  const alasan = !status ? 'Memeriksa jam buka…' : !status.bisaPesan ? `${w.nama} ${status.buka ? 'sudah berhenti menerima pesanan' : 'sedang tutup'} (${status.ket}).` : jauh ? 'Alamat terlalu jauh (lebih dari 6 km).' : null;

  const pesan = () => {
    if (alasan || !now) return;
    const p = st.buatPesanan(now);
    if (p) router.replace(`/lacak?id=${p.id}`);
  };

  return (
    <Layar
      judul="Keranjang"
      kembali={`/warung/${w.id}`}
      bawah={
        <View style={{ gap: 8 }}>
          {alasan ? (
            <Text style={gaya.alasan} role="status">
              {alasan}
            </Text>
          ) : null}
          <Tombol label={s.bayar === 'qris' ? `Pesan & bayar QRIS · ${rupiah(total)}` : `Pesan sekarang · ${rupiah(total)}`} onPress={pesan} disabled={!!alasan} ikonKanan="kanan" />
        </View>
      }
    >
      {/* nota pesanan */}
      <TepiNota posisi="atas" />
      <View style={gaya.nota}>
        <Link href={`/warung/${w.id}`} style={gaya.warung}>
          {w.nama}
        </Link>
        <Text style={gaya.kecil}>{w.alamat}</Text>
        <View style={gaya.garis} />
        {item.map((i) => (
          <View key={i.menuId} style={gaya.barisItem}>
            <View style={{ flex: 1 }}>
              <Text style={gaya.itemNama}>{i.m.nama}</Text>
              <Text style={gaya.mono}>
                {i.qty} × {rupiah(i.m.harga)}
              </Text>
            </View>
            <TombolIkon ikon={i.qty === 1 ? 'sampah' : 'kurang'} label={i.qty === 1 ? `Hapus ${i.m.nama}` : `Kurangi ${i.m.nama}`} ukuran={36} onPress={() => st.qty(i.menuId, -1)} />
            <Text style={gaya.qty}>{i.qty}</Text>
            <TombolIkon ikon="tambah" label={`Tambah ${i.m.nama}`} ukuran={36} latar={warna.sambal} warnaIkon="#FFFFFF" onPress={() => st.qty(i.menuId, 1)} />
          </View>
        ))}
        <Link href={`/warung/${w.id}`} style={gaya.tautan}>
          + Tambah menu lain dari warung ini
        </Link>
        <Text style={gaya.label} nativeID="label-catatan">
          Catatan untuk warung
        </Text>
        <TextInput
          value={s.keranjang.catatan}
          onChangeText={st.catatan}
          placeholder="Mis. sambal dipisah, level 2, tanpa bawang goreng"
          placeholderTextColor={warna.tinta2}
          style={gaya.input}
          multiline
          maxLength={160}
          aria-labelledby="label-catatan"
        />
      </View>
      <TepiNota posisi="bawah" />

      {/* alamat */}
      <View style={gaya.kepalaBagian}>
        <SubJudul>Antar ke</SubJudul>
        <Link href="/alamat" style={gaya.tautanKecil}>
          Kelola alamat
        </Link>
      </View>
      <View role="radiogroup" aria-label="Pilih alamat antar" style={{ gap: 8 }}>
        {s.alamat.map((a) => {
          const m = rute({ x: w.x, y: w.y }, a).meter;
          const aktif = a.id === alamat.id;
          return (
            <Pressable key={a.id} role="radio" aria-checked={aktif} onPress={() => st.pilihAlamat(a.id)} style={[gaya.pilihan, aktif && gaya.pilihanAktif]}>
              <View style={[gaya.radio, aktif && gaya.radioAktif]}>{aktif ? <View style={gaya.radioIsi} /> : null}</View>
              <View style={{ flex: 1 }}>
                <Text style={gaya.pilihanJudul}>{a.label}</Text>
                <Text style={gaya.kecil} numberOfLines={1}>
                  {a.detail}
                </Text>
              </View>
              <Text style={[gaya.mono, { color: m > JARAK_MAKS_M ? warna.sambalTua : warna.tinta }]}>{m > JARAK_MAKS_M ? 'terlalu jauh' : km(m)}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={gaya.peta}>
        <Peta label={`Peta ilustrasi rute dari ${w.nama} ke ${alamat.label}, ${km(r.meter)}`} rute={r.titik} warung={{ x: w.x, y: w.y, warna: w.warna }} rumah={alamat} />
      </View>

      {/* promo */}
      <SubJudul style={{ marginTop: 20, marginBottom: 8 }}>Promo</SubJudul>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {PROMO.map((p) => (
          <Chip key={p.kode} label={p.kode} ikon="tiket" aktif={s.promo === p.kode} onPress={() => st.pakaiPromo(s.promo === p.kode ? null : p.kode)} />
        ))}
      </View>
      <View style={gaya.kodeBaris}>
        <TextInput value={kodeKetik} onChangeText={setKodeKetik} placeholder="Ketik kode promo" placeholderTextColor={warna.tinta2} style={[gaya.input, { flex: 1, minHeight: 46 }]} autoCapitalize="characters" aria-label="Kode promo" onSubmitEditing={() => kodeKetik.trim() && st.pakaiPromo(kodeKetik.trim().toUpperCase())} />
        <Tombol label="Pakai" varian="gelap" kecil onPress={() => kodeKetik.trim() && st.pakaiPromo(kodeKetik.trim().toUpperCase())} />
      </View>
      {s.promo && promo ? (
        <Text style={[gaya.promoInfo, { color: promo.ok ? warna.daun : warna.sambalTua }]} role="status">
          {s.promo}: {promo.alasan}
        </Text>
      ) : null}

      {/* bayar */}
      <SubJudul style={{ marginTop: 20, marginBottom: 8 }}>Bayar</SubJudul>
      <View role="radiogroup" aria-label="Metode bayar" style={{ gap: 8 }}>
        {(
          [
            { id: 'tunai', judul: 'Tunai ke kurir', sub: 'Siapkan uang pas kalau bisa', ikon: 'uang' },
            { id: 'qris', judul: 'QRIS (simulasi)', sub: 'Kode QR contoh, tidak ada uang yang berpindah', ikon: 'qr' },
          ] as const
        ).map((m) => {
          const aktif = s.bayar === m.id;
          return (
            <Pressable key={m.id} role="radio" aria-checked={aktif} onPress={() => st.pilihBayar(m.id)} style={[gaya.pilihan, aktif && gaya.pilihanAktif]}>
              <View style={[gaya.radio, aktif && gaya.radioAktif]}>{aktif ? <View style={gaya.radioIsi} /> : null}</View>
              <Ikon nama={m.ikon} ukuran={24} warna={warna.tinta} />
              <View style={{ flex: 1 }}>
                <Text style={gaya.pilihanJudul}>{m.judul}</Text>
                <Text style={gaya.kecil}>{m.sub}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ringkasan */}
      <View style={gaya.ringkas}>
        <Baris kiri="Subtotal" kanan={rupiah(subtotal)} />
        <Baris kiri="Ongkir" kanan={rupiah(ok)} />
        <Text style={[gaya.mono, { marginTop: -2, marginBottom: 4 }]}>{rincianOngkir(r.meter)}</Text>
        {potongan ? <Baris kiri={`Promo ${s.promo}`} kanan={`−${rupiah(potongan)}`} warnaKanan={warna.daun} /> : null}
        <View style={gaya.garis} />
        <Baris kiri="Total" kanan={rupiah(total)} tebal />
      </View>
    </Layar>
  );
}

function Baris({ kiri, kanan, tebal, warnaKanan }: { kiri: string; kanan: string; tebal?: boolean; warnaKanan?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 }}>
      <Text style={tebal ? gaya.total : gaya.ringkasTeks}>{kiri}</Text>
      <Text style={[tebal ? gaya.total : gaya.ringkasTeks, warnaKanan && { color: warnaKanan }]}>{kanan}</Text>
    </View>
  );
}

function KeranjangKosong() {
  return (
    <Layar judul="Keranjang" kembali>
      <View style={{ alignItems: 'center', paddingVertical: 36, gap: 10 }}>
        <Svg width={150} height={120} viewBox="0 0 150 120" aria-hidden focusable={false}>
          <Ellipse cx={75} cy={108} rx={52} ry={6} fill="rgba(43,27,18,0.12)" />
          <Path d="M30 46h90L79 104a5 5 0 0 1-8 0z" fill={warna.daun} />
          <Path d="M75 48v50M75 62l-18-12M75 76l-13-11M75 62l18-12M75 76l13-11" stroke="#8DB27A" strokeWidth={2.4} strokeLinecap="round" />
          <Path d="M30 46h90l-5 7H35z" fill={warna.daunTua} />
          <Path d="M62 16c-3 5 3 8 0 13M75 10c-3 5 3 8 0 13M88 16c-3 5 3 8 0 13" stroke={warna.garisTegas} strokeWidth={3} strokeLinecap="round" fill="none" />
        </Svg>
        <Text style={gaya.kosongJudul}>Pincukmu masih kosong</Text>
        <Text style={[gaya.kecil, { textAlign: 'center', maxWidth: 280 }]}>Pilih warung yang sedang buka, tambahkan menu, lalu kembali ke sini untuk cek ongkir dan bayar.</Text>
        <Link href="/" asChild>
          <Tombol label="Cari warung" ikon="cari" style={{ marginTop: 8 }} />
        </Link>
      </View>
    </Layar>
  );
}

const gaya = StyleSheet.create({
  nota: { backgroundColor: warna.putih, paddingHorizontal: 16, paddingVertical: 10 },
  warung: { fontFamily: huruf.display, fontSize: 20, lineHeight: 26, color: warna.sambalTua },
  kecil: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  mono: { fontFamily: huruf.mono, fontSize: 12.5, lineHeight: 18, color: warna.tinta2 },
  garis: { borderTopWidth: 1.5, borderColor: warna.garisTegas, borderStyle: 'dashed', marginVertical: 10 },
  barisItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  itemNama: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  qty: { fontFamily: huruf.hitam, fontSize: 16, minWidth: 20, textAlign: 'center', color: warna.tinta },
  tautan: { fontFamily: huruf.hitam, fontSize: 14, lineHeight: 22, color: warna.sambalTua, marginTop: 6, paddingVertical: 6 },
  tautanKecil: { fontFamily: huruf.hitam, fontSize: 14, lineHeight: 22, color: warna.sambalTua, textDecorationLine: 'underline', paddingVertical: 4 },
  label: { fontFamily: huruf.tebal, fontSize: 13.5, color: warna.tinta, marginTop: 10, marginBottom: 6 },
  input: { fontFamily: huruf.sedang, fontSize: 15, color: warna.tinta, borderWidth: 1.5, borderColor: warna.garisTegas, borderRadius: radius.sedang, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: warna.kertas, minHeight: 64, textAlignVertical: 'top' },
  kepalaBagian: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
  pilihan: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.putih, borderRadius: radius.sedang, borderWidth: 1.5, borderColor: warna.garis, padding: 12, minHeight: 56 },
  pilihanAktif: { borderColor: warna.sambal, backgroundColor: '#FFF8F3' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: warna.garisTegas, alignItems: 'center', justifyContent: 'center' },
  radioAktif: { borderColor: warna.sambal },
  radioIsi: { width: 11, height: 11, borderRadius: 6, backgroundColor: warna.sambal },
  pilihanJudul: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  peta: { marginTop: 10, borderRadius: radius.besar, overflow: 'hidden', borderWidth: 1, borderColor: warna.garis },
  kodeBaris: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 10 },
  promoInfo: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, marginTop: 8 },
  ringkas: { marginTop: 20, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 16 },
  ringkasTeks: { fontFamily: huruf.sedang, fontSize: 14.5, color: warna.tinta },
  total: { fontFamily: huruf.hitam, fontSize: 17, color: warna.tinta },
  alasan: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, color: warna.sambalTua, textAlign: 'center' },
  kosongJudul: { fontFamily: huruf.display, fontSize: 22, color: warna.tinta, textAlign: 'center' },
});
