import { DEFAULT_CONTENT } from "./defaults";
import type { Content, Work } from "./types";

// Re-export agar impor lama dari "data/content" tetap berfungsi.
export * from "./types";
export { DEFAULT_CONTENT, NAV_LINKS, SITE_URL, ASSET_BASE } from "./defaults";

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** "Lotte KIOSK" -> "lotte-kiosk" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildWhatsappLink(content: Pick<Content, "contact">): string {
  const number = content.contact.whatsappNumber.replace(/\D/g, "");
  const text = encodeURIComponent(content.contact.whatsappMessage);
  return `https://api.whatsapp.com/send?phone=${number}&text=${text}`;
}

export function toTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return `tel:+${intl}`;
}

/* ------------------------------------------------------------------ */
/* Normalisasi data (untuk draft lama, impor JSON, atau content.json)   */
/* ------------------------------------------------------------------ */

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

/**
 * Migrasi URL gambar lama: konten yang tersimpan di localStorage (draft CMS)
 * atau content.json hasil unduhan lama masih memakai URL absolut Netlify.
 * Situs Netlify tersebut sudah di-pause, jadi URL-nya ditulis ulang ke path
 * lokal agar gambar diambil dari domain yang sama dengan situs ini.
 */
const LEGACY_ASSET_RE = /^https?:\/\/portofolio-hasbiashiddiqi\.netlify\.app\/assets\/img\//;

export function localizeImageUrl(url: string): string {
  return url.replace(LEGACY_ASSET_RE, "/assets/img/");
}

const strList = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

function normalizeWork(raw: unknown): Work | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const id = str(r.id) || newId();
  const title = str(r.title);

  return {
    id,
    slug: slugify(str(r.slug) || title) || id,
    title,
    category: str(r.category),
    subtitle: str(r.subtitle),
    image: localizeImageUrl(str(r.image)),
    gallery: strList(r.gallery).map(localizeImageUrl),
    description: str(r.description),
    details: strList(r.details),
    liveUrl: str(r.liveUrl),
    liveLabel: str(r.liveLabel),
  };
}

/** Normalisasi daftar karya dan pastikan setiap slug unik. */
function normalizeWorks(raw: unknown[]): Work[] {
  const seen = new Set<string>();
  const result: Work[] = [];

  for (const item of raw) {
    const work = normalizeWork(item);
    if (!work) continue;

    let slug = work.slug;
    let n = 2;
    while (seen.has(slug)) slug = `${work.slug}-${n++}`;
    seen.add(slug);

    result.push({ ...work, slug });
  }
  return result;
}

export function findWorkBySlug(works: Work[], slug: string): Work | undefined {
  return works.find((w) => w.slug === slug);
}

/**
 * Karya kosong baru — dipakai tombol "Tambah karya" di Dashboard maupun
 * di panel Karya, agar karya baru selalu punya bentuk yang sama persis
 * dengan karya yang sudah ada (field, slug unik, halaman detail).
 */
export function createEmptyWork(existing: Work[] = []): Work {
  const id = newId();
  const taken = new Set(existing.map((w) => w.slug));
  let slug = `karya-${id}`;
  let n = 2;
  while (taken.has(slug)) slug = `karya-${id}-${n++}`;

  return {
    id,
    slug,
    title: "Karya baru",
    category: "",
    subtitle: "",
    image: "",
    gallery: [],
    description: "",
    details: [],
    liveUrl: "",
    liveLabel: "",
  };
}

/**
 * Menggabungkan data (mis. dari localStorage atau impor JSON) dengan nilai
 * default, sehingga field yang hilang tidak membuat situs rusak.
 */
export function mergeContent(raw: unknown): Content {
  const source = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_CONTENT;

  const obj = <T extends object>(value: unknown, fallback: T): T =>
    value && typeof value === "object" ? ({ ...fallback, ...(value as object) } as T) : fallback;

  const list = <T>(value: unknown, fallback: T[]): T[] =>
    Array.isArray(value) ? (value as T[]) : fallback;

  return {
    site: obj(source.site, d.site),
    hero: obj(source.hero, d.hero),
    sections: obj(source.sections, d.sections),
    about: { ...obj(source.about, d.about), image: localizeImageUrl(obj(source.about, d.about).image) },
    information: obj(source.information, d.information),
    experience: list(source.experience, d.experience),
    skillGroups: list(source.skillGroups, d.skillGroups),
    education: list(source.education, d.education),
    services: obj(source.services, d.services),
    contact: obj(source.contact, d.contact),
    works: Array.isArray(source.works) ? normalizeWorks(source.works) : d.works,
  };
}
