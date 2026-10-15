# portofolio-hasbiashiddiqi
## Deploy (Vercel / hosting statis)

```bash
npm install
npm run build   # hasil di dist/, Vercel otomatis mendeteksi Vite
```

Gambar dibaca dari `public/assets/img/` (path `/assets/img/...`), bukan
dari hosting lain. Lihat `public/assets/img/README.md` untuk daftar file
yang harus ditimpa dengan foto asli. Jangan memakai URL gambar dari
Netlify lama — situs tersebut sudah di-pause sehingga gambarnya 404.

## Mode Dinamis (tambah karya langsung tampil untuk semua pengunjung)

Secara default situs ini statis: perubahan dashboard hanya jadi draft di
browser admin, dan untuk publish harus unduh JSON ke `public/content.json`
lalu deploy ulang.

Mode dinamis menghilangkan langkah manual itu. Konten disimpan di
**Vercel Blob** lewat serverless function `api/content.js`
(`GET /api/content` untuk membaca, `PUT /api/content` untuk menerbitkan).
Setelah aktif, setiap perubahan di dashboard — termasuk tambah karya —
otomatis diterbitkan ±1 detik setelah selesai diedit, dan halaman
pengunjung ikut ter-update (maks. ~30 detik) tanpa deploy ulang.

### Aktivasi (satu kali, di dashboard Vercel)

1. Buka project di Vercel → **Storage** → **Create** → **Blob** →
   hubungkan ke project ini **untuk environment Production**. Vercel
   otomatis menambahkan kredensial Blob (`BLOB_READ_WRITE_TOKEN` atau
   `BLOB_STORE_ID` untuk auth OIDC — keduanya didukung).
2. **Settings → Environment Variables**, tambahkan:
   `CMS_PASSWORD` = password login dashboard
   (samakan persis; default awal `admin123` — ganti juga password
   dashboard di menu Pengaturan dan samakan env ini).
3. **Redeploy** project.
4. Buka `#/admin` → **Pengaturan**: kartu "Mode dinamis" harus berstatus
   aktif. Header dashboard juga akan menampilkan
   "Dinamis • tersimpan di server".

Jika langkah di atas belum dilakukan, situs tetap berfungsi seperti
semula (mode statis + draft lokal) — tidak ada yang rusak.

### Troubleshooting: status tetap "belum aktif"

Buka `https://<domain-kamu>/api/content` di browser. Respons
`"configured": false` disertai field `checks` yang menunjukkan
kredensial apa saja yang terbaca server:

- `hasReadWriteToken: false` **dan** `hasBlobStoreId: false` → Blob belum
  terhubung ke project/environment Production ini (penyebab tersering:
  Blob terhubung hanya untuk Preview, terhubung ke project lain, atau
  deployment Production belum di-redeploy setelah Blob dihubungkan).
- `hasCmsPassword: false` → env `CMS_PASSWORD` belum ada untuk
  Production; penerbitan dari dashboard akan ditolak server.
- Setelah memperbaiki, **redeploy Production** (Deployments → `⋯` →
  Redeploy pada deployment Production, bukan Preview) dan muat ulang
  halaman ini sampai membalas `"dynamic": true`.

### Catatan

- Gambar unggahan dashboard tersimpan ter-embed (data URL) di dalam
  konten. Untuk banyak gambar besar, lebih ringan memakai path file di
  `public/assets/img/` seperti gambar bawaan.
- Proteksi dashboard bersifat ringan. Jangan gunakan password yang sama
  dengan akun penting lainnya.
