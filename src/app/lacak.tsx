import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import { Ikon } from '@/components/Ikon';
import { Kosong, SerahPincuk } from '@/components/Kosong';
import { AvatarKurir } from '@/components/Kurir';
import { kembaliKe, Layar } from '@/components/Layar';
import { Cap, TepiNota, UratDaun } from '@/components/Motif';
import { Peta } from '@/components/Peta';
import { ProgresTahap } from '@/components/ProgresTahap';
import { Chip, Judul, Lencana, SubJudul, Tombol, TombolIkon } from '@/components/ui';
import { WARUNG, warungById } from '@/lib/data';
import { useGerakDikurangi } from '@/lib/gerak';
import { km, rupiah } from '@/lib/harga';
import { useJudulDokumen } from '@/lib/judul';
import { PETA } from '@/lib/peta';
import { kurirPesanan, PERCEPAT, posisiKurir, rentangTiba, statusPesanan, TAHAP, type Pesanan } from '@/lib/pesanan';
import { judulHalaman, meta } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { jam, jamDari, statusBuka, tanggal, wib } from '@/lib/waktu';

export function generateMetadata() {
  return meta({ judul: 'Lacak Pesanan', deskripsi: 'Lacak pesanan demo Pincuk per tahap: diterima, dimasak, diambil kurir, diantar, sampai. Peta ilustrasi dan chat kurir simulasi.', path: '/lacak', noindex: true });
}

const BATAS_BAYAR_MS = 10 * 60000;
const jamSim = (ms: number) => jam(wib(ms).menit);

export default function Lacak() {
  useJudulDokumen(judulHalaman('Lacak Pesanan'));
  const { id } = useLocalSearchParams<{ id?: string }>();
  const now = useSekarang(1000);
  const { s, siap } = useStore();
  if (!siap || !now) {
    return (
      <Layar judul="Lacak pesanan" kembali="/pesanan">
        <Text style={gaya.kecil}>Memuat pesanan…</Text>
      </Layar>
    );
  }
  const p = s.pesanan.find((x) => x.id === id) ?? (id ? undefined : s.pesanan.find((x) => !statusPesanan(x, now).selesai));
  if (!p) {
    const buka = WARUNG.filter((w) => statusBuka(w.jadwal, now).bisaPesan);
    return (
      <Layar judul="Lacak pesanan" kembali="/pesanan">
        <Kosong
          jenis="lacak"
          judul={id ? 'Pesanan tidak ada di perangkat ini' : 'Belum ada yang diantar'}
          teks={`${id ? 'Pesanan demo hanya tersimpan di browser atau HP tempat kamu memesan. ' : ''}${buka.length} warung bisa pesan sekarang.`}
          aksi={buka[0] ? `Pesan dari ${buka[0].nama}` : 'Ke beranda'}
          href={buka[0] ? `/warung/${buka[0].id}` : '/'}
        />
      </Layar>
    );
  }
  return <IsiLacak p={p} now={now} />;
}

function IsiLacak({ p, now }: { p: Pesanan; now: number }) {
  const st = useStore();
  const ins = useSafeAreaInsets();
  const [rincian, setRincian] = useState(false);
  const [lebar, setLebar] = useState(390);
  const w = warungById(p.warungId)!;
  const s = statusPesanan(p, now);
  const k = kurirPesanan(p);
  const habisWaktuBayar = s.tahap === 0 && now - p.dibuat > BATAS_BAYAR_MS;

  if (s.tahap === 0) {
    return (
      <Layar judul="Bayar dengan QRIS" kembali="/pesanan">
        <View style={gaya.kartuQr}>
          <Text style={gaya.kecil}>{p.kode}</Text>
          <Text style={gaya.totalBesar}>{rupiah(p.total)}</Text>
          <Text style={gaya.kecil}>ke {w.nama}</Text>
          <View style={{ marginVertical: 14 }}>
            <QrContoh benih={p.id} />
          </View>
          <Lencana teks="CONTOH · bukan kode pembayaran sungguhan" latar={warna.sambalMuda} fg={warna.sambalTua} style={{ alignSelf: 'center' }} />
          <Text style={[gaya.teks, { textAlign: 'center', marginTop: 12 }]}>
            {habisWaktuBayar ? 'Waktu bayar sudah habis. Batalkan lalu pesan ulang.' : `Di aplikasi sungguhan, kode ini dipindai dari aplikasi bank atau dompet digital. Bayar sebelum ${jamDari(p.dibuat + BATAS_BAYAR_MS)} WIB.`}
          </Text>
        </View>
        {!habisWaktuBayar ? <Tombol label="Saya sudah bayar (simulasi)" ikon="centang" onPress={() => st.bayarQris(p.id, now)} style={{ marginTop: 16 }} /> : null}
        <Tombol label="Batalkan pesanan" varian="garis" onPress={() => st.batalkan(p.id, now)} style={{ marginTop: 10 }} />
      </Layar>
    );
  }

  const batal = s.tahap === -1;
  const sampai = s.tahap === 5;
  if (sampai) return <LayarSampai p={p} now={now} />;

  const pos = s.tahap >= 2 && !batal ? posisiKurir(p, s) : null;
  const eta = rentangTiba(s);
  const tinggiPeta = Math.round((lebar * PETA.tinggi) / PETA.lebar);
  const judulStatus = batal ? 'Pesanan dibatalkan' : TAHAP[s.tahap].judul;

  return (
    <View style={{ flex: 1, backgroundColor: warna.kertas }} role="main" onLayout={(e) => setLebar(e.nativeEvent.layout.width)}>
      <View style={StyleSheet.absoluteFill as object}>
        <Peta
          label={`Peta ilustrasi: ${judulStatus}. Rute dari ${w.nama} ke ${p.alamat.label}, ${km(p.meter)}.`}
          rute={pos?.rute ?? undefined}
          progres={s.tahap === 4 ? s.progres : 0}
          warung={{ x: w.x, y: w.y, warna: w.warna }}
          rumah={p.alamat}
          kurir={pos}
        />
      </View>
      <View style={[gaya.tombolAtas, { top: ins.top + 10 }]}>
        <TombolIkon ikon="kembali" label="Kembali" onPress={() => kembaliKe('/pesanan')} />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: Math.max(140, tinggiPeta - 36) }}>
        <View style={gaya.lembar}>
          <View style={gaya.pegangan} />
          {batal ? (
            <>
              <Judul level={1} ukuran={24}>
                Pesanan dibatalkan
              </Judul>
              <Text style={gaya.teks}>Dibatalkan pukul {jamDari(p.batal!)} WIB. Tidak ada biaya.</Text>
            </>
          ) : (
            <>
              <Text style={gaya.eta} aria-label={`Tiba sekitar ${jamSim(eta.dari)} sampai ${jamSim(eta.sampai)} WIB`}>
                Tiba {jamSim(eta.dari)}–{jamSim(eta.sampai)}
                <Text style={gaya.etaWib}> WIB</Text>
              </Text>
              <View aria-live="polite">
                <Judul level={1} ukuran={19} warna={warna.daunTua}>
                  {judulStatus}
                </Judul>
              </View>
              <Text style={gaya.kecil}>
                {s.tahap === 4 ? `±${s.sisaMenit} menit lagi` : `Perkiraan ±${s.sisaMenit} menit lagi`} · jam simulasi, {PERCEPAT}× lebih cepat
              </Text>
              <View style={{ marginTop: 14 }}>
                <ProgresTahap tahap={s.tahap} />
              </View>
            </>
          )}

          {/* kurir + chat */}
          {s.tahap >= 2 && !batal ? (
            <View style={gaya.kurir}>
              <AvatarKurir helm={k.helm} jaket={k.jaket} />
              <View style={{ flex: 1 }}>
                <Text style={gaya.kurirNama}>{k.nama}</Text>
                <Text style={gaya.kecil}>
                  {k.motor} · <Text style={{ fontFamily: huruf.mono }}>{k.nopol}</Text>
                </Text>
              </View>
              <Link href={`/chat?id=${p.id}`} asChild>
                <Tombol label="Chat" ikon="chat" varian="gelap" kecil style={{ minHeight: 44 }} />
              </Link>
            </View>
          ) : !batal ? (
            <View style={gaya.kurir}>
              <Ikon nama="wajan" ukuran={26} warna={warna.daunTua} />
              <Text style={[gaya.teks, { flex: 1 }]}>{w.nama} sedang menyiapkan pesananmu. Kurir dipilih begitu mulai dimasak.</Text>
            </View>
          ) : null}

          {!batal ? (
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <Tombol label="Percepat tahap" ikon="percepat" varian="kedua" kecil onPress={() => st.percepat(p.id, now)} style={{ flex: 1, minHeight: 44 }} aria-label="Percepat tahap ke berikutnya (khusus demo)" />
              {s.tahap === 1 ? <Tombol label="Batalkan" varian="garis" kecil onPress={() => st.batalkan(p.id, now)} style={{ flex: 1, minHeight: 44 }} /> : null}
            </View>
          ) : (
            <Link href={`/warung/${w.id}`} asChild>
              <Tombol label={`Kembali ke ${w.nama}`} varian="garis" style={{ marginTop: 12 }} />
            </Link>
          )}

          {/* rincian tahap, bisa dilipat */}
          {!batal ? (
            <>
              <Pressable role="button" aria-expanded={rincian} onPress={() => setRincian(!rincian)} style={gaya.lipat}>
                <Text style={gaya.lipatTeks}>Rincian tahap</Text>
                <View style={{ transform: [{ rotate: rincian ? '180deg' : '0deg' }] }}>
                  <Ikon nama="bawah" ukuran={20} warna={warna.tinta} />
                </View>
              </Pressable>
              {rincian ? (
                <View style={gaya.rincian}>
                  {TAHAP.slice(1).map((t, i) => {
                    const idx = i + 1;
                    const lewat = s.tahap >= idx;
                    return (
                      <View key={t.id} style={gaya.rincianBaris} aria-current={s.tahap === idx ? 'step' : undefined}>
                        <View style={[gaya.titikTahap, lewat && { backgroundColor: warna.daun, borderColor: warna.daun }]} />
                        <Text style={[gaya.rincianTeks, lewat && { color: warna.tinta, fontFamily: huruf.tebal }]}>{t.judul}</Text>
                        <Text style={gaya.mono}>{lewat ? jamSim(s.mulai[i]) : `±${jamSim(s.mulai[i])}`}</Text>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </>
          ) : null}

          <Nota p={p} />
        </View>
      </ScrollView>
    </View>
  );
}

/** Layar hasil: pesanan sampai, stempel "SAMPAI", penilaian pribadi (tanpa rating agregat). */
function LayarSampai({ p, now }: { p: Pesanan; now: number }) {
  const st = useStore();
  const w = warungById(p.warungId)!;
  const k = kurirPesanan(p);
  const s = statusPesanan(p, now);
  const sudah = st.s.penilaian[p.id];
  const [nilai, setNilai] = useState(sudah?.nilai ?? 0);
  const [tanda, setTanda] = useState<string[]>(sudah?.tanda ?? []);
  const [catatan, setCatatan] = useState(sudah?.catatan ?? '');
  const [tersimpan, setTersimpan] = useState(!!sudah);
  const kurangiGerak = useGerakDikurangi();
  const cap = useRef(new Animated.Value(kurangiGerak ? 1 : 0)).current;
  useEffect(() => {
    if (kurangiGerak) cap.setValue(1);
    else Animated.spring(cap, { toValue: 1, friction: 5, tension: 120, useNativeDriver: Platform.OS !== 'web' }).start();
  }, [cap, kurangiGerak]);
  const bisaUlang = statusBuka(w.jadwal, now).bisaPesan;
  const TANDA = ['Masih hangat', 'Sambal pas', 'Porsi pas', 'Kurir ramah', 'Rapi, tidak tumpah'];

  return (
    <Layar judul="Pesanan sampai" kembali="/pesanan" latar={warna.kertas}>
      <View style={gaya.hasil}>
        <UratDaun warnaGaris="rgba(46,107,59,0.07)" />
        <SerahPincuk helm={k.helm} jaket={k.jaket} />
        <Animated.View style={[gaya.capWadah, { opacity: cap, transform: [{ scale: cap.interpolate({ inputRange: [0, 1], outputRange: [1.8, 1] }) }] }]}>
          <Cap teks={p.bayar === 'qris' ? 'LUNAS' : 'SAMPAI'} warnaCap={warna.sambal} ukuran={88} />
        </Animated.View>
        <Text style={gaya.selamat} role="heading" aria-level={2}>
          Selamat makan!
        </Text>
        <Text style={[gaya.teks, { textAlign: 'center' }]}>
          Diantar {k.nama} ke {p.alamat.label.toLowerCase()} pukul {jamSim(s.mulai[4])} WIB (jam simulasi). {p.bayar === 'tunai' ? `Dibayar tunai ${rupiah(p.total)}.` : 'Lunas lewat QRIS simulasi.'}
        </Text>
      </View>

      {/* penilaian pribadi */}
      <View style={gaya.nilaiKartu}>
        <SubJudul>{tersimpan ? 'Penilaianmu' : `Gimana ${w.nama}?`}</SubJudul>
        <Text style={gaya.kecil}>Hanya untuk catatanmu sendiri; tidak ditampilkan sebagai rating warung.</Text>
        <View style={gaya.cabaiBaris} role="radiogroup" aria-label="Nilai 1 sampai 5 cabai">
          {[1, 2, 3, 4, 5].map((n) => (
            <Pressable key={n} role="radio" aria-checked={nilai === n} aria-label={`${n} cabai`} onPress={() => { setNilai(n); setTersimpan(false); }} style={gaya.cabai}>
              <Ikon nama="cabai" ukuran={30} warna={n <= nilai ? warna.sambal : warna.garisTegas} isi={n <= nilai ? warna.sambal : undefined} />
            </Pressable>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }} role="group" aria-label="Pilihan cepat">
          {TANDA.map((t) => (
            <Chip key={t} label={t} aktif={tanda.includes(t)} aksen={warna.daun} onPress={() => { setTanda((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t])); setTersimpan(false); }} />
          ))}
        </View>
        <TextInput value={catatan} onChangeText={(t) => { setCatatan(t); setTersimpan(false); }} placeholder="Catatan untuk diri sendiri (opsional)" placeholderTextColor={warna.tinta2} style={gaya.input} maxLength={140} aria-label="Catatan penilaian" />
        <Tombol
          label={tersimpan ? 'Tersimpan di riwayat' : 'Simpan penilaian'}
          ikon={tersimpan ? 'centang' : undefined}
          varian={tersimpan ? 'garis' : 'gelap'}
          kecil
          disabled={!nilai}
          onPress={() => {
            st.nilai(p.id, { nilai, tanda, catatan: catatan.trim(), waktu: Date.now() });
            setTersimpan(true);
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <Tombol
          label={bisaUlang ? 'Pesan lagi' : 'Warung tutup'}
          ikon="ulang"
          varian={bisaUlang ? 'utama' : 'garis'}
          disabled={!bisaUlang}
          style={{ flex: 1 }}
          onPress={() => {
            st.pesanLagi(p);
            router.push('/keranjang');
          }}
        />
        <Link href="/" asChild>
          <Tombol label="Beranda" varian="garis" style={{ flex: 1 }} />
        </Link>
      </View>
      <Nota p={p} />
    </Layar>
  );
}

function Nota({ p }: { p: Pesanan }) {
  const w = warungById(p.warungId)!;
  return (
    <View style={{ marginTop: 18 }}>
      <SubJudul style={{ marginBottom: 8 }}>Nota</SubJudul>
      <TepiNota posisi="atas" />
      <View style={gaya.nota}>
        <Text style={gaya.notaWarung}>{w.nama}</Text>
        <Text style={gaya.mono}>
          {p.kode} · {tanggal(p.dibuat)}, {jamDari(p.dibuat)} WIB
        </Text>
        <View style={gaya.garis} />
        {p.item.map((i, n) => (
          <View key={`${i.menuId}-${n}`} style={{ marginVertical: 2 }}>
            <View style={gaya.baris}>
              <Text style={[gaya.mono, { color: warna.tinta, flex: 1 }]}>
                {i.qty}× {i.nama}
              </Text>
              <Text style={[gaya.mono, { color: warna.tinta }]}>{rupiah(i.harga * i.qty)}</Text>
            </View>
            {i.opsiTeks ? <Text style={gaya.monoOpsi}>  {i.opsiTeks}</Text> : null}
            {i.catatan ? <Text style={gaya.monoOpsi}>  “{i.catatan}”</Text> : null}
          </View>
        ))}
        {p.catatan ? <Text style={[gaya.mono, { marginTop: 4 }]}>Catatan: {p.catatan}</Text> : null}
        <View style={gaya.garis} />
        <View style={gaya.baris}>
          <Text style={gaya.mono}>Subtotal</Text>
          <Text style={gaya.mono}>{rupiah(p.subtotal)}</Text>
        </View>
        <View style={gaya.baris}>
          <Text style={gaya.mono}>Ongkir ({km(p.meter)})</Text>
          <Text style={gaya.mono}>{rupiah(p.ongkir)}</Text>
        </View>
        {p.potongan ? (
          <View style={gaya.baris}>
            <Text style={gaya.mono}>Promo {p.promo}</Text>
            <Text style={[gaya.mono, { color: warna.daunTua }]}>−{rupiah(p.potongan)}</Text>
          </View>
        ) : null}
        <View style={[gaya.baris, { marginTop: 6 }]}>
          <Text style={gaya.notaTotal}>Total · {p.bayar === 'qris' ? 'QRIS (simulasi)' : 'tunai'}</Text>
          <Text style={gaya.notaTotal}>{rupiah(p.total)}</Text>
        </View>
        <View style={gaya.garis} />
        <Text style={gaya.mono}>
          Antar ke {p.alamat.label}: {p.alamat.detail}
          {p.alamat.patokan ? ` (${p.alamat.patokan})` : ''}
        </Text>
      </View>
      <TepiNota posisi="bawah" />
    </View>
  );
}

/** Pola kotak mirip kode QR, sengaja TIDAK bisa dipindai (demo). */
function QrContoh({ benih }: { benih: string }) {
  let h = 2166136261;
  for (let i = 0; i < benih.length; i++) h = Math.imul(h ^ benih.charCodeAt(i), 16777619);
  const acak = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 4294967296;
  const n = 25;
  let d = '';
  const diPojok = (x: number, y: number) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!diPojok(x, y) && acak() > 0.52) d += `M${x} ${y}h1v1h-1z`;
  const pojok = (x: number, y: number) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return (
    <Svg width={196} height={196} viewBox={`-2 -2 ${n + 4} ${n + 4}`} aria-hidden focusable={false}>
      <Rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#FFFFFF" />
      <Path d={d} fill={warna.tinta} />
      <Path d={pojok(0, 0) + pojok(n - 7, 0) + pojok(0, n - 7)} fill={warna.tinta} fillRule="evenodd" />
      <Rect x={8.5} y={10.5} width={8} height={4} rx={1} fill={warna.sambal} />
    </Svg>
  );
}

const gaya = StyleSheet.create({
  kecil: { fontFamily: huruf.sedang, fontSize: 13, lineHeight: 18, color: warna.tinta2 },
  teks: { fontFamily: huruf.sedang, fontSize: 14.5, lineHeight: 21, color: warna.tinta },
  kartuQr: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 18, alignItems: 'center' },
  totalBesar: { fontFamily: huruf.display, fontSize: 32, lineHeight: 40, color: warna.tinta, marginTop: 4, fontVariant: ['tabular-nums'] },
  tombolAtas: { position: 'absolute', left: 16, zIndex: 5 },
  lembar: { backgroundColor: warna.kertas, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 28, minHeight: 560, gap: 4 },
  pegangan: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: warna.garisTegas, marginBottom: 8 },
  eta: { fontFamily: huruf.display, fontSize: 30, lineHeight: 38, color: warna.tinta, fontVariant: ['tabular-nums'] },
  etaWib: { fontFamily: huruf.hitam, fontSize: 16, color: warna.tinta2 },
  kurir: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 12, marginTop: 14 },
  kurirNama: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 21, color: warna.tinta },
  lipat: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 48, marginTop: 10, borderBottomWidth: 1, borderColor: warna.garis },
  lipatTeks: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta },
  rincian: { paddingVertical: 8, gap: 10 },
  rincianBaris: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titikTahap: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: warna.garisTegas },
  rincianTeks: { flex: 1, fontFamily: huruf.sedang, fontSize: 14, color: warna.tinta2 },
  hasil: { alignItems: 'center', backgroundColor: warna.daunMuda, borderRadius: radius.besar, paddingVertical: 18, paddingHorizontal: 14, overflow: 'hidden', gap: 6 },
  capWadah: { position: 'absolute', right: 14, top: 14 },
  selamat: { fontFamily: huruf.display, fontSize: 30, lineHeight: 38, color: warna.daunTua },
  nilaiKartu: { marginTop: 14, backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 14, gap: 10 },
  cabaiBaris: { flexDirection: 'row', gap: 4 },
  cabai: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  input: { fontFamily: huruf.sedang, fontSize: 15, color: warna.tinta, borderWidth: 1.5, borderColor: warna.garisTegas, borderRadius: radius.sedang, paddingHorizontal: 12, minHeight: 46, backgroundColor: warna.kertas },
  nota: { backgroundColor: warna.putih, paddingHorizontal: 16, paddingVertical: 10 },
  notaWarung: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 21, color: warna.tinta },
  notaTotal: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta, fontVariant: ['tabular-nums'] },
  mono: { fontFamily: huruf.mono, fontSize: 12.5, lineHeight: 18, color: warna.tinta2 },
  monoOpsi: { fontFamily: huruf.mono, fontSize: 12, lineHeight: 17, color: warna.daunTua },
  garis: { borderTopWidth: 1.5, borderColor: warna.garisTegas, borderStyle: 'dashed', marginVertical: 10 },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
});
