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
   hubungkan ke project ini. Vercel otomatis menambahkan env
   `BLOB_READ_WRITE_TOKEN`.
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

### Catatan

- Gambar unggahan dashboard tersimpan ter-embed (data URL) di dalam
  konten. Untuk banyak gambar besar, lebih ringan memakai path file di
  `public/assets/img/` seperti gambar bawaan.
- Proteksi dashboard bersifat ringan. Jangan gunakan password yang sama
  dengan akun penting lainnya.
