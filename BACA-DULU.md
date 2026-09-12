# Paket Perbaikan SEO — Optik Kayumanis

Isi zip ini:
- `app/sitemap.js` — generate `/sitemap.xml` otomatis (artikel + produk + halaman statis)
- `app/robots.js` — generate `/robots.txt` otomatis
- `app/layout.js` — sudah diperbaiki: `lang="en"` → `lang="id"`

## Cara pasang di VPS

1. Copy 3 file di atas ke folder project frontend kamu di VPS, timpa yang lama:
   - `sitemap.js` dan `robots.js` → taruh di `app/` (file baru)
   - `layout.js` → **timpa** file `app/layout.js` yang lama

2. Tambahkan env var berikut ke `.env` frontend (kalau belum ada):
   ```
   NEXT_PUBLIC_CLIENT_URL="https://optikkayumanis.id"
   ```

3. Rebuild & restart:
   ```bash
   cd /var/www/optikkayumanis/frontend
   rm -rf .next
   npm run build
   pm2 restart optik-frontend
   ```

4. Verifikasi:
   ```bash
   curl https://optikkayumanis.id/sitemap.xml
   curl https://optikkayumanis.id/robots.txt
   ```

5. Daftarkan domain ke Google Search Console (search.google.com/search-console),
   verifikasi kepemilikan, lalu submit sitemap: `https://optikkayumanis.id/sitemap.xml`
