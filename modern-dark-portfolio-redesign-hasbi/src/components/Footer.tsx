import { ArrowUp } from "lucide-react";
import { useContent } from "../cms/ContentContext";

export default function Footer() {
  const { content } = useContent();

  return (
    <footer className="relative border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="font-display text-sm text-muted">
          © {new Date().getFullYear()} <span className="text-sand">{content.site.name}</span>. All rights
          reserved.
        </p>
        <div className="flex items-center gap-8">
          <a
            href="#/admin"
            className="font-display text-xs uppercase tracking-[0.3em] text-muted/60 transition-colors hover:text-brown-soft"
          >
            Dashboard
          </a>
          <a
            href="#top"
            className="group flex items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-muted transition-colors hover:text-brown-soft"
          >
            Back to top
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:-translate-y-1 group-hover:border-brown">
              <ArrowUp size={16} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
