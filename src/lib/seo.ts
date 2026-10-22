import type { Metadata } from 'expo-router/server';

export const SITUS = {
  url: 'https://app-antar.pintuweb.id',
  nama: 'Pincuk',
  judul: 'Pincuk: Demo Aplikasi Pesan-antar Kuliner | PintuWeb',
  tagline: 'Masakan warung tetangga, diantar selagi hangat.',
  deskripsi: 'Demo aplikasi pesan-antar dari warung lokal fiktif: keranjang, ongkir dari jarak, bayar tunai/QRIS simulasi, lacak kurir di peta ilustrasi.',
  kontak: 'https://www.pintuweb.id/kontak?demo=antar',
  ogAlt: 'Pincuk, demo aplikasi pesan-antar kuliner warung lokal buatan PintuWeb',
};

export const judulHalaman = (judul?: string) => (judul ? `${judul} · Pincuk` : SITUS.judul);

/** Metadata per halaman: judul ≤60, deskripsi ≤155, canonical absolut. */
export function meta({ judul, deskripsi = SITUS.deskripsi, path, noindex }: { judul?: string; deskripsi?: string; path: string; noindex?: boolean }): Metadata {
  const title = judulHalaman(judul);
  const url = SITUS.url + (path === '/' ? '/' : path);
  return {
    title,
    description: deskripsi,
    applicationName: SITUS.nama,
    ...(path === '/404' ? {} : { alternates: { canonical: url } }),
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName: 'Pincuk · demo PintuWeb',
      url,
      title,
      description: deskripsi,
      images: [{ url: `${SITUS.url}/og.jpg`, width: 1200, height: 630, alt: SITUS.ogAlt }],
    },
    twitter: { card: 'summary_large_image', title, description: deskripsi, images: [`${SITUS.url}/og.jpg`] },
  };
}
