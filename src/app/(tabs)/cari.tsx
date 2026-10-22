import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Foto } from '@/components/Foto';
import { Ikon } from '@/components/Ikon';
import { IlustrasiMenu } from '@/components/IlustrasiMenu';
import { Chip, Judul, SubJudul } from '@/components/ui';
import { KartuWarung } from '@/components/Warung';
import { KATEGORI, WARUNG, type KategoriId } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Cari Warung & Menu', deskripsi: 'Cari pecel, rawon, bakso, ayam geprek, jajan pasar, atau kopi dari warung fiktif di Tirtalaya. Demo aplikasi pesan-antar buatan PintuWeb.', path: '/cari' });
}

const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Cari() {
  useJudulDokumen(judulHalaman('Cari Warung & Menu'));
  const ins = useSafeAreaInsets();
  const now = useSekarang(60000);
  const [q, setQ] = useState('');
  const [kat, setKat] = useState<KategoriId | null>(null);

  const hasil = useMemo(() => {
    const k = norm(q.trim());
    const warung = WARUNG.filter((w) => (!kat || w.kategori.includes(kat)) && (!k || norm(`${w.nama} ${w.tagline} ${w.alamat}`).includes(k)));
    const menu = k
      ? WARUNG.flatMap((w) => w.bagian.flatMap((b) => b.menu.map((m) => ({ w, m })))).filter(({ w, m }) => (!kat || w.kategori.includes(kat)) && norm(`${m.nama} ${m.ket}`).includes(k))
      : [];
    return { warung, menu };
  }, [q, kat]);

  return (
    <View style={{ flex: 1 }} role="main">
      <View style={[gaya.kepala, { paddingTop: ins.top + 12 }]}>
        <Judul level={1} ukuran={26}>
          Cari
        </Judul>
        <View style={gaya.kotak}>
          <Ikon nama="cari" ukuran={20} warna={warna.tinta2} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Pecel, bakso, kopi, nama warung…"
            placeholderTextColor={warna.tinta2}
            style={gaya.input}
            aria-label="Cari warung atau menu"
            returnKeyType="search"
            autoCorrect={false}
          />
          {q ? (
            <Pressable onPress={() => setQ('')} role="button" aria-label="Hapus pencarian" style={gaya.hapus}>
              <Ikon nama="tutup" ukuran={18} warna={warna.tinta} />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }} style={{ marginTop: 12, marginHorizontal: -16 }} contentInset={{ left: 16 }}>
          <View style={{ width: 8 }} />
          <Chip label="Semua" aktif={!kat} onPress={() => setKat(null)} />
          {KATEGORI.map((k) => (
            <Chip key={k.id} label={k.nama} aktif={kat === k.id} onPress={() => setKat(kat === k.id ? null : k.id)} />
          ))}
          <View style={{ width: 8 }} />
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
        <Text style={gaya.ringkas} aria-live="polite">
          {hasil.warung.length} warung{q.trim() ? ` · ${hasil.menu.length} menu cocok dengan “${q.trim()}”` : ''}
        </Text>
        {hasil.menu.length ? (
          <>
            <SubJudul style={{ marginTop: 10, marginBottom: 8 }}>Menu</SubJudul>
            <View style={gaya.daftarMenu}>
              {hasil.menu.slice(0, 12).map(({ w, m }) => (
                <Link key={`${w.id}-${m.id}`} href={`/warung/${w.id}`} asChild>
                  <Pressable style={gaya.menu}>
                    {m.foto ? <Foto sumber={m.foto} alt="" style={gaya.menuFoto} /> : <IlustrasiMenu jenis={m.ilustrasi ?? 'mangkuk'} ukuran={56} />}
                    <View style={{ flex: 1 }}>
                      <Text style={gaya.menuNama}>{m.nama}</Text>
                      <Text style={gaya.menuWarung} numberOfLines={1}>
                        {w.nama}
                      </Text>
                    </View>
                    <Text style={gaya.menuHarga}>{rupiah(m.harga)}</Text>
                  </Pressable>
                </Link>
              ))}
            </View>
          </>
        ) : null}
        {hasil.warung.length ? (
          <>
            <SubJudul style={{ marginTop: 14, marginBottom: 8 }}>Warung</SubJudul>
            <View style={{ gap: 14 }}>
              {hasil.warung.map((w) => (
                <KartuWarung key={w.id} w={w} now={now} />
              ))}
            </View>
          </>
        ) : (
          <View style={gaya.kosong}>
            <Text style={gaya.kosongJudul}>Belum ketemu.</Text>
            <Text style={gaya.ringkas}>Coba kata lain, misalnya “rawon”, “klepon”, atau “es teh”.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const gaya = StyleSheet.create({
  kepala: { paddingHorizontal: 16, paddingBottom: 12, backgroundColor: warna.kertas, borderBottomWidth: 1, borderColor: warna.garis },
  kotak: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: warna.putih, borderRadius: radius.pil, borderWidth: 1.5, borderColor: warna.garisTegas, paddingLeft: 14, paddingRight: 6, marginTop: 10, minHeight: 50 },
  input: { flex: 1, fontFamily: huruf.sedang, fontSize: 16, color: warna.tinta, paddingVertical: 10, minWidth: 0 },
  hapus: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  ringkas: { fontFamily: huruf.sedang, fontSize: 13.5, lineHeight: 19, color: warna.tinta2 },
  daftarMenu: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, overflow: 'hidden' },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderBottomWidth: 1, borderColor: warna.garis },
  menuFoto: { width: 56, height: 56, borderRadius: 12 },
  menuNama: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  menuWarung: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  menuHarga: { fontFamily: huruf.tebal, fontSize: 14, color: warna.tinta },
  kosong: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  kosongJudul: { fontFamily: huruf.display, fontSize: 22, color: warna.tinta },
});
