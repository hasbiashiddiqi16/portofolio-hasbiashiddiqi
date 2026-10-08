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

const DRAFT_KEY = "hasbi-portfolio-cms-draft-v1";
const PUBLISHED_URL = "./content.json";

/** Versi publish: public/content.json (fallback ke default bawaan). */
async function fetchPublished(): Promise<Content> {
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
  /** Versi publish (public/content.json). */
  published: Content;
  hasDraft: boolean;
  isDraftDifferent: boolean;
  loaded: boolean;
  saveError: string | null;
  lastSaved: number | null;
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

  const contentRef = useRef(content);
  const publishedRef = useRef(published);

  // Load published content once on mount.
  useEffect(() => {
    let cancelled = false;
    fetchPublished().then((pub) => {
      if (cancelled) return;
      publishedRef.current = pub;
      setPublished(pub);
      if (window.localStorage.getItem(DRAFT_KEY) === null) {
        contentRef.current = pub;
        setContent(pub);
      }
      setLoaded(true);
    });
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
      update,
      replace,
      discardDraft,
    }),
    [content, published, hasDraft, isDraftDifferent, loaded, saveError, lastSaved, update, replace, discardDraft]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
