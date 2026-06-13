self.addEventListener('install', (e) => {
    console.log('[Service Worker] Terinstal');
});

self.addEventListener('fetch', (e) => {
    // Biarkan kosong dulu, ini cuma syarat wajib PWA
});