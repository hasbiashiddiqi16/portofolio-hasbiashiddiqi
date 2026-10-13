import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT, mergeContent, type Content } from "../data/content";
import { getPassword, isAuthenticated } from "./auth";

const DRAFT_KEY = "hasbi-portfolio-cms-draft-v1";
const PUBLISHED_URL = "./content.json";
const DYNAMIC_URL = "/api/content";

export type PublishStatus = "local" | "syncing" | "synced" | "error";

/**
 * Konten dinamis dari server (Vercel Blob lewat /api/content).
 * `active: false` berarti backend belum diaktifkan di hosting ini dan
 * situs memakai mode statis seperti biasa.
 */
async function fetchServerContent(): Promise<{ active: boolean; content: Content | null }> {
  try {
    const res = await fetch(DYNAMIC_URL, { cache: "no-store" });
    if (!res.ok) return { active: false, content: null };
    const data = (await res.json()) as { dynamic?: boolean; content?: unknown };
    if (!data || data.dynamic !== true) return { active: false, content: null };
    return { active: true, content: data.content ? mergeContent(data.content) : null };
  } catch {
    return { active: false, content: null };
  }
}

/** Versi publish statis: public/content.json (fallback ke default bawaan). */
async function fetchStaticContent(): Promise<Content> {
  try {
    const res = await fetch(PUBLISHED_URL, { cache: "no-store" });
    if (!res.ok) return DEFAULT_CONTENT;
    const data = await res.json();
    return mergeContent(data);
  } catch {
    return DEFAULT_CONTENT;
  }
}

function readDraft(): Content | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? mergeContent(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeDraft(content: Content): string | null {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    return null;
  } catch {
    return "Penyimpanan browser penuh. Kecilkan ukuran gambar atau hapus beberapa karya.";
  }
}

type ContentContextValue = {
  /** Konten yang sedang aktif (draft jika ada, otherwise versi publish). */
  content: Content;
  /** Versi publish (server dinamis / public/content.json). */
  published: Content;
  hasDraft: boolean;
  isDraftDifferent: boolean;
  loaded: boolean;
  saveError: string | null;
  lastSaved: number | null;
  /** True bila backend /api/content aktif (mode dinamis). */
  dynamicActive: boolean;
  publishStatus: PublishStatus;
  publishError: string | null;
  lastPublishedAt: number | null;
  /** Terbitkan konten saat ini ke server agar tampil untuk semua pengunjung. */
  publishNow: () => Promise<{ ok: boolean; message: string }>;
  update: (mutator: (current: Content) => Content) => void;
  replace: (next: unknown) => void;
  discardDraft: () => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [published, setPublished] = useState<Content>(DEFAULT_CONTENT);
  const [content, setContent] = useState<Content>(() => readDraft() ?? DEFAULT_CONTENT);
  const [hasDraft, setHasDraft] = useState<boolean>(
    () => window.localStorage.getItem(DRAFT_KEY) !== null
  );
  const [loaded, setLoaded] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [dynamicActive, setDynamicActive] = useState(false);
  const [publishStatus, setPublishStatus] = useState<PublishStatus>("local");
  const [publishError, setPublishError] = useState<string | null>(null);
  const [lastPublishedAt, setLastPublishedAt] = useState<number | null>(null);

  const contentRef = useRef(content);
  const publishedRef = useRef(published);
  const dynamicRef = useRef(false);
  const publishingRef = useRef(false);

  // Load konten: utamakan server dinamis, fallback ke statis.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const server = await fetchServerContent();
      if (cancelled) return;
      dynamicRef.current = server.active;
      setDynamicActive(server.active);

      const pub = server.content ?? (await fetchStaticContent());
      if (cancelled) return;
      publishedRef.current = pub;
      setPublished(pub);
      if (server.active) setPublishStatus("synced");
      if (window.localStorage.getItem(DRAFT_KEY) === null) {
        contentRef.current = pub;
        setContent(pub);
      }
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== DRAFT_KEY) return;
      const draft = readDraft();
      const next = draft ?? publishedRef.current;
      contentRef.current = next;
      setContent(next);
      setHasDraft(draft !== null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const commit = useCallback((next: Content) => {
    contentRef.current = next;
    setContent(next);
    setHasDraft(true);
    const err = writeDraft(next);
    setSaveError(err);
    if (!err) setLastSaved(Date.now());
  }, []);

  const update = useCallback(
    (mutator: (current: Content) => Content) => commit(mutator(contentRef.current)),
    [commit]
  );

  const replace = useCallback((next: unknown) => commit(mergeContent(next)), [commit]);

  const discardDraft = useCallback(() => {
    window.localStorage.removeItem(DRAFT_KEY);
    contentRef.current = publishedRef.current;
    setContent(publishedRef.current);
    setHasDraft(false);
    setSaveError(null);
    setLastSaved(null);
  }, []);

  const publishNow = useCallback(async (): Promise<{ ok: boolean; message: string }> => {
    if (!dynamicRef.current) {
      return {
        ok: false,
        message:
          "Mode dinamis belum aktif di hosting ini. Aktifkan Vercel Blob + env CMS_PASSWORD, lalu redeploy (lihat Pengaturan / README).",
      };
    }
    if (publishingRef.current) return { ok: false, message: "Sedang menerbitkan, tunggu sebentar…" };

    publishingRef.current = true;
    setPublishStatus("syncing");
    setPublishError(null);
    try {
      const snapshot = contentRef.current;
      const res = await fetch(DYNAMIC_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": getPassword(),
        },
        body: JSON.stringify(snapshot),
      });
      const data = (await res.json().catch(() => null)) as { message?: string } | null;
      if (!res.ok) throw new Error(data?.message || `Server membalas ${res.status}.`);

      publishedRef.current = snapshot;
      setPublished(snapshot);
      setLastPublishedAt(Date.now());
      setPublishStatus("synced");
      return { ok: true, message: "Berhasil diterbitkan. Semua pengunjung kini melihat versi ini." };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menerbitkan ke server.";
      setPublishStatus("error");
      setPublishError(message);
      return { ok: false, message };
    } finally {
      publishingRef.current = false;
    }
  }, []);

  // Mode dinamis: terbitkan otomatis ~1,2 detik setelah admin berhenti
  // mengedit, sehingga tambah/edit karya langsung tampil untuk semua.
  useEffect(() => {
    if (!loaded || !dynamicActive || !isAuthenticated()) return;
    if (JSON.stringify(content) === JSON.stringify(publishedRef.current)) return;
    const timer = window.setTimeout(() => void publishNow(), 1200);
    return () => window.clearTimeout(timer);
  }, [content, loaded, dynamicActive, publishNow]);

  // Mode dinamis: pengunjung (bukan admin) mengecek konten terbaru tiap
  // 30 detik, jadi halaman ikut ter-update tanpa deploy / reload manual.
  useEffect(() => {
    if (!dynamicActive) return;
    const id = window.setInterval(async () => {
      if (isAuthenticated()) return;
      if (window.localStorage.getItem(DRAFT_KEY) !== null) return;
      const server = await fetchServerContent();
      if (!server.content) return;
      if (JSON.stringify(server.content) === JSON.stringify(publishedRef.current)) return;
      publishedRef.current = server.content;
      contentRef.current = server.content;
      setPublished(server.content);
      setContent(server.content);
    }, 30000);
    return () => window.clearInterval(id);
  }, [dynamicActive]);

  const isDraftDifferent = useMemo(
    () => hasDraft && JSON.stringify(content) !== JSON.stringify(published),
    [hasDraft, content, published]
  );

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      published,
      hasDraft,
      isDraftDifferent,
      loaded,
      saveError,
      lastSaved,
      dynamicActive,
      publishStatus,
      publishError,
      lastPublishedAt,
      publishNow,
      update,
      replace,
      discardDraft,
    }),
    [
      content,
      published,
      hasDraft,
      isDraftDifferent,
      loaded,
      saveError,
      lastSaved,
      dynamicActive,
      publishStatus,
      publishError,
      lastPublishedAt,
      publishNow,
      update,
      replace,
      discardDraft,
    ]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
