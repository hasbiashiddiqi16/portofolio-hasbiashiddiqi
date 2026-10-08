/**
 * Routing berbasis hash, sehingga tetap berjalan di hosting statis
 * (Netlify, GitHub Pages) tanpa aturan rewrite.
 *
 *   #                 -> halaman utama
 *   #about, #works... -> halaman utama, di-scroll ke section terkait
 *   #/work/<slug>     -> halaman detail karya
 *   #/admin           -> dashboard CMS
 */

export type Route =
  | { name: "home"; anchor: string | null }
  | { name: "work"; slug: string }
  | { name: "admin" };

export function parseRoute(hash: string): Route {
  if (hash.startsWith("#/admin")) return { name: "admin" };

  const match = hash.match(/^#\/work\/([^/?#]+)/);
  if (match) return { name: "work", slug: decodeURIComponent(match[1]) };

  const anchor = hash.length > 1 && !hash.startsWith("#/") ? hash.slice(1) : null;
  return { name: "home", anchor };
}

export function workHref(slug: string): string {
  return `#/work/${encodeURIComponent(slug)}`;
}
