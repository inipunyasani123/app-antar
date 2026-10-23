import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Kosong } from '@/components/Kosong';
import { AvatarKurir } from '@/components/Kurir';
import { UratDaun } from '@/components/Motif';
import { Layar } from '@/components/Layar';
import { Chip, TombolIkon } from '@/components/ui';
import { kurirPesanan, pesanOtomatis, statusPesanan, TAHAP } from '@/lib/pesanan';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { jamDari } from '@/lib/waktu';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Chat Kurir', deskripsi: 'Chat simulasi dengan kurir di demo Pincuk: pesan otomatis per tahap pengantaran dan balasan singkat untuk patokan, kembalian, atau posisi.', path: '/chat', noindex: true });
}

const CEPAT = ['Pagar hijau ya, Mas', 'Titip di pos ronda saja', 'Kembaliannya pas', 'Sudah sampai mana?', 'Sambalnya dipisah, ya', 'Matur nuwun'];

export default function Chat() {
  useJudulDokumen(judulHalaman('Chat Kurir'));
  const { id } = useLocalSearchParams<{ id?: string }>();
  const now = useSekarang(1000);
  const { s, siap, kirimChat } = useStore();
  const [teks, setTeks] = useState('');
  const gulir = useRef<ComponentRef<typeof ScrollView>>(null);
  const p = siap ? s.pesanan.find((x) => x.id === id) : undefined;
  const daftar = p && now ? [...pesanOtomatis(p), ...(s.chat[p.id] ?? [])].filter((m) => m.waktu <= now).sort((a, b) => a.waktu - b.waktu) : [];
  const jumlah = daftar.length;
  useEffect(() => {
    gulir.current?.scrollToEnd({ animated: true });
  }, [jumlah]);

  if (!siap || !now) {
    return (
      <Layar judul="Chat kurir" kembali="/pesanan">
        <Text style={gaya.kecil}>Memuat chat…</Text>
      </Layar>
    );
  }
  if (!p) {
    return (
      <Layar judul="Chat kurir" kembali="/pesanan">
        <Kosong jenis="chat" judul="Belum ada kurir untuk diajak chat" teks="Chat terbuka begitu pesananmu mulai dimasak dan kurir dipilih. Pesanan demo hanya tersimpan di perangkat ini." aksi="Lihat pesanan" href="/pesanan" />
      </Layar>
    );
  }
  const k = kurirPesanan(p);
  const st = statusPesanan(p, now);
  const kirim = (t: string) => {
    if (!t.trim()) return;
    kirimChat(p.id, t, Date.now());
    setTeks('');
  };

  return (
    <Layar
      judul={k.nama}
      kembali={`/lacak?id=${p.id}`}
      gulir={false}
      kanan={<AvatarKurir ukuran={40} helm={k.helm} jaket={k.jaket} />}
      bawah={
        <View style={{ gap: 8 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CEPAT.map((c) => (
              <Chip key={c} label={c} onPress={() => kirim(c)} />
            ))}
          </ScrollView>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <TextInput
              value={teks}
              onChangeText={setTeks}
              placeholder="Tulis pesan untuk kurir"
              placeholderTextColor={warna.tinta2}
              style={gaya.input}
              aria-label="Tulis pesan untuk kurir"
              onSubmitEditing={() => kirim(teks)}
              returnKeyType="send"
              maxLength={300}
            />
            <TombolIkon ikon="kirim" label="Kirim pesan" latar={warna.sambal} warnaIkon="#FFFFFF" onPress={() => kirim(teks)} ukuran={48} />
          </View>
        </View>
      }
    >
      <View style={gaya.info}>
        <Text style={gaya.infoTeks}>
          {st.tahap === -1 ? 'Pesanan dibatalkan.' : st.tahap === 0 ? 'Menunggu pembayaran.' : TAHAP[st.tahap].judul}
          {' · '}
          {k.motor} <Text style={{ fontFamily: huruf.mono }}>{k.nopol}</Text>
        </Text>
        <Text style={gaya.kecil}>Chat simulasi: kurir menjawab otomatis dengan kalimat sederhana.</Text>
      </View>
      <View style={{ flex: 1 }}>
      <UratDaun warnaGaris="rgba(46,107,59,0.06)" />
      <ScrollView ref={gulir} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 10 }} role="log" aria-label="Percakapan dengan kurir" aria-live="polite">
        {daftar.length === 0 ? <Kosong jenis="chat" judul="Kurir belum menyapa" teks="Kurir akan menyapa begitu pesanan mulai dimasak. Kamu boleh menulis patokan rumah dulu." /> : null}
        {daftar.map((m) => (
          <View key={m.id + m.waktu} style={[gaya.gelembung, m.dari === 'kamu' ? gaya.kamu : gaya.kurir]}>
            <Text style={[gaya.pesan, m.dari === 'kamu' && { color: '#FFFFFF' }]}>{m.teks}</Text>
            <Text style={[gaya.jam, m.dari === 'kamu' && { color: '#F7DCCF' }]}>
              {m.dari === 'kamu' ? 'Kamu' : k.nama} · {jamDari(m.waktu)}
            </Text>
          </View>
        ))}
      </ScrollView>
      </View>
    </Layar>
  );
}

const gaya = StyleSheet.create({
  kecil: { fontFamily: huruf.sedang, fontSize: 12.5, lineHeight: 17, color: warna.tinta2 },
  info: { marginHorizontal: 16, backgroundColor: warna.kertas2, borderRadius: radius.sedang, padding: 10, gap: 2 },
  infoTeks: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, color: warna.tinta },
  gelembung: { maxWidth: '82%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  kamu: { alignSelf: 'flex-end', backgroundColor: warna.sambal, borderBottomRightRadius: 6 },
  kurir: { alignSelf: 'flex-start', backgroundColor: warna.putih, borderWidth: 1, borderColor: warna.garis, borderBottomLeftRadius: 6 },
  pesan: { fontFamily: huruf.sedang, fontSize: 15, lineHeight: 21, color: warna.tinta },
  jam: { fontFamily: huruf.sedang, fontSize: 11.5, lineHeight: 16, color: warna.tinta2, marginTop: 3 },
  input: { flex: 1, minWidth: 0, fontFamily: huruf.sedang, fontSize: 15.5, color: warna.tinta, borderWidth: 1.5, borderColor: warna.garisTegas, borderRadius: radius.pil, paddingHorizontal: 16, minHeight: 48, backgroundColor: warna.kertas },
});
