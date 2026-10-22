import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ikon } from '@/components/Ikon';
import { Layar } from '@/components/Layar';
import { Peta } from '@/components/Peta';
import { Chip, SubJudul, Tombol, TombolIkon } from '@/components/ui';
import { KELURAHAN, WARUNG } from '@/lib/data';
import { km } from '@/lib/harga';
import { JARAK_MAKS_M, namaJalanDi, rute, tempelKeJalan, type Titik } from '@/lib/peta';
import { meta, judulHalaman } from '@/lib/seo';
import { useStore, type Alamat } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Alamat Tersimpan', deskripsi: 'Simpan alamat rumah, kantor, atau kos di demo Pincuk. Pilih titik di peta ilustrasi; ongkir dihitung dari jarak rute ke warung.', path: '/alamat', noindex: true });
}

const LABEL = ['Rumah', 'Kantor', 'Kos', 'Lainnya'];

export default function HalamanAlamat() {
  useJudulDokumen(judulHalaman('Alamat Tersimpan'));
  const { s, siap, alamat: aktif, pilihAlamat, hapusAlamat, simpanAlamat } = useStore();
  const [form, setForm] = useState<Alamat | null>(null);
  const [hapus, setHapus] = useState<string | null>(null);
  const [galat, setGalat] = useState('');

  const baru = () => {
    setGalat('');
    setForm({ id: `a${Date.now().toString(36)}`, label: 'Kos', detail: '', patokan: '', x: KELURAHAN[3].x, y: KELURAHAN[3].y });
  };

  if (form) {
    const terdekat = Math.min(...WARUNG.map((w) => rute({ x: w.x, y: w.y }, form).meter));
    const terjauh = Math.max(...WARUNG.map((w) => rute({ x: w.x, y: w.y }, form).meter));
    const set = (u: Partial<Alamat>) => setForm({ ...form, ...u });
    const pilihTitik = (t: Titik) => set(tempelKeJalan(t));
    return (
      <Layar judul={s.alamat.some((a) => a.id === form.id) ? 'Ubah alamat' : 'Alamat baru'} kembali="/alamat"
        bawah={
          <View style={{ gap: 6 }}>
            {galat ? (
              <Text style={gaya.galat} role="alert">
                {galat}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Tombol label="Batal" varian="garis" onPress={() => setForm(null)} style={{ flex: 1 }} />
              <Tombol
                label="Simpan alamat"
                ikon="centang"
                style={{ flex: 1.6 }}
                onPress={() => {
                  if (form.detail.trim().length < 6) return setGalat('Tulis alamat lengkap dulu (nama jalan, gang, nomor).');
                  simpanAlamat({ ...form, detail: form.detail.trim(), patokan: form.patokan.trim() });
                  setForm(null);
                }}
              />
            </View>
          </View>
        }
      >
        <SubJudul style={{ marginBottom: 8 }}>Label</SubJudul>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {LABEL.map((l) => (
            <Chip key={l} label={l} aktif={form.label === l} onPress={() => set({ label: l })} />
          ))}
        </View>
        <Text style={gaya.label} nativeID="lbl-detail">
          Alamat lengkap
        </Text>
        <TextInput value={form.detail} onChangeText={(t) => set({ detail: t })} placeholder="Mis. Jl. Melati Gg. 2 No. 5, Pasar Lama" placeholderTextColor={warna.tinta2} style={gaya.input} aria-labelledby="lbl-detail" maxLength={120} />
        <Text style={gaya.label} nativeID="lbl-patokan">
          Patokan untuk kurir (opsional)
        </Text>
        <TextInput value={form.patokan} onChangeText={(t) => set({ patokan: t })} placeholder="Mis. rumah cat kuning, sebelah warung kelontong" placeholderTextColor={warna.tinta2} style={gaya.input} aria-labelledby="lbl-patokan" maxLength={80} />

        <SubJudul style={{ marginTop: 18, marginBottom: 4 }}>Titik di peta</SubJudul>
        <Text style={gaya.kecil}>Ketuk peta untuk menaruh pin di jalan terdekat, atau pilih kelurahan di bawah.</Text>
        <View style={gaya.peta}>
          <Peta
            label={`Peta ilustrasi pemilih titik. Pin sekarang di ${namaJalanDi(form)}.`}
            rumah={form}
            warungLain={WARUNG.map((w) => ({ x: w.x, y: w.y, warna: w.warna }))}
            onPilih={pilihTitik}
          />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }} role="group" aria-label="Kelurahan">
          {KELURAHAN.map((k) => (
            <Chip key={k.id} label={k.nama} ikon="pin" aktif={form.x === k.x && form.y === k.y} onPress={() => set({ x: k.x, y: k.y })} />
          ))}
        </View>
        <Text style={[gaya.kecil, { marginTop: 10 }]} aria-live="polite">
          Pin di {namaJalanDi(form)}. Warung terdekat {km(terdekat)}, terjauh {km(terjauh)}
          {terjauh > JARAK_MAKS_M ? ' (sebagian warung di luar jangkauan 6 km)' : ''}.
        </Text>
      </Layar>
    );
  }

  return (
    <Layar judul="Alamat tersimpan" kembali="/saya">
      <Text style={gaya.kecil}>Alamat aktif dipakai untuk menghitung jarak dan ongkir. Semua tersimpan di perangkat ini.</Text>
      <View style={{ gap: 10, marginTop: 12 }} role="radiogroup" aria-label="Alamat aktif">
        {(siap ? s.alamat : s.alamat).map((a) => {
          const pilih = a.id === aktif.id;
          return (
            <View key={a.id} style={[gaya.kartu, pilih && gaya.kartuAktif]}>
              <Pressable role="radio" aria-checked={pilih} onPress={() => pilihAlamat(a.id)} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                <View style={[gaya.radio, pilih && { borderColor: warna.sambal }]}>{pilih ? <View style={gaya.radioIsi} /> : null}</View>
                <View style={{ flex: 1 }}>
                  <Text style={gaya.judul}>
                    {a.label}
                    {pilih ? <Text style={gaya.aktif}> · dipakai sekarang</Text> : null}
                  </Text>
                  <Text style={gaya.teks}>{a.detail}</Text>
                  {a.patokan ? <Text style={gaya.kecil}>Patokan: {a.patokan}</Text> : null}
                </View>
              </Pressable>
              <View style={{ gap: 6 }}>
                <TombolIkon ikon="pensil" label={`Ubah alamat ${a.label}`} ukuran={40} onPress={() => setForm(a)} />
                {s.alamat.length > 1 ? <TombolIkon ikon="sampah" label={`Hapus alamat ${a.label}`} ukuran={40} onPress={() => setHapus(a.id)} /> : null}
              </View>
              {hapus === a.id ? (
                <View style={gaya.hapus}>
                  <Text style={gaya.teks}>Hapus alamat {a.label}?</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Tombol label="Hapus" kecil onPress={() => { hapusAlamat(a.id); setHapus(null); }} />
                    <Tombol label="Batal" kecil varian="garis" onPress={() => setHapus(null)} />
                  </View>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      <Tombol label="Tambah alamat" ikon="tambah" varian="gelap" onPress={baru} style={{ marginTop: 16 }} />
      <View style={gaya.catatan}>
        <Ikon nama="info" ukuran={18} warna={warna.tinta2} />
        <Text style={[gaya.kecil, { flex: 1 }]}>Peta Tirtalaya di aplikasi ini ilustrasi, bukan peta sungguhan. Di aplikasi klien, titik bisa diambil dari GPS dan layanan peta pilihan klien.</Text>
      </View>
    </Layar>
  );
}

const gaya = StyleSheet.create({
  kecil: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  teks: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 20, color: warna.tinta },
  judul: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 22, color: warna.tinta },
  aktif: { fontFamily: huruf.tebal, fontSize: 13, color: warna.daun },
  kartu: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1.5, borderColor: warna.garis, padding: 14 },
  kartuAktif: { borderColor: warna.sambal },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: warna.garisTegas, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  radioIsi: { width: 11, height: 11, borderRadius: 6, backgroundColor: warna.sambal },
  hapus: { width: '100%', gap: 8, borderTopWidth: 1, borderColor: warna.garis, paddingTop: 10 },
  label: { fontFamily: huruf.tebal, fontSize: 14, color: warna.tinta, marginTop: 16, marginBottom: 6 },
  input: { fontFamily: huruf.sedang, fontSize: 15.5, color: warna.tinta, borderWidth: 1.5, borderColor: warna.garisTegas, borderRadius: radius.sedang, paddingHorizontal: 14, minHeight: 48, backgroundColor: warna.putih },
  peta: { marginTop: 10, borderRadius: radius.besar, overflow: 'hidden', borderWidth: 1, borderColor: warna.garis },
  galat: { fontFamily: huruf.tebal, fontSize: 13.5, color: warna.sambalTua, textAlign: 'center' },
  catatan: { flexDirection: 'row', gap: 8, marginTop: 18, alignItems: 'flex-start' },
});
