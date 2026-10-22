import { Link, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Ikon } from '@/components/Ikon';
import { AvatarKurir, KurirMotor } from '@/components/Kurir';
import { Layar } from '@/components/Layar';
import { Cap, TepiNota, UratDaun } from '@/components/Motif';
import { Peta } from '@/components/Peta';
import { Judul, Lencana, SubJudul, Tombol } from '@/components/ui';
import { warungById } from '@/lib/data';
import { km, rupiah } from '@/lib/harga';
import { kurirPesanan, PERCEPAT, posisiKurir, statusPesanan, TAHAP, type Pesanan } from '@/lib/pesanan';
import { meta, judulHalaman } from '@/lib/seo';
import { useSekarang, useStore } from '@/lib/store';
import { huruf, radius, warna } from '@/lib/theme';
import { jamDari, statusBuka, tanggal } from '@/lib/waktu';
import { useJudulDokumen } from '@/lib/judul';

export function generateMetadata() {
  return meta({ judul: 'Lacak Pesanan', deskripsi: 'Lacak pesanan demo Pincuk per tahap: diterima, dimasak, diambil kurir, diantar, sampai. Peta ilustrasi dan chat kurir simulasi.', path: '/lacak', noindex: true });
}

const BATAS_BAYAR_MS = 10 * 60000;

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
    return (
      <Layar judul="Lacak pesanan" kembali="/pesanan">
        <Text style={gaya.teks}>Pesanan tidak ditemukan di perangkat ini. Pesanan demo hanya tersimpan di browser atau HP tempat kamu memesan.</Text>
        <Link href="/pesanan" asChild>
          <Tombol label="Lihat semua pesanan" varian="garis" style={{ marginTop: 14 }} />
        </Link>
      </Layar>
    );
  }
  return <IsiLacak p={p} now={now} />;
}

function IsiLacak({ p, now }: { p: Pesanan; now: number }) {
  const st = useStore();
  const w = warungById(p.warungId)!;
  const s = statusPesanan(p, now);
  const k = kurirPesanan(p);
  const pos = s.tahap >= 2 ? posisiKurir(p, s) : null;
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
  const judulStatus = batal ? 'Pesanan dibatalkan' : sampai ? 'Sudah sampai. Selamat makan!' : TAHAP[s.tahap].judul;
  const subStatus = batal
    ? `Dibatalkan pukul ${jamDari(p.batal!)} WIB. Tidak ada biaya.`
    : sampai
      ? `Diantar ${k.nama} ke ${p.alamat.label.toLowerCase()}.`
      : s.tahap === 4
        ? `Tiba sekitar ${s.sisaMenit} menit lagi`
        : `Perkiraan tiba ±${s.sisaMenit} menit lagi`;
  const bisaUlang = statusBuka(w.jadwal, now).bisaPesan;

  return (
    <Layar judul="Lacak pesanan" kembali="/pesanan">
      <View style={gaya.peta}>
        <Peta
          label={`Peta ilustrasi: ${judulStatus}. Rute dari ${w.nama} ke ${p.alamat.label}, ${km(p.meter)}.`}
          rute={pos?.rute ?? undefined}
          progres={s.tahap === 4 ? s.progres : s.tahap === 5 ? 1 : 0}
          warung={{ x: w.x, y: w.y, warna: w.warna }}
          rumah={p.alamat}
          kurir={pos && !batal ? pos : null}
        />
      </View>

      <View style={[gaya.status, batal && { backgroundColor: warna.tinta2 }]}>
        <UratDaun />
        <View aria-live="polite">
          <Judul level={2} ukuran={23} warna={warna.kertas}>
            {judulStatus}
          </Judul>
        </View>
        <Text style={gaya.statusSub}>{subStatus}</Text>
        {!batal ? (
          <View style={gaya.langkah} role="list" aria-label="Tahap pesanan">
            {TAHAP.slice(1).map((t, i) => {
              const idx = i + 1;
              const lewat = s.tahap > idx || sampai;
              const kini = s.tahap === idx && !sampai;
              return (
                <View key={t.id} style={gaya.langkahBaris} role="listitem" aria-current={kini ? 'step' : undefined}>
                  <View style={[gaya.bulat, lewat && gaya.bulatLewat, kini && gaya.bulatKini]}>{lewat ? <Ikon nama="centang" ukuran={14} warna={warna.daunTua} tebal={3} /> : null}</View>
                  <Text style={[gaya.langkahTeks, (lewat || kini) && { color: warna.kertas, fontFamily: huruf.hitam }]}>{t.judul}</Text>
                  <Text style={gaya.langkahJam}>{s.tahap >= idx || sampai ? jamDari(s.mulai[i]) : ''}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
      {!batal && !sampai ? (
        <Text style={[gaya.kecil, { marginTop: 8 }]}>Simulasi berjalan {PERCEPAT}× lebih cepat: 1 menit di aplikasi = 4 detik. Jam tahap di atas ikut disimulasikan.</Text>
      ) : null}

      {/* kurir */}
      {s.tahap >= 2 && !batal ? (
        <View style={gaya.kurir}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <AvatarKurir helm={k.helm} jaket={k.jaket} />
            <View style={{ flex: 1 }}>
              <Text style={gaya.kurirNama}>{k.nama}</Text>
              <Text style={gaya.kecil}>
                {k.motor} · <Text style={{ fontFamily: huruf.mono }}>{k.nopol}</Text>
              </Text>
            </View>
          </View>
          {s.tahap === 4 ? (
            <View style={{ alignItems: 'center', marginTop: 6 }}>
              <KurirMotor lebar={150} helm={k.helm} motor={k.helm} jaket={k.jaket} />
            </View>
          ) : null}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Link href={`/chat?id=${p.id}`} asChild>
              <Tombol label="Chat kurir" ikon="chat" varian="gelap" kecil style={{ flex: 1 }} />
            </Link>
          </View>
          <Text style={[gaya.kecil, { marginTop: 8 }]}>Kurir dan kendaraan rekaan. Nomor polisi sengaja dibuat 0000.</Text>
        </View>
      ) : null}

      {!batal && !sampai ? (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Tombol label="Percepat tahap" ikon="percepat" varian="kedua" kecil onPress={() => st.percepat(p.id, now)} style={{ flex: 1 }} aria-label="Percepat ke tahap berikutnya (khusus demo)" />
          {s.tahap === 1 ? <Tombol label="Batalkan" varian="garis" kecil onPress={() => st.batalkan(p.id, now)} style={{ flex: 1 }} /> : null}
        </View>
      ) : null}

      {sampai || batal ? (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Tombol
            label={bisaUlang ? 'Pesan lagi' : 'Warung tutup'}
            ikon="ulang"
            varian={bisaUlang ? 'utama' : 'garis'}
            disabled={!bisaUlang}
            kecil
            style={{ flex: 1 }}
            onPress={() => {
              st.pesanLagi(p);
              router.push('/keranjang');
            }}
          />
          <Link href="/" asChild>
            <Tombol label="Beranda" varian="garis" kecil style={{ flex: 1 }} />
          </Link>
        </View>
      ) : null}

      {/* nota */}
      <SubJudul style={{ marginTop: 22, marginBottom: 8 }}>Nota</SubJudul>
      <TepiNota posisi="atas" />
      <View style={gaya.nota}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={gaya.notaWarung}>{w.nama}</Text>
            <Text style={gaya.mono}>
              {p.kode} · {tanggal(p.dibuat)}, {jamDari(p.dibuat)} WIB
            </Text>
          </View>
          {sampai ? <Cap teks={p.bayar === 'qris' ? 'LUNAS' : 'SAMPAI'} warnaCap={warna.daun} ukuran={72} /> : null}
        </View>
        <View style={gaya.garis} />
        {p.item.map((i) => (
          <View key={i.menuId} style={gaya.baris}>
            <Text style={[gaya.mono, { color: warna.tinta, flex: 1 }]}>
              {i.qty}× {i.nama}
            </Text>
            <Text style={[gaya.mono, { color: warna.tinta }]}>{rupiah(i.harga * i.qty)}</Text>
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
            <Text style={[gaya.mono, { color: warna.daun }]}>−{rupiah(p.potongan)}</Text>
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
    </Layar>
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
  totalBesar: { fontFamily: huruf.display, fontSize: 32, lineHeight: 40, color: warna.tinta, marginTop: 4 },
  peta: { borderRadius: radius.besar, overflow: 'hidden', borderWidth: 1, borderColor: warna.garis },
  status: { backgroundColor: warna.daun, borderRadius: radius.besar, padding: 16, marginTop: 12, overflow: 'hidden' },
  statusSub: { fontFamily: huruf.tebal, fontSize: 15, lineHeight: 21, color: warna.kunyitMuda, marginTop: 4 },
  langkah: { marginTop: 14, gap: 8 },
  langkahBaris: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulat: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#9BC0A2', alignItems: 'center', justifyContent: 'center' },
  bulatLewat: { backgroundColor: warna.kunyit, borderColor: warna.kunyit },
  bulatKini: { borderColor: warna.kunyit, borderWidth: 5 },
  langkahTeks: { flex: 1, fontFamily: huruf.tebal, fontSize: 14.5, lineHeight: 20, color: '#D3E3D2' },
  langkahJam: { fontFamily: huruf.mono, fontSize: 12.5, color: '#E8F0DD' },
  kurir: { backgroundColor: warna.putih, borderRadius: radius.besar, borderWidth: 1, borderColor: warna.garis, padding: 14, marginTop: 14 },
  kurirNama: { fontFamily: huruf.hitam, fontSize: 16.5, lineHeight: 22, color: warna.tinta },
  nota: { backgroundColor: warna.putih, paddingHorizontal: 16, paddingVertical: 10 },
  notaWarung: { fontFamily: huruf.hitam, fontSize: 16, lineHeight: 21, color: warna.tinta },
  notaTotal: { fontFamily: huruf.hitam, fontSize: 15, color: warna.tinta },
  mono: { fontFamily: huruf.mono, fontSize: 12.5, lineHeight: 18, color: warna.tinta2 },
  garis: { borderTopWidth: 1.5, borderColor: warna.garisTegas, borderStyle: 'dashed', marginVertical: 10 },
  baris: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginVertical: 2 },
});
