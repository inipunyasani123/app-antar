import { useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
// Inti pembuat QR (tanpa fs/canvas): dijalankan di Node saat build, jadi QR ikut tertanam di HTML statis.
import QR from 'qrcode/lib/core/qrcode';
import { SITUS } from '@/lib/seo';

function qrPath(teks: string) {
  const q = QR.create(teks, { errorCorrectionLevel: 'M' });
  const n: number = q.modules.size;
  let d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.get(x, y)) d += `M${x + 2} ${y + 2}h1v1h-1z`;
  return { d, ukuran: n + 4 };
}

const QR_URL = SITUS.url + '/';
const qr = qrPath(QR_URL);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Pincuk (demo)',
  alternateName: 'Pincuk: aplikasi pesan-antar kuliner',
  url: QR_URL,
  description: SITUS.deskripsi,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Android, iOS, Web',
  inLanguage: 'id',
  isAccessibleForFree: true,
  image: `${SITUS.url}/og.jpg`,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'IDR' },
  featureList: [
    'Jelajah warung per kategori dengan jam buka WIB',
    'Keranjang satu warung per pesanan',
    'Ongkir dari jarak rute dan alamat tersimpan',
    'Bayar tunai atau QRIS (simulasi)',
    'Lacak pesanan per tahap di peta ilustrasi dan chat kurir',
    'Pilihan menu terstruktur: level sambal, kuah dipisah, tambahan lauk',
    'Riwayat, penilaian pribadi, pesan lagi, warung favorit, dan promo',
  ],
  creator: { '@type': 'Organization', name: 'PintuWeb', url: 'https://www.pintuweb.id' },
  publisher: { '@type': 'Organization', name: 'PintuWeb', url: 'https://www.pintuweb.id' },
};

const UNICODE_LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const css = `
@font-face{font-family:Shrikhand;src:url(/fonts/shrikhand.woff2) format("woff2");font-display:swap;unicode-range:${UNICODE_LATIN}}
@font-face{font-family:Figtree500;src:url(/fonts/figtree-500.woff2) format("woff2");font-display:swap;unicode-range:${UNICODE_LATIN}}
@font-face{font-family:Figtree700;src:url(/fonts/figtree-700.woff2) format("woff2");font-display:swap;unicode-range:${UNICODE_LATIN}}
@font-face{font-family:Figtree800;src:url(/fonts/figtree-800.woff2) format("woff2");font-display:swap;unicode-range:${UNICODE_LATIN}}
html,body{height:100%;margin:0}
body{background:#FBF3E4;color:#2B1B12;display:flex;flex-direction:column;overflow:hidden;font-family:Figtree500,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
#root{display:flex;flex:1;flex-direction:column;min-height:0;height:100%}
.panggung{flex:1;display:flex;min-height:0}
.ponsel{flex:1;display:flex;flex-direction:column;min-height:0;min-width:0;position:relative}
.panel{display:none}
:focus-visible{outline:3px solid #2B1B12!important;outline-offset:2px}
input:focus-visible,textarea:focus-visible{outline-offset:0}
.bilah-demo{flex:none;margin:0;padding:8px 16px;background:#0f1b33;color:#dfe6f3;font:400 12.5px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;text-align:center}
.bilah-demo a{color:#fff;font-weight:600;text-decoration:underline;text-underline-offset:3px;display:inline-block;padding:3px 0}
.bilah-demo a:focus-visible{outline-color:#fff!important}
@media (min-width:768px){
  body{overflow:auto;background-color:#1F4D2B;background-image:radial-gradient(circle at 16% 20%,rgba(233,163,27,.20),transparent 36%),radial-gradient(circle at 88% 85%,rgba(179,50,27,.22),transparent 38%),repeating-linear-gradient(-28deg,rgba(251,243,228,.07) 0 2px,transparent 2px 22px),repeating-linear-gradient(-28deg,rgba(251,243,228,.035) 0 1px,transparent 1px 11px)}
  .panggung{align-items:center;justify-content:center;gap:56px;padding:28px 32px}
  .ponsel{flex:none;width:390px;height:min(844px,calc(100dvh - 110px));min-height:620px;border:11px solid #2B1B12;border-radius:50px;overflow:hidden;background:#FBF3E4;box-shadow:0 0 0 2px rgba(251,243,228,.18),0 40px 70px -30px rgba(0,0,0,.6);transform:translateZ(0)}
  .panel{display:block;width:340px;flex:none}
  .bilah-demo{padding:12px 16px;font-size:13px}
}
@media (min-width:768px) and (max-width:899px){.panggung{gap:28px;padding:24px 16px}.panel{width:300px}}
.panel .merek{display:flex;align-items:center;gap:12px}
.panel .nama{font:400 44px/1 Shrikhand,Georgia,serif;margin:0;color:#FBF3E4;text-shadow:3px 3px 0 #B3321B}
.panel .jenis{font:700 13px/1.3 Figtree700,system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#FBE7B5;margin:18px 0 6px}
.panel .tagline{font:400 22px/1.25 Shrikhand,Georgia,serif;color:#FFFDF8;margin:0 0 18px}
.panel ul{list-style:none;padding:0;margin:0 0 22px;display:grid;gap:10px}
.panel li{font:500 15px/1.45 Figtree500,system-ui,sans-serif;padding-left:26px;position:relative;color:#FBF3E4}
.panel li::before{content:"";position:absolute;left:0;top:5px;width:14px;height:14px;border-radius:4px;background:#E9A31B;box-shadow:3px 3px 0 #B3321B}
.panel .kartu-qr{display:flex;gap:14px;align-items:center;background:#FFFDF8;border:1px solid #E2D2B6;border-radius:18px;padding:12px;margin-bottom:16px}
.panel .kartu-qr svg{width:104px;height:104px;flex:none;border-radius:8px}
.panel .kartu-qr p{margin:0;font:500 14px/1.45 Figtree500,system-ui,sans-serif;color:#6A4E3C}
.panel .kartu-qr strong{display:block;font:800 15px/1.35 Figtree800,system-ui,sans-serif;color:#2B1B12;margin-bottom:2px}
.panel .cta{display:inline-flex;align-items:center;gap:8px;min-height:48px;padding:0 22px;border-radius:999px;background:#B3321B;color:#fff;text-decoration:none;font:800 16px/1 Figtree800,system-ui,sans-serif;box-shadow:0 4px 0 #8C2412}
.panel .cta:hover{background:#8C2412}
.panel .cta:focus-visible{outline-color:#FBE7B5!important}
.panel .catatan{font:500 13px/1.5 Figtree500,system-ui,sans-serif;color:#D3E3D2;margin:18px 0 0}
`;

export default function Root({ children }: PropsWithChildren) {
  const { headNodes, bodyNodes, htmlAttributes, bodyAttributes } = useServerDocumentContext();
  return (
    <html lang="id" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#1F4D2B" />
        <meta name="color-scheme" content="light" />
        <meta name="author" content="PintuWeb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Pincuk" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/ikon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preload" href="/fonts/figtree-500.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/figtree-800.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/shrikhand.woff2" as="font" type="font/woff2" crossOrigin="" />
        <style id="pincuk-dasar" dangerouslySetInnerHTML={{ __html: css }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        <div className="panggung">
          <aside className="panel" aria-label="Tentang demo Pincuk">
            <div className="merek">
              <svg width="56" height="56" viewBox="0 0 64 64" aria-hidden="true">
                <rect width="64" height="64" rx="16" fill="#B3321B" />
                <path d="M24 10c-2 3 2 5 0 8M32 7c-2 3 2 5 0 8M40 10c-2 3 2 5 0 8" stroke="#FBE7B5" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                <path d="M14 30c2-7 10-10 18-10s16 3 18 10z" fill="#FFFDF8" />
                <circle cx="26" cy="25" r="2.6" fill="#B3321B" />
                <circle cx="36" cy="24" r="2.2" fill="#E9A31B" />
                <path d="M10 29h44L34.5 57.5a3 3 0 0 1-5 0z" fill="#2E6B3B" />
                <path d="M32 30v25M32 37l-9-6M32 43l-7-6M32 37l9-6M32 43l7-6" stroke="#8DB27A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                <path d="M10 29h44l-3 4.5H13z" fill="#1F4D2B" />
              </svg>
              <p className="nama">Pincuk</p>
            </div>
            <p className="jenis">Demo aplikasi pesan-antar kuliner</p>
            <p className="tagline">{SITUS.tagline}</p>
            <ul>
              <li>Jelajah warung per kategori. Jam buka (WIB) menentukan bisa pesan atau tidak.</li>
              <li>Satu warung per keranjang. Ongkir dihitung dari jarak rute ke alamatmu.</li>
              <li>Bayar tunai atau QRIS simulasi, lalu lacak kurir per tahap di peta ilustrasi.</li>
              <li>Pilih level sambal, kuah dipisah, dan tambahan lauk per menu. Ada chat kurir, penilaian pribadi, dan pesan lagi.</li>
            </ul>
            <div className="kartu-qr">
              <svg viewBox={`0 0 ${qr.ukuran} ${qr.ukuran}`} role="img" aria-label={`Kode QR menuju ${QR_URL}`} shapeRendering="crispEdges">
                <rect width={qr.ukuran} height={qr.ukuran} fill="#FFFFFF" />
                <path d={qr.d} fill="#2B1B12" />
              </svg>
              <p>
                <strong>Coba di HP</strong>
                Pindai kode ini, lalu pasang ke layar utama supaya terasa seperti aplikasi.
              </p>
            </div>
            <a className="cta" href={SITUS.kontak}>
              Pesan aplikasi seperti ini
            </a>
            <p className="catatan">Dibuat dengan React Native + Expo: satu kode untuk Android, iOS, dan web. Warung, menu, harga, dan kurir di demo ini rekaan.</p>
          </aside>
          <div className="ponsel">{children}</div>
        </div>
        <aside className="bilah-demo" aria-label="Tentang situs demo ini">
          Situs demo buatan PintuWeb — nama dan isinya rekaan. <a href={SITUS.kontak}>Buat yang seperti ini →</a>
        </aside>
        {bodyNodes}
      </body>
    </html>
  );
}
