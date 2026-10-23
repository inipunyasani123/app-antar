import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Foto } from '@/components/Foto';
import { Ikon } from '@/components/Ikon';
import { IlustrasiMenu } from '@/components/IlustrasiMenu';
import { Kosong } from '@/components/Kosong';
import { Tenda, UratDaun } from '@/components/Motif';
import { Chip, Judul, SubJudul } from '@/components/ui';
import { KartuWarungRingkas } from '@/components/Warung';
import { KATEGORI, WARUNG, warungById, type KategoriId } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { useJudulDokumen } from '@/lib/judul';
import { judulHalaman, meta } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { statusBuka } from '@/lib/waktu';

export function generateMetadata() {
  return meta({ judul: 'Cari Warung & Menu', deskripsi: 'Cari pecel, rawon, bakso, rujak cingur, terang bulan, atau kopi dari warung fiktif di Tirtalaya. Demo aplikasi pesan-antar buatan PintuWeb.', path: '/cari' });
}

const SERING = ['pecel', 'rawon', 'bakso urat', 'rujak cingur', 'es teh', 'klepon', 'terang bulan'];
const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export default function Cari() {
  useJudulDokumen(judulHalaman('Cari Warung & Menu'));
  const ins = useSafeAreaInsets();
  const now = useSekarang(60000);
  const { s, siap, simpanCari } = useStore();
  const [q, setQ] = useState('');
  const [kat, setKat] = useState<KategoriId | null>(null);
  const kata = norm(q.trim());

  const hasil = useMemo(() => {
    const warung = WARUNG.filter((w) => (!kat || w.kategori.includes(kat)) && (!kata || norm(`${w.nama} ${w.tagline} ${w.alamat}`).includes(kata)));
    const menu = kata
      ? WARUNG.flatMap((w) => w.bagian.flatMap((b) => b.menu.map((m) => ({ w, m })))).filter(({ w, m }) => (!kat || w.kategori.includes(kat)) && norm(`${m.nama} ${m.ket}`).includes(kata))
      : [];
    return { warung, menu };
  }, [kata, kat]);

  const simpan = () => q.trim().length >= 2 && simpanCari(q.trim());
  const dilihat = siap ? s.dilihat.map((id) => warungById(id)).filter(Boolean).slice(0, 3) : [];

  return (
    <View style={{ flex: 1 }} role="main">
      <View style={[gaya.kepala, { paddingTop: ins.top + 12 }]}>
        <UratDaun />
        <Judul level={1} ukuran={26} warna={warna.kertas}>
          Cari
        </Judul>
        <View style={gaya.kotak}>
          <Ikon nama="cari" ukuran={20} warna={warna.tinta2} />
          <TextInput
            value={q}
            onChangeText={setQ}
            onSubmitEditing={simpan}
            onBlur={simpan}
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
      </View>
      <Tenda warnaTenda={warna.daun} tinggi={12} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, paddingVertical: 8 }} style={{ flexGrow: 0, flexShrink: 0 }}>
        <Chip label="Semua" aktif={!kat} aksen={warna.daun} onPress={() => setKat(null)} />
        {KATEGORI.map((k) => (
          <Chip key={k.id} label={k.nama} aktif={kat === k.id} aksen={warna.daun} onPress={() => setKat(kat === k.id ? null : k.id)} />
        ))}
      </ScrollView>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
        {!kata ? (
          <>
            <SubJudul style={gaya.judul}>Sering dicari</SubJudul>
            <View style={gaya.chips}>
              {SERING.map((t) => (
                <Chip key={t} label={t} onPress={() => { setQ(t); simpanCari(t); }} />
              ))}
            </View>
            {siap && s.cariTerakhir.length ? (
              <>
                <View style={gaya.kepalaBagian}>
                  <SubJudul>Terakhir dicari</SubJudul>
                  <Pressable role="button" onPress={() => simpanCari(null)} style={gaya.hapusRiwayat}>
                    <Text style={gaya.tautan}>Hapus</Text>
                  </Pressable>
                </View>
                <View style={gaya.chips}>
                  {s.cariTerakhir.map((t) => (
                    <Chip key={t} label={t} ikon="ulang" onPress={() => setQ(t)} />
                  ))}
                </View>
              </>
            ) : null}
            {dilihat.length ? (
              <>
                <SubJudul style={gaya.judul}>Terakhir dilihat</SubJudul>
                <View style={{ gap: 10 }}>
                  {dilihat.map((w) => (
                    <KartuWarungRingkas key={w!.id} w={w!} now={now} />
                  ))}
                </View>
              </>
            ) : null}
          </>
        ) : null}

        <Text style={[gaya.ringkas, { marginTop: 14 }]} aria-live="polite">
          {kata ? `${hasil.menu.length} menu dan ${hasil.warung.length} warung cocok dengan “${q.trim()}”` : `${hasil.warung.length} warung${kat ? ` di ${KATEGORI.find((k) => k.id === kat)?.nama.toLowerCase()}` : ''}`}
        </Text>
        {hasil.menu.length ? (
          <>
            <SubJudul style={gaya.judul}>Menu</SubJudul>
            <View style={gaya.daftarMenu}>
              {hasil.menu.slice(0, 14).map(({ w, m }) => {
                const st = now ? statusBuka(w.jadwal, now) : null;
                return (
                  <Link key={`${w.id}-${m.id}`} href={`/warung/${w.id}`} asChild>
                    <Pressable style={gaya.menu} onPress={simpan}>
                      {m.foto ? <Foto sumber={m.foto} alt="" style={gaya.menuFoto} /> : <IlustrasiMenu jenis={m.ilustrasi ?? 'mangkuk'} ukuran={56} />}
                      <View style={{ flex: 1 }}>
                        <Text style={gaya.menuNama}>{m.nama}</Text>
                        <Text style={gaya.menuWarung} numberOfLines={1}>
                          {w.nama}
                        </Text>
                        {st ? <Text style={[gaya.menuStatus, { color: st.bisaPesan ? warna.daunTua : warna.sambalTua }]}>{st.bisaPesan ? 'Bisa dipesan' : `${st.label} · ${st.ket}`}</Text> : null}
                      </View>
                      <Text style={gaya.menuHarga}>{rupiah(m.harga)}</Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          </>
        ) : null}
        {hasil.warung.length ? (
          <>
            <SubJudul style={gaya.judul}>Warung</SubJudul>
            <View style={{ gap: 10 }}>
              {hasil.warung.map((w) => (
                <KartuWarungRingkas key={w.id} w={w} now={now} />
              ))}
            </View>
          </>
        ) : null}
        {kata && !hasil.menu.length && !hasil.warung.length ? (
          <Kosong
            jenis="cari"
            judul="Belum ketemu"
            teks={`Belum ada menu “${q.trim()}” di warung Tirtalaya. Coba lihat kategori ini:`}
            sisi={
              <View style={[gaya.chips, { justifyContent: 'center' }]}>
                {KATEGORI.slice(0, 4).map((k) => (
                  <Link key={k.id} href={`/kategori/${k.id}`} asChild>
                    <Chip label={k.nama} ikon="kanan" />
                  </Link>
                ))}
              </View>
            }
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const gaya = StyleSheet.create({
  kepala: { paddingHorizontal: 16, paddingBottom: 14, backgroundColor: warna.daun, overflow: 'hidden' },
  kotak: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: warna.putih, borderRadius: radius.pil, paddingLeft: 14, paddingRight: 4, marginTop: 10, minHeight: 50 },
  input: { flex: 1, fontFamily: huruf.sedang, fontSize: 16, color: warna.tinta, paddingVertical: 10, minWidth: 0 },
  hapus: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  judul: { marginTop: 16, marginBottom: 8 },
  kepalaBagian: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, marginBottom: 4 },
  hapusRiwayat: { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'flex-end' },
  tautan: { fontFamily: huruf.hitam, fontSize: 14, color: warna.sambalTua, textDecorationLine: 'underline' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ringkas: { fontFamily: huruf.sedang, fontSize: 13.5, lineHeight: 19, color: warna.tinta2 },
  daftarMenu: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, overflow: 'hidden' },
  menu: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderBottomWidth: 1, borderColor: warna.garis, minHeight: 76 },
  menuFoto: { width: 56, height: 56, borderRadius: 12 },
  menuNama: { fontFamily: huruf.hitam, fontSize: 15, lineHeight: 20, color: warna.tinta },
  menuWarung: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  menuStatus: { fontFamily: huruf.tebal, fontSize: 12.5, lineHeight: 17 },
  menuHarga: { fontFamily: huruf.tebal, fontSize: 14, color: warna.tinta, fontVariant: ['tabular-nums'] },
});
