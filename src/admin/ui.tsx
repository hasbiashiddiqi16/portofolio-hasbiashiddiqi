import {
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { fileToDataUrl } from "../cms/image";

export const inputClass =
  "w-full rounded-xl border border-line bg-ink/70 px-4 py-2.5 text-sm text-sand placeholder:text-muted/50 outline-none transition-colors focus:border-brown";

export function moveItem<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function removeAt<T>(list: T[], index: number): T[] {
  return list.filter((_, i) => i !== index);
}

export function PageHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-sand md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-surface/60 p-6 md:p-8">
      {(title || actions) && (
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && <h3 className="font-display text-lg font-semibold text-sand">{title}</h3>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.15em] text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted/70">{hint}</span>}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${inputClass} resize-y ${props.className ?? ""}`} />;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ variant = "ghost", className = "", ...rest }: ButtonProps) {
  const styles = {
    primary: "bg-brown text-ink hover:bg-brown-soft",
    ghost: "border border-line text-sand hover:border-brown hover:text-brown-soft",
    danger: "border border-red-900/60 text-red-300 hover:bg-red-950/40",
  };
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
    />
  );
}

export function IconButton({
  label,
  danger,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; danger?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? "hover:border-red-800 hover:text-red-300" : "hover:border-brown hover:text-brown-soft"
      }`}
    >
      {children}
    </button>
  );
}

export function ItemActions({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <IconButton label="Pindah ke atas" disabled={index === 0} onClick={() => onMove(-1)}>
        <ArrowUp size={16} />
      </IconButton>
      <IconButton label="Pindah ke bawah" disabled={index === total - 1} onClick={() => onMove(1)}>
        <ArrowDown size={16} />
      </IconButton>
      <IconButton label="Hapus" danger onClick={onRemove}>
        <Trash2 size={16} />
      </IconButton>
    </div>
  );
}

export function FileButton({
  label,
  accept,
  onFile,
  icon,
}: {
  label: string;
  accept: string;
  onFile: (file: File) => void;
  icon?: ReactNode;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-sand transition-colors hover:border-brown hover:text-brown-soft">
      {icon ?? <Upload size={16} />}
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onFile(file);
        }}
      />
    </label>
  );
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isData = value.startsWith("data:");

  const handleFile = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await fileToDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses gambar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field label={label}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-ink sm:w-44">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-muted">Belum ada gambar</span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <TextInput
            value={isData ? "" : value}
            placeholder={
              isData ? "Gambar unggahan aktif (isi URL untuk mengganti)" : "https://... atau unggah gambar"
            }
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <FileButton label={busy ? "Memproses..." : "Unggah gambar"} accept="image/*" onFile={handleFile} />
            {value && (
              <Button variant="danger" onClick={() => onChange("")}>
                Hapus gambar
              </Button>
            )}
          </div>
          {error && <p className="text-xs text-red-300">{error}</p>}
        </div>
      </div>
    </Field>
  );
}

export function StringList({
  value,
  onChange,
  placeholder,
  addLabel = "Tambah",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={item}
            placeholder={placeholder}
            onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <ItemActions
            index={i}
            total={value.length}
            onMove={(dir) => onChange(moveItem(value, i, dir))}
            onRemove={() => onChange(removeAt(value, i))}
          />
        </div>
      ))}
      <div>
        <Button onClick={() => onChange([...value, ""])}>
          <Plus size={16} />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
