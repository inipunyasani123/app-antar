import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { hargaSatuan, pilihanAwal, type Menu, type PilihanMenu } from '@/lib/data';
import { rupiah } from '@/lib/harga';
import { huruf, radius, warna } from '@/lib/theme';
import { Foto } from './Foto';
import { Ikon } from './Ikon';
import { IlustrasiMenu } from './IlustrasiMenu';
import { Lembar } from './Lembar';
import { Tombol } from './ui';

/** Lembar detail menu: foto, pilihan terstruktur (level sambal, kuah, tambahan), jumlah, catatan per item. */
export function LembarMenu({ menu, fotoBesar, bisa, alasan, onTutup, onTambah }: {
  menu: Menu | null;
  fotoBesar?: Menu['foto'];
  bisa: boolean;
  alasan?: string;
  onTutup: () => void;
  onTambah: (pilih: PilihanMenu, qty: number, catatan: string) => void;
}) {
  const [pilih, setPilih] = useState<PilihanMenu>({});
  const [qty, setQty] = useState(1);
  const [catatan, setCatatan] = useState('');
  useEffect(() => {
    if (menu) {
      setPilih(pilihanAwal(menu));
      setQty(1);
      setCatatan('');
    }
  }, [menu]);
  if (!menu) return null;
  const total = hargaSatuan(menu, pilih) * qty;
  const ubah = (oId: string, pId: string, satu: boolean) =>
    setPilih((p) => {
      const kini = p[oId] ?? [];
      return { ...p, [oId]: satu ? [pId] : kini.includes(pId) ? kini.filter((x) => x !== pId) : [...kini, pId] };
    });

  return (
    <Lembar
      terbuka
      judul={menu.nama}
      onTutup={onTutup}
      atas={
        <View>
          {menu.foto ? <Foto sumber={fotoBesar ?? menu.foto} alt={`Foto ilustrasi ${menu.nama.toLowerCase()}`} style={gaya.foto} /> : <View style={gaya.ilus}><IlustrasiMenu jenis={menu.ilustrasi ?? 'mangkuk'} ukuran={150} radius={24} /></View>}
        </View>
      }
      kaki={
        <>
          {!bisa && alasan ? <Text style={gaya.alasan}>{alasan}</Text> : null}
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={gaya.stepper}>
              <Pressable role="button" aria-label="Kurangi jumlah" onPress={() => setQty((q) => Math.max(1, q - 1))} style={gaya.stepTombol} disabled={qty <= 1}>
                <Ikon nama="kurang" ukuran={20} warna={qty <= 1 ? warna.tinta2 : warna.tinta} />
              </Pressable>
              <Text style={gaya.qty} aria-live="polite" aria-label={`Jumlah ${qty}`}>
                {qty}
              </Text>
              <Pressable role="button" aria-label="Tambah jumlah" onPress={() => setQty((q) => Math.min(20, q + 1))} style={gaya.stepTombol}>
                <Ikon nama="tambah" ukuran={20} warna={warna.tinta} />
              </Pressable>
            </View>
            <Tombol label={`Tambah · ${rupiah(total)}`} disabled={!bisa} onPress={() => onTambah(pilih, qty, catatan)} style={{ flex: 1 }} />
          </View>
        </>
      }
    >
      <Text style={gaya.ket}>{menu.ket}</Text>
      <Text style={gaya.harga}>{rupiah(menu.harga)}</Text>
      {(menu.opsi ?? []).map((o) => (
        <View key={o.id} style={{ gap: 8 }}>
          <Text style={gaya.opsiJudul} nativeID={`opsi-${menu.id}-${o.id}`}>
            {o.judul}
            <Text style={gaya.opsiSub}>{o.jenis === 'satu' ? ' · pilih satu' : ' · boleh lebih dari satu'}</Text>
          </Text>
          <View style={gaya.pilihan} role={o.jenis === 'satu' ? 'radiogroup' : 'group'} aria-labelledby={`opsi-${menu.id}-${o.id}`}>
            {o.pilihan.map((x) => {
              const aktif = (pilih[o.id] ?? []).includes(x.id);
              return (
                <Pressable
                  key={x.id}
                  role={o.jenis === 'satu' ? 'radio' : 'checkbox'}
                  aria-checked={aktif}
                  onPress={() => ubah(o.id, x.id, o.jenis === 'satu')}
                  style={[gaya.segmen, aktif && gaya.segmenAktif]}
                >
                  {aktif ? <Ikon nama="centang" ukuran={16} warna={warna.kertas} tebal={3} /> : null}
                  <Text style={[gaya.segmenTeks, aktif && { color: warna.kertas }]}>
                    {x.label}
                    {x.harga ? ` +${rupiah(x.harga)}` : ''}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
      <Text style={gaya.opsiJudul} nativeID={`catatan-${menu.id}`}>
        Catatan untuk menu ini <Text style={gaya.opsiSub}>· opsional</Text>
      </Text>
      <TextInput value={catatan} onChangeText={setCatatan} placeholder="Mis. tanpa bawang goreng" placeholderTextColor={warna.tinta2} style={gaya.input} maxLength={80} aria-labelledby={`catatan-${menu.id}`} />
    </Lembar>
  );
}

const gaya = StyleSheet.create({
  foto: { width: '100%', height: 190 },
  ilus: { alignItems: 'center', backgroundColor: warna.kertas2, paddingVertical: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: warna.kunyit, borderRadius: radius.pil },
  stepTombol: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  qty: { fontFamily: huruf.hitam, fontSize: 17, minWidth: 22, textAlign: 'center', color: warna.tinta, fontVariant: ['tabular-nums'] },
  ket: { fontFamily: huruf.sedang, fontSize: 15, lineHeight: 21, color: warna.tinta2, marginTop: 4 },
  harga: { fontFamily: huruf.hitam, fontSize: 17, color: warna.tinta, fontVariant: ['tabular-nums'] },
  opsiJudul: { fontFamily: huruf.hitam, fontSize: 15.5, lineHeight: 21, color: warna.tinta, marginTop: 4 },
  opsiSub: { fontFamily: huruf.sedang, fontSize: 13, color: warna.tinta2 },
  pilihan: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segmen: { minHeight: 44, paddingHorizontal: 14, borderRadius: radius.pil, borderWidth: 1.5, borderColor: warna.garisTegas, backgroundColor: warna.putih, flexDirection: 'row', alignItems: 'center', gap: 6 },
  segmenAktif: { backgroundColor: warna.daun, borderColor: warna.daun },
  segmenTeks: { fontFamily: huruf.tebal, fontSize: 14, color: warna.tinta, fontVariant: ['tabular-nums'] },
  input: { fontFamily: huruf.sedang, fontSize: 15, color: warna.tinta, borderWidth: 1.5, borderColor: warna.garisTegas, borderRadius: radius.sedang, paddingHorizontal: 12, minHeight: 46, backgroundColor: warna.kertas },
  alasan: { fontFamily: huruf.tebal, fontSize: 13.5, lineHeight: 19, color: warna.sambalTua, textAlign: 'center' },
});
