import { useState } from "react";
import { Download, ExternalLink, Plus, RotateCcw } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import { setPassword } from "../cms/auth";
import {
  buildWhatsappLink,
  newId,
  type Content,
  type EducationItem,
  type SectionLabel,
  type Skill,
  type SkillGroup,
} from "../data/content";
import {
  Button,
  Card,
  Field,
  FileButton,
  ImageField,
  ItemActions,
  PageHeading,
  StringList,
  TextArea,
  TextInput,
  moveItem,
  removeAt,
} from "./ui";

export type TabId =
  | "dashboard"
  | "hero"
  | "about"
  | "skills"
  | "education"
  | "services"
  | "works"
  | "contact"
  | "settings";

type Notice = { ok: boolean; text: string };
type ObjectKey = "site" | "hero" | "about" | "information" | "contact";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n) || 0));

/** Patch helper for single-object sections (e.g. hero, contact). */
function usePatch<K extends ObjectKey>(key: K) {
  const { update } = useContent();
  return (patch: Partial<Content[K]>) =>
    update((c) => ({ ...c, [key]: { ...c[key], ...patch } }) as Content);
}

function NoticeText({ notice }: { notice: Notice | null }) {
  if (!notice) return null;
  return (
    <p className={`text-sm ${notice.ok ? "text-brown-soft" : "text-red-300"}`}>{notice.text}</p>
  );
}

export function SectionLabelCard({
  sectionKey,
  description,
}: {
  sectionKey: keyof Content["sections"];
  description?: string;
}) {
  const { content, update } = useContent();
  const value: SectionLabel = content.sections[sectionKey];
  const setLabel = (patch: Partial<SectionLabel>) =>
    update((c) => ({
      ...c,
      sections: { ...c.sections, [sectionKey]: { ...c.sections[sectionKey], ...patch } },
    }));

  return (
    <Card title="Label bagian" description={description}>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Eyebrow (teks kecil)">
          <TextInput value={value.eyebrow} onChange={(e) => setLabel({ eyebrow: e.target.value })} />
        </Field>
        <Field label="Judul bagian">
          <TextInput value={value.title} onChange={(e) => setLabel({ title: e.target.value })} />
        </Field>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

export function DashboardPanel({ onNavigate }: { onNavigate: (tab: TabId) => void }) {
  const { content, isDraftDifferent } = useContent();

  const stats: { label: string; value: number; tab: TabId }[] = [
    { label: "Karya", value: content.works.length, tab: "works" },
    { label: "Grup keahlian", value: content.skillGroups.length, tab: "skills" },
    { label: "Riwayat pendidikan", value: content.education.length, tab: "education" },
    {
      label: "Layanan (marquee)",
      value: content.services.rowOne.length + content.services.rowTwo.length,
      tab: "services",
    },
    { label: "Poin pengalaman", value: content.experience.length, tab: "about" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Selamat datang"
        description="Kelola seluruh konten portofolio dari sini. Perubahan langsung tampil di pratinjau situs di browser ini."
      />

      <div
        className={`rounded-2xl border px-5 py-4 text-sm ${
          isDraftDifferent
            ? "border-brown/50 bg-brown/10 text-brown-soft"
            : "border-line bg-surface/60 text-muted"
        }`}
      >
        {isDraftDifferent
          ? "Ada perubahan draft yang belum diterbitkan. Unduh JSON dari menu Pengaturan lalu ganti public/content.json."
          : "Draft sama dengan versi yang diterbitkan."}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onNavigate(s.tab)}
            className="group rounded-3xl border border-line bg-surface/60 p-6 text-left transition-colors hover:border-brown/60"
          >
            <p className="font-display text-4xl font-semibold text-sand">{s.value}</p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
            <span className="mt-4 inline-flex text-xs text-brown-soft opacity-0 transition-opacity group-hover:opacity-100">
              Kelola →
            </span>
          </button>
        ))}
      </div>

      <Card title="Mulai cepat">
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted">
          <li>Buka <span className="text-sand">Hero &amp; Situs</span> untuk mengganti judul dan teks pembuka.</li>
          <li>Di <span className="text-sand">Karya</span>, unggah gambar atau tempel URL, lalu atur urutannya.</li>
          <li>Setelah selesai, unduh JSON di <span className="text-sand">Pengaturan</span> dan simpan sebagai <code className="text-brown-soft">public/content.json</code>.</li>
          <li>Build dan deploy ulang agar perubahan tampil untuk semua pengunjung.</li>
        </ol>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero & Situs                                                        */
/* ------------------------------------------------------------------ */

export function SiteHeroPanel() {
  const { content } = useContent();
  const patchSite = usePatch("site");
  const patchHero = usePatch("hero");

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Hero & Situs"
        description="Judul tab browser, deskripsi SEO, dan teks besar di halaman depan."
      />

      <Card title="Situs">
        <Field label="Nama (brand & footer)">
          <TextInput value={content.site.name} onChange={(e) => patchSite({ name: e.target.value })} />
        </Field>
        <Field label="Judul tab browser">
          <TextInput value={content.site.title} onChange={(e) => patchSite({ title: e.target.value })} />
        </Field>
        <Field label="Deskripsi (SEO)">
          <TextArea value={content.site.description} onChange={(e) => patchSite({ description: e.target.value })} />
        </Field>
      </Card>

      <Card title="Hero (halaman depan)">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Eyebrow">
            <TextInput value={content.hero.eyebrow} onChange={(e) => patchHero({ eyebrow: e.target.value })} />
          </Field>
          <Field label="Judul baris 1">
            <TextInput value={content.hero.titleFirst} onChange={(e) => patchHero({ titleFirst: e.target.value })} />
          </Field>
        </div>
        <Field label="Judul baris 2 (aksen cokelat)">
          <TextInput value={content.hero.titleAccent} onChange={(e) => patchHero({ titleAccent: e.target.value })} />
        </Field>
        <Field label="Subjudul">
          <TextArea value={content.hero.subtitle} onChange={(e) => patchHero({ subtitle: e.target.value })} />
        </Field>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tentang Saya                                                        */
/* ------------------------------------------------------------------ */

export function AboutPanel() {
  const { content, update } = useContent();
  const patchAbout = usePatch("about");
  const patchInfo = usePatch("information");

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Tentang Saya"
        description="Perkenalan, foto, informasi kontak, dan poin pengalaman. Angka di awal poin pengalaman akan dianimasikan."
      />

      <SectionLabelCard sectionKey="about" />

      <Card title="Perkenalan">
        <Field label="Teks perkenalan">
          <TextArea rows={5} value={content.about.intro} onChange={(e) => patchAbout({ intro: e.target.value })} />
        </Field>
        <ImageField label="Foto" value={content.about.image} onChange={(image) => patchAbout({ image })} />
      </Card>

      <Card title="Informasi" description="Nama dan nomor telepon yang tampil di bagian Tentang Saya.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama lengkap">
            <TextInput value={content.information.name} onChange={(e) => patchInfo({ name: e.target.value })} />
          </Field>
          <Field label="Nomor telepon">
            <TextInput value={content.information.phone} onChange={(e) => patchInfo({ phone: e.target.value })} />
          </Field>
        </div>
      </Card>

      <Card title="Pengalaman & dukungan" description="Contoh: 50+ Projects (angka di depan akan dihitung naik saat terlihat).">
        <StringList
          value={content.experience}
          onChange={(list) => update((c) => ({ ...c, experience: list }))}
          placeholder="Contoh: 50+ Projects"
          addLabel="Tambah poin"
        />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Keahlian                                                            */
/* ------------------------------------------------------------------ */

export function SkillsPanel() {
  const { content, update } = useContent();
  const groups = content.skillGroups;

  const patchGroup = (gi: number, patch: Partial<SkillGroup>) =>
    update((c) => ({
      ...c,
      skillGroups: c.skillGroups.map((g, i) => (i === gi ? { ...g, ...patch } : g)),
    }));
  const moveGroup = (gi: number, dir: -1 | 1) =>
    update((c) => ({ ...c, skillGroups: moveItem(c.skillGroups, gi, dir) }));
  const removeGroup = (gi: number) =>
    update((c) => ({ ...c, skillGroups: removeAt(c.skillGroups, gi) }));
  const addGroup = () =>
    update((c) => ({
      ...c,
      skillGroups: [...c.skillGroups, { id: newId(), title: "Grup baru", items: [] }],
    }));

  const patchSkill = (gi: number, si: number, patch: Partial<Skill>) =>
    update((c) => ({
      ...c,
      skillGroups: c.skillGroups.map((g, i) =>
        i !== gi
          ? g
          : { ...g, items: g.items.map((s, j) => (j === si ? { ...s, ...patch } : s)) }
      ),
    }));
  const moveSkill = (gi: number, si: number, dir: -1 | 1) =>
    update((c) => ({
      ...c,
      skillGroups: c.skillGroups.map((g, i) =>
        i !== gi ? g : { ...g, items: moveItem(g.items, si, dir) }
      ),
    }));
  const removeSkill = (gi: number, si: number) =>
    update((c) => ({
      ...c,
      skillGroups: c.skillGroups.map((g, i) =>
        i !== gi ? g : { ...g, items: removeAt(g.items, si) }
      ),
    }));
  const addSkill = (gi: number) =>
    update((c) => ({
      ...c,
      skillGroups: c.skillGroups.map((g, i) =>
        i !== gi ? g : { ...g, items: [...g.items, { name: "Skill baru", value: 80 }] }
      ),
    }));

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Keahlian"
        description="Grup keahlian dan persentase level. Bar akan terisi saat bagian ini terlihat di layar."
      />

      <SectionLabelCard sectionKey="skills" />

      {groups.map((group, gi) => (
        <Card
          key={group.id}
          title={group.title || "Grup tanpa judul"}
          actions={
            <ItemActions
              index={gi}
              total={groups.length}
              onMove={(dir) => moveGroup(gi, dir)}
              onRemove={() => removeGroup(gi)}
            />
          }
        >
          <Field label="Judul grup">
            <TextInput value={group.title} onChange={(e) => patchGroup(gi, { title: e.target.value })} />
          </Field>

          <div className="flex flex-col gap-4">
            {group.items.map((skill, si) => (
              <div key={si} className="flex flex-col gap-3 rounded-2xl border border-line/70 bg-ink/40 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <TextInput
                    value={skill.name}
                    placeholder="Nama skill"
                    className="min-w-0 flex-1"
                    onChange={(e) => patchSkill(gi, si, { name: e.target.value })}
                  />
                  <TextInput
                    type="number"
                    min={0}
                    max={100}
                    value={skill.value}
                    className="w-24"
                    onChange={(e) => patchSkill(gi, si, { value: clamp(Number(e.target.value)) })}
                  />
                  <ItemActions
                    index={si}
                    total={group.items.length}
                    onMove={(dir) => moveSkill(gi, si, dir)}
                    onRemove={() => removeSkill(gi, si)}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={skill.value}
                  onChange={(e) => patchSkill(gi, si, { value: clamp(Number(e.target.value)) })}
                  className="w-full accent-[#b8825a]"
                />
              </div>
            ))}
            <div>
              <Button onClick={() => addSkill(gi)}>
                <Plus size={16} />
                Tambah skill
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div>
        <Button variant="primary" onClick={addGroup}>
          <Plus size={16} />
          Tambah grup
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pendidikan                                                          */
/* ------------------------------------------------------------------ */

export function EducationPanel() {
  const { content, update } = useContent();
  const items = content.education;

  const patchItem = (i: number, patch: Partial<EducationItem>) =>
    update((c) => ({
      ...c,
      education: c.education.map((e, j) => (j === i ? { ...e, ...patch } : e)),
    }));
  const moveItemAt = (i: number, dir: -1 | 1) =>
    update((c) => ({ ...c, education: moveItem(c.education, i, dir) }));
  const removeItemAt = (i: number) =>
    update((c) => ({ ...c, education: removeAt(c.education, i) }));
  const addItem = () =>
    update((c) => ({
      ...c,
      education: [...c.education, { id: newId(), heading: "Tahun / periode", subtitle: "Nama institusi" }],
    }));

  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="Pendidikan" description="Riwayat pendidikan yang tampil dalam dua kolom." />

      <SectionLabelCard sectionKey="education" />

      {items.map((item, i) => (
        <Card
          key={item.id}
          title={item.subtitle || item.heading || "Tanpa judul"}
          actions={
            <ItemActions index={i} total={items.length} onMove={(dir) => moveItemAt(i, dir)} onRemove={() => removeItemAt(i)} />
          }
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Periode / heading">
              <TextInput value={item.heading} onChange={(e) => patchItem(i, { heading: e.target.value })} />
            </Field>
            <Field label="Institusi / jurusan">
              <TextInput value={item.subtitle} onChange={(e) => patchItem(i, { subtitle: e.target.value })} />
            </Field>
          </div>
        </Card>
      ))}

      <div>
        <Button variant="primary" onClick={addItem}>
          <Plus size={16} />
          Tambah pendidikan
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Layanan                                                             */
/* ------------------------------------------------------------------ */

export function ServicesPanel() {
  const { content, update } = useContent();
  const setRow = (key: "rowOne" | "rowTwo", list: string[]) =>
    update((c) => ({ ...c, services: { ...c.services, [key]: list } }));

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Layanan"
        description="Kata-kata yang tampil di marquee bagian layanan. Baris 1 bergerak ke kiri, baris 2 ke kanan."
      />

      <SectionLabelCard sectionKey="services" />

      <Card title="Baris 1 (ke kiri)">
        <StringList
          value={content.services.rowOne}
          onChange={(list) => setRow("rowOne", list)}
          placeholder="Nama layanan"
          addLabel="Tambah layanan"
        />
      </Card>

      <Card title="Baris 2 (ke kanan)">
        <StringList
          value={content.services.rowTwo}
          onChange={(list) => setRow("rowTwo", list)}
          placeholder="Nama layanan"
          addLabel="Tambah layanan"
        />
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Karya                                                               */
/* ------------------------------------------------------------------ */



/* ------------------------------------------------------------------ */
/* Kontak                                                              */
/* ------------------------------------------------------------------ */

export function ContactPanel() {
  const { content } = useContent();
  const patch = usePatch("contact");
  const link = buildWhatsappLink(content);

  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="Kontak" description="Teks ajakan dan tautan WhatsApp di bagian kontak." />

      <Card title="Teks ajakan">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Judul (bagian pertama)">
            <TextInput value={content.contact.headline} onChange={(e) => patch({ headline: e.target.value })} />
          </Field>
          <Field label="Judul (aksen cokelat)">
            <TextInput value={content.contact.headlineAccent} onChange={(e) => patch({ headlineAccent: e.target.value })} />
          </Field>
        </div>
        <Field label="Deskripsi">
          <TextArea rows={4} value={content.contact.body} onChange={(e) => patch({ body: e.target.value })} />
        </Field>
      </Card>

      <Card title="WhatsApp" description="Tombol dan lingkaran WhatsApp akan mengarah ke link berikut.">
        <Field label="Nomor WhatsApp" hint="Format internasional tanpa tanda +, contoh: 6281287350024">
          <TextInput value={content.contact.whatsappNumber} onChange={(e) => patch({ whatsappNumber: e.target.value })} />
        </Field>
        <Field label="Pesan otomatis">
          <TextArea value={content.contact.whatsappMessage} onChange={(e) => patch({ whatsappMessage: e.target.value })} />
        </Field>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted">Link yang dihasilkan</span>
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-start gap-2 break-all text-sm text-brown-soft hover:underline"
          >
            <ExternalLink size={14} className="mt-0.5 shrink-0" />
            {link}
          </a>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pengaturan                                                          */
/* ------------------------------------------------------------------ */

function downloadJson(content: Content) {
  const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "content.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function SettingsPanel() {
  const { content, hasDraft, replace, discardDraft } = useContent();
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwNotice, setPwNotice] = useState<Notice | null>(null);
  const [dataNotice, setDataNotice] = useState<Notice | null>(null);

  const changePassword = () => {
    if (newPw.length < 6) {
      setPwNotice({ ok: false, text: "Password minimal 6 karakter." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwNotice({ ok: false, text: "Konfirmasi password tidak cocok." });
      return;
    }
    setPassword(newPw);
    setNewPw("");
    setConfirmPw("");
    setPwNotice({ ok: true, text: "Password berhasil diubah." });
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== "object" || !("site" in parsed) || !("works" in parsed)) {
        throw new Error("format file tidak sesuai");
      }
      replace(parsed);
      setDataNotice({ ok: true, text: "Data berhasil diimpor sebagai draft." });
    } catch (err) {
      const reason = err instanceof Error ? err.message : "error tidak diketahui";
      setDataNotice({ ok: false, text: `Gagal mengimpor: ${reason}.` });
    }
  };

  const discard = () => {
    if (window.confirm("Buang draft dan kembali ke versi publish? Perubahan yang belum diunduh akan hilang.")) {
      discardDraft();
      setDataNotice({ ok: true, text: "Draft dibuang. Kembali ke versi publish." });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeading title="Pengaturan" description="Publish, cadangan data, dan keamanan dashboard." />

      <Card
        title="Publish & cadangan"
        description="Perubahan disimpan sebagai draft di browser ini. Untuk menerbitkan ke semua pengunjung, unduh JSON lalu simpan sebagai public/content.json dan deploy ulang."
      >
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => downloadJson(content)}>
            <Download size={16} />
            Unduh JSON (publish)
          </Button>
          <FileButton label="Impor JSON" accept="application/json,.json" onFile={importJson} />
          <Button variant="danger" disabled={!hasDraft} onClick={discard}>
            <RotateCcw size={16} />
            Buang draft
          </Button>
        </div>
        <NoticeText notice={dataNotice} />
      </Card>

      <Card title="Ubah password" description="Password default: admin123. Minimal 6 karakter.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password baru">
            <TextInput type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
          </Field>
          <Field label="Konfirmasi password">
            <TextInput type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
          </Field>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" onClick={changePassword}>
            Simpan password
          </Button>
          <NoticeText notice={pwNotice} />
        </div>
        <p className="text-xs text-muted/70">
          Ini proteksi sederhana untuk situs statis (password tersimpan di browser). Bukan pengamanan tingkat server.
        </p>
      </Card>
    </div>
  );
}
