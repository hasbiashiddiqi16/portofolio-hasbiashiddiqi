import { ExternalLink, Plus } from "lucide-react";
import { useContent } from "../cms/ContentContext";
import { newId, slugify, type Work } from "../data/content";
import { workHref } from "../lib/router";
import { SectionLabelCard } from "./panels";
import {
  Button,
  Card,
  Field,
  ImageField,
  ItemActions,
  PageHeading,
  StringList,
  TextArea,
  TextInput,
  moveItem,
  removeAt,
} from "./ui";

/** Slug unik: jika sudah dipakai karya lain, tambahkan akhiran angka. */
function uniqueSlug(base: string, works: Work[], exceptIndex: number): string {
  const taken = new Set(works.filter((_, i) => i !== exceptIndex).map((w) => w.slug));
  let slug = base || "karya";
  let n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

function WorkEditor({
  work,
  index,
  total,
  works,
  onPatch,
  onMove,
  onRemove,
}: {
  work: Work;
  index: number;
  total: number;
  works: Work[];
  onPatch: (patch: Partial<Work>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const slugTaken = works.some((w, i) => i !== index && w.slug === work.slug);
  const previewPath = `${window.location.pathname}${window.location.search}${workHref(work.slug)}`;

  return (
    <Card
      title={`${String(index + 1).padStart(2, "0")} · ${work.title || "Tanpa judul"}`}
      actions={<ItemActions index={index} total={total} onMove={onMove} onRemove={onRemove} />}
    >
      <ImageField label="Gambar sampul" value={work.image} onChange={(image) => onPatch({ image })} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Judul">
          <TextInput
            value={work.title}
            onChange={(e) => onPatch({ title: e.target.value })}
            onBlur={() => {
              if (!work.slug) onPatch({ slug: uniqueSlug(slugify(work.title), works, index) });
            }}
          />
        </Field>
        <Field label="Kategori" hint='Contoh: "Website", "UI/UX Design", "Logo Design"'>
          <TextInput value={work.category} onChange={(e) => onPatch({ category: e.target.value })} />
        </Field>
        <Field label="Subjudul">
          <TextInput value={work.subtitle} onChange={(e) => onPatch({ subtitle: e.target.value })} />
        </Field>
        <Field
          label="Slug (alamat halaman)"
          hint={slugTaken ? "Slug ini sudah dipakai karya lain, ubah sedikit." : "Huruf kecil dan tanda hubung."}
        >
          <div className="flex items-center gap-2">
            <TextInput
              value={work.slug}
              className={slugTaken ? "border-red-800" : ""}
              onChange={(e) => onPatch({ slug: e.target.value })}
              onBlur={() => onPatch({ slug: slugify(work.slug) || uniqueSlug(slugify(work.title), works, index) })}
            />
            <a
              href={previewPath}
              target="_blank"
              rel="noreferrer"
              title="Buka halaman detail di tab baru"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-brown hover:text-brown-soft"
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </Field>
      </div>

      <Field label="Deskripsi" hint="Pisahkan paragraf dengan satu baris kosong.">
        <TextArea rows={6} value={work.description} onChange={(e) => onPatch({ description: e.target.value })} />
      </Field>

      <Field label="Detail proyek" hint="Poin-poin yang tampil di kolom Detail Proyek.">
        <StringList
          value={work.details}
          onChange={(details) => onPatch({ details })}
          placeholder="Contoh: Responsive"
          addLabel="Tambah detail"
        />
      </Field>

      <Field label="Galeri tambahan" hint="Opsional. Tampil sebagai grid di bawah detail proyek.">
        <div className="flex flex-col gap-4">
          {work.gallery.map((src, gi) => (
            <div key={gi} className="rounded-2xl border border-line/70 bg-ink/40 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.15em] text-muted">Galeri {gi + 1}</span>
                <ItemActions
                  index={gi}
                  total={work.gallery.length}
                  onMove={(dir) => onPatch({ gallery: moveItem(work.gallery, gi, dir) })}
                  onRemove={() => onPatch({ gallery: removeAt(work.gallery, gi) })}
                />
              </div>
              <ImageField
                label="Gambar"
                value={src}
                onChange={(next) =>
                  onPatch({ gallery: work.gallery.map((g, j) => (j === gi ? next : g)) })
                }
              />
            </div>
          ))}
          <div>
            <Button onClick={() => onPatch({ gallery: [...work.gallery, ""] })}>
              <Plus size={16} />
              Tambah gambar galeri
            </Button>
          </div>
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
        <Field label="Link eksternal (opsional)" hint="Contoh: Figma, situs live, atau demo Adobe XD.">
          <TextInput
            value={work.liveUrl}
            placeholder="https://..."
            onChange={(e) => onPatch({ liveUrl: e.target.value })}
          />
        </Field>
        <Field label="Label tombol">
          <TextInput
            value={work.liveLabel}
            placeholder="Live Now / Demo"
            onChange={(e) => onPatch({ liveLabel: e.target.value })}
          />
        </Field>
      </div>
    </Card>
  );
}

export default function WorksPanel() {
  const { content, update } = useContent();
  const works = content.works;

  const patchWork = (i: number, patch: Partial<Work>) =>
    update((c) => ({ ...c, works: c.works.map((w, j) => (j === i ? { ...w, ...patch } : w)) }));

  const moveWork = (i: number, dir: -1 | 1) =>
    update((c) => ({ ...c, works: moveItem(c.works, i, dir) }));

  const removeWork = (i: number) => update((c) => ({ ...c, works: removeAt(c.works, i) }));

  const addWork = () =>
    update((c) => {
      const id = newId();
      return {
        ...c,
        works: [
          ...c.works,
          {
            id,
            slug: `karya-${id}`,
            title: "Karya baru",
            category: "",
            subtitle: "",
            image: "",
            gallery: [],
            description: "",
            details: [],
            liveUrl: "",
            liveLabel: "",
          },
        ],
      };
    });

  return (
    <div className="flex flex-col gap-8">
      <PageHeading
        title="Karya"
        description={`${works.length} karya tampil di situs. Setiap karya memiliki halaman detail sendiri dengan tampilan yang sama seperti portofolio.`}
      />

      <SectionLabelCard sectionKey="works" />

      {works.map((work, i) => (
        <WorkEditor
          key={work.id}
          work={work}
          index={i}
          total={works.length}
          works={works}
          onPatch={(patch) => patchWork(i, patch)}
          onMove={(dir) => moveWork(i, dir)}
          onRemove={() => removeWork(i)}
        />
      ))}

      <div>
        <Button variant="primary" onClick={addWork}>
          <Plus size={16} />
          Tambah karya
        </Button>
      </div>
    </div>
  );
}
