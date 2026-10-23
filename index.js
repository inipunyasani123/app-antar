// Titik masuk aplikasi.
// Di web, HTML hasil render statis sudah lengkap; beri browser satu bingkai untuk melukisnya
// sebelum JavaScript menghidrasi (supaya FCP/LCP tidak tertahan eksekusi bundel).
// Di Android/iOS, Expo Router didaftarkan langsung seperti biasa.
if (process.env.EXPO_OS === 'web' && typeof requestAnimationFrame === 'function') {
  requestAnimationFrame(() => setTimeout(() => require('expo-router/entry'), 0));
} else {
  require('expo-router/entry');
}
