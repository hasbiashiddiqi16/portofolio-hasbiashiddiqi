import { useState, type FormEvent } from "react";
import {
  Briefcase,
  Check,
  ExternalLink,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  Settings,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useContent } from "../cms/ContentContext";
import { isAuthenticated, login, logout } from "../cms/auth";
import {
  AboutPanel,
  ContactPanel,
  DashboardPanel,
  EducationPanel,
  ServicesPanel,
  SettingsPanel,
  SiteHeroPanel,
  SkillsPanel,
  type TabId,
} from "./panels";
import WorksPanel from "./WorksPanel";
import { Button, TextInput } from "./ui";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "hero", label: "Hero & Situs", icon: Sparkles },
  { id: "about", label: "Tentang Saya", icon: User },
  { id: "skills", label: "Keahlian", icon: Layers },
  { id: "education", label: "Pendidikan", icon: GraduationCap },
  { id: "services", label: "Layanan", icon: Briefcase },
  { id: "works", label: "Karya", icon: ImageIcon },
  { id: "contact", label: "Kontak", icon: MessageCircle },
  { id: "settings", label: "Pengaturan", icon: Settings },
];

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPasswordValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login(password)) {
      onSuccess();
    } else {
      setError(true);
      setPasswordValue("");
    }
  };

  return (
    <div className="noise relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-32 top-10 h-96 w-96 rounded-full bg-brown/20 blur-[120px]" />
        <div className="drift absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brown-soft/10 blur-[110px]" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm rounded-3xl border border-line bg-surface/80 p-8 backdrop-blur"
      >
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-brown/40 bg-brown/10 text-brown-soft">
          <Lock size={22} />
        </div>
        <h1 className="font-display text-2xl font-semibold text-sand">CMS Portofolio</h1>
        <p className="mt-2 text-sm text-muted">Masukkan password untuk mengelola konten.</p>

        <div className="mt-8 flex flex-col gap-4">
          <TextInput
            type="password"
            autoFocus
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPasswordValue(e.target.value);
              setError(false);
            }}
          />
          {error && <p className="text-xs text-red-300">Password salah. Coba lagi.</p>}
          <Button type="submit" variant="primary" className="w-full py-3">
            Masuk
          </Button>
        </div>

        <a href="#top" className="mt-6 inline-block text-xs text-muted transition-colors hover:text-brown-soft">
          ← Kembali ke situs
        </a>
      </form>
    </div>
  );
}

function SaveStatus() {
  const { saveError, lastSaved, isDraftDifferent } = useContent();

  if (saveError) {
    return (
      <span className="flex items-center gap-2 text-xs text-red-300">
        <X size={14} />
        {saveError}
      </span>
    );
  }

  const time = lastSaved
    ? new Date(lastSaved).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <span className="flex items-center gap-2 text-xs text-muted">
      <Check size={14} className="text-brown-soft" />
      {isDraftDifferent
        ? time
          ? `Draft tersimpan ${time}`
          : "Draft tersimpan"
        : "Sinkron dengan versi publish"}
    </span>
  );
}

function renderPanel(tab: TabId, go: (tab: TabId) => void) {
  switch (tab) {
    case "dashboard":
      return <DashboardPanel onNavigate={go} />;
    case "hero":
      return <SiteHeroPanel />;
    case "about":
      return <AboutPanel />;
    case "skills":
      return <SkillsPanel />;
    case "education":
      return <EducationPanel />;
    case "services":
      return <ServicesPanel />;
    case "works":
      return <WorksPanel />;
    case "contact":
      return <ContactPanel />;
    case "settings":
      return <SettingsPanel />;
  }
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(isAuthenticated);
  const [tab, setTab] = useState<TabId>("dashboard");

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  const go = (next: TabId) => {
    setTab(next);
    window.scrollTo({ top: 0 });
  };

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-ink text-sand md:flex">
      <aside className="border-b border-line bg-surface/40 p-6 md:sticky md:top-0 md:flex md:h-screen md:w-64 md:shrink-0 md:flex-col md:gap-8 md:border-b-0 md:border-r">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brown to-brown-soft font-display text-lg font-semibold text-ink">
            H
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-sand">Hasbi CMS</p>
            <p className="text-xs text-muted">Portofolio dashboard</p>
          </div>
        </div>

        <nav className="-mx-2 mt-6 flex gap-1 overflow-x-auto px-2 md:mx-0 md:mt-0 md:flex-col md:overflow-visible">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => go(t.id)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  active ? "bg-brown/15 text-brown-soft" : "text-muted hover:bg-line/40 hover:text-sand"
                }`}
              >
                <Icon size={17} />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-6 flex flex-col gap-1 md:mt-auto">
          <a
            href="#top"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted transition-colors hover:bg-line/40 hover:text-sand"
          >
            <ExternalLink size={17} />
            Lihat situs
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-line/40 hover:text-red-300"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-5 md:px-10">
          <p className="font-display text-[11px] uppercase tracking-[0.3em] text-muted">
            CMS / <span className="text-brown-soft">{current.label}</span>
          </p>
          <SaveStatus />
        </header>

        <div className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-10">{renderPanel(tab, go)}</div>
      </main>
    </div>
  );
}
