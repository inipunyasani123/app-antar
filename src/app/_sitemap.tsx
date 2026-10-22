// Menggantikan daftar rute bawaan Expo Router (/_sitemap) supaya tidak terindeks. Peta situs ada di /sitemap.xml.
export { default, generateMetadata } from './+not-found';
