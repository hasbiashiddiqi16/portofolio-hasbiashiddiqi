/**
 * Backend dinamis portofolio (Vercel Serverless Function + Vercel Blob).
 *
 *   GET  /api/content  -> { dynamic: true, content: <konten terakhir> | null }
 *   PUT  /api/content  -> simpan konten (butuh header x-admin-password)
 *
 * Konten disimpan sebagai satu file `content.json` di Vercel Blob, sehingga
 * perubahan dari dashboard langsung tampil untuk semua pengunjung tanpa
 * deploy ulang.
 *
 * Pengaturan di Vercel (satu kali):
 *   1. Storage -> Create -> Blob -> hubungkan ke project ini.
 *      (Otomatis menambahkan env BLOB_READ_WRITE_TOKEN.)
 *   2. Settings -> Environment Variables:
 *        CMS_PASSWORD = password dashboard (samakan dengan yang dipakai login)
 *   3. Redeploy.
 *
 * Jika BLOB_READ_WRITE_TOKEN belum ada, endpoint ini membalas 501 dan
 * situs otomatis jatuh kembali ke mode statis (public/content.json /
 * konten bawaan), jadi situs tidak pernah rusak selama belum diaktifkan.
 */
import { list, put } from "@vercel/blob";

const BLOB_PATH = "content.json";

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function expectedPassword() {
  // Samakan dengan password login dashboard. Jika env belum diatur,
  // dipakai password default dashboard agar fitur langsung bisa dicoba —
  // sangat disarankan mengatur CMS_PASSWORD di Vercel.
  return process.env.CMS_PASSWORD || process.env.ADMIN_PASSWORD || "admin123";
}

function providedPassword(req) {
  const header = req.headers["x-admin-password"];
  if (typeof header === "string" && header) return header;
  const auth = req.headers.authorization;
  if (typeof auth === "string" && auth.startsWith("Bearer ")) return auth.slice(7);
  return "";
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : null;
}

export default async function handler(req, res) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return sendJson(res, 501, {
      dynamic: false,
      configured: false,
      message:
        "Mode dinamis belum aktif: buat Vercel Blob (Storage) dan redeploy. Lihat README.md bagian Mode Dinamis.",
    });
  }

  try {
    if (req.method === "GET") {
      const { blobs } = await list({ prefix: BLOB_PATH, limit: 10 });
      const blob = blobs.find((b) => b.pathname === BLOB_PATH);
      if (!blob) return sendJson(res, 200, { dynamic: true, configured: true, content: null });

      // downloadUrl + cache-buster agar tidak membaca salinan CDN lama.
      const url = blob.downloadUrl || blob.url;
      const fresh = await fetch(`${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}`, {
        cache: "no-store",
      });
      if (!fresh.ok) throw new Error(`Gagal membaca konten tersimpan (${fresh.status}).`);
      const content = await fresh.json();
      return sendJson(res, 200, { dynamic: true, configured: true, content });
    }

    if (req.method === "PUT" || req.method === "POST") {
      if (providedPassword(req) !== expectedPassword()) {
        return sendJson(res, 401, {
          dynamic: true,
          configured: true,
          message:
            "Password ditolak server. Pastikan env CMS_PASSWORD di Vercel sama dengan password login dashboard.",
        });
      }

      const content = await readBody(req);
      if (!content || typeof content !== "object" || !Array.isArray(content.works)) {
        return sendJson(res, 400, {
          dynamic: true,
          configured: true,
          message: "Format konten tidak valid (field works wajib ada).",
        });
      }

      await put(BLOB_PATH, JSON.stringify(content), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
      });
      return sendJson(res, 200, { dynamic: true, configured: true, ok: true });
    }

    res.setHeader("Allow", "GET, PUT, POST");
    return sendJson(res, 405, { dynamic: true, configured: true, message: "Method tidak didukung." });
  } catch (err) {
    return sendJson(res, 502, {
      dynamic: true,
      configured: true,
      message: err instanceof Error ? err.message : "Kesalahan server tidak diketahui.",
    });
  }
}
