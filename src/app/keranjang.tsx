import { Link, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ikon } from '@/components/Ikon';
import { Kosong } from '@/components/Kosong';
import { Layar } from '@/components/Layar';
import { TepiNota } from '@/components/Motif';
import { Peta } from '@/components/Peta';
import { Toast } from '@/components/Toast';
import { SubJudul, Tombol, TombolIkon } from '@/components/ui';
import { cariMenu, hargaSatuan, PROMO, ringkasPilihan, WARUNG, warungById } from '@/lib/data';
import { cekPromo, km, ongkir, rincianOngkir, rupiah } from '@/lib/harga';
import { useJudulDokumen } from '@/lib/judul';
import { JARAK_MAKS_M, rute } from '@/lib/peta';
import { judulHalaman, meta } from '@/lib/seo';
import { useSekarang, useStore, type ItemKeranjang } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { statusBuka } from '@/lib/waktu';

export function generateMetadata() {
  return meta({ judul: 'Keranjang', deskripsi: 'Keranjang demo Pincuk: satu warung per pesanan, ongkir dari jarak rute, promo, dan pilihan bayar tunai atau QRIS simulasi.', path: '/keranjang', noindex: true });
}

export default function Keranjang() {
  useJudulDokumen(judulHalaman('Keranjang'));
  const now = useSekarang(15000);
  const st = useStore();
  const { s, siap, alamat } = st;
  const [petaBesar, setPetaBesar] = useState(false);
  const [dihapus, setDihapus] = useState<{ item: ItemKeranjang; indeks: number; nama: string } | null>(null);
  const hilang = useCallback(() => setDihapus(null), []);
  const w = s.keranjang.warungId ? warungById(s.keranjang.warungId) : undefined;

  if (!siap) {
    return (
      <Layar judul="Keranjang" kembali>
        <Text style={gaya.kecil}>Memuat keranjang…</Text>
      </Layar>
    );
  }
  if (!w || !s.keranjang.item.length) {
    const buka = now ? WARUNG.filter((x) => statusBuka(x.jadwal, now).bisaPesan) : [];
    return (
      <Layar judul="Keranjang" kembali>
        <Kosong
          jenis="keranjang"
          judul="Pincukmu masih kosong"
          teks={now ? `${buka.length} warung bisa pesan sekarang. Pilih menu, lalu kembali ke sini untuk cek ongkir dan bayar.` : 'Pilih warung yang sedang buka, tambahkan menu, lalu kembali ke sini.'}
          aksi={buka[0] ? `Buka ${buka[0].nama}` : 'Cari warung'}
          href={buka[0] ? `/warung/${buka[0].id}` : '/'}
        />
        <Toast teks={dihapus ? `${dihapus.nama} dihapus` : null} aksi="Urungkan" onAksi={() => { if (dihapus) st.kembalikan(dihapus.item, dihapus.indeks); setDihapus(null); }} onHilang={hilang} />
      </Layar>
    );
  }

  const item = s.keranjang.item.map((i) => ({ ...i, m: cariMenu(w.id, i.menuId)! })).filter((i) => i.m);
  const subtotal = item.reduce((n, i) => n + hargaSatuan(i.m, i.pilih) * i.qty, 0);
  const r = rute({ x: w.x, y: w.y }, alamat);
  const ok = ongkir(r.meter);
  const promo = now ? cekPromo(s.promo, subtotal, ok, r.meter, now) : null;
  const potongan = promo?.ok ? promo.potonganBarang + promo.potonganOngkir : 0;
  const total = subtotal + ok - potongan;
  const status = now ? statusBuka(w.jadwal, now) : null;
  const jauh = r.meter > JARAK_MAKS_M;
  const alasan = !status ? 'Memeriksa jam buka…' : !status.bisaPesan ? `${w.nama}: ${status.label.toLowerCase()}, ${status.ket}.` : jauh ? 'Alamat terlalu jauh (lebih dari 6 km).' : null;

  const kurangi = (i: (typeof item)[number], indeks: number) => {
    if (i.qty === 1) setDihapus({ item: { kunci: i.kunci, menuId: i.menuId, qty: 1, pilih: i.pilih, catatan: i.catatan }, indeks, nama: i.m.nama });
    st.qty(i.kunci, -1);
  };
  const pesan = () => {
    if (alasan || !now) return;
    const p = st.buatPesanan(now);
    if (p) router.replace(`/lacak?id=${p.id}`);
  };

  return (
    <View style={{ flex: 1 }}>
      <Layar
        judul="Keranjang"
        kembali={`/warung/${w.id}`}
        bawah={
          <View style={{ gap: 8 }}>
            <View style={gaya.ringkasBaris}>
              <Text style={gaya.ringkasKecil}>
                {rupiah(subtotal)} + ongkir {rupiah(ok)}
                {potongan ? ` − promo ${rupiah(potongan)}` : ''}
              </Text>
              <Text style={gaya.ringkasTotal}>{rupiah(total)}</Text>
            </View>
            {alasan ? (
              <Text style={gaya.alasan} role="status">
                {alasan}
              </Text>
            ) : null}
            <Tombol label={s.bayar === 'qris' ? `Pesan & bayar QRIS · ${rupiah(total)}` : `Pesan sekarang · ${rupiah(total)}`} onPress={pesan} disabled={!!alasan} ikonKanan="kanan" />
          </View>
        }
      >
        {/* 1. Pesanan */}
        <SubJudul style={gaya.judulKartu}>1 · Pesanan</SubJudul>
        <TepiNota posisi="atas" />
        <View style={gaya.nota}>
          <Link href={`/warung/${w.id}`} style={gaya.warung}>
            {w.nama}
          </Link>
          <Text style={gaya.kecil}>{w.alamat}</Text>
          <View style={gaya.garis} />
          {item.map((i, n) => {
            const teksOpsi = ringkasPilihan(i.m, i.pilih);
            return (
              <View key={i.kunci} style={gaya.barisItem}>
                <View style={{ flex: 1 }}>
                  <Text style={gaya.itemNama}>{i.m.nama}</Text>
                  {teksOpsi ? <Text style={gaya.opsi}>{teksOpsi}</Text> : null}
                  {i.catatan ? <Text style={gaya.opsi}>Catatan: {i.catatan}</Text> : null}
                  <Text style={gaya.mono}>
                    {i.qty} × {rupiah(hargaSatuan(i.m, i.pilih))}
                  </Text>
                </View>
                <TombolIkon ikon={i.qty === 1 ? 'sampah' : 'kurang'} label={i.qty === 1 ? `Hapus ${i.m.nama}` : `Kurangi ${i.m.nama}`} onPress={() => kurangi(i, n)} />
                <Text style={gaya.qty}>{i.qty}</Text>
                <TombolIkon ikon="tambah" label={`Tambah ${i.m.nama}`} latar={warna.sambal} warnaIkon="#FFFFFF" onPress={() => st.qty(i.kunci, 1)} />
              </View>
            );
          })}
          <Link href={`/warung/${w.id}`} style={gaya.tautan}>
            + Tambah menu lain dari warung ini
          </Link>
          <Text style={gaya.label} nativeID="label-catatan">
            Catatan untuk warung
          </Text>
          <TextInput value={s.keranjang.catatan} onChangeText={st.catatan} placeholder="Mis. sambal dipisah semua, tanpa sendok plastik" placeholderTextColor={warna.tinta2} style={gaya.input} multiline maxLength={160} aria-labelledby="label-catatan" />
        </View>
        <TepiNota posisi="bawah" />

        {/* 2. Antar ke */}
        <View style={[gaya.kepalaKartu, { marginTop: 18 }]}>
          <SubJudul>2 · Antar ke</SubJudul>
          <Link href="/alamat" style={gaya.tautanKecil}>
            Kelola alamat
          </Link>
        </View>
        <View style={gaya.kartu}>
          <View role="radiogroup" aria-label="Pilih alamat antar" style={{ gap: 6 }}>
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
          <Pressable role="button" aria-expanded={petaBesar} onPress={() => setPetaBesar(!petaBesar)} style={gaya.peta}>
            <Peta label={`Peta ilustrasi rute dari ${w.nama} ke ${alamat.label}, ${km(r.meter)}`} rute={r.titik} warung={{ x: w.x, y: w.y, warna: w.warna }} rumah={alamat} tinggi={petaBesar ? undefined : 120} />
            <View style={gaya.petaLabel}>
              <Ikon nama={petaBesar ? 'tutup' : 'cari'} ukuran={16} warna={warna.tinta} />
              <Text style={gaya.petaLabelTeks}>{petaBesar ? 'Perkecil peta' : 'Perbesar peta'}</Text>
            </View>
          </Pressable>
          <Text style={[gaya.mono, { marginTop: 8 }]}>{rincianOngkir(r.meter)}</Text>
        </View>

        {/* 3. Bayar */}
        <SubJudul style={[gaya.judulKartu, { marginTop: 18 }]}>3 · Bayar</SubJudul>
        <View style={gaya.kartu}>
          <View role="radiogroup" aria-label="Metode bayar" style={{ gap: 6 }}>
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
          <Text style={[gaya.label, { marginTop: 14 }]}>Promo (satu per pesanan)</Text>
          <View style={{ gap: 8 }}>
            {PROMO.map((p) => {
              const c = now ? cekPromo(p.kode, subtotal, ok, r.meter, now) : null;
              const dipakai = s.promo === p.kode;
              const status = !c ? '' : c.ok ? (dipakai ? `Terpasang · −${rupiah(c.potonganBarang + c.potonganOngkir)}` : `Bisa dipakai · hemat ${rupiah(c.potonganBarang + c.potonganOngkir)}`) : c.alasan;
              return (
                <Pressable key={p.kode} role="checkbox" aria-checked={dipakai} onPress={() => st.pakaiPromo(dipakai ? null : p.kode)} style={[gaya.kupon, dipakai && { borderColor: warna.daun, backgroundColor: '#F2F7EC' }]}>
                  <View style={[gaya.kuponSobek, { backgroundColor: p.warna }]}>
                    <Ikon nama={dipakai ? 'centang' : 'tiket'} ukuran={20} warna={p.warna === warna.kunyit ? warna.tinta : '#FFFFFF'} tebal={dipakai ? 3 : 2} />
                  </View>
                  <View style={{ flex: 1, paddingVertical: 8, paddingRight: 10 }}>
                    <Text style={gaya.kuponJudul}>
                      {p.judul} <Text style={gaya.kuponKode}>{p.kode}</Text>
                    </Text>
                    <Text style={[gaya.kuponStatus, { color: c?.ok ? warna.daunTua : warna.tinta2 }]}>{status}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ringkasan */}
        <View style={gaya.ringkas}>
          <Baris kiri="Subtotal" kanan={rupiah(subtotal)} />
          <Baris kiri={`Ongkir (${km(r.meter)})`} kanan={rupiah(ok)} />
          {potongan ? <Baris kiri={`Promo ${s.promo}`} kanan={`−${rupiah(potongan)}`} warnaKanan={warna.daunTua} /> : null}
          <View style={gaya.garis} />
          <Baris kiri="Total" kanan={rupiah(total)} tebal />
        </View>
      </Layar>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 150 }} pointerEvents="box-none">
        <Toast teks={dihapus ? `${dihapus.nama} dihapus` : null} aksi="Urungkan" onAksi={() => { if (dihapus) st.kembalikan(dihapus.item, dihapus.indeks); setDihapus(null); }} onHilang={hilang} />
      </View>
    </View>
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

const gaya = StyleSheet.create({
  judulKartu: { marginBottom: 8 },
  kepalaKartu: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  kartu: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 12 },
  nota: { backgroundColor: warna.putih, paddingHorizontal: 16, paddingVertical: 10 },
  warung: { fontFamily: huruf.display, fontSize: 20, lineHeight: 26, color: warna.sambalTua },
  kecil: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  mono: { fontFamily: huruf.mono, fontSize: 12.5, lineHeight: 18, color: warna.tinta2 },
  opsi: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17, color: warna.daunTua },
  garis: { borderTopWidth: 1.5, borderColor: warna.garisTegas, borderStyle: 'dashed', marginVertical: 10 },
  barisItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  itemNama: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  qty: { fontFamily: huruf.hitam, fontSize: 16, minWidth: 20, textAlign: 'center', color: warna.tinta, fontVariant: ['tabular-nums'] },
  tautan: { fontFamily: huruf.hitam, fontSize: 14, lineHeight: 22, color: warna.sambalTua, marginTop: 6, paddingVertical: 11 },
  tautanKecil: { fontFamily: huruf.hitam, fontSize: 14, lineHeight: 22, color: warna.sambalTua, textDecorationLine: 'underline', paddingVertical: 11 },
  label: { fontFamily: huruf.tebal, fontSize: 13.5, color: warna.tinta, marginTop: 6, marginBottom: 6 },
  input: { fontFamily: huruf.sedang, fontSize: 15, color: warna.tinta, borderWidth: 1.5, borderColor: warna.garisTegas, borderRadius: radius.sedang, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: warna.kertas, minHeight: 64, textAlignVertical: 'top' },
  pilihan: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radius.sedang, borderWidth: 1.5, borderColor: warna.garis, padding: 10, minHeight: 56 },
  pilihanAktif: { borderColor: warna.daun, backgroundColor: '#F2F7EC' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: warna.garisTegas, alignItems: 'center', justifyContent: 'center' },
  radioAktif: { borderColor: warna.daun },
  radioIsi: { width: 11, height: 11, borderRadius: 6, backgroundColor: warna.daun },
  pilihanJudul: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  peta: { marginTop: 10, borderRadius: radius.sedang, overflow: 'hidden', borderWidth: 1, borderColor: warna.garis },
  petaLabel: { position: 'absolute', right: 8, bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: warna.putih, borderRadius: radius.pil, paddingHorizontal: 10, paddingVertical: 5 },
  petaLabelTeks: { fontFamily: huruf.tebal, fontSize: 12.5, color: warna.tinta },
  kupon: { flexDirection: 'row', alignItems: 'stretch', gap: 10, borderRadius: radius.sedang, borderWidth: 1.5, borderColor: warna.garis, overflow: 'hidden', minHeight: 56 },
  kuponSobek: { width: 44, alignItems: 'center', justifyContent: 'center', borderRightWidth: 2, borderStyle: 'dashed', borderColor: warna.putih },
  kuponJudul: { fontFamily: huruf.hitam, fontSize: 14.5, lineHeight: 20, color: warna.tinta },
  kuponKode: { fontFamily: huruf.mono, fontSize: 12, color: warna.tinta2 },
  kuponStatus: { fontFamily: huruf.tebal, fontSize: 13, lineHeight: 18, fontVariant: ['tabular-nums'] },
  ringkas: { marginTop: 18, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 16 },
  ringkasTeks: { fontFamily: huruf.sedang, fontSize: 14.5, color: warna.tinta, fontVariant: ['tabular-nums'] },
  total: { fontFamily: huruf.hitam, fontSize: 17, color: warna.tinta, fontVariant: ['tabular-nums'] },
  ringkasBaris: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  ringkasKecil: { flex: 1, fontFamily: huruf.sedang, fontSize: 13, color: warna.tinta2, fontVariant: ['tabular-nums'] },
  ringkasTotal: { fontFamily: huruf.display, fontSize: 20, color: warna.tinta, fontVariant: ['tabular-nums'] },
  alasan: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, color: warna.sambalTua, textAlign: 'center' },
});
