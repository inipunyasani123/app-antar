# Pincuk — demo aplikasi pesan-antar kuliner

Demo PintuWeb: aplikasi pesan-antar dari warung dan kedai lokal **fiktif** di Tirtalaya (kota rekaan di Jawa Timur).
Satu kode React Native + Expo untuk Android, iOS, dan web. Versi web tayang di https://app-antar.pintuweb.id.

Fitur: jelajah warung per kategori, jam buka WIB yang menentukan bisa pesan atau tidak, keranjang satu warung per
pesanan, alamat tersimpan dengan titik di peta ilustrasi, ongkir dari jarak rute, promo, bayar tunai atau QRIS
(simulasi), lacak pesanan per tahap dengan kurir ilustrasi, chat kurir simulasi, riwayat dan pesan lagi.
Semua data disimulasikan di perangkat (AsyncStorage, di web = localStorage), tanpa server.

## Menjalankan

```bash
npm install
npx expo start          # Expo Go / emulator / web
npx expo export -p web  # build web statis ke dist/ (dipakai Vercel)
npx tsc --noEmit        # cek tipe
```

`.env` hanya berisi bendera build Expo (tree shaking), bukan rahasia.

## Struktur

- `src/app/` — rute Expo Router (`+html.tsx` = kerangka HTML web: bingkai ponsel, panel samping, QR, bilah demo).
- `src/components/` — UI, ilustrasi SVG (logo, tenda, nota, peta, kurir), foto (`Foto.web.tsx` memakai `<img>` lazy).
- `src/lib/` — data fiktif, jam buka WIB, rute & ongkir, simulasi pesanan & chat, penyimpanan, metadata SEO.
- `assets/images/menu/` — foto hidangan CC0/domain publik, sumber di `assets/images/SUMBER.md`.
- `assets/fonts/`, `public/fonts/` — Shrikhand dan Figtree (SIL OFL 1.1, lisensi di `assets/fonts/`).

Warung, pemilik, kurir, menu, harga, dan promo di demo ini rekaan. Nomor polisi kurir sengaja 0000.
